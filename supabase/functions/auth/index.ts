import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { hashSync, compareSync, genSaltSync } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMITS = {
  signin: { maxAttempts: 10, windowMinutes: 15 },
  signup: { maxAttempts: 5, windowMinutes: 60 },
};

// Legacy hash for migration only - will be removed once all users have migrated
async function legacyHashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function hashPassword(password: string): string {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
}

function verifyPassword(password: string, storedHash: string): boolean {
  if (storedHash.startsWith("$2")) {
    return compareSync(password, storedHash);
  }
  return false;
}

async function verifyPasswordWithLegacy(password: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith("$2")) {
    return compareSync(password, storedHash);
  }
  const legacyHash = await legacyHashPassword(password);
  return legacyHash === storedHash;
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, "0")).join("");
}

async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  identifier: string,
  attemptType: string
): Promise<boolean> {
  const limits = RATE_LIMITS[attemptType as keyof typeof RATE_LIMITS];
  if (!limits) return true;

  const windowStart = new Date(Date.now() - limits.windowMinutes * 60 * 1000).toISOString();

  // Get existing record
  const { data: existing } = await supabase
    .from("auth_rate_limits")
    .select("*")
    .eq("identifier", identifier)
    .eq("attempt_type", attemptType)
    .single();

  if (!existing) {
    // No record yet, create one
    await supabase.from("auth_rate_limits").upsert({
      identifier,
      attempt_type: attemptType,
      attempt_count: 1,
      window_start: new Date().toISOString(),
    }, { onConflict: "identifier,attempt_type" });
    return true;
  }

  // Check if window has expired, reset if so
  if (existing.window_start < windowStart) {
    await supabase
      .from("auth_rate_limits")
      .update({ attempt_count: 1, window_start: new Date().toISOString() })
      .eq("identifier", identifier)
      .eq("attempt_type", attemptType);
    return true;
  }

  // Check if over limit
  if (existing.attempt_count >= limits.maxAttempts) {
    return false;
  }

  // Increment counter
  await supabase
    .from("auth_rate_limits")
    .update({ attempt_count: existing.attempt_count + 1 })
    .eq("identifier", identifier)
    .eq("attempt_type", attemptType);

  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action, company_id, password, full_name, token } = await req.json();

    // Rate limit signin and signup actions
    if (action === "signin" || action === "signup") {
      const identifier = company_id || "unknown";
      const allowed = await checkRateLimit(supabase, identifier, action);
      if (!allowed) {
        const retryMinutes = RATE_LIMITS[action as keyof typeof RATE_LIMITS]?.windowMinutes || 15;
        console.warn(`Rate limit exceeded for ${action} by ${identifier}`);
        return new Response(
          JSON.stringify({ error: `Too many attempts. Please try again in ${retryMinutes} minutes.` }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (action === "signup") {
      if (!company_id || typeof company_id !== "string" || company_id.length < 3 || company_id.length > 50) {
        return new Response(
          JSON.stringify({ error: "Company ID must be between 3 and 50 characters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!password || typeof password !== "string" || password.length < 6 || password.length > 128) {
        return new Response(
          JSON.stringify({ error: "Password must be between 6 and 128 characters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (full_name && (typeof full_name !== "string" || full_name.length > 100)) {
        return new Response(
          JSON.stringify({ error: "Full name must be 100 characters or less" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: existing } = await supabase
        .from("company_users")
        .select("id")
        .eq("company_id", company_id)
        .single();

      if (existing) {
        return new Response(
          JSON.stringify({ error: "This Company ID is already registered" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const password_hash = hashPassword(password);
      const { data: user, error: createError } = await supabase
        .from("company_users")
        .insert({ company_id, password_hash, full_name })
        .select()
        .single();

      if (createError) {
        console.error("Failed to create user:", createError.message);
        return new Response(
          JSON.stringify({ error: "Failed to create account" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const sessionToken = generateToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await supabase.from("user_sessions").insert({
        user_id: user.id,
        token: sessionToken,
        expires_at: expiresAt.toISOString(),
      });

      return new Response(
        JSON.stringify({
          user: { id: user.id, company_id: user.company_id, full_name: user.full_name },
          token: sessionToken,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "signin") {
      if (!company_id || typeof company_id !== "string" || !password || typeof password !== "string") {
        return new Response(
          JSON.stringify({ error: "Company ID and password are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: user } = await supabase
        .from("company_users")
        .select("*")
        .eq("company_id", company_id)
        .single();

      if (!user) {
        hashPassword(password);
        return new Response(
          JSON.stringify({ error: "Invalid Company ID or password" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const passwordValid = await verifyPasswordWithLegacy(password, user.password_hash);
      if (!passwordValid) {
        return new Response(
          JSON.stringify({ error: "Invalid Company ID or password" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!user.password_hash.startsWith("$2")) {
        const newHash = hashPassword(password);
        await supabase
          .from("company_users")
          .update({ password_hash: newHash })
          .eq("id", user.id);
        console.log(`Migrated password hash for user ${user.id} to bcrypt`);
      }

      const sessionToken = generateToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await supabase.from("user_sessions").insert({
        user_id: user.id,
        token: sessionToken,
        expires_at: expiresAt.toISOString(),
      });

      return new Response(
        JSON.stringify({
          user: { id: user.id, company_id: user.company_id, full_name: user.full_name },
          token: sessionToken,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "validate") {
      if (!token || typeof token !== "string") {
        return new Response(
          JSON.stringify({ error: "Token required" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: session } = await supabase
        .from("user_sessions")
        .select("*, company_users(*)")
        .eq("token", token)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (!session) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired session" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const userData = session.company_users;
      return new Response(
        JSON.stringify({
          user: { id: userData.id, company_id: userData.company_id, full_name: userData.full_name },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "signout") {
      if (token) {
        await supabase.from("user_sessions").delete().eq("token", token);
      }
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Auth function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

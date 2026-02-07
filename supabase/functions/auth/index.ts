import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { hashSync, compareSync, genSaltSync } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
  // Check if it's a bcrypt hash (starts with $2)
  if (storedHash.startsWith("$2")) {
    return compareSync(password, storedHash);
  }
  // Legacy SHA-256 hash migration path — fall through to async check
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

    if (action === "signup") {
      // Validate inputs
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

      // Check if company_id exists
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

      // Create user with bcrypt hash
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

      // Create session
      const sessionToken = generateToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

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

      // Find user by company_id first, then verify password server-side
      const { data: user } = await supabase
        .from("company_users")
        .select("*")
        .eq("company_id", company_id)
        .single();

      if (!user) {
        // Perform a dummy hash to prevent timing attacks
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

      // Migrate legacy hash to bcrypt on successful login
      if (!user.password_hash.startsWith("$2")) {
        const newHash = hashPassword(password);
        await supabase
          .from("company_users")
          .update({ password_hash: newHash })
          .eq("id", user.id);
        console.log(`Migrated password hash for user ${user.id} to bcrypt`);
      }

      // Create session
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

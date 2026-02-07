import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple hash function for passwords (in production, use bcrypt via a proper library)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
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
      if (!company_id || company_id.length < 3 || company_id.length > 50) {
        return new Response(
          JSON.stringify({ error: "Company ID must be between 3 and 50 characters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!password || password.length < 6) {
        return new Response(
          JSON.stringify({ error: "Password must be at least 6 characters" }),
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

      // Create user
      const password_hash = await hashPassword(password);
      const { data: user, error: createError } = await supabase
        .from("company_users")
        .insert({ company_id, password_hash, full_name })
        .select()
        .single();

      if (createError) {
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
      if (!company_id || !password) {
        return new Response(
          JSON.stringify({ error: "Company ID and password are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Find user
      const password_hash = await hashPassword(password);
      const { data: user, error: findError } = await supabase
        .from("company_users")
        .select("*")
        .eq("company_id", company_id)
        .eq("password_hash", password_hash)
        .single();

      if (findError || !user) {
        return new Response(
          JSON.stringify({ error: "Invalid Company ID or password" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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
      if (!token) {
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

      const user = session.company_users;
      return new Response(
        JSON.stringify({
          user: { id: user.id, company_id: user.company_id, full_name: user.full_name },
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
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
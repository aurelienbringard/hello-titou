// Invites an approved early-access requester to create their Hello Titou account.
// Called by the database trigger after status becomes "approved", or by tools/early_access.py.
// Auth: the one-time invite_token stored on the request (anon cannot read it).

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = "https://hellotitou.fr/";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json({ error: "missing service configuration" }, 500);

  let payload: { id?: string; token?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const id = String(payload.id || "").trim();
  const token = String(payload.token || "").trim();
  if (!id || !token) return json({ error: "id and token are required" }, 400);

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: row, error: loadErr } = await admin
    .from("early_access_requests")
    .select("id, email, first_name, status, invite_token, invited_at")
    .eq("id", id)
    .maybeSingle();

  if (loadErr) return json({ error: loadErr.message }, 500);
  if (!row) return json({ error: "request not found" }, 404);
  if (row.status !== "approved") return json({ error: "request is not approved" }, 409);
  if (!row.invite_token || row.invite_token !== token) return json({ error: "invalid token" }, 403);

  const email = String(row.email || "").trim().toLowerCase();
  if (!email) return json({ error: "missing email" }, 400);

  // Grant access if a parent row already exists.
  await admin
    .from("parent_accounts")
    .update({ access_granted: true, plan_updated_at: new Date().toISOString() })
    .ilike("email", email);

  let existingId: string | null = null;
  const getByEmail = (admin.auth.admin as { getUserByEmail?: (e: string) => Promise<{ data: { user?: { id: string } } | null; error: { message: string } | null }> }).getUserByEmail;
  if (typeof getByEmail === "function") {
    const existing = await getByEmail.call(admin.auth.admin, email);
    existingId = existing.data?.user?.id || null;
  } else {
    const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = (listed.data?.users || []).find((u) => (u.email || "").toLowerCase() === email);
    existingId = found?.id || null;
  }

  let action = "invited";
  if (existingId) {
    action = "already_registered";
    // They can sign in with their existing password; access is now granted.
  } else {
    const invited = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: SITE,
      data: { first_name: row.first_name || "", early_access: true },
    });
    if (invited.error) {
      const msg = invited.error.message || "invite failed";
      // Already registered is not a hard failure.
      if (/already|registered|exists/i.test(msg)) {
        action = "already_registered";
      } else {
        return json({ error: msg }, 500);
      }
    }
  }

  await admin
    .from("early_access_requests")
    .update({ invited_at: new Date().toISOString() })
    .eq("id", id);

  return json({ ok: true, id, email, action });
});

#!/usr/bin/env python3
"""List, approve or reject Hello Titou early-access requests.

Preferred path for the assistant (no secret needed):

  Supabase MCP execute_sql on project hyfvwxfgsmuyekfxucot:

    SELECT * FROM public.admin_list_early_access('pending');
    SELECT public.admin_decide_early_access('<uuid>', 'approved');
    SELECT public.admin_decide_early_access('<uuid>', 'rejected', 'optional note');

Approving a request sets status to approved, grants access if the parent
already has an account, and triggers an invite email
(Edge Function early-access-invite).

This script does the same thing when a service role key is available
(never commit it):

  export HELLO_TITOU_SERVICE_ROLE_KEY=...
  python3 tools/early_access.py list
  python3 tools/early_access.py approve <id>
  python3 tools/early_access.py reject <id> [--note "…"]
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = "hyfvwxfgsmuyekfxucot"
SB_URL = "https://hyfvwxfgsmuyekfxucot.supabase.co"
DEFAULT_KEY_FILES = (Path(__file__).resolve().parent / ".env", Path(__file__).resolve().parent / ".service_role")


def load_service_role() -> str | None:
    for name in ("HELLO_TITOU_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_ROLE_KEY"):
        val = (os.environ.get(name) or "").strip()
        if val:
            return val
    for path in DEFAULT_KEY_FILES:
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        for line in text.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                k, v = line.split("=", 1)
                if k.strip() in ("HELLO_TITOU_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_ROLE_KEY", "SERVICE_ROLE_KEY"):
                    return v.strip().strip('"').strip("'")
            else:
                return line
    return None


def sql_help(action: str, request_id: str | None = None, note: str | None = None) -> str:
    lines = [
        "No service role key found. Run this SQL via Supabase MCP execute_sql",
        f"on project {PROJECT}:",
        "",
    ]
    if action == "list":
        lines.append("SELECT * FROM public.admin_list_early_access('pending');")
        lines.append("-- or all requests:")
        lines.append("SELECT * FROM public.admin_list_early_access('all');")
    elif action == "approve":
        lines.append(f"SELECT public.admin_decide_early_access('{request_id}', 'approved');")
        lines.append("")
        lines.append("This sends the invite email automatically (trigger + Edge Function).")
    elif action == "reject":
        n = (note or "").replace("'", "''")
        if n:
            lines.append(f"SELECT public.admin_decide_early_access('{request_id}', 'rejected', '{n}');")
        else:
            lines.append(f"SELECT public.admin_decide_early_access('{request_id}', 'rejected');")
    return "\n".join(lines)


def rpc(key: str, fn: str, payload: dict):
    url = f"{SB_URL}/rest/v1/rpc/{fn}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Prefer": "return=representation",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"RPC {fn} failed ({e.code}): {body}") from e


def print_rows(rows):
    if not rows:
        print("Aucune demande.")
        return
    if isinstance(rows, dict):
        rows = [rows]
    for r in rows:
        print("-" * 60)
        print(f"id:            {r.get('id')}")
        print(f"status:        {r.get('status')}")
        print(f"created_at:    {r.get('created_at')}")
        print(f"first_name:    {r.get('first_name')}")
        print(f"email:         {r.get('email')}")
        print(f"children_info: {r.get('children_info') or '—'}")
        print(f"message:       {r.get('message') or '—'}")
        print(f"decided_at:    {r.get('decided_at') or '—'}")
        print(f"notes:         {r.get('notes') or '—'}")
        print(f"invited_at:    {r.get('invited_at') or '—'}")
    print("-" * 60)
    print(f"{len(rows)} demande(s).")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_list = sub.add_parser("list", help="List requests (default: pending)")
    p_list.add_argument("--status", default="pending", help="pending, approved, rejected, or all")
    p_app = sub.add_parser("approve", help="Approve a request and send the invite email")
    p_app.add_argument("id")
    p_rej = sub.add_parser("reject", help="Reject a request")
    p_rej.add_argument("id")
    p_rej.add_argument("--note", default=None)
    args = parser.parse_args(argv)

    key = load_service_role()
    if not key:
        rid = getattr(args, "id", None)
        note = getattr(args, "note", None)
        print(sql_help(args.cmd, rid, note))
        return 2

    if args.cmd == "list":
        rows = rpc(key, "admin_list_early_access", {"p_status": args.status})
        print_rows(rows)
        return 0
    if args.cmd == "approve":
        result = rpc(key, "admin_decide_early_access", {"p_id": args.id, "p_decision": "approved"})
        print(json.dumps(result, ensure_ascii=False, indent=2))
        print("Invite email: sent automatically if the parent did not already have an account.")
        return 0
    if args.cmd == "reject":
        payload = {"p_id": args.id, "p_decision": "rejected"}
        if args.note:
            payload["p_notes"] = args.note
        result = rpc(key, "admin_decide_early_access", payload)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())

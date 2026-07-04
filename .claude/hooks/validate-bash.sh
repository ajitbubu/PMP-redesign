#!/usr/bin/env bash
#
# PreToolUse hook (matcher: Bash) — blocks a small set of catastrophic commands.
#
# Fail-OPEN by design: any parse/tooling problem allows the command through, so a bug in
# this script can never brick the session. Exit codes follow the Claude Code hook protocol:
#   exit 2  -> block the tool call (stderr is shown to Claude)
#   exit 0  -> allow
#
set -uo pipefail

payload="$(cat 2>/dev/null)" || exit 0
[ -z "$payload" ] && exit 0

# Extract the command string (jq preferred, python3 fallback, else fail open).
cmd=""
if command -v jq >/dev/null 2>&1; then
  cmd="$(printf '%s' "$payload" | jq -r '.tool_input.command // ""' 2>/dev/null)" || cmd=""
elif command -v python3 >/dev/null 2>&1; then
  cmd="$(printf '%s' "$payload" | python3 -c 'import sys, json
try:
    print(json.load(sys.stdin).get("tool_input", {}).get("command", ""))
except Exception:
    print("")' 2>/dev/null)" || cmd=""
fi
[ -z "$cmd" ] && exit 0

deny() {
  echo "⛔ validate-bash blocked this command: $1" >&2
  echo "   $cmd" >&2
  echo "   If this is genuinely intended, run it in your own terminal or adjust" >&2
  echo "   .claude/hooks/validate-bash.sh." >&2
  exit 2
}

# --- Catastrophic patterns (kept tight to avoid false positives) ---

# rm -rf targeting a bare root / home path (/, ~, $HOME, /*) — not sub-paths like /tmp/x.
if printf '%s' "$cmd" | grep -Eq '\brm\b[^|;&]*-[a-zA-Z]*[rf][a-zA-Z]*\b[^|;&]*[[:space:]](/|~|\$HOME)([[:space:]]|$|/\*|\*)'; then
  deny "recursive/forced delete of a root or home path"
fi

# Force-push to a protected branch.
if printf '%s' "$cmd" | grep -Eq '\bgit[[:space:]]+push\b[^|;&]*(--force|-f)\b' \
  && printf '%s' "$cmd" | grep -Eq '\b(main|master|production)\b'; then
  deny "force-push to a protected branch (main/master/production)"
fi

# Raw write to / reformat of a block device: `dd ... of=/dev/...` or `mkfs* /dev/...`.
if printf '%s' "$cmd" | grep -Eq '\bdd\b[^|;&]*[[:space:]]of=/dev/' \
  || printf '%s' "$cmd" | grep -Eq '\bmkfs(\.[a-z0-9]+)?\b[^|;&]*[[:space:]]/dev/'; then
  deny "raw write to / reformat of a block device"
fi

# Pipe a downloaded payload straight into a shell.
if printf '%s' "$cmd" | grep -Eq '\b(curl|wget)\b[^|]*\|[[:space:]]*(sudo[[:space:]]+)?(sh|bash|zsh|fish)\b'; then
  deny "piping a downloaded script directly into a shell"
fi

# Fork bomb.
if printf '%s' "$cmd" | grep -Eq ':\(\)[[:space:]]*\{[[:space:]]*:[[:space:]]*\|[[:space:]]*:'; then
  deny "fork bomb"
fi

# Recursive chmod/chown on a bare root/home path.
if printf '%s' "$cmd" | grep -Eq '\b(chmod|chown)\b[^|;&]*-[a-zA-Z]*R[a-zA-Z]*\b[^|;&]*[[:space:]](/|~|\$HOME)([[:space:]]|$)'; then
  deny "recursive permission/ownership change on a root path"
fi

exit 0

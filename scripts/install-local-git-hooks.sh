#!/bin/sh
set -eu

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

HOOKS_SRC="$ROOT/scripts/git-hooks"
HOOKS_DST="$ROOT/.local/githooks"

mkdir -p "$HOOKS_DST"

for hook in prepare-commit-msg commit-msg pre-commit; do
  cp "$HOOKS_SRC/$hook" "$HOOKS_DST/$hook"
  chmod +x "$HOOKS_DST/$hook"
done

git config core.hooksPath .local/githooks

cat > "$ROOT/.local/README" <<'EOF'
Local-only directory. Not committed.

Git hooks here strip automated co-author trailers and block editor tooling
files from being committed. Re-run scripts/install-local-git-hooks.sh after
cloning on a new machine.
EOF

echo "Installed local git hooks to .local/githooks"
echo "Set core.hooksPath = .local/githooks for this repository"

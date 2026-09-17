#!/usr/bin/env bash
# Runs the Next.js dev server (port 4000) under the pinned Node toolchain.
set -euo pipefail

cd "$(dirname "$0")/.."

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use "$(cat .nvmrc 2>/dev/null || echo 24)" >/dev/null
export PATH="$NVM_BIN:$PATH"

exec yarn dev

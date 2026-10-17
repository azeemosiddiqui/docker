#!/bin/sh
# Runs before the application command.
set -eu
echo "=========================================="
echo " Nexus Taskboard container starting..."
echo " Environment: ${NODE_ENV:-production}"
echo " Port: ${PORT:-3000}"
echo "=========================================="
# exec replaces this shell and forwards stop signals to Node.js.
exec "$@"

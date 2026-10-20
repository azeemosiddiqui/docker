#!/bin/sh
# ENTRYPOINT runs this script when the container starts.
set -e
echo "Starting the basic Node.js Docker app..."
echo "Configured PORT: ${PORT}"
# "$@" means the command and arguments supplied by CMD (or docker run).
exec "$@"

#!/bin/bash
set -e
export COMMIT_SHA=$(git rev-parse HEAD)
# Build new images while old containers are still running
docker compose build --no-cache
# Restart containers with the new images (short downtime)
docker compose up -d --force-recreate

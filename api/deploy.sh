#!/bin/bash
set -e
export COMMIT_SHA=$(git rev-parse HEAD)
docker compose down
docker compose build --no-cache
docker compose up -d

#!/bin/bash
set -e
export COMMIT_SHA=$(git rev-parse HEAD)
docker compose down
docker compose build --no-cache --build-arg COMMIT_SHA=$COMMIT_SHA
docker compose up -d

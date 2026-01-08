#!/usr/bin/env bash
set -e

# Backend URL
URL="http://localhost:3000/api/v1/servers/data"

# If specific files are passed as arguments, use those.
# Otherwise, default to all .json files in the current directory.
FILES=${@:-*.json}

for DATA_FILE in $FILES; do
  echo "Sending data from $DATA_FILE to $URL..."

  curl -X POST "$URL" \
    -H "Content-Type: application/json" \
    -d @"$DATA_FILE" \
    -w "HTTP Status: %{http_code}\n" \
    -s -o >(jq '.')

done

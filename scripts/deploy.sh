#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DEPLOY_REPO="git@github.com:digitalocean/design-lab.git"
DEPLOY_DIR="$(dirname "$PROJECT_DIR")/design-lab"

cd "$PROJECT_DIR"

echo ""
echo "=== Step 1: Commit and push source code ==="
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "Update from deploy script"
  git push origin HEAD
  echo "Source code pushed."
else
  echo "No changes to commit."
fi

echo ""
echo "=== Step 2: Build ==="
npm run build
echo "Build complete."

echo ""
echo "=== Step 3: Deploy to design-lab ==="
if [ ! -d "$DEPLOY_DIR/.git" ]; then
  echo "Cloning design-lab repo..."
  git clone "$DEPLOY_REPO" "$DEPLOY_DIR"
fi

cd "$DEPLOY_DIR"

if [ -z "$(git config user.email)" ]; then
  git config user.email "design-lab@digitalocean.com"
  git config user.name "Design Lab Deploy"
fi

git pull origin main 2>/dev/null || true

rm -rf "$DEPLOY_DIR"/*
cp -r "$PROJECT_DIR/dist/"* "$DEPLOY_DIR/"

git add -A
if [ -n "$(git status --porcelain)" ]; then
  git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"
  git push origin main
  echo ""
  echo "=== Deployed! App Platform will update automatically. ==="
else
  echo ""
  echo "=== No changes to deploy. ==="
fi

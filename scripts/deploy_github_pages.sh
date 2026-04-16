#!/usr/bin/env bash
# Deploy dashboard to GitHub Pages (gh-pages branch)
# Pushes only static HTML/CSS/JS + data JSON files to the gh-pages branch
# of the SOTA repository.
#
# Usage: bash scripts/deploy_github_pages.sh

set -euo pipefail

REPO_URL="https://github.com/hollobit/SOTA.git"
DEPLOY_DIR=$(mktemp -d)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DASHBOARD_DIR="$PROJECT_ROOT/dashboard"
EXPORT_DIR="$PROJECT_ROOT/data/export"

echo "=== GitHub Pages Deploy ==="
echo "Project: $PROJECT_ROOT"
echo "Deploy temp: $DEPLOY_DIR"

# 1. Ensure data is exported
echo "[1/5] Exporting latest data..."
cd "$PROJECT_ROOT"
python -m cyber export 2>/dev/null || echo "  (export skipped — run manually if needed)"

# 2. Clone or init gh-pages branch
echo "[2/5] Preparing gh-pages branch..."
HAS_BRANCH=$(git ls-remote "$REPO_URL" refs/heads/gh-pages 2>/dev/null | wc -l | tr -d ' ')
if [ "$HAS_BRANCH" -gt 0 ]; then
    git clone --branch gh-pages --single-branch --depth 1 "$REPO_URL" "$DEPLOY_DIR"
else
    echo "  Creating new gh-pages branch (orphan)..."
    cd "$DEPLOY_DIR"
    git init
    git checkout --orphan gh-pages
    git remote add origin "$REPO_URL"
fi

# 3. Clear old content and copy new
echo "[3/5] Copying dashboard files..."
cd "$DEPLOY_DIR"
# Remove everything except .git
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +

# Copy dashboard HTML/CSS/JS
cp "$DASHBOARD_DIR/index.html" .
cp -r "$DASHBOARD_DIR/css" .
cp -r "$DASHBOARD_DIR/js" .

# Copy data (actual files, not symlink)
mkdir -p data
if [ -d "$EXPORT_DIR" ]; then
    cp -r "$EXPORT_DIR"/* data/
else
    echo "  WARNING: $EXPORT_DIR not found. Data will be empty."
fi

# Create .nojekyll to bypass Jekyll processing
touch .nojekyll

# Create CNAME if needed (uncomment and set your domain)
# echo "sota.example.com" > CNAME

echo "[4/5] Committing..."
git add -A
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "deploy: update dashboard — $TIMESTAMP

Models: $(python3 -c "import json; d=json.load(open('data/models.json')); print(len(d))" 2>/dev/null || echo '?')
Benchmarks: $(python3 -c "import json; d=json.load(open('data/benchmarks.json')); print(len(d))" 2>/dev/null || echo '?')
Scores: $(python3 -c "import json; d=json.load(open('data/scores/current.json')); print(len(d))" 2>/dev/null || echo '?')
" || echo "  (no changes to commit)"

echo "[5/5] Pushing to gh-pages..."
git push origin gh-pages --force

echo ""
echo "=== Deploy complete ==="
echo "Site: https://hollobit.github.io/SOTA/"
echo ""

# Cleanup
rm -rf "$DEPLOY_DIR"

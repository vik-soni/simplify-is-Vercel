#!/bin/bash

echo "=== API Routes Audit ==="
echo ""
echo "## All API Routes Found:"
find ./app/api -type f -name '*.ts' -o -name '*.tsx' 2>/dev/null | sort

echo ""
echo "## Route Method & Path Mapping:"
grep -r "export.*\(GET\|POST\|PUT\|PATCH\|DELETE\)" ./app/api --include="*.ts" --include="*.tsx" 2>/dev/null | head -50

echo ""
echo "## All lib/api or services directories:"
find ./lib -type d -name "*api*" -o -type d -name "*service*" 2>/dev/null

echo ""
echo "## Middleware & Auth patterns:"
grep -r "middleware\|NextRequest\|NextResponse" ./app/api --include="*.ts" -l 2>/dev/null | head -20

echo ""
echo "## Database query patterns (Supabase calls):"
grep -r "supabase\|from(" ./lib --include="*.ts" -l 2>/dev/null | head -20

echo ""
echo "## Hook files (data fetching):"
find ./hooks -type f -name "*.ts" -o -name "*.tsx" 2>/dev/null | sort

echo ""
echo
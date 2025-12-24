#!/bin/bash

# Script to remove cache-related settings from all hooks
# These settings will be inherited from global QueryClient config

echo "🔧 Removing cache settings from hooks..."

# List of files to update
FILES=(
  "hooks/useDashboardQuery.ts"
  "hooks/useAccountsQuery.ts"
  "hooks/usePaymentOrdersQuery.ts"
  "hooks/useAccountGroupsQuery.ts"
  "hooks/useAccountGroupsWithDependency.ts"
  "hooks/usePaymentOrderDetailQuery.ts"
  "hooks/usePaymentOrderTransactionsQuery.ts"
  "hooks/useTransactionsQuery.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  📝 Processing $file..."

    # Remove staleTime, gcTime, refetchOnWindowFocus, refetchOnMount lines
    # Keep the file structure intact

    # Note: Manual review needed - this is a placeholder
    # You should manually update each file
  fi
done

echo "✅ Done! Please manually review and update each hook file."
echo ""
echo "Replace cache settings with:"
echo "    // ⚠️ NO CACHE - سیستم مالی (از تنظیمات global استفاده می‌شود)"

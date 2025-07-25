# Self improvement tracker application

A Next.js application for record any activity self improvement like workout, learning and create project.

## Project Setup

- **Supabase Project ID**: `qqrouqhuxlojkmstorok`
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with cookie-based sessions
- **State**: React Query (TanStack Query v5)
- **Styling**: Tailwind CSS
- **UI**: Radix UI primitives
- **Visualizations**: D3.js (network graphs), Recharts (charts)
- **Convert HTML**: html2canvas

## Critical Conventions

### File Naming (IMPORTANT!)
**All files MUST use kebab-case naming:**
- ✅ `content-heatmap.tsx`
- ❌ `ContentHeatmap.tsx`

### Component Folder Structure
```
theme-detail-page/
├── components/
│   ├── index.ts (barrel export)
│   └── theme-*.tsx (components)
├── hooks/
│   ├── index.ts (barrel export)
│   └── use-theme-*.ts (hooks)
├── types/
│   └── *.ts (TypeScript interfaces)
├── utils/
│   └── theme-*.ts (utilities)
└── constants/
    └── theme-constants.ts
```

## Common Patterns

### React Query Hook Pattern
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['theme-network', themeId],
  queryFn: async () => {
    const result = await supabase.rpc('function_name', {
      p_theme_id: themeId
    });
    return result.data;
  },
  staleTime: 5 * 60 * 1000 // 5 minutes
});
```

### Supabase RPC Function Pattern
```sql
CREATE OR REPLACE FUNCTION function_name(p_theme_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN json_build_object(
    'key', value,
    'nested', (SELECT json_agg(...) FROM ...)
  );
END;
$$;
```

### Loading State Component
```typescript
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"/>
    </div>
  );
}
```

### Deduplication Pattern (for duplicate key warnings)
```typescript
const uniqueProfiles = analytics.contributingProfiles.reduce((acc, p) => {
  const existing = acc.find(profile => profile.id === p.id);
  if (!existing) {
    acc.push(p);
  } else {
    existing.contentCount += p.contentCount;
    existing.totalViews += p.totalViews;
  }
  return acc;
}, [] as typeof analytics.contributingProfiles);
```

## Known Issues & Solutions

### Issue: Numbers like 1009 displayed as "1.0K"
**Solution**: Add optional parameter to formatting function:
```typescript
export function formatNumber(num: number, exact: boolean = false): string {
  if (exact) {
    return num.toLocaleString();
  }
  // ... existing rounding logic
}
```

### Issue: Filter re-renders entire page
**Location**: `components/network-pages/theme-detail-page/theme-detail-page.tsx`
**Fix**: Optimize filter logic to prevent full page re-renders

## Database Constraints

- **Query Limit**: Default 1000 rows (use aggregation, not raw selects)
- **Always use**: `COUNT(*)` for totals, not row selections
- **RLS**: Policies are active - ensure proper permissions
- **Time Filters**: Support 'all', '7d', '30d', '90d'

## Loading Skeletons

### Standards
- **Page-level skeletons**: Always use `h-screen` to prevent layout shifts
- **Background colors**: `bg-neutral-900` or `bg-neutral-800`
- **Skeleton items**: `bg-neutral-700` with `animate-pulse`
- **Match layout**: Skeleton should match the actual component layout

### Available Skeletons
- `PageSkeleton` - Generic full-page skeleton
- `ContentSkeleton` - For content lists
- `CardSkeleton` - For card components
- `TableSkeleton` - For table data
- `AllProminentsPageSkeleton` - Specific to All Prominents page
- `NetworkMapSkeleton` - For network map visualization

### Usage Example
```tsx
import { PageSkeleton } from '@app/components/ui/loading';

if (isLoading) {
  return <PageSkeleton hasHeader hasSidebar />;
}
```

## Commands

- `bun run dev` - Development server with TurboPack
- `bun run build` - Production build
- `bun run lint` - ESLint checks

**Note**: TypeScript errors currently ignored during build (see next.config.ts)

## Tools
- Use Supabase MCP for Database Related stuffs, either to check data, query, create RPC function or testing RPC functions
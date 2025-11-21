# Styles Directory

## Active Stylesheets

### `globals.css`
**Status:** ✅ Active - Main stylesheet

This is the primary global stylesheet used across the entire application.
Imported in: `app/layout.tsx`

Features:
- Tailwind CSS directives (@tailwind base, components, utilities)
- CSS custom properties for theming (light/dark modes)
- Global resets and defaults
- RTL-specific adjustments
- Custom scrollbar styles

### `themes.css`
**Status:** ⚠️ Review needed

Theme-specific CSS variables and configurations.
May contain additional theme definitions.

## Archived/Unused Files

The following files were found to be unused and have been backed up:

- `globals-new.css.backup` - Not imported anywhere
- `global-v2.css.backup` - Not imported anywhere

**Note:** If you need to restore these files, remove the `.backup` extension.

## Best Practices

1. **Single Source of Truth:** We use `globals.css` as the main stylesheet
2. **Tailwind First:** Prefer Tailwind utility classes over custom CSS
3. **CSS Variables:** Use CSS custom properties for theming
4. **RTL Support:** All styles should support RTL layout

## File Structure

```
styles/
├── globals.css          # ✅ Main stylesheet (ACTIVE)
├── themes.css           # ⚠️ Additional themes
├── README.md            # This file
├── globals-new.css.backup   # Archived
└── global-v2.css.backup     # Archived
```

## Maintenance

Last reviewed: 2025-11-20
Reviewed by: Code quality improvement initiative

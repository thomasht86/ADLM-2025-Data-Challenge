# LabDocs Unlocked - Theme System Documentation

## Overview
This document describes the centralized theme system implemented for LabDocs Unlocked, ensuring consistent dark/light mode behavior across all components.

## Implementation Details

### CSS Variables System
All colors are now managed through CSS custom properties (variables) defined in `styles-chat.css`. This provides:
- **Single source of truth** for all color values
- **Automatic theme switching** when the `.dark` class is applied to `<html>`
- **Consistent styling** across all components

### Color Palette

#### Light Mode (Default)
```css
--color-bg-primary: #FAFBFC      /* Main background */
--color-bg-surface: #FFFFFF       /* Cards, panels */
--color-bg-hover: #F9FAFB         /* Hover states */
--color-bg-active: #F3F4F6        /* Active states */
--color-text-primary: #1F2937     /* Main text */
--color-text-secondary: #4B5563   /* Secondary text */
--color-text-muted: #6B7280       /* Muted text */
--color-border: #E5E7EB           /* Borders */
--color-accent-primary: #4F46E5   /* Primary accent (indigo) */
```

#### Dark Mode
```css
--color-bg-primary: #0F1419       /* Main background */
--color-bg-surface: #1A1F2E       /* Cards, panels */
--color-bg-hover: #252D3F         /* Hover states */
--color-bg-active: #2D3748        /* Active states */
--color-text-primary: #E5E7EB     /* Main text */
--color-text-secondary: #D1D5DB   /* Secondary text */
--color-text-muted: #9CA3AF       /* Muted text */
--color-border: #2D3748           /* Borders */
--color-accent-primary: #818CF8   /* Primary accent (lighter indigo) */
```

## Configuration

### Tailwind CSS
Both `index.html` and `index-chat.html` now configure Tailwind to use class-based dark mode:

```javascript
tailwind.config = {
    darkMode: 'class',
}
```

This ensures Tailwind's `dark:` utility classes work with our `.dark` class approach.

### JavaScript Theme Toggle
The theme is managed by:
- `main.js` - for the search interface
- `main-chat.js` - for the chat interface

Both files:
1. Add/remove the `dark` class on `document.documentElement` (the `<html>` tag)
2. Save theme preference to localStorage
3. Load saved theme on page load

## Components Using Theme System

### All Components Now Support Dark/Light Mode:
- ✅ **Navbar** - Background, text, borders
- ✅ **Suggested Questions** - Background, borders, hover states
- ✅ **Welcome Screen** - Text colors, cards
- ✅ **Chat Messages** - User and AI messages, avatars
- ✅ **Source Cards** - Background, borders, highlights
- ✅ **Badges** - SOP, 510k, and other badges
- ✅ **Citations** - Background and text
- ✅ **Highlights** - Search result highlights
- ✅ **Input Fields** - Chat input, focus states
- ✅ **Buttons** - Send button, related questions
- ✅ **Scrollbars** - Custom scrollbar styling

## Files Modified

### CSS Files
1. **`css/styles-chat.css`**
   - Added CSS custom properties at `:root` and `.dark`
   - Converted all color values to use `var(--color-*)`
   - Removed individual `.dark` selector rules (now handled by variables)

2. **`css/styles.css`**
   - Updated to use CSS variables with fallbacks
   - Removed individual `.dark` selector rules
   - Ensured compatibility with styles-chat.css variables

### HTML Files
1. **`index-chat.html`**
   - Added Tailwind config for `darkMode: 'class'`

2. **`index.html`**
   - Added Tailwind config for `darkMode: 'class'`
   - Added styles-chat.css import for variable access

## Usage

### For Developers
To use theme colors in new components:

```css
/* Use CSS variables */
.my-component {
    background-color: var(--color-bg-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
}

.my-component:hover {
    background-color: var(--color-bg-hover);
    border-color: var(--color-border-focus);
}
```

### For Users
- Click the 🌙/☀️ button in the header to toggle dark/light mode
- Theme preference is saved automatically
- Theme persists across page reloads

## Benefits

1. **Minimal Configuration** - All colors defined in one place
2. **Automatic Updates** - Adding `.dark` class updates all components
3. **Maintainable** - Easy to adjust colors or add new themes
4. **Consistent** - All components use the same color palette
5. **Accessible** - High contrast ratios in both modes
6. **Performance** - CSS variables are native and fast

## Testing

To test dark/light mode:
1. Open the application in a browser
2. Click the theme toggle button (🌙/☀️)
3. Verify all components update immediately:
   - Navbar background and text
   - Suggested question cards
   - Message bubbles
   - Source cards
   - Input fields
   - Buttons and badges

## Future Enhancements

Possible additions:
- System preference detection (`prefers-color-scheme`)
- Additional theme variants (e.g., high contrast, sepia)
- Smooth color transitions on theme change
- Theme-specific images or icons

## Troubleshooting

### Issue: Theme not switching for some components
**Solution**: Ensure the component uses CSS variables (`var(--color-*)`) instead of hardcoded colors.

### Issue: Tailwind dark: classes not working
**Solution**: Verify `tailwind.config` includes `darkMode: 'class'` in the HTML file.

### Issue: Theme not persisting
**Solution**: Check browser localStorage is enabled and `Utils.setLocalStorage()` is called.

---

*Last updated: October 18, 2025*

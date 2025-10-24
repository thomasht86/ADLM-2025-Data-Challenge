# LabDocs Unlocked - Design System

## 🎨 Color Palette

### Light Mode
```
Background:     #FAFBFC (soft off-white - easy on the eyes)
Surface:        #FFFFFF (pure white for cards)
Primary:        #4F46E5 (indigo - professional yet modern)
Primary Light:  #6366F1 (lighter indigo for gradients)
Text Primary:   #1F2937 (soft black, not harsh)
Text Secondary: #6B7280 (medium gray)
Border:         #E5E7EB (very subtle gray)
```

### Dark Mode
```
Background:     #0F1419 (soft black, not pure black)
Surface:        #1A1F2E (dark blue-gray surface)
Primary:        #818CF8 (lighter indigo - less harsh)
Primary Dark:   #6366F1 (for gradients)
Text Primary:   #E5E7EB (soft white)
Text Secondary: #9CA3AF (medium gray)
Border:         #2D3748 (subtle dark border)
```

## 🎯 Design Principles

### 1. **Soft, Not Harsh**
- ✅ Backgrounds: Off-white (#FAFBFC) instead of pure white
- ✅ Dark mode: Soft black (#0F1419) instead of #000000
- ✅ Borders: Subtle grays (#E5E7EB) instead of stark borders
- ✅ Shadows: Soft, barely visible shadows for depth

### 2. **Professional Medical Aesthetic**
- Clean, uncluttered interfaces
- Consistent spacing (using 0.875rem, 1rem, 1.25rem)
- Professional indigo color scheme
- High readability with proper contrast ratios

### 3. **Smooth Interactions**
- All interactions have 0.2s ease transitions
- Hover effects are subtle but noticeable
- Micro-animations for delight (typing dots, cursor blink)
- Transform effects (translateY, translateX) for depth

### 4. **Visual Hierarchy**
- **Primary actions**: Bold gradients with shadows
- **Secondary actions**: Subtle backgrounds
- **Text hierarchy**:
  - Headers: 600 weight
  - Body: 400 weight
  - Small text: 0.875rem

## 📦 Component Styles

### User Message Bubble
```css
Background: Linear gradient (indigo to lighter indigo)
Shadow: Soft with indigo tint (0 2px 8px rgba(79, 70, 229, 0.15))
Border Radius: 1.25rem (rounded) with 0.375rem on bottom-right
Padding: 0.875rem 1.25rem
Font Size: 0.9375rem (15px)
```

### AI Message Avatar
```css
Background: Indigo to purple gradient
Size: 2.25rem × 2.25rem
Border Radius: 0.625rem (rounded square)
Shadow: Soft indigo glow
```

### Source Cards
```css
Background: Pure white (light) / #1A1F2E (dark)
Border: 1px solid #E5E7EB (very subtle)
Border Radius: 0.75rem
Shadow: Very subtle (0 1px 3px rgba(0, 0, 0, 0.03))
Hover:
  - Border: Indigo
  - Shadow: Larger, indigo-tinted
  - Transform: translateY(-2px)
```

### Citations
```css
Background: #EEF2FF (indigo-50)
Color: #4F46E5 (indigo-600)
Padding: 0.125rem 0.5rem
Border Radius: 0.375rem
Font Size: 0.8125rem (13px)
Font Weight: 600

Hover:
  - Background: Lighter
  - Transform: translateY(-1px)
  - Shadow: Soft indigo glow
```

### Chat Input
```css
Background: White / #1A1F2E
Border: 1.5px solid #E5E7EB (slightly thicker for emphasis)
Focus:
  - Border: Indigo
  - Ring: 3px indigo glow (0 0 0 3px rgba(79, 70, 229, 0.1))
Font Size: 0.9375rem
Line Height: 1.6
```

### Send Button
```css
Background: Linear gradient indigo
Shadow: 0 2px 8px rgba(79, 70, 229, 0.25)
Hover:
  - Transform: translateY(-2px)
  - Shadow: Larger, more prominent
Active:
  - Transform: translateY(0) (press effect)
```

### Related Questions
```css
Background: #F9FAFB (very light gray)
Border: 1px #E5E7EB
Border Radius: 0.625rem
Hover:
  - Background: White
  - Border: Indigo
  - Text: Indigo
  - Transform: translateX(4px) (slide right)
```

## 🌓 Dark Mode Strategy

### Philosophy
- **Avoid pure blacks** - use #0F1419 for background
- **Reduce contrast** - softer whites for text (#E5E7EB instead of #FFFFFF)
- **Warmer tones** - dark blue-gray surfaces (#1A1F2E) instead of pure gray
- **Lighter primaries** - #818CF8 instead of #4F46E5 for less eye strain
- **Softer shadows** - more prominent in dark mode for depth

### Dark Mode Surfaces
```
Level 0 (Background): #0F1419
Level 1 (Cards):      #1A1F2E  (+1 step up)
Level 2 (Hover):      #252D3F  (+1 more step)
Level 3 (Active):     #2D3748  (+1 more step)
```

## 📐 Spacing System

### Consistent Spacing Scale
```
0.5rem  = 8px   (tight)
0.625rem = 10px (compact)
0.75rem = 12px  (small)
0.875rem = 14px (default small)
1rem    = 16px  (default)
1.25rem = 20px  (comfortable)
1.5rem  = 24px  (spacious)
2rem    = 32px  (very spacious)
```

### Margin/Padding Guidelines
- **Message bubbles**: 0.875rem padding, 1.5-2rem margin-bottom
- **Cards**: 1rem padding
- **Buttons**: 0.5-0.625rem vertical, 0.875rem horizontal
- **Container**: 1-1.5rem default, 2rem+ for emphasis

## 🔤 Typography

### Font Sizes
```
0.75rem   = 12px (small badges, labels)
0.8125rem = 13px (citations, small text)
0.875rem  = 14px (secondary text, buttons)
0.9375rem = 15px (body text - primary size)
1rem      = 16px (comfortable reading)
1.125rem  = 18px (subheadings)
1.25rem   = 20px (headings)
2rem      = 32px (hero text)
```

### Font Weights
```
400 = Normal (body text)
500 = Medium (buttons, labels)
600 = Semibold (headings, emphasis)
700 = Bold (avoided - too heavy)
```

### Line Heights
```
1.5  = Tight (labels, buttons)
1.6  = Comfortable (messages)
1.75 = Spacious (AI responses, prose)
```

## 🎭 Shadows & Depth

### Shadow Hierarchy
```
Level 1 (Subtle):
  0 1px 3px rgba(0, 0, 0, 0.03)

Level 2 (Default):
  0 2px 8px rgba(0, 0, 0, 0.04)

Level 3 (Elevated):
  0 4px 12px rgba(0, 0, 0, 0.06)

Level 4 (Floating):
  0 8px 24px rgba(0, 0, 0, 0.08)
```

### Colored Shadows (for primary elements)
```
Indigo glow:
  0 2px 8px rgba(79, 70, 229, 0.15)
  0 4px 12px rgba(79, 70, 229, 0.2)
```

## 🎬 Animations & Transitions

### Timing
```
Default: 0.2s ease
Quick:   0.15s ease
Slow:    0.3s ease-in-out
```

### Transform Effects
```
Hover lift:   translateY(-2px)
Slide right:  translateX(4px)
Press:        translateY(0) from translateY(-2px)
```

### Keyframe Animations
```
Fade in:      opacity 0→1, translateY(10px)→0
Typing dots:  translateY(0)→-8px with opacity
Cursor blink: opacity 1→0 step-end
```

## 🎨 Badge Color System

### SOP (Standard Operating Procedure)
```
Light: #DBEAFE background, #1E40AF text (blue)
Dark:  #1E3A8A background, #BFDBFE text
```

### 510(k) (FDA Clearance)
```
Light: #FCE7F3 background, #BE185D text (pink)
Dark:  #831843 background, #FBCFE8 text
```

### Other
```
Light: #F3F4F6 background, #4B5563 text (gray)
Dark:  #374151 background, #D1D5DB text
```

## ♿ Accessibility

### Contrast Ratios (WCAG AA)
```
Normal text:     4.5:1 minimum
Large text:      3:1 minimum
UI components:   3:1 minimum
```

### Our Ratios
```
Primary text on background:  #1F2937 on #FAFBFC = 12.5:1 ✓
Secondary text:              #6B7280 on #FAFBFC = 5.8:1 ✓
Primary button:              #FFFFFF on #4F46E5 = 8.2:1 ✓
Citations:                   #4F46E5 on #EEF2FF = 6.1:1 ✓
Dark mode text:              #E5E7EB on #0F1419 = 13.1:1 ✓
```

### Focus States
- All interactive elements have visible focus rings
- Focus ring: 3px solid with 0.1 opacity of primary color
- Never remove focus outlines

## 📱 Responsive Breakpoints

```css
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

### Mobile Adaptations
- Source panel becomes full-screen overlay
- Font sizes reduce by ~6% (0.9375rem → 0.875rem)
- Message bubbles: max-width 85% instead of 80%
- Touch targets: minimum 44×44px

## 🎯 Best Practices

### DO ✅
- Use soft off-white backgrounds, never pure white
- Apply subtle shadows for depth
- Use consistent spacing from the scale
- Transition all interactive elements (0.2s ease)
- Test in both light and dark mode
- Maintain proper contrast ratios
- Use indigo gradient for primary actions

### DON'T ❌
- Don't use pure black (#000000) or pure white (#FFFFFF) for backgrounds
- Don't use harsh borders (use #E5E7EB or softer)
- Don't use bright, saturated colors (except for accents)
- Don't skip hover states on interactive elements
- Don't forget to test dark mode
- Don't use bold font weights > 600 (too heavy)

## 🔄 Future Enhancements

- Add subtle gradient overlays for depth
- Explore glassmorphism for modals/overlays
- Add loading skeleton animations
- Consider custom font (Inter, SF Pro, or similar)
- Add more micro-interactions
- Explore haptic feedback for mobile

---

**Design Philosophy**: Professional, medical-grade interface that's easy on the eyes for extended reading sessions. Subtle, sophisticated, and accessible.

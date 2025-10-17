# DarkBet UI Revamp System Prompt

## Project Overview

DarkBet is a decentralized prediction market platform built on BNB Smart Chain, featuring revolutionary Dark Pool betting technology. The platform allows users to create and participate in prediction markets with complete privacy until resolution, preventing market manipulation and ensuring fair competition.

## Design System Foundation

### Core Brand Identity

- **Primary Colors**: BNB Yellow (#F0B90B), Dark themes with gold accents
- **Typography**: Be Vietnam Pro font family (display, heading, body, caption variants)
- **Theme**: Dark mode with sophisticated gradients and glass morphism effects
- **Aesthetic**: Professional, modern, crypto-focused with emphasis on privacy and transparency

### Color Palette

```css
/* Primary BNB Colors */
--primary: #f0b90b (BNB Yellow) --primary-foreground: #000000
  --secondary: #1e2329 (BNB Dark) --secondary-foreground: #ffffff
  --accent: #00d4aa (BNB Green) --accent-foreground: #ffffff
  /* Dark Theme Colors */ --background: #000000 --foreground: #ffffff
  --card: #0f0f0f --border: #1f1f1f --muted: #1a1a1a --muted-foreground: #a0a0a0;
```

### Typography Scale

```css
/* Display Text (Hero Headlines) */
.font-display: 700 weight, -0.01em letter-spacing, 1.1 line-height

/* Heading Text */
.font-heading: 600 weight, -0.005em letter-spacing, 1.2 line-height

/* Body Text */
.font-body: 400 weight, 1.6 line-height

/* Caption Text */
.font-caption: 500 weight, 0.875rem size, 1.4 line-height
```

## Hero Section Benchmark Analysis

### Layout Structure

1. **Background Effects**: Layered blur effects with yellow/gold gradients
2. **Update Badge**: Left-aligned "Live" indicator with sparkle icon
3. **Main Title**: Two-line headline with animated word cycling
4. **Description**: Clean paragraph with proper spacing
5. **CTA Buttons**: Primary (shimmer) and secondary (outline) buttons
6. **Explanation Section**: Quote icon, large heading, descriptive text
7. **Stats Section**: Three-column metrics with yellow accents

### Key Design Patterns

#### 1. Background Effects

```tsx
<div className="absolute inset-0 overflow-hidden">
  <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
  <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />
  <div className="absolute inset-0 bg-[repeating-linear-gradient(105deg,#101010_0px_1px,transparent_1px_8px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
</div>
```

#### 2. Animated Word Cycling

- Uses Framer Motion for smooth transitions
- Yellow gradient text on dark background
- 4-second duration with smooth easing
- Words: "Private", "On-Chain", "Predictive"

#### 3. Shimmer Button Component

- Custom gradient backgrounds
- Hover effects with transform animations
- Rounded full design with proper shadows
- Orange/yellow color scheme

#### 4. Stats Display

- Yellow accent colors for numbers
- Gray text for labels
- Rounded container with border and backdrop blur
- Responsive grid layout

## Component Architecture

### Core Components

1. **ShimmerButton**: Custom animated button with gradient effects
2. **WordAnimator**: Text cycling animation component
3. **NewItemsLoading**: Live badge with sparkle icon
4. **Button**: shadcn/ui base button with custom variants

### Styling Patterns

#### Glass Morphism

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

#### Gradient Text

```css
.gradient-text-brand {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

#### BNB Pattern

```css
.bnb-pattern {
  background-image:
    radial-gradient(
      circle at 25% 25%,
      rgba(240, 185, 11, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 75% 75%,
      rgba(240, 185, 11, 0.1) 0%,
      transparent 50%
    );
}
```

## UI Revamp Guidelines

### 1. Maintain Design Consistency

- Use the established color palette (BNB Yellow, Dark themes)
- Apply Be Vietnam Pro typography consistently
- Maintain dark mode aesthetic throughout
- Preserve glass morphism and gradient effects

### 2. Component Standards

- All interactive elements should have smooth transitions
- Use rounded corners (lg, md, sm variants)
- Apply proper shadows and glows for depth
- Maintain accessibility standards (focus states, contrast)

### 3. Animation Principles

- Use Framer Motion for complex animations
- Apply consistent easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Keep animations subtle and purposeful
- Respect user preferences for reduced motion

### 4. Responsive Design

- Mobile-first approach with proper breakpoints
- Flexible layouts that adapt to screen sizes
- Touch-friendly interactive elements
- Proper spacing and typography scaling

### 5. Dark Pool Theme Integration

- Emphasize privacy and security through design
- Use subtle animations to convey "hidden until revealed" concept
- Apply consistent visual hierarchy
- Maintain professional, trustworthy appearance

## Technical Implementation

### Framework Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for base components
- **Framer Motion** for animations
- **Lucide React** for icons

### File Structure

```
components/
├── ui/                    # Base UI components
│   ├── button.tsx        # shadcn/ui button
│   ├── shimmer-button.tsx # Custom animated button
│   ├── word-animator.tsx  # Text cycling component
│   └── hero-section.tsx  # Main hero component
├── layout/               # Layout components
├── prediction/           # Feature-specific components
└── providers/           # Context providers
```

### Styling Approach

- Use Tailwind utility classes for rapid development
- Create custom CSS classes for complex effects
- Apply consistent spacing using Tailwind's scale
- Use CSS custom properties for dynamic theming

## Quality Standards

### Code Quality

- TypeScript strict mode enabled
- Proper component prop interfaces
- Clean, readable code structure
- Consistent naming conventions

### Performance

- Optimize animations for 60fps
- Lazy load non-critical components
- Minimize bundle size
- Use proper image optimization

### Accessibility

- WCAG 2.1 AA compliance
- Proper semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach

## Implementation Checklist

### Before Starting

- [ ] Review existing component structure
- [ ] Understand the Dark Pool concept
- [ ] Familiarize with BNB Chain branding
- [ ] Set up development environment

### During Development

- [ ] Maintain design system consistency
- [ ] Apply proper TypeScript types
- [ ] Test responsive behavior
- [ ] Validate accessibility features
- [ ] Optimize animations and transitions

### Before Completion

- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Code review and cleanup
- [ ] Documentation updates
- [ ] User testing feedback

## Success Metrics

### Visual Quality

- Consistent with brand identity
- Professional, modern appearance
- Smooth animations and transitions
- Proper visual hierarchy

### User Experience

- Intuitive navigation
- Clear call-to-actions
- Responsive design
- Fast loading times

### Technical Excellence

- Clean, maintainable code
- Proper error handling
- Accessibility compliance
- Performance optimization

This system prompt provides comprehensive guidance for revamping the DarkBet UI while maintaining the established design system and brand identity. The hero section serves as the benchmark for quality, consistency, and user experience across the entire platform.

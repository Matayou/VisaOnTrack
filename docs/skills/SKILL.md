---
name: ai-app-designer
description: Creates stunning, professional UI/UX designs for AI applications and websites using modern design principles, responsive layouts, and best practices. Use when user requests app design, website design, UI mockup, interface design, dashboard design, or any visual design work for AI-powered applications. Automatically applies modern design patterns, accessible components, and production-ready code for React artifacts.
---

# AI App & Website Designer

This skill helps create stunning, professional designs for AI applications and websites with modern UI/UX patterns, accessible components, and production-ready code.

## When to Use This Skill

Use this skill when the user requests:
- **App or website designs** - "Design a chat interface", "Create an AI image generator UI"
- **UI mockups** - "Show me what this would look like", "Mock up a dashboard"
- **Interface improvements** - "Make this look better", "Redesign this component"
- **Design systems** - "Create a design for our AI platform"
- **Landing pages** - "Design a homepage for our AI tool"

## Design Workflow

### 1. Understand Requirements

Ask clarifying questions to understand:
- **Purpose**: What does this app/website do?
- **Target users**: Who will use it? (developers, general public, enterprises)
- **Key features**: Chat, image generation, data visualization, forms?
- **Branding**: Any color preferences or brand guidelines?
- **Tone**: Professional, playful, minimal, creative?

### 2. Choose Design Direction

Select appropriate patterns based on app type:

**For Chat Interfaces:**
- Use chat UI patterns (see `references/ui-patterns.md` - Chat Interface Layout)
- Distinct user/AI message bubbles
- Typing indicators, message actions
- Input area at bottom

**For Generation Tools (Image/Text/Content):**
- Split layout: input panel + preview area
- Clear generation button
- Progress indicators
- Download/export options

**For Dashboards:**
- Metric cards at top
- Charts and visualizations
- Recent activity feed
- Navigation sidebar

**For Landing Pages:**
- Hero section with clear value proposition
- Feature highlights
- Social proof (testimonials, logos)
- Call-to-action buttons

### 3. Apply Design Principles

Before building, consult `references/design-principles.md` for:
- **Color systems** - Choose appropriate palette
- **Typography** - Select font pairing and sizes
- **Spacing** - Use 8px base unit consistently
- **Layout** - Grid systems and container widths
- **Accessibility** - Ensure WCAG compliance

### 4. Build with Components

Use pre-built patterns from `references/component-library.md`:
- Copy relevant component code
- Customize colors, sizes, content
- Ensure responsive behavior
- Add appropriate states (hover, active, loading)

### 5. Polish and Refine

Add finishing touches:
- **Micro-interactions** - Hover effects, transitions
- **Loading states** - Spinners, skeletons, progress bars
- **Empty states** - Helpful messaging when no data
- **Error handling** - Friendly error messages
- **Animations** - Smooth transitions (respect reduced-motion)

## Design Best Practices

### Color Usage
1. Start with a base color palette (see design-principles.md)
2. Use 60-30-10 rule (60% primary, 30% secondary, 10% accent)
3. Ensure sufficient contrast (4.5:1 minimum for text)
4. Provide dark mode support when possible

### Typography Hierarchy
- Large, bold headings (24-48px)
- Clear section titles (20-32px)
- Readable body text (16-18px, never smaller than 14px)
- Sufficient line height (1.5-1.6)

### Spacing Consistency
- Use multiples of 8px (4px for micro spacing)
- Consistent padding in cards and containers
- Adequate white space between sections
- Comfortable margins around text blocks

### Interactive Elements
Every interactive element must have:
- **Hover state** - Visual feedback on mouse over
- **Active state** - Feedback when clicked
- **Focus state** - Keyboard navigation indicator
- **Disabled state** - Clear when unavailable
- **Loading state** - Feedback during async operations

## Creating React Artifacts

When building designs as interactive React artifacts:

### Setup
```jsx
import { useState } from 'react';
import { Sparkles, Upload, Settings } from 'lucide-react';
```

### Structure
1. **Container** - Max width, centered, padding
2. **Header** - Navigation, logo, user menu
3. **Main content** - Primary interface
4. **Footer** - Links, info (if needed)

### Responsive Design
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`
- Mobile-first approach (default styles = mobile)
- Hide/show elements based on screen size
- Adjust layouts (stack on mobile, side-by-side on desktop)

### State Management
```jsx
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);
```

Handle all three states: loading, success, error.

## Common AI App Layouts

### Chat Interface
```
┌────────────────────────────┐
│  Header (title, settings)  │
├────────────────────────────┤
│                            │
│  Messages (scrollable)     │
│  - User bubbles (right)    │
│  - AI bubbles (left)       │
│                            │
├────────────────────────────┤
│  Input + Send button       │
└────────────────────────────┘
```

### Image Generator
```
┌──────────┬─────────────────┐
│          │                 │
│  Input   │   Preview       │
│  Panel   │   (Large)       │
│          │                 │
│  Generate│   [Download]    │
│          │   [Regenerate]  │
└──────────┴─────────────────┘
```

### Dashboard
```
┌────────────────────────────┐
│  Top Nav                   │
├───────┬────────────────────┤
│ Side  │  Metrics (cards)   │
│ Nav   ├────────────────────┤
│       │  Charts & viz      │
│ Home  ├────────────────────┤
│ Data  │  Recent activity   │
│ AI    │                    │
└───────┴────────────────────┘
```

## Reference Documentation

Before starting any design, review these references:

1. **Design Principles** (`references/design-principles.md`)
   - Color systems and palettes
   - Typography scales and pairings
   - Spacing systems
   - Modern design trends
   - Accessibility standards

2. **UI Patterns** (`references/ui-patterns.md`)
   - Common AI app layouts
   - Component patterns
   - Interaction patterns
   - Responsive patterns
   - Animation standards

3. **Component Library** (`references/component-library.md`)
   - Ready-to-use Tailwind components
   - React components with state
   - Icon libraries
   - Code examples

## Quality Checklist

Before finalizing any design, verify:

✓ **Visual Hierarchy**
- Clear primary actions (large, prominent)
- Secondary actions less prominent
- Tertiary actions subtle

✓ **Accessibility**
- Sufficient color contrast (4.5:1 minimum)
- Keyboard navigation works
- Focus indicators visible
- Alt text for images (when applicable)

✓ **Responsive**
- Works on mobile (320px+)
- Works on tablet (768px+)
- Works on desktop (1024px+)
- Touch targets 44x44px minimum

✓ **Polish**
- Consistent spacing (8px base unit)
- Hover states on interactive elements
- Loading states for async operations
- Error states with helpful messages
- Smooth transitions (0.2-0.3s)

✓ **Performance**
- No unnecessary re-renders
- Efficient state management
- Optimized images (if using)
- Respect prefers-reduced-motion

## Tips for Stunning Designs

1. **Start Simple** - Begin with core functionality, add polish later
2. **Use White Space** - Don't cram everything together
3. **Limit Colors** - Stick to 2-3 main colors plus neutrals
4. **Consistent Patterns** - Reuse components and styles
5. **Test Interactions** - Click everything, ensure it feels good
6. **Mobile First** - Design for mobile, enhance for desktop
7. **Add Delight** - Small animations, smooth transitions, micro-interactions
8. **Think in Systems** - Reusable components, not one-offs
9. **User Feedback** - Always show state (loading, success, error)
10. **Reduce Cognitive Load** - Clear labels, intuitive flows, obvious actions

## Advanced Techniques

### Glassmorphism Effect
```jsx
className="bg-white/10 backdrop-blur-lg border border-white/20"
```

### Gradient Backgrounds
```jsx
className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
```

### Animated Gradient Border
```jsx
className="relative before:absolute before:inset-0 before:rounded-lg 
  before:p-[2px] before:bg-gradient-to-r before:from-blue-500 before:to-purple-500
  before:animate-pulse"
```

### Smooth Scroll
```jsx
className="overflow-y-auto scroll-smooth"
```

### Card Hover Effects
```jsx
className="hover:scale-105 hover:shadow-xl transition-all duration-300"
```

## Example Workflows

### Workflow: Chat Interface Design

1. Read `references/ui-patterns.md` (Chat Interface Layout section)
2. Choose color scheme from `references/design-principles.md`
3. Copy chat components from `references/component-library.md`
4. Customize colors and styling
5. Add typing indicator, message actions
6. Implement responsive layout
7. Add smooth scrolling and animations
8. Test on mobile and desktop

### Workflow: Dashboard Design

1. Read `references/ui-patterns.md` (Dashboard Layout section)
2. Copy metric cards from `references/component-library.md`
3. Choose visualization library (recharts available)
4. Implement navigation (sidebar or top nav)
5. Add real-time update capability (useState)
6. Ensure responsive collapse on mobile
7. Add loading skeletons
8. Polish with hover effects and transitions

### Workflow: Landing Page Design

1. Start with hero section (large heading, subheading, CTA)
2. Add feature showcase (3-4 key features with icons)
3. Include social proof (testimonials, company logos)
4. Strong call-to-action at end
5. Ensure mobile responsive
6. Add smooth scroll between sections
7. Implement dark/light mode toggle
8. Polish with animations on scroll

## Troubleshooting

**Issue: Design looks cluttered**
- Add more white space (increase padding/margin)
- Reduce number of elements on screen
- Group related items together
- Use dividers or cards to separate sections

**Issue: Colors clash**
- Stick to one main color + neutral grays
- Use color wheel (complementary, analogous, or triadic)
- Reduce saturation for backgrounds
- Ensure sufficient contrast

**Issue: Hard to read text**
- Increase font size (minimum 14px, prefer 16-18px)
- Increase line height (1.5-1.6)
- Improve contrast ratio (minimum 4.5:1)
- Reduce line length (max 65 characters)

**Issue: Looks dated**
- Use modern color palettes (see design-principles.md)
- Add subtle shadows and border radius
- Implement smooth transitions
- Use modern font (Inter, SF Pro, Poppins)
- Add micro-interactions on hover

**Issue: Not responsive**
- Use Tailwind responsive prefixes
- Stack elements vertically on mobile
- Adjust font sizes for mobile
- Hide non-essential elements on small screens
- Test at 320px, 768px, 1024px widths

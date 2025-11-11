# @visaontrack/web

VisaOnTrack v2 — Next.js Frontend

## Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm --filter @visaontrack/web dev

# Typecheck
pnpm --filter @visaontrack/web typecheck

# Build
pnpm --filter @visaontrack/web build

# Start production server
pnpm --filter @visaontrack/web start
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **API Client:** `@visaontrack/client` (generated from OpenAPI)

## Project Structure

```
apps/web/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Landing page (/)
│   └── globals.css     # Global styles & design tokens
├── components/         # Reusable components (to be added)
├── lib/                # Utilities (to be added)
├── next.config.js      # Next.js configuration
├── tailwind.config.ts  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── package.json
```

## Design System

The app uses the Elite Design System defined in `docs/mockups/ELITE_DESIGN_SYSTEM.md`:

- **Colors:** Semantic color tokens (primary, text, bg, border, success, error)
- **Typography:** Inter font family with defined scale
- **Spacing:** 4px base grid system
- **Border Radius:** Consistent radius values
- **Shadows:** Subtle shadow system
- **Transitions:** Smooth animation timing

All design tokens are mapped to Tailwind classes in `tailwind.config.ts`.

## Routes

### Implemented
- `/` - Landing page

### To Be Implemented (M1)
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/onboarding/account-type` - Account type selection
- `/onboarding/seeker/welcome` - Seeker onboarding
- `/onboarding/provider/*` - Provider onboarding flow

## Development Guidelines

### Component Structure
- Use TypeScript for all components
- Use Tailwind CSS for styling
- Follow the design system tokens
- Ensure accessibility (ARIA labels, keyboard navigation)
- Mobile-first responsive design

### Accessibility
- All interactive elements have ARIA labels
- Keyboard navigation support (focus rings)
- Touch-friendly targets (44px minimum)
- Semantic HTML structure
- Screen reader friendly

### Performance
- Use Next.js Image component for images
- Implement code splitting where needed
- Optimize animations (use CSS transforms)
- Lazy load components when appropriate

## API Integration

The app uses the generated API client from `@visaontrack/client`:

```typescript
import { api } from '@visaontrack/client';

// Example usage
const user = await api.auth.login({ email, password });
```

**⚠️ IMPORTANT:** Never use manual `fetch` calls. Always use the generated API client.

## References

- **Spec:** `visaontrack-v2-spec.md`
- **Design System:** `docs/mockups/ELITE_DESIGN_SYSTEM.md`
- **Patterns:** `docs/mockups/WORLD_CLASS_PATTERNS.md`
- **Mockups:** `docs/mockups/*.html`


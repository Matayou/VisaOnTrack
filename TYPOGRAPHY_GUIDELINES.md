# Typography Guidelines for VisaOnTrack

## Font Families

We use two main font families in our application:

1. **Headings**: Poppins (font-heading)
2. **Body**: Inter (font-sans)

## Typography Component

We've created a reusable Typography component located at `src/components/ui/typography.tsx`. Use this component for consistent text styling across the application.

### Usage

```tsx
import { Typography } from "@/components/ui/typography"

<Typography variant="h1">This is a heading</Typography>
<Typography variant="p">This is a paragraph</Typography>
```

Available variants: 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'list-item'

## Text Sizes and Styles

- Headings (h1-h6): Use the Typography component with appropriate variant
- Paragraphs: Use the Typography component with 'p' variant
- Small text: Apply 'text-sm' class
- Muted text: Apply 'text-muted-foreground' class

## Examples

```tsx
<Typography variant="h1">Main Heading</Typography>
<Typography variant="h2">Subheading</Typography>
<Typography variant="p">Regular paragraph text</Typography>
<Typography variant="p" className="text-sm text-muted-foreground">Small, muted text</Typography>
```

## Labels and Form Fields

For form labels, use the Label component from `@/components/ui/label`:

```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="email" className="text-sm font-medium">Email</Label>
```

## Links

For links, use Next.js Link component with appropriate styling:

```tsx
import Link from 'next/link'

<Link href="/path" className="text-primary font-medium hover:underline">
  Link Text
</Link>
```

## Consistency

- Always use the Typography component for main text elements
- Stick to the defined color palette in `tailwind.config.js`
- Use appropriate spacing between text elements for better readability

By following these guidelines, we can maintain a consistent and modern typography style across the VisaOnTrack application.
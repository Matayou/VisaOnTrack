# Public Assets Directory

This directory contains static assets that are served at the root URL path.

## Image Storage

Place all images here. They will be accessible at the root path.

### Directory Structure (Recommended)

```
public/
├── images/
│   ├── logos/          # Logo files
│   ├── icons/         # Icon files (if not using Lucide)
│   ├── avatars/       # User avatar placeholders
│   ├── illustrations/ # Illustration images
│   └── backgrounds/   # Background images
└── favicon.ico        # Site favicon
```

## Usage in Next.js

### Using Next.js Image Component (Recommended)

```tsx
import Image from 'next/image';

// Image in public/images/logo.png
<Image 
  src="/images/logo.png" 
  alt="VisaOnTrack Logo" 
  width={200} 
  height={50}
/>
```

### Using Regular img Tag

```tsx
// Image in public/images/hero-bg.jpg
<img src="/images/hero-bg.jpg" alt="Hero background" />
```

### Using in CSS

```css
/* Image in public/images/pattern.svg */
.background {
  background-image: url('/images/pattern.svg');
}
```

## Important Notes

1. **Path Reference**: Files in `public/` are referenced with a leading `/`
   - File: `public/images/logo.png`
   - Reference: `/images/logo.png`

2. **Next.js Image Component**: Always use `next/image` for better performance:
   - Automatic image optimization
   - Lazy loading
   - Responsive images
   - WebP format support

3. **File Naming**: Use kebab-case for file names:
   - ✅ `hero-background.jpg`
   - ❌ `hero_background.jpg` or `heroBackground.jpg`

4. **Image Formats**: Prefer modern formats:
   - WebP for photos
   - SVG for icons/logos
   - PNG for images with transparency
   - JPG for photos (fallback)

## Example Structure

```
public/
├── favicon.ico
├── images/
│   ├── logos/
│   │   ├── visaontrack-logo.svg
│   │   └── visaontrack-logo-dark.svg
│   ├── illustrations/
│   │   ├── hero-illustration.svg
│   │   └── empty-state.svg
│   └── backgrounds/
│       └── gradient-pattern.svg
```


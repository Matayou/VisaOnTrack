# AI App UI Patterns

## Common AI Application Layouts

### 1. Chat Interface Layout
```
┌─────────────────────────────────────┐
│  Header (Logo, Settings)            │
├─────────────────────────────────────┤
│                                     │
│  Chat Messages                      │
│  (Scrollable, user & AI bubbles)    │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  Input Box + Send Button            │
└─────────────────────────────────────┘
```

**Key Features:**
- Auto-scroll to bottom on new messages
- Typing indicators for AI responses
- Message actions (copy, edit, regenerate)
- Markdown/code syntax highlighting
- File upload capability

### 2. Image/Content Generator Layout
```
┌──────────────┬──────────────────────┐
│              │                      │
│   Input      │    Preview/Output    │
│   Panel      │    (Large display)   │
│   - Prompt   │                      │
│   - Settings │                      │
│   - Generate │    [Download]        │
│              │    [Regenerate]      │
└──────────────┴──────────────────────┘
```

**Key Features:**
- Clear input section (text or uploads)
- Large preview area
- Generation progress indicator
- Download/export options
- History sidebar (optional)

### 3. Dashboard Layout
```
┌───────────────────────────────────────┐
│  Top Navigation                       │
├────────┬──────────────────────────────┤
│ Side   │  Key Metrics (Cards)         │
│ Nav    ├──────────────────────────────┤
│        │  Charts & Visualizations     │
│ - Home │                              │
│ - Data ├──────────────────────────────┤
│ - AI   │  Recent Activity / Logs      │
│ - More │                              │
└────────┴──────────────────────────────┘
```

**Key Features:**
- Metric cards with big numbers
- Interactive charts
- Real-time updates
- Quick action buttons
- Responsive collapse on mobile

### 4. Form-Based AI Tool
```
┌─────────────────────────────────────┐
│  Header / Breadcrumbs               │
├─────────────────────────────────────┤
│                                     │
│  Step 1: Input                      │
│  [Form fields...]                   │
│                                     │
│  Step 2: Configure                  │
│  [Options/toggles...]               │
│                                     │
│  [Process with AI] →                │
│                                     │
├─────────────────────────────────────┤
│  Results Section                    │
└─────────────────────────────────────┘
```

**Key Features:**
- Progressive disclosure (steps)
- Clear field labels and help text
- Validation feedback
- Save/load configurations
- Process button (prominent)

## Component Patterns

### Input Components

**Text Input (AI Prompt)**
- Large textarea (multi-line)
- Character/token counter
- Send button (bottom-right or below)
- Shift+Enter for new line, Enter to send
- Placeholder with example prompts

**File Upload Zone**
- Drag-and-drop area
- Click to browse
- Preview thumbnails
- Remove option for each file
- File type/size restrictions shown

**Settings Panel**
- Sliders for numerical values (temperature, steps)
- Toggles for boolean options
- Dropdowns for discrete choices
- Collapsible sections for advanced settings

### Output Components

**AI Message Bubble**
- Distinct styling (usually left-aligned)
- Avatar/icon for AI
- Timestamp (subtle, gray)
- Action buttons (copy, regenerate, share)
- Markdown rendering
- Code syntax highlighting

**Generation Preview Card**
- Large image/content area
- Loading state (skeleton or spinner)
- Metadata (date, settings used)
- Action toolbar (download, edit, delete)
- Thumbnail grid for multiple results

**Progress Indicators**
- Linear progress bar with percentage
- Step indicators (for multi-stage processes)
- Estimated time remaining
- Cancel button
- Status messages

### Navigation Components

**Top Navigation Bar**
- Logo/brand (left)
- Main nav links (center)
- User menu + settings (right)
- Search bar (if applicable)
- Sticky on scroll

**Sidebar Navigation**
- Collapsible on mobile
- Icons with labels
- Active state highlight
- Expandable sections
- Footer with user profile

## Interaction Patterns

### Loading States

**Skeleton Screens**
```
Use for: Page/content loading
Instead of: Full-page spinners
Benefit: Perceived performance improvement
```

**Spinners**
```
Use for: Button actions, small updates
Size: 16-24px
Position: Replace button text or next to it
```

**Progress Bars**
```
Use for: Long-running processes
Show: Percentage and estimated time
Allow: Cancellation option
```

### Feedback Patterns

**Success Toast**
- Green checkmark icon
- Brief message ("Image generated successfully!")
- Auto-dismiss after 3-5 seconds
- Positioned top-right or bottom-right

**Error Toast**
- Red X icon
- Clear error message
- Action button ("Retry" or "Learn More")
- Manual dismiss or auto-dismiss after 7-10 seconds

**Inline Validation**
- Immediate feedback on form fields
- Green checkmark for valid
- Red X with error message for invalid
- Gray for neutral/untouched

### Responsive Patterns

**Mobile Adaptations**
- Hamburger menu (collapse sidebar)
- Stacked layouts (no side-by-side)
- Bottom navigation bar (easy thumb reach)
- Larger touch targets (44x44px minimum)
- Simplified forms (fewer fields per screen)

**Tablet Adaptations**
- 2-column layouts (instead of 3)
- Drawer navigation (slide-out sidebar)
- Medium-sized cards
- Balanced spacing

## AI-Specific Patterns

### Prompt Engineering UI

**Prompt Templates**
- Dropdown or cards with pre-written prompts
- Variables marked as `{placeholder}`
- Fill-in-the-blanks interface
- Save custom templates

**Prompt Enhancement**
- "Enhance prompt" button
- Show original vs enhanced
- Explain what was changed
- Allow editing of enhanced version

**Multi-modal Inputs**
- Text + image upload
- Text + file attachment
- Audio + text combination
- Clear labeling of each input type

### Result Variations

**Grid of Options**
- Generate 4-9 variations
- Equal-sized cards
- Hover to enlarge/highlight
- Select to expand full-size
- Regenerate individual items

**Comparison View**
- Side-by-side comparison
- Slider to transition between versions
- Highlight differences
- Save preferred version

### History & Sessions

**Conversation History**
- Sidebar with past chats
- Search functionality
- Date grouping (Today, Yesterday, Last 7 days)
- Pin important conversations
- Delete option

**Generation History**
- Grid/list of past outputs
- Filter by date, type, tags
- Thumbnail previews
- Quick re-use or remix
- Export multiple items

## Animation Standards

### Timing Functions
- **Ease-out**: Entering elements (0.2-0.3s)
- **Ease-in**: Exiting elements (0.15-0.2s)
- **Ease-in-out**: Moving elements (0.3-0.4s)
- **Spring**: Playful interactions (configure based on physics)

### Animation Types
- **Fade in**: Opacity 0 → 1
- **Slide in**: Transform translateY(-20px) → 0
- **Scale in**: Transform scale(0.95) → 1
- **Shimmer**: Loading state (gradient animation)
- **Pulse**: Attention-grabbing (scale 1 → 1.05 → 1)

### Motion Preferences
Always respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Dark Mode Patterns

### Color Adjustments
- Don't just invert colors
- Reduce pure white (#ffffff → #e5e5e5 or #f5f5f5)
- Reduce pure black (#000000 → #0a0a0a or #121212)
- Adjust contrast (slightly lower than light mode)
- Use darker versions of brand colors

### Surface Colors (Dark Mode)
- Background: #0a0a0a or #121212
- Surface/Card: #1e1e1e or #1f1f1f
- Elevated: #2a2a2a or #262626
- Border: #333333 or rgba(255,255,255,0.1)

### Text Colors (Dark Mode)
- Primary: #e5e5e5 or #f5f5f5
- Secondary: #a3a3a3 or #b3b3b3
- Tertiary: #737373 or #808080
- Disabled: #525252 or #4a4a4a

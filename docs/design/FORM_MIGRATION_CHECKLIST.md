# Form Migration Checklist

**Project:** VisaOnTrack (SawadeePass)
**Goal:** Migrate all inline form inputs to standardized `<FormField />` component
**Status:** 2/22 files migrated (9% complete)

---

## Why Migrate?

**Current Issues:**
- 50+ instances of duplicated input styling code
- Inconsistent validation feedback (3 different patterns)
- Mixed input heights (h-11 vs h-12)
- Hard to maintain (changes require updating 20+ files)
- Accessibility issues (missing ARIA attributes)

**After Migration:**
- Single source of truth for input styling
- Consistent validation across all forms
- 90% less code per form field
- Automatic accessibility support
- Easy to update styles globally

---

## Migration Priority

### Phase 1: Auth Pages (High Traffic) ⚠️ CRITICAL

| File | Inputs | Status | Assigned | Notes |
|------|--------|--------|----------|-------|
| `/app/auth/login/page.tsx` | 2 | ❌ Not Started | - | Email + Password |
| `/app/auth/register/page.tsx` | 4 | ❌ Not Started | - | Name, Email, Password, Confirm |
| `/app/auth/forgot-password/page.tsx` | 1 | ❌ Not Started | - | Email only |
| `/app/auth/reset-password/page.tsx` | 2 | ❌ Not Started | - | Password + Confirm |
| `/app/auth/verify-email/page.tsx` | 1 | ❌ Not Started | - | Verification code |
| `/app/auth/register/simple/page.tsx` | 2 | ❌ Not Started | - | Email + Password |

**Total:** 6 files, ~12 input fields

---

### Phase 2: Onboarding (User Journey Critical) ⚠️ HIGH PRIORITY

| File | Inputs | Status | Assigned | Notes |
|------|--------|--------|----------|-------|
| `/app/onboarding/provider/business/page.tsx` | 8 | ❌ Not Started | - | Complex validation |
| `/app/onboarding/provider/credentials/page.tsx` | 3 | ❌ Not Started | - | File uploads |
| `/app/onboarding/provider/services/page.tsx` | 3 | ❌ Not Started | - | Multi-select |
| `/app/onboarding/seeker/welcome/page.tsx` | 0 | ✅ No forms | - | Navigation only |
| `/app/onboarding/provider/welcome/page.tsx` | 0 | ✅ No forms | - | Navigation only |

**Total:** 3 files, ~14 input fields

---

### Phase 3: Request & Provider Forms 📋 MEDIUM PRIORITY

| File | Inputs | Status | Assigned | Notes |
|------|--------|--------|----------|-------|
| `/app/requests/[id]/components/RequestEditForm.tsx` | 5 | ❌ Not Started | - | Edit existing |
| `/app/providers/profile/manage/page.tsx` | 6 | ❌ Not Started | - | Provider settings |
| `/app/requests/new/components/steps/*.tsx` | 10 | ❌ Not Started | - | Multi-step form |

**Total:** 3 file groups, ~21 input fields

---

### Phase 4: Misc Forms 📝 LOW PRIORITY

| File | Inputs | Status | Assigned | Notes |
|------|--------|--------|----------|-------|
| Contact forms | TBD | ❌ Not Started | - | If any exist |
| Settings pages | TBD | ❌ Not Started | - | Account settings |

---

## Migration Guide

### Step-by-Step Process

#### 1. Before Migration - Review Current Code

**Identify this pattern:**
```tsx
// ❌ OLD PATTERN - Inline input with manual validation
<div className="flex flex-col gap-2">
  <label htmlFor="email" className="text-sm font-medium text-text-primary">
    Email address
  </label>
  <div className="relative">
    <input
      type="email"
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className={`h-12 w-full rounded-base border bg-bg-primary px-4 pr-11 font-sans text-base text-text-primary outline-none transition-all duration-150 ${
        emailValidation.status === 'success'
          ? 'border-success bg-success-light/5 focus:shadow-focus-success'
          : emailValidation.status === 'error'
          ? 'border-error bg-error-light/5 focus:shadow-focus-error'
          : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-focus-primary'
      }`}
      placeholder="you@example.com"
      required
      aria-invalid={emailValidation.status === 'error'}
    />
    {emailValidation.status === 'success' && (
      <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
    )}
    {emailValidation.status === 'error' && (
      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-error" />
    )}
  </div>
  {emailValidation.status !== 'empty' && (
    <span className={`text-xs ${emailValidation.status === 'error' ? 'text-error' : 'text-success'}`}>
      {emailValidation.message}
    </span>
  )}
</div>
```

**Lines of code:** ~40 lines per field

---

#### 2. After Migration - Replace with FormField

```tsx
// ✅ NEW PATTERN - Using FormField component
<FormField
  label="Email address"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
  validationStatus={emailValidation.status}
  error={emailValidation.status === 'error' ? emailValidation.message : undefined}
  success={emailValidation.status === 'success' ? emailValidation.message : undefined}
  required
/>
```

**Lines of code:** ~10 lines per field (75% reduction!)

---

#### 3. Add Import

```tsx
// At top of file
import { FormField } from '@/components/ui';
```

---

#### 4. Update Validation Logic (if needed)

**Keep your existing validation:**
```tsx
// This stays the same
const [emailValidation, setEmailValidation] = useState<ValidationResult>({
  status: 'empty',
  message: ''
});

const handleEmailChange = (value: string) => {
  setEmail(value);
  const result = validateEmail(value);
  setEmailValidation(result);
};
```

**FormField will use the validation status automatically!**

---

### Common Patterns & Solutions

#### Pattern A: Password with Toggle Visibility

**Before:**
```tsx
<div className="relative">
  <input type={showPassword ? 'text' : 'password'} ... />
  <button onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? <EyeOff /> : <Eye />}
  </button>
</div>
```

**After:**
```tsx
<FormField
  type={showPassword ? 'text' : 'password'}
  rightIcon={
    <button onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  }
  {...otherProps}
/>
```

---

#### Pattern B: Input with Left Icon

**Before:**
```tsx
<div className="relative">
  <div className="absolute left-4 top-1/2 -translate-y-1/2">
    <Phone className="h-4 w-4" />
  </div>
  <input className="pl-11" ... />
</div>
```

**After:**
```tsx
<FormField
  icon={<Phone className="h-4 w-4" />}
  {...otherProps}
/>
```

---

#### Pattern C: Textarea (Multi-line)

**Before:**
```tsx
<textarea
  className="w-full min-h-24 rounded-base border..."
  rows={6}
/>
```

**After:**
```tsx
<FormField
  as="textarea"
  rows={6}
  {...otherProps}
/>
```

**Note:** Need to add textarea support to Input component first!

---

#### Pattern D: Select Dropdown

**Before:**
```tsx
<select className="h-12 w-full rounded-base border...">
  <option value="en">English</option>
  <option value="th">Thai</option>
</select>
```

**After:** Use `<Select />` component instead of FormField

```tsx
import { Select } from '@/components/ui';

<div className="flex flex-col gap-2">
  <label className="text-sm font-medium">Language</label>
  <Select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
  >
    <option value="en">English</option>
    <option value="th">Thai</option>
  </Select>
  {error && <span className="text-xs text-error">{error}</span>}
</div>
```

**Or** wrap in FormField when support is added.

---

## Testing Checklist

After migrating each form:

- [ ] **Visual:** Input looks correct (height, border, spacing)
- [ ] **Validation:** Error states show properly
- [ ] **Success:** Success states show properly
- [ ] **Focus:** Focus ring appears on click
- [ ] **Keyboard:** Tab navigation works
- [ ] **Submit:** Form submits correctly
- [ ] **Mobile:** Layout works on 375px viewport
- [ ] **Accessibility:** Screen reader announces errors

---

## File-by-File Migration Examples

### Example 1: Login Page

**File:** `apps/web/app/auth/login/page.tsx`

**Current State:** 2 inline inputs (email + password)

**Migration Steps:**

1. Add import:
```tsx
import { FormField } from '@/components/ui';
```

2. Replace email input (lines 118-164):
```tsx
<FormField
  label="Email address"
  name="email"
  type="email"
  value={email}
  onChange={(e) => handleEmailChange(e.target.value)}
  placeholder="you@example.com"
  validationStatus={emailValidation.status}
  error={emailValidation.message}
  required
  autoComplete="email"
/>
```

3. Replace password input (lines 167-194):
```tsx
<FormField
  label="Password"
  name="password"
  type={showPassword ? 'text' : 'password'}
  value={password}
  onChange={(e) => {
    setPassword(e.target.value);
    setError(null);
  }}
  placeholder="Enter your password"
  rightIcon={
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-text-tertiary hover:text-text-secondary"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  }
  required
  autoComplete="current-password"
/>
```

4. Test all states: empty, typing, error, success

**Lines saved:** ~80 lines → ~30 lines (63% reduction)

---

### Example 2: Provider Business Page

**File:** `apps/web/app/onboarding/provider/business/page.tsx`

**Current State:** 8 inline inputs with complex validation

**Challenge:** Custom styling with icons and auto-save

**Solution:** Keep auto-save logic, replace just the input rendering

**Before (lines 510-528):**
```tsx
<div className="flex gap-3">
  <div className="flex h-12 w-12 items-center justify-center rounded-base bg-gradient-to-br from-primary to-primary-hover text-white">
    <Briefcase className="h-5 w-5" />
  </div>
  <div className="flex-1">
    <label className="mb-2 block text-sm font-medium">Business Name *</label>
    <input
      type="text"
      value={businessName}
      onChange={(e) => handleFieldChange('businessName', e.target.value)}
      className={`h-12 w-full rounded-base border bg-bg-primary px-4 font-sans text-base text-text-primary outline-none transition-all duration-150 hover:border-border-medium focus:outline-none focus:ring-2 ${getInputClasses('businessName')}`}
    />
    {touchedFields.businessName && formErrors.businessName && (
      <p className="mt-1 text-xs text-error">{formErrors.businessName}</p>
    )}
  </div>
</div>
```

**After:**
```tsx
<div className="flex gap-3">
  <div className="flex h-12 w-12 items-center justify-center rounded-base bg-gradient-to-br from-primary to-primary-hover text-white">
    <Briefcase className="h-5 w-5" />
  </div>
  <div className="flex-1">
    <FormField
      label="Business Name"
      name="businessName"
      type="text"
      value={businessName}
      onChange={(e) => handleFieldChange('businessName', e.target.value)}
      error={touchedFields.businessName ? formErrors.businessName : undefined}
      required
    />
  </div>
</div>
```

**Keep:** Icon decoration, auto-save logic, validation
**Replace:** Input rendering and error display

---

## Validation Library Integration

FormField works with existing validation libraries:

### With Zod
```tsx
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

// Use with FormField
<FormField
  error={errors.email?.message}
  validationStatus={errors.email ? 'error' : undefined}
/>
```

### With React Hook Form
```tsx
import { useForm } from 'react-hook-form';

const { register, formState: { errors } } = useForm();

<FormField
  {...register('email')}
  error={errors.email?.message}
/>
```

### With Custom Validation (Current Pattern)
```tsx
import { validateEmail } from '@/lib/validation';

const [emailValidation, setEmailValidation] = useState<ValidationResult>({
  status: 'empty',
  message: ''
});

<FormField
  validationStatus={emailValidation.status}
  error={emailValidation.message}
/>
```

---

## Common Issues & Solutions

### Issue 1: "FormField doesn't support textarea"

**Solution:** Extend Input component to support `as="textarea"` prop

```tsx
// In Input.tsx
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  as?: 'input' | 'textarea';
}

// Then in FormField:
<FormField as="textarea" rows={6} />
```

### Issue 2: "I need custom styling on the input"

**Solution:** FormField accepts className prop

```tsx
<FormField
  className="bg-gradient-to-r from-white to-gray-50"
  {...otherProps}
/>
```

### Issue 3: "Password toggle icon not working"

**Solution:** Use rightIcon prop with clickable button

```tsx
<FormField
  type={showPassword ? 'text' : 'password'}
  rightIcon={
    <button type="button" onClick={() => setShowPassword(!show)}>
      {showPassword ? <EyeOff /> : <Eye />}
    </button>
  }
/>
```

---

## Progress Tracking

**Total Forms to Migrate:** 22 files
**Completed:** 2 files (9%)
**In Progress:** 0 files
**Not Started:** 20 files

**Estimated Time:**
- Simple form (1-2 inputs): 15 minutes
- Medium form (3-5 inputs): 30 minutes
- Complex form (6+ inputs): 60 minutes

**Total Estimated Effort:** ~12-15 hours for all migrations

---

## Next Actions

1. **Choose starting point:** Auth pages (high traffic) or onboarding (user journey)
2. **Migrate one file** as proof of concept
3. **Review with team** to confirm approach
4. **Assign remaining files** to team members
5. **Track progress** in this checklist

---

## Quick Reference Card

```tsx
// Import
import { FormField } from '@/components/ui';

// Basic usage
<FormField
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
  required
/>

// With validation
<FormField
  {...basicProps}
  validationStatus="error"
  error="Email is required"
/>

// With success
<FormField
  {...basicProps}
  validationStatus="success"
  success="Looks good!"
/>

// With icon
<FormField
  {...basicProps}
  icon={<Mail className="h-4 w-4" />}
/>

// With right icon (password toggle)
<FormField
  type={showPassword ? 'text' : 'password'}
  rightIcon={<button><Eye /></button>}
/>

// With helper text
<FormField
  {...basicProps}
  helperText="We'll never share your email"
/>
```

---

**End of Checklist**

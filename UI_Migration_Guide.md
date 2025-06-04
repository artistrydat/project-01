# UI Migration Guide

## Overview

This guide provides a systematic approach to migrating your React Native Expo project to a cohesive Gen Z-friendly design system using Tailwind CSS and NativeWind. The migration is designed to be incremental, safe, and reversible.

## Migration Strategy

### Phase-by-Phase Timeline

| Phase | Duration | Focus Area | Deliverables |
|-------|----------|------------|-------------|
| **Phase 1** | Week 1 | Foundation Setup | Updated config, theme provider, base utilities |
| **Phase 2** | Week 2 | Core Components | Migrated Button, LoadingView, base cards |
| **Phase 3** | Week 3 | Navigation & Layout | Tab bar, headers, screen layouts |
| **Phase 4** | Week 4-5 | Feature Screens | Explore, Profile, Destination screens |
| **Phase 5** | Week 6 | Polish & Optimization | Dark mode, performance, accessibility |

## Pre-Migration Checklist

### Environment Setup

- [ ] Yarn package manager installed and updated
- [ ] All dependencies up to date
- [ ] Git working directory clean
- [ ] Development server running successfully
- [ ] TypeScript compilation passing

### Backup Strategy

```bash
# Create migration branch
git checkout -b feature/design-system-migration

# Tag current state
git tag pre-migration-backup
```

## Phase 1: Foundation Setup (Week 1)

### Step 1.1: Update Tailwind Configuration

**File**: `tailwind.config.js`

**Current State Analysis**:

- Basic NativeWind setup exists
- Partial cyber-lime color implementation
- Missing comprehensive design tokens

**Migration Actions**:

1. Backup current config
2. Implement complete design system from UI_Design_Guide.md
3. Add responsive breakpoints for mobile

**Validation**:

```bash
# Test configuration
yarn dev
# Check for compilation errors
yarn tsc --noEmit
```

### Step 1.2: Global Styles Update

**File**: `global.css`

**Add Design System Utilities**:

```css
/* Add to global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom utility classes */
@layer utilities {
  .text-gradient-cyber {
    background: linear-gradient(135deg, #39FF14, #8A2BE2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .glass-morphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .card-shadow {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}
```

### Step 1.3: Theme Provider Setup

**Create**: `contexts/ThemeContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: '#6366F1',
  secondary: '#39FF14',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#0F172A',
  textSecondary: '#64748B',
};

const darkColors = {
  primary: '#8B5CF6',
  secondary: '#39FF14',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('auto');
  const systemColorScheme = useColorScheme();
  
  const isDark = theme === 'dark' || (theme === 'auto' && systemColorScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### Step 1.4: App Layout Integration

**File**: `app/_layout.tsx`

**Current Integration**:

```typescript
// Add ThemeProvider wrapper
import { ThemeProvider } from '../contexts/ThemeContext';

// Wrap existing layout
export default function RootLayout() {
  return (
    <ThemeProvider>
      {/* ...existing layout code... */}
    </ThemeProvider>
  );
}
```

**Phase 1 Validation Checklist**:

- [ ] App starts without errors
- [ ] Theme context accessible in components
- [ ] Tailwind classes compile correctly
- [ ] No TypeScript errors
- [ ] Existing screens render unchanged

## Phase 2: Core Components Migration (Week 2)

### Step 2.1: Button Component Migration

**File**: `components/ui/Button.tsx`

**Current Analysis**:

- Basic button with ActivityIndicator
- Limited styling variants
- Missing accessibility features

**Migration Plan**:

1. Add design system variants
2. Implement consistent sizing
3. Add interaction states
4. Maintain existing props interface

**New Button Variants**:

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'cyber' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  // ...existing props
}
```

**Implementation Strategy**:

1. Create variant style mappings
2. Update existing usage gradually
3. Add new variants without breaking old ones

### Step 2.2: Card Components Standardization

**Target Files**:

- `components/destination/DestinationCard.tsx`
- `components/destination/ActivityCard.tsx`
- Create: `components/ui/Card.tsx` (base component)

**Standardization Goals**:

- Consistent padding and spacing
- Unified shadow system
- Glass morphism variants
- Responsive behavior

### Step 2.3: Loading States Migration

**File**: `components/ui/LoadingView.tsx`

**Updates**:

- Consistent spinner colors
- Theme-aware loading states
- Skeleton loading variants

**Phase 2 Validation**:

- [ ] All buttons render correctly
- [ ] Loading states work in both themes
- [ ] Cards maintain functionality
- [ ] No prop interface breaking changes

## Phase 3: Navigation & Layout (Week 3)

### Step 3.1: Tab Bar Styling

**File**: `app/(protected)/(tabs)/_layout.tsx`

**Current State**:

- Expo Router tab configuration
- Basic tab styling

**Migration Actions**:

1. Update tab bar colors
2. Add consistent icon styling
3. Implement active/inactive states
4. Add glass morphism effects

### Step 3.2: Screen Headers

**Files to Update**:

- All screen headers across the app
- Navigation back buttons
- Action buttons in headers

**Standardization**:

- Consistent typography scale
- Unified spacing
- Theme-aware colors

**Phase 3 Validation**:

- [ ] Navigation works correctly
- [ ] Tab switching smooth
- [ ] Headers render consistently
- [ ] Back navigation functional

## Phase 4: Feature Screens Migration (Week 4-5)

### Step 4.1: Explore Screen

**File**: `app/(protected)/(tabs)/explore.tsx`

**Current Elements**:

- Hero section with gradients
- Destination cards grid
- Search functionality
- Filter options

**Migration Priority**:

1. Hero section typography and spacing
2. Card grid layout and styling
3. Search input styling
4. Filter button design

**Before/After Mapping**:

```typescript
// Before
className="text-4xl font-black text-gray-900"

// After
className="text-4xl font-black text-neutral-900"
// Or with design tokens
className={designTokens.headingHero}
```

### Step 4.2: Profile Screen

**File**: `app/(protected)/(tabs)/profile.tsx`

**Elements to Migrate**:

- Profile header
- Preference cards
- Settings sections
- Action buttons

### Step 4.3: Destination Screens

**Files**:

- `app/(protected)/destination/itinerary/[id].tsx`
- `app/(protected)/destination/activity/[activityId].tsx`

**Focus Areas**:

- Detail layouts
- Image presentations
- Action buttons
- Content typography

**Phase 4 Validation**:

- [ ] All screens visually consistent
- [ ] User flows work end-to-end
- [ ] Data loading states themed
- [ ] Error states styled consistently

## Phase 5: Polish & Optimization (Week 6)

### Step 5.1: Dark Mode Implementation

**Implementation Plan**:

1. Test all screens in dark mode
2. Adjust contrast ratios
3. Update gradient combinations
4. Verify accessibility standards

### Step 5.2: Performance Optimization

**Focus Areas**:

- Gradient rendering performance
- Image loading optimization
- Animation smoothness
- Bundle size impact

### Step 5.3: Accessibility Improvements

**Checklist**:

- [ ] Color contrast ratios meet WCAG standards
- [ ] Focus indicators visible
- [ ] Screen reader compatibility
- [ ] Touch target sizes appropriate

## Testing Strategy

### Automated Testing

```bash
# Type checking
yarn tsc --noEmit

# Linting
yarn lint

# Unit tests (if implemented)
yarn test
```

### Manual Testing Checklist

**Per Component**:

- [ ] Renders correctly in isolation
- [ ] Props work as expected
- [ ] Responsive behavior maintained
- [ ] Theme switching works
- [ ] Accessibility preserved

**Per Screen**:

- [ ] Visual regression acceptable
- [ ] Navigation functional
- [ ] Interactive elements respond
- [ ] Loading/error states work
- [ ] Data persistence maintained

**Integration Testing**:

- [ ] User flows end-to-end
- [ ] Performance acceptable
- [ ] Memory usage stable
- [ ] Battery impact minimal

## Rollback Strategy

### Quick Rollback

```bash
# Return to pre-migration state
git checkout pre-migration-backup
```

### Partial Rollback

```bash
# Rollback specific files
git checkout HEAD~1 -- path/to/file
```

### Feature Flags (Advanced)

```typescript
// Add to components for gradual rollout
const useNewDesign = __DEV__ ? true : false;

return useNewDesign ? <NewComponent /> : <OldComponent />;
```

## Common Pitfalls & Solutions

### Issue: Performance Impact

**Symptoms**: Slower rendering, dropped frames
**Solution**:

- Optimize gradient usage
- Use native animations
- Profile with Flipper

### Issue: Theme Inconsistencies

**Symptoms**: Colors don't match, spacing off
**Solution**:

- Always use design tokens
- Test in both light/dark modes
- Validate against design guide

### Issue: Breaking Changes

**Symptoms**: Screens crash, props missing
**Solution**:

- Maintain backward compatibility
- Update prop interfaces gradually
- Test after each change

## Success Metrics

### Technical Metrics

- [ ] Zero TypeScript errors
- [ ] No runtime crashes
- [ ] Performance within 5% of baseline
- [ ] Bundle size increase < 10%

### Design Metrics

- [ ] 100% design token usage
- [ ] Consistent spacing throughout
- [ ] WCAG AA compliance
- [ ] Theme switching smooth

### User Experience Metrics

- [ ] No user flow disruptions
- [ ] Improved visual consistency
- [ ] Better accessibility scores
- [ ] Positive user feedback

## Post-Migration Maintenance

### Code Standards

- Always use design tokens
- Follow component patterns
- Maintain theme compatibility
- Document new patterns

### Regular Reviews

- Monthly design system audits
- Performance monitoring
- Accessibility testing
- User feedback collection

## Support & Resources

### Documentation References

- [UI_Design_Guide.md](UI_Design_Guide.md) - Complete design system
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NativeWind Docs](https://www.nativewind.dev/)

### Development Tools

- **VS Code Extensions**: Tailwind CSS IntelliSense
- **Chrome DevTools**: React Native Debugger
- **Testing**: Flipper for performance monitoring

### Team Communication

- Create dedicated Slack channel for migration
- Daily standup updates on progress
- Weekly demo of completed phases
- Documentation updates in real-time

---

*This migration guide should be treated as a living document. Update it as you discover new patterns or encounter issues during the migration process.*

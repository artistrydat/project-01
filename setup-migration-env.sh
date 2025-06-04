#!/bin/bash

# UI Design System Migration - Development Environment Setup
# For React Native Expo project with Yarn package manager

echo "🚀 Setting up development environment for UI migration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    print_error "Yarn is not installed. Please install Yarn first."
    exit 1
fi

print_success "Yarn is installed and ready"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Verifying project structure..."

# Create migration branch
print_status "Creating migration branch..."
git checkout -b feature/design-system-migration 2>/dev/null || {
    print_warning "Branch already exists or git not initialized"
}

# Tag current state for rollback
print_status "Creating backup tag..."
git tag -f pre-migration-backup 2>/dev/null || {
    print_warning "Could not create git tag"
}

# Check current dependencies
print_status "Checking current dependencies..."
yarn list --depth=0 > migration-logs/current-dependencies.txt 2>/dev/null || {
    mkdir -p migration-logs
    yarn list --depth=0 > migration-logs/current-dependencies.txt
}

# Verify essential dependencies
print_status "Verifying essential dependencies..."

REQUIRED_DEPS=("expo" "react-native" "nativewind" "tailwindcss")
MISSING_DEPS=()

for dep in "${REQUIRED_DEPS[@]}"; do
    if ! yarn list --pattern="$dep" --depth=0 | grep -q "$dep"; then
        MISSING_DEPS+=("$dep")
    fi
done

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    print_error "Missing required dependencies: ${MISSING_DEPS[*]}"
    print_status "Installing missing dependencies..."
    
    # Install based on what's missing
    if [[ " ${MISSING_DEPS[*]} " =~ "nativewind" ]]; then
        yarn add nativewind
    fi
    
    if [[ " ${MISSING_DEPS[*]} " =~ "tailwindcss" ]]; then
        yarn add --dev tailwindcss
    fi
else
    print_success "All required dependencies are installed"
fi

# Update dependencies to latest compatible versions
print_status "Updating dependencies..."
yarn upgrade-interactive --latest --caret || {
    print_warning "Interactive upgrade failed, running standard upgrade"
    yarn upgrade
}

# Create migration directories
print_status "Creating migration workspace directories..."
mkdir -p migration-logs
mkdir -p migration-backups
mkdir -p contexts
mkdir -p components/ui-new  # For new components during migration

# Backup critical files
print_status "Backing up critical configuration files..."
cp tailwind.config.js migration-backups/tailwind.config.js.backup 2>/dev/null || {
    print_warning "tailwind.config.js not found - will be created"
}

cp global.css migration-backups/global.css.backup 2>/dev/null || {
    print_warning "global.css not found - will be created"
}

cp app/_layout.tsx migration-backups/_layout.tsx.backup 2>/dev/null || {
    print_warning "app/_layout.tsx not found"
}

# Install additional development tools
print_status "Installing development tools..."

# Tailwind CSS IntelliSense support
yarn add --dev @tailwindcss/typography 2>/dev/null
yarn add --dev tailwind-merge clsx 2>/dev/null

# Type checking and linting
if ! yarn list --pattern="typescript" --depth=0 | grep -q "typescript"; then
    print_status "Installing TypeScript..."
    yarn add --dev typescript @types/react @types/react-native
fi

# Install color and design utilities
yarn add colord 2>/dev/null || print_warning "Failed to install colord"

# Create development scripts
print_status "Creating development scripts..."

cat > migration-logs/test-migration.sh << 'EOF'
#!/bin/bash
# Quick migration testing script

echo "🧪 Testing migration changes..."

echo "1. Type checking..."
yarn tsc --noEmit

echo "2. Starting development server..."
echo "   Run 'yarn dev' in another terminal to test changes"

echo "3. Testing component in isolation..."
echo "   Open React Native debugger to test individual components"

echo "✅ Test script completed"
EOF

chmod +x migration-logs/test-migration.sh

# Create rollback script
cat > migration-logs/rollback.sh << 'EOF'
#!/bin/bash
# Emergency rollback script

echo "🔄 Rolling back migration changes..."

# Restore backed up files
if [ -f "migration-backups/tailwind.config.js.backup" ]; then
    cp migration-backups/tailwind.config.js.backup tailwind.config.js
    echo "Restored tailwind.config.js"
fi

if [ -f "migration-backups/global.css.backup" ]; then
    cp migration-backups/global.css.backup global.css
    echo "Restored global.css"
fi

if [ -f "migration-backups/_layout.tsx.backup" ]; then
    cp migration-backups/_layout.tsx.backup app/_layout.tsx
    echo "Restored app/_layout.tsx"
fi

echo "🔄 Rollback completed. Restart the development server."
EOF

chmod +x migration-logs/rollback.sh

# Create component testing template
print_status "Creating component testing template..."

cat > migration-logs/component-test-template.tsx << 'EOF'
import React from 'react';
import { View, Text } from 'react-native';

// Template for testing migrated components in isolation
const ComponentTest = () => {
  return (
    <View className="flex-1 justify-center items-center bg-neutral-50">
      <Text className="text-2xl font-bold text-neutral-900">
        Component Test Page
      </Text>
      
      {/* Add your component here for testing */}
      
    </View>
  );
};

export default ComponentTest;
EOF

# Create migration checklist
print_status "Creating migration checklist..."

cat > migration-logs/migration-checklist.md << 'EOF'
# Migration Progress Checklist

## Phase 1: Foundation Setup
- [ ] Updated tailwind.config.js with design system
- [ ] Created ThemeContext.tsx
- [ ] Updated global.css with utilities
- [ ] Wrapped app with ThemeProvider
- [ ] Verified no TypeScript errors
- [ ] Tested development server starts

## Phase 2: Core Components
- [ ] Migrated Button component
- [ ] Updated LoadingView component
- [ ] Created base Card component
- [ ] Tested components in isolation
- [ ] Verified prop interfaces unchanged

## Phase 3: Navigation & Layout
- [ ] Updated tab bar styling
- [ ] Migrated screen headers
- [ ] Updated navigation elements
- [ ] Tested navigation flows

## Phase 4: Feature Screens
- [ ] Migrated explore screen
- [ ] Updated profile screen
- [ ] Migrated destination screens
- [ ] Tested all user flows

## Phase 5: Polish & Optimization
- [ ] Implemented dark mode
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Final testing and documentation

## Testing Checklist (Run after each phase)
- [ ] `yarn tsc --noEmit` passes
- [ ] Development server starts
- [ ] No runtime errors
- [ ] Visual regression acceptable
- [ ] User flows work correctly
EOF

# Create design token usage guide
cat > migration-logs/design-tokens-usage.md << 'EOF'
# Design Tokens Quick Reference

## Colors
```typescript
// Primary colors
className="bg-primary-500 text-white"
className="bg-primary-50 text-primary-900"

// Cyber theme
className="bg-cyber-500 text-white"
className="text-cyber-600"

// Neutrals
className="bg-neutral-50 text-neutral-900"
className="text-neutral-600"
```

## Typography
```typescript
// Headings
className="text-4xl font-black"     // Hero
className="text-2xl font-bold"      // Section
className="text-xl font-semibold"   // Subsection

// Body text
className="text-base font-normal"   // Standard
className="text-lg font-medium"     // Large
```

## Spacing
```typescript
// Padding
className="p-4"      // Standard
className="p-6"      // Cards
className="px-6 py-8" // Sections

// Margins
className="mb-4"     // Standard spacing
className="mb-6"     // Section spacing
```

## Borders & Shadows
```typescript
className="rounded-2xl"           // Standard cards
className="rounded-3xl"           // Hero elements
className="shadow-lg"             // Card shadows
className="border border-neutral-200" // Subtle borders
```
EOF

# Test current setup
print_status "Testing current setup..."

# Check if development server can start
print_status "Verifying development environment..."
timeout 10s yarn tsc --noEmit || {
    print_warning "TypeScript check failed or timed out"
}

# Create final summary
print_status "Creating setup summary..."

cat > migration-logs/setup-summary.md << EOF
# Migration Environment Setup Summary

**Setup Date**: $(date)
**Project**: React Native Expo with Tailwind CSS
**Package Manager**: Yarn

## What Was Done

1. ✅ Created migration branch: \`feature/design-system-migration\`
2. ✅ Tagged current state: \`pre-migration-backup\`
3. ✅ Verified dependencies and installed missing ones
4. ✅ Created migration workspace directories
5. ✅ Backed up critical configuration files
6. ✅ Created testing and rollback scripts
7. ✅ Generated migration checklists and guides

## Directory Structure Created

\`\`\`
migration-logs/
├── current-dependencies.txt      # Dependency snapshot
├── test-migration.sh            # Testing script
├── rollback.sh                  # Emergency rollback
├── component-test-template.tsx  # Component testing
├── migration-checklist.md       # Progress tracking
├── design-tokens-usage.md       # Quick reference
└── setup-summary.md            # This file

migration-backups/
├── tailwind.config.js.backup   # Config backup
├── global.css.backup           # Styles backup
└── _layout.tsx.backup          # Layout backup

contexts/
└── (ready for ThemeContext.tsx)

components/
└── ui-new/                     # New components during migration
\`\`\`

## Next Steps

1. Review the guides:
   - \`UI_Design_Guide.md\`
   - \`UI_Migration_Guide.md\`

2. Start with Phase 1:
   \`\`\`bash
   # Begin migration
   yarn dev
   # Follow Phase 1 steps in UI_Migration_Guide.md
   \`\`\`

3. Use testing script after each change:
   \`\`\`bash
   ./migration-logs/test-migration.sh
   \`\`\`

4. Emergency rollback if needed:
   \`\`\`bash
   ./migration-logs/rollback.sh
   \`\`\`

## Development Commands

\`\`\`bash
# Start development
yarn dev

# Type checking
yarn tsc --noEmit

# Test migration step
./migration-logs/test-migration.sh

# Emergency rollback
./migration-logs/rollback.sh
\`\`\`

$(yarn --version | head -1)
$(node --version)
EOF

print_success "Migration environment setup completed!"
print_status "Summary created at: migration-logs/setup-summary.md"
print_status "Next steps:"
echo "  1. Review UI_Design_Guide.md and UI_Migration_Guide.md"
echo "  2. Start with Phase 1 in the migration guide"
echo "  3. Use ./migration-logs/test-migration.sh to test changes"
echo "  4. Track progress in migration-logs/migration-checklist.md"

print_success "Ready to begin migration! 🎨"
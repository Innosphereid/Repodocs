# Organisms Components

This directory contains organism-level components that compose multiple molecules and atoms to create complex UI sections.

## Components Overview

### Header

The main application header with navigation, logo, and user authentication controls.

**Features:**

- Responsive navigation menu
- User authentication status display
- Profile link integration
- Mobile menu support

### DocumentationPreview

Displays generated documentation with preview capabilities.

**Features:**

- Content preview
- Diff viewing
- User feedback collection
- Action buttons (approve, regenerate)

### ProfileLayout

Organizes the profile page layout with responsive grid system.

**Props:**

- `children: React.ReactNode` - Child components
- `className?: string` - Additional CSS classes

**Features:**

- Responsive 3-column grid layout
- Consistent spacing and alignment
- Mobile-first design

### ProfilePageContainer

Main container for the profile page with consistent spacing.

**Props:**

- `children: React.ReactNode` - Child components
- `className?: string` - Additional CSS classes

**Features:**

- Consistent vertical spacing
- Responsive container
- Semantic structure

## Usage Examples

### Profile Page Layout

```tsx
import ProfilePageContainer from "@/components/organisms/ProfilePageContainer";
import ProfileLayout from "@/components/organisms/ProfileLayout";

export default function ProfilePage() {
  return (
    <ProfilePageContainer>
      <ProfileHeader />
      <ProfileLayout>
        <ProfileInfo user={user} />
        <ProfileStatsSection user={user} />
      </ProfileLayout>
    </ProfilePageContainer>
  );
}
```

### Header Integration

```tsx
import Header from "@/components/organisms/Header";

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}
```

## Design Principles

- **Composition**: Organisms compose multiple molecules and atoms
- **Responsibility**: Each organism has a specific, well-defined purpose
- **Reusability**: Can be reused across different pages and contexts
- **Responsive**: Mobile-first responsive design
- **Accessibility**: Proper semantic structure and ARIA support
- **Performance**: Optimized rendering and minimal re-renders

## Component Hierarchy

```
Organisms
├── Header
│   ├── Logo (Atom)
│   ├── Navigation (Molecule)
│   └── UserActions (Molecule)
├── ProfileLayout
│   ├── ProfileSection (Molecule)
│   └── ProfileSection (Molecule)
├── ProfilePageContainer
│   ├── ProfileHeader (Molecule)
│   ├── ViewModeToggle (Molecule)
│   └── ProfileLayout (Organism)
└── DocumentationPreview
    ├── ContentDisplay (Molecule)
    ├── ActionButtons (Molecule)
    └── FeedbackForm (Molecule)
```

# Components Directory

This directory contains all the reusable UI components for RepoDocsAI, organized following atomic design principles.

## Directory Structure

```
components/
├── atoms/           # Basic building blocks (buttons, inputs, etc.)
├── molecules/       # Simple combinations of atoms
├── organisms/       # Complex UI sections
├── templates/       # Page layout templates
├── ui/             # Shadcn/ui components
├── auth/           # Authentication components
└── index.ts        # Main export file
```

## Design System

### Atomic Design Principles

1. **Atoms**: Basic building blocks (buttons, inputs, icons)
2. **Molecules**: Simple combinations of atoms (form fields, search bars)
3. **Organisms**: Complex UI sections (headers, forms, navigation)
4. **Templates**: Page layouts and structure
5. **Pages**: Complete page implementations

### Component Categories

#### Atoms

- **LoadingSpinner**: Loading indicator with size variants
- **Logo**: Application logo component
- **StatusBadge**: Status indicator badges

#### Molecules

- **Profile Components**: User profile display and management
- **Statistics Components**: Data visualization and metrics
- **Security Components**: Account security and authentication
- **UI Components**: Form elements and interactive components

#### Organisms

- **Header**: Main application navigation
- **ProfileLayout**: Profile page layout structure
- **DocumentationPreview**: Documentation display and interaction

#### Templates

- **Layout**: Main page layout wrapper

#### UI Components (Shadcn/ui)

- **Form Elements**: Input, Button, Textarea, etc.
- **Layout**: Card, Dialog, Tabs, etc.
- **Feedback**: Alert, Toast, Progress, etc.

## Usage

### Importing Components

```tsx
// Import specific components
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/molecules/ProfileCard";
import { Header } from "@/components/organisms/Header";

// Import from main index
import { Button, ProfileCard, Header } from "@/components";
```

### Component Composition

```tsx
// Example: Building a profile section
import {
  ProfileSection,
  ProfileCard,
  AccountSecurityCard,
} from "@/components/molecules";

const ProfileInfo = ({ user }) => (
  <ProfileSection>
    <ProfileCard user={user} />
    <AccountSecurityCard githubId={user.github_id} hasPassword={true} />
  </ProfileSection>
);
```

## Development Guidelines

### Creating New Components

1. **Follow Naming Convention**: Use PascalCase for component names
2. **TypeScript**: Always use TypeScript with proper interfaces
3. **Props Interface**: Define clear prop interfaces
4. **Default Props**: Provide sensible defaults where appropriate
5. **Error Handling**: Include proper error states and validation

### Component Structure

```tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface ComponentNameProps {
  // Define props interface
  children?: React.ReactNode;
  className?: string;
}

const ComponentName: React.FC<ComponentNameProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {children}
    </div>
  );
};

export default ComponentName;
```

### Styling Guidelines

- **Tailwind CSS**: Use Tailwind for styling
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Ensure proper contrast and focus states
- **Consistency**: Follow established design patterns

### Testing

- **Unit Tests**: Test individual component functionality
- **Integration Tests**: Test component interactions
- **Accessibility Tests**: Ensure screen reader compatibility
- **Visual Tests**: Verify design consistency

## Best Practices

### Performance

- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders with useCallback/useMemo

### Accessibility

- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Provide alternative text for images

### Responsiveness

- Mobile-first design approach
- Use responsive breakpoints consistently
- Test on various screen sizes

### Code Quality

- Follow ESLint rules
- Use TypeScript strict mode
- Implement proper error boundaries
- Document complex logic

## Contributing

When adding new components:

1. Create the component in the appropriate directory
2. Add proper TypeScript interfaces
3. Include JSDoc comments for complex logic
4. Update the relevant index files
5. Add to the main components index
6. Update documentation
7. Include tests if applicable

## Dependencies

- **React**: 19.1.0+
- **TypeScript**: 5+
- **Tailwind CSS**: 4+
- **Lucide React**: Icons
- **Radix UI**: Accessible primitives
- **Class Variance Authority**: Component variants

# Profile Components

This directory contains reusable components for the user profile functionality in RepoDocsAI.

## Components Overview

### ProfileHeader

A header component for the profile page with title and edit button.

**Props:**

- `onEditClick?: () => void` - Callback for edit button click
- `className?: string` - Additional CSS classes

### ProfileSection

A wrapper component for grouping profile sections with consistent spacing.

**Props:**

- `children: React.ReactNode` - Child components
- `className?: string` - Additional CSS classes

### ProfileCard

Displays user profile information including avatar, username, plan type, and basic details.

**Props:**

- `user: User` - User object with profile data
- `className?: string` - Additional CSS classes

### ProfileInfo

Groups profile information components (ProfileCard + AccountSecurityCard).

**Props:**

- `user: User` - User object with profile data
- `className?: string` - Additional CSS classes

### ProfileStats

Displays detailed profile statistics with visual indicators and metrics.

**Props:**

- `monthlyUsageCount: number` - Current month usage count
- `usageResetDate: string` - Date when usage resets
- `createdAt: string` - Account creation date
- `updatedAt: string` - Last update date
- `className?: string` - Additional CSS classes

### ProfileStatsSection

Groups profile statistics components with view mode switching.

**Props:**

- `user: User` - User object with profile data
- `viewMode: 'detailed' | 'simple'` - Current view mode
- `onAccountAction: (action: string) => void` - Account action callback
- `className?: string` - Additional CSS classes

### UsageStatsCard

Displays simple usage statistics in a card format.

**Props:**

- `monthlyUsageCount: number` - Current month usage count
- `usageResetDate: string` - Date when usage resets
- `createdAt: string` - Account creation date
- `updatedAt: string` - Last update date
- `className?: string` - Additional CSS classes

### PlanDetailsCard

Shows detailed information about the user's current plan and features.

**Props:**

- `planType: string` - User's plan type (free, pro, team)
- `className?: string` - Additional CSS classes

### AccountSecurityCard

Displays account security information and status.

**Props:**

- `githubId?: number` - GitHub OAuth ID if connected
- `hasPassword: boolean` - Whether password is set
- `className?: string` - Additional CSS classes

### AccountActionsCard

Provides buttons for various account actions.

**Props:**

- `onActionClick?: (action: string) => void` - Action click callback
- `className?: string` - Additional CSS classes

### ViewModeToggle

Allows switching between simple and detailed view modes.

**Props:**

- `viewMode: 'detailed' | 'simple'` - Current view mode
- `onViewModeChange: (mode: 'detailed' | 'simple') => void` - View mode change callback
- `className?: string` - Additional CSS classes

## Usage Example

```tsx
import ProfileHeader from "@/components/molecules/ProfileHeader";
import ProfileInfo from "@/components/molecules/ProfileInfo";
import ProfileStatsSection from "@/components/molecules/ProfileStatsSection";

export default function ProfilePage() {
  const [viewMode, setViewMode] = useState<"detailed" | "simple">("detailed");

  return (
    <div>
      <ProfileHeader onEditClick={() => console.log("Edit clicked")} />
      <ProfileInfo user={user} />
      <ProfileStatsSection
        user={user}
        viewMode={viewMode}
        onAccountAction={(action) => console.log(action)}
      />
    </div>
  );
}
```

## Design Principles

- **Atomic Design**: Components follow atomic design principles
- **Reusability**: All components are designed to be reusable across the application
- **Type Safety**: Full TypeScript support with proper interfaces
- **Accessibility**: Components include proper ARIA labels and semantic HTML
- **Responsive**: Mobile-first responsive design with Tailwind CSS
- **Consistent**: Follows established design patterns and spacing conventions

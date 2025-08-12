# Dashboard Directory

This directory contains the dashboard-related pages and functionality for RepoDocsAI.

## Pages

### Dashboard Home (`/dashboard`)

The main dashboard page showing user statistics, recent analyses, and plan information.

**Features:**

- Usage statistics overview
- Recent repository analyses
- Plan limits and current usage
- Quick action buttons

### User Profile (`/dashboard/profile`)

Comprehensive user profile management page with account information and settings.

**Features:**

- Profile information display
- Usage statistics (simple/detailed views)
- Plan details and features
- Account security status
- Account management actions

## Component Architecture

```
Dashboard
├── Dashboard Home
│   ├── Usage Stats Cards
│   ├── Plan Limits Display
│   └── Recent Analyses List
└── User Profile
    ├── Profile Information
    ├── Usage Statistics
    ├── Plan Details
    ├── Account Security
    └── Account Actions
```

## Data Flow

1. **Authentication**: All dashboard pages require user authentication
2. **User Context**: User data is provided via AuthContext
3. **Protected Routes**: Routes are wrapped with ProtectedRoute component
4. **Data Fetching**: User data is fetched from authentication context
5. **State Management**: Local state for UI interactions (view modes, etc.)

## Security Features

- **Route Protection**: All dashboard routes require authentication
- **User Validation**: User data is validated before display
- **Session Management**: Proper session handling and logout
- **Data Isolation**: Users can only access their own data

## Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Grid Layout**: Responsive grid system for different screen sizes
- **Touch Friendly**: Optimized for touch interactions
- **Breakpoint Support**: Supports all major device breakpoints

## Future Enhancements

- **Analytics Dashboard**: Detailed usage analytics and insights
- **Team Management**: Team collaboration features
- **Billing Integration**: Subscription management
- **Notification Center**: User notification preferences
- **Activity Timeline**: User activity history
- **Integration Settings**: Third-party service connections

## Usage Examples

### Accessing Dashboard

```tsx
// Navigate to dashboard
router.push("/dashboard");

// Navigate to profile
router.push("/dashboard/profile");
```

### Using Protected Routes

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Layout>{/* Dashboard content */}</Layout>
    </ProtectedRoute>
  );
}
```

### Accessing User Data

```tsx
import { useAuth } from "@/lib/contexts/auth.context";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      {/* Profile content */}
    </div>
  );
}
```

## Testing Considerations

- **Authentication**: Test protected route access
- **User Data**: Verify correct data display
- **Responsiveness**: Test mobile and desktop layouts
- **Accessibility**: Ensure screen reader compatibility
- **Performance**: Test loading and rendering speed
- **Error Handling**: Test error states and edge cases

## Dependencies

- **Authentication**: AuthContext and ProtectedRoute
- **Layout**: Layout template component
- **UI Components**: Shadcn/ui components
- **Icons**: Lucide React icons
- **Styling**: Tailwind CSS
- **Routing**: Next.js App Router

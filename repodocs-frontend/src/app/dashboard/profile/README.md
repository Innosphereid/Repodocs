# User Profile Page

The user profile page (`/dashboard/profile`) provides a comprehensive view of user account information, usage statistics, and account management features.

## Features

### Profile Information Display

- **User Avatar**: Displays user's GitHub avatar or fallback icon
- **Username**: Shows the user's username
- **Plan Type**: Displays current subscription plan with visual indicators
- **Email**: Shows user's email address
- **GitHub Integration**: Displays GitHub OAuth connection status
- **Account Dates**: Shows creation and last update dates

### Usage Statistics

- **Current Month Usage**: Number of repository analyses used this month
- **Usage Reset Date**: When the monthly usage counter resets
- **Account Age**: How long the account has been active
- **Last Activity**: Days since last account activity

### Plan Details

- **Current Plan**: Visual representation of plan type
- **Feature Comparison**: Shows what features are available
- **Monthly Limits**: Usage limits for current plan
- **Upgrade Options**: Clear indication of plan benefits

### Account Security

- **GitHub OAuth Status**: Connected/Not Connected indicator
- **Password Status**: Whether password is set
- **Two-Factor Auth**: Current 2FA status
- **Session Management**: Active session information

### Account Actions

- **Change Password**: Update account password
- **Update Email**: Modify email address
- **Billing & Plans**: Manage subscription
- **Notifications**: Configure notification preferences
- **Export Data**: Download user data
- **Delete Account**: Account deletion option

## View Modes

### Simple View

- Clean, minimal statistics display
- Focus on essential information
- Better for mobile devices

### Detailed View

- Rich visual statistics with icons
- Color-coded metrics
- Enhanced data visualization
- Better for desktop users

## Component Architecture

```
ProfilePage
├── ProfilePageContainer (Organism)
│   ├── ProfileHeader (Molecule)
│   ├── ViewModeToggle (Molecule)
│   └── ProfileLayout (Organism)
│       ├── ProfileSection (Molecule)
│       │   └── ProfileInfo (Molecule)
│       │       ├── ProfileCard (Molecule)
│       │       └── AccountSecurityCard (Molecule)
│       └── ProfileSection (Molecule)
│           └── ProfileStatsSection (Molecule)
│               ├── UsageStatsCard/ProfileStats (Molecule)
│               ├── PlanDetailsCard (Molecule)
│               └── AccountActionsCard (Molecule)
```

## Data Sources

The profile page uses data from the following sources:

- **User Context**: Authentication context provides user data
- **Database Schema**: Based on the User entity structure
- **Plan Configuration**: Static plan feature definitions

## Security Features

- **Protected Route**: Only accessible to authenticated users
- **Data Validation**: User data is validated before display
- **Secure Actions**: Account actions require proper authentication
- **Input Sanitization**: All user inputs are properly sanitized

## Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Grid Layout**: Responsive grid system for different screen sizes
- **Touch Friendly**: Optimized for touch interactions
- **Breakpoint Support**: Supports all major device breakpoints

## Accessibility

- **Semantic HTML**: Proper heading hierarchy and structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Proper focus indicators

## Future Enhancements

- **Profile Editing**: In-place profile editing
- **Avatar Upload**: Custom avatar upload functionality
- **Activity Timeline**: User activity history
- **Integration Settings**: Third-party service connections
- **Notification Preferences**: Detailed notification configuration
- **Data Export**: Comprehensive data export options

## Usage

```tsx
// Navigate to profile page
router.push("/dashboard/profile");

// Access profile data
const { user } = useAuth();

// Handle profile actions
const handleAccountAction = (action: string) => {
  switch (action) {
    case "change-password":
      // Handle password change
      break;
    case "update-email":
      // Handle email update
      break;
    // ... other actions
  }
};
```

## Testing

The profile page should be tested for:

- **Authentication**: Proper access control
- **Data Display**: Correct data rendering
- **Responsiveness**: Mobile and desktop layouts
- **Accessibility**: Screen reader and keyboard navigation
- **Performance**: Fast loading and rendering
- **Error Handling**: Graceful error states

# Source Directory

This directory contains the main source code for RepoDocsAI frontend application.

## Directory Structure

```
src/
├── app/            # Next.js App Router pages
├── components/     # Reusable UI components
├── lib/           # Utility libraries and configurations
├── pages/         # Legacy pages (if any)
└── types/         # TypeScript type definitions
```

## Architecture Overview

### Frontend Framework

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Accessible component library

### Component Architecture

- **Atomic Design**: Atoms, Molecules, Organisms, Templates
- **Reusable Components**: Modular and composable design
- **Type Safety**: Full TypeScript support
- **Accessibility**: WCAG compliant components

### State Management

- **React Context**: Authentication and user state
- **Local State**: Component-level state management
- **Server State**: API data fetching and caching

## Key Directories

### App Directory (`/app`)

Contains all the application pages and routing logic using Next.js 15 App Router.

**Features:**

- File-based routing
- Layout nesting
- Server and client components
- API routes
- Middleware support

### Components Directory (`/components`)

Reusable UI components organized by atomic design principles.

**Categories:**

- **Atoms**: Basic building blocks
- **Molecules**: Simple component combinations
- **Organisms**: Complex UI sections
- **Templates**: Page layout structures
- **UI**: Shadcn/ui components
- **Auth**: Authentication components

### Library Directory (`/lib`)

Utility functions, configurations, and shared logic.

**Contents:**

- **Contexts**: React context providers
- **Hooks**: Custom React hooks
- **Services**: API and external service integrations
- **Types**: TypeScript type definitions
- **Utils**: Utility functions and helpers

## Development Guidelines

### Code Organization

- **Feature-based**: Organize by feature rather than type
- **Co-location**: Keep related files together
- **Clear Separation**: Distinguish between concerns
- **Consistent Naming**: Follow established conventions

### Component Development

- **Single Responsibility**: Each component has one purpose
- **Props Interface**: Define clear prop contracts
- **Default Props**: Provide sensible defaults
- **Error Handling**: Include proper error states
- **Loading States**: Show loading indicators

### TypeScript Usage

- **Strict Mode**: Enable strict TypeScript settings
- **Interface First**: Define interfaces before implementation
- **Generic Types**: Use generics for reusable components
- **Type Guards**: Implement proper type checking
- **Union Types**: Use union types for variants

### Styling Approach

- **Tailwind CSS**: Use utility classes for styling
- **Component Variants**: Use class-variance-authority
- **Responsive Design**: Mobile-first approach
- **Design System**: Follow established design tokens
- **Accessibility**: Ensure proper contrast and focus

## Build and Development

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Environment Configuration

```env
# Development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.repodocs.ai
```

### Build Output

- **Static Assets**: Optimized images and fonts
- **JavaScript Bundles**: Code-split by routes
- **CSS**: Purged and optimized styles
- **HTML**: Server-side rendered pages

## Performance Optimization

### Code Splitting

- **Route-based**: Automatic code splitting by routes
- **Component-based**: Lazy load heavy components
- **Dynamic Imports**: Load components on demand

### Image Optimization

- **Next.js Image**: Automatic image optimization
- **WebP Format**: Modern image formats
- **Responsive Images**: Different sizes for devices
- **Lazy Loading**: Load images when needed

### Bundle Optimization

- **Tree Shaking**: Remove unused code
- **Minification**: Compress JavaScript and CSS
- **Gzip Compression**: Reduce transfer size
- **CDN Distribution**: Global content delivery

## Testing Strategy

### Testing Levels

- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user journey testing
- **Visual Tests**: Design consistency testing

### Testing Tools

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **Storybook**: Component development and testing

### Test Coverage

- **Component Logic**: Test component behavior
- **User Interactions**: Test user interactions
- **Edge Cases**: Test error states and boundaries
- **Accessibility**: Test screen reader compatibility

## Security Considerations

### Client-side Security

- **Input Validation**: Validate all user inputs
- **XSS Prevention**: Sanitize user content
- **CSRF Protection**: Prevent cross-site requests
- **Content Security Policy**: Restrict resource loading

### Authentication

- **Secure Storage**: Store tokens securely
- **Session Management**: Proper session handling
- **Route Protection**: Protect sensitive routes
- **OAuth Security**: Secure OAuth implementation

## Deployment

### Build Process

1. **Code Compilation**: TypeScript compilation
2. **Asset Optimization**: Image and font optimization
3. **Bundle Generation**: Production-ready bundles
4. **Static Generation**: Pre-render static pages

### Deployment Options

- **Vercel**: Recommended platform
- **Netlify**: Alternative hosting
- **Self-hosted**: Custom server deployment
- **Docker**: Containerized deployment

### Environment Management

- **Development**: Local development setup
- **Staging**: Pre-production testing
- **Production**: Live application deployment
- **Monitoring**: Performance and error tracking

## Monitoring and Analytics

### Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS metrics
- **Bundle Analysis**: JavaScript bundle size
- **Error Tracking**: Runtime error monitoring
- **User Analytics**: User behavior tracking

### Health Checks

- **Route Health**: API endpoint monitoring
- **Build Health**: Build process monitoring
- **Dependency Health**: Package vulnerability scanning
- **Performance Health**: Performance regression detection

## Contributing

### Development Workflow

1. **Feature Branch**: Create feature branch
2. **Development**: Implement feature
3. **Testing**: Write and run tests
4. **Code Review**: Submit for review
5. **Merge**: Merge to main branch

### Code Standards

- **ESLint**: Follow linting rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Git Hooks**: Pre-commit validation

### Documentation

- **Component Docs**: Document component usage
- **API Docs**: Document API integrations
- **Architecture Docs**: Document system design
- **README Files**: Keep documentation updated

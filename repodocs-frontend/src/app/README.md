# App Directory

This directory contains the Next.js 15 App Router pages and routing structure for RepoDocsAI.

## Directory Structure

```
app/
├── about/           # About page
├── api/            # API routes
├── auth/           # Authentication pages
├── blog/           # Blog pages
├── changelog/      # Changelog page
├── components/     # Page-specific components
├── contact/        # Contact page
├── dashboard/      # Dashboard pages
├── docs/           # Documentation pages
├── examples/       # Examples page
├── favicon.ico     # App favicon
├── globals.css     # Global styles
├── guides/         # Guides page
├── layout.tsx      # Root layout
├── page.tsx        # Home page
├── pages/          # Additional pages
├── privacy/        # Privacy policy
└── terms/          # Terms of service
```

## Pages Overview

### Public Pages

- **Home** (`/`): Landing page with features and pricing
- **About** (`/about`): Company and product information
- **Blog** (`/blog`): Blog posts and articles
- **Changelog** (`/changelog`): Product updates and changes
- **Contact** (`/contact`): Contact form and information
- **Documentation** (`/docs`): Product documentation
- **Examples** (`/examples`): Usage examples and demos
- **Guides** (`/guides`): User guides and tutorials
- **Privacy** (`/privacy`): Privacy policy
- **Terms** (`/terms`): Terms of service

### Protected Pages

- **Dashboard** (`/dashboard`): Main user dashboard
- **Profile** (`/dashboard/profile`): User profile management

### API Routes

- **Auth** (`/api/auth`): Authentication endpoints
- **GitHub OAuth** (`/api/auth/github`): GitHub OAuth integration

## Routing Structure

### App Router Features

- **File-based Routing**: Pages are created by adding files to directories
- **Layout Nesting**: Nested layouts for consistent UI
- **Server Components**: Default server-side rendering
- **Client Components**: Marked with "use client" directive
- **Dynamic Routes**: Support for dynamic parameters
- **Route Groups**: Organized route grouping

### Layout Hierarchy

```
Root Layout (layout.tsx)
├── Header (global navigation)
├── Main Content
│   ├── Page-specific layouts
│   └── Page content
└── Footer (global footer)
```

## Page Components

### Layout Components

- **Root Layout**: Global layout wrapper
- **Page Layouts**: Page-specific layout components
- **Navigation**: Header and footer components

### Page Components

- **Landing Page**: Hero section, features, pricing
- **Dashboard**: User statistics and management
- **Profile**: User account information
- **Authentication**: Login and registration forms

## Data Fetching

### Server Components

- **Static Data**: Fetch data at build time
- **Dynamic Data**: Fetch data on each request
- **Caching**: Built-in caching strategies

### Client Components

- **API Calls**: Fetch data from backend APIs
- **State Management**: Local state and context
- **Real-time Updates**: WebSocket or polling

## Styling

### Global Styles

- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Global custom styles
- **CSS Variables**: Design system tokens

### Component Styles

- **Scoped Styles**: Component-specific styling
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching support

## Performance

### Optimization

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Font loading optimization
- **Bundle Analysis**: Webpack bundle analyzer

### Caching

- **Static Generation**: Pre-rendered pages
- **Incremental Static Regeneration**: Dynamic updates
- **Edge Caching**: CDN and edge caching

## Security

### Authentication

- **Protected Routes**: Route-level protection
- **Session Management**: Secure session handling
- **OAuth Integration**: GitHub OAuth support

### Data Protection

- **Input Validation**: Client and server validation
- **XSS Prevention**: Content security policies
- **CSRF Protection**: Cross-site request forgery protection

## Development

### Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Code Organization

- **Page Components**: Keep pages simple and focused
- **Business Logic**: Extract logic to custom hooks
- **Data Fetching**: Use appropriate data fetching patterns
- **Error Handling**: Implement proper error boundaries

## Testing

### Testing Strategy

- **Unit Tests**: Component and function testing
- **Integration Tests**: Page and route testing
- **E2E Tests**: Full user journey testing
- **Accessibility Tests**: Screen reader and keyboard testing

### Testing Tools

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **axe-core**: Accessibility testing

## Deployment

### Build Process

1. **Code Compilation**: TypeScript and Next.js compilation
2. **Asset Optimization**: Image and font optimization
3. **Bundle Generation**: Production-ready bundles
4. **Static Export**: Static file generation (if needed)

### Deployment Options

- **Vercel**: Recommended platform
- **Netlify**: Alternative static hosting
- **Self-hosted**: Custom server deployment
- **Docker**: Containerized deployment

## Monitoring

### Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS metrics
- **Bundle Analysis**: JavaScript bundle size
- **Error Tracking**: Runtime error monitoring
- **User Analytics**: User behavior tracking

### Health Checks

- **Route Health**: API endpoint monitoring
- **Database Health**: Database connection status
- **External Services**: Third-party service health
- **Uptime Monitoring**: Service availability tracking

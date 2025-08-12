# RepoDocsAI Frontend

A modern, responsive web application for AI-powered repository documentation generation, built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality

- **Repository Analysis**: AI-powered analysis of GitHub repositories
- **Documentation Generation**: Automatic README.md generation
- **Pull Request Integration**: Seamless GitHub workflow integration
- **User Dashboard**: Comprehensive usage statistics and management
- **Profile Management**: User account and security management

### User Experience

- **Responsive Design**: Mobile-first, responsive interface
- **Modern UI**: Clean, intuitive design using Shadcn/ui
- **Accessibility**: WCAG compliant with screen reader support
- **Performance**: Optimized for fast loading and smooth interactions

### Authentication & Security

- **GitHub OAuth**: Secure GitHub integration
- **Protected Routes**: Route-level authentication
- **Session Management**: Secure session handling
- **Data Validation**: Client and server-side validation

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React features and performance improvements
- **TypeScript**: Type-safe development

### Styling & UI

- **Tailwind CSS 4**: Utility-first CSS framework
- **Shadcn/ui**: Accessible component library
- **Lucide React**: Beautiful, customizable icons
- **Class Variance Authority**: Component variant management

### Development Tools

- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Turbopack**: Fast development bundler

## 📁 Project Structure

```
repodocs-frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/       # Dashboard pages
│   │   │   └── profile/     # User profile page
│   │   ├── auth/            # Authentication pages
│   │   └── ...              # Other public pages
│   ├── components/          # Reusable UI components
│   │   ├── atoms/          # Basic building blocks
│   │   ├── molecules/      # Simple component combinations
│   │   ├── organisms/      # Complex UI sections
│   │   ├── templates/      # Page layout structures
│   │   ├── ui/             # Shadcn/ui components
│   │   └── auth/           # Authentication components
│   ├── lib/                # Utility libraries
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API integrations
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
│   └── types/              # Global type definitions
├── public/                 # Static assets
├── docs/                   # Documentation
└── package.json            # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.17 or later
- **npm**: 9.0 or later
- **Git**: For version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/repodocs-frontend.git
   cd repodocs-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:

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

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Available Scripts

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Testing

```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests
```

### Build & Deployment

```bash
npm run build        # Build for production
npm run analyze      # Analyze bundle size
npm run export       # Export static files
```

## 🎨 Component Architecture

### Atomic Design Principles

The application follows atomic design principles for organized, maintainable components:

1. **Atoms**: Basic building blocks (buttons, inputs, icons)
2. **Molecules**: Simple combinations of atoms (form fields, search bars)
3. **Organisms**: Complex UI sections (headers, forms, navigation)
4. **Templates**: Page layouts and structure
5. **Pages**: Complete page implementations

### Component Categories

#### Profile Components

- **ProfileCard**: User profile display
- **ProfileStats**: Usage statistics visualization
- **AccountSecurity**: Security status display
- **AccountActions**: Account management actions

#### Layout Components

- **Header**: Main navigation and user actions
- **Layout**: Page layout wrapper
- **ProfileLayout**: Profile page specific layout

#### UI Components

- **Button**: Interactive buttons with variants
- **Card**: Content containers
- **Input**: Form input fields
- **Badge**: Status indicators

## 🔐 Authentication

### GitHub OAuth Integration

- Secure GitHub authentication
- User profile data synchronization
- Repository access permissions
- Token management

### Protected Routes

- Route-level authentication
- Automatic redirects
- Session validation
- User context management

## 📱 Responsive Design

### Mobile-First Approach

- Designed for mobile devices first
- Responsive breakpoints for all screen sizes
- Touch-friendly interactions
- Optimized for mobile performance

### Breakpoint System

```css
/* Mobile first approach */
.sm: 640px   /* Small devices */
.md: 768px   /* Medium devices */
.lg: 1024px  /* Large devices */
.xl: 1280px  /* Extra large devices */
.2xl: 1536px /* 2X large devices */
```

## ♿ Accessibility

### WCAG Compliance

- **Color Contrast**: AA level contrast ratios
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels
- **Focus Management**: Clear focus indicators

### Accessibility Features

- Semantic HTML structure
- ARIA labels and descriptions
- Focus trap for modals
- Skip navigation links
- Alternative text for images

## 🚀 Performance

### Optimization Strategies

- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Font loading optimization
- **Bundle Analysis**: Webpack bundle analyzer

### Performance Metrics

- **Core Web Vitals**: LCP, FID, CLS optimization
- **Bundle Size**: Optimized JavaScript bundles
- **Loading Speed**: Fast initial page loads
- **Runtime Performance**: Smooth interactions

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Component and function testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user journey testing
- **Accessibility Tests**: Screen reader compatibility

### Testing Tools

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **axe-core**: Accessibility testing

## 🔧 Configuration

### Environment Variables

```env
# Development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.repodocs.ai
```

### Build Configuration

- **TypeScript**: Strict mode enabled
- **ESLint**: Comprehensive linting rules
- **Prettier**: Consistent code formatting
- **Turbopack**: Fast development bundling

## 📦 Dependencies

### Core Dependencies

```json
{
  "next": "15.4.6",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "typescript": "^5"
}
```

### UI Dependencies

```json
{
  "tailwindcss": "^4",
  "lucide-react": "^0.539.0",
  "class-variance-authority": "^0.7.1"
}
```

### Development Dependencies

```json
{
  "eslint": "^9",
  "@types/node": "^20",
  "@types/react": "^19"
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Self-Hosted

1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Configure reverse proxy (nginx/Apache)

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards

- Follow ESLint rules
- Use TypeScript strict mode
- Write meaningful commit messages
- Include proper documentation

### Component Guidelines

- Follow atomic design principles
- Include proper TypeScript interfaces
- Add JSDoc comments for complex logic
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check the docs directory
- **Issues**: Report bugs on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact the development team

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🗺️ Roadmap

### Upcoming Features

- **Dark Mode**: Theme switching support
- **Advanced Analytics**: Detailed usage insights
- **Team Collaboration**: Multi-user workspaces
- **API Integration**: RESTful API endpoints
- **Mobile App**: React Native application

### Long-term Goals

- **AI Enhancement**: Improved documentation generation
- **Multi-language Support**: Internationalization
- **Enterprise Features**: Advanced team management
- **Marketplace**: Template and plugin ecosystem

---

**Built with ❤️ by the RepoDocsAI Team**

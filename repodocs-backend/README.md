# RepoDocs Backend

Backend service for RepoDocsAI built with NestJS, TypeORM, and PostgreSQL.

## 🚀 Features

- **Database Setup & Configuration** - Complete PostgreSQL schema with TypeORM
- **Environment Configuration** - Comprehensive configuration management
- **Health Checks** - Database connectivity verification
- **Database Migrations** - Automated schema management
- **Database Seeding** - Initial data setup

## 🛠️ Tech Stack

- **Framework**: NestJS 10
- **Database**: PostgreSQL with TypeORM
- **Configuration**: @nestjs/config with Joi validation
- **Validation**: class-validator, class-transformer
- **Database**: Supabase (PostgreSQL)

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase)
- Redis (for future features)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd repodocs-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL=postgresql://postgres:password@localhost:5432/repodocs
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # App Config
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-jwt-secret
   CORS_ORIGIN=http://localhost:3000
   ```

## 🗄️ Database Setup

### 1. Test Database Connection
```bash
npm run db:test
```

### 2. Run Migrations
```bash
npm run db:migrate
```

### 3. Seed Database (Optional)
```bash
npm run db:seed
```

## 🚀 Development

### Start Development Server
```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run db:test` - Test database connection
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data

## 📊 API Endpoints

### Health Check
- `GET /api/v1/health` - Service health status

## 🗂️ Project Structure

```
src/
├── config/                 # Configuration management
│   ├── env.config.ts      # Environment variables
│   └── config.module.ts   # Configuration module
├── database/              # Database layer
│   ├── entities/          # TypeORM entities
│   ├── migrations/        # Database migrations
│   ├── seeds/             # Database seeders
│   └── database.module.ts # Database module
├── health/                # Health check endpoints
├── app.module.ts          # Main application module
└── main.ts               # Application entry point
```

## 🗄️ Database Schema

The application includes the following core tables:

- **users** - User management and authentication
- **repository_analyses** - Repository analysis tracking
- **generated_documentation** - Generated documentation storage
- **rate_limits** - Rate limiting for anonymous users
- **ai_usage_logs** - AI service usage tracking
- **system_analytics** - System event logging

## 🔒 Security Features

- Environment variable validation
- CORS configuration
- Input validation with class-validator
- Database connection security

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `SUPABASE_URL` | Supabase project URL | Yes | - |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | - |
| `NODE_ENV` | Application environment | No | `development` |
| `PORT` | Application port | No | `3000` |
| `JWT_SECRET` | JWT signing secret | No | - |
| `CORS_ORIGIN` | CORS allowed origin | No | `http://localhost:3000` |

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Environment Variables
Ensure all required environment variables are set in production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.

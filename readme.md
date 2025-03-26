# Express E-commerce Backend

A modern, scalable e-commerce backend system built with Express.js and TypeScript, following domain-driven design principles.

## Key Features

- **Authentication & Authorization**
  - 🔐 JWT-based authentication
  - 🔑 OAuth 2.0 integration (Google)
  - 👥 Role-based access control
  - 📧 Email verification system

- **E-commerce Core**
  - 🛍️ Product catalog management
  - 🛒 Shopping cart functionality
  - 📝 Order processing
  - 💫 Wishlist management
  - 🏷️ Category and tag management

- **Payment & Integration**
  - 💳 Midtrans payment gateway
  - 📨 Email notifications (SMTP)
  - 🔍 Elasticsearch integration
  - 📊 Analytics tracking

- **Performance & Monitoring**
  - 🚀 Redis caching
  - 📈 Performance monitoring
  - 📝 Structured logging
  - 🔄 Rate limiting

## Tech Stack

- **Core:**
  - Node.js (>= 14)
  - Express.js
  - TypeScript
  - PostgreSQL 14+

- **Infrastructure:**
  - Docker & Docker Compose
  - Redis
  - Elasticsearch
  - NGINX (production)

- **Testing & Quality:**
  - Jest
  - Supertest
  - ESLint
  - Prettier

## Prerequisites

- Node.js >= 14
- PostgreSQL >= 14
- Docker & Docker Compose (recommended)
- Gmail account or SMTP server access
- Midtrans account for payments
- Google Cloud Console account (for OAuth)

## Development Setup

1. **Clone and Install:**

```bash
git clone https://github.com/yourusername/express-ecommerce-backend.git
cd express-ecommerce-backend
npm install
```

2. **Environment Configuration:**

```bash
cp .env.example .env
```

## Running the Application

### Docker Development Setup (Recommended)

```bash
# Start all services
docker-compose up -d

# Initialize database
docker-compose exec api npm run db:refresh

# View logs
docker-compose logs -f api
```

### Local Development Setup

```bash
# Start PostgreSQL & Redis (if installed locally)
brew services start postgresql
brew services start redis

# Initialize database
npm run db:refresh

# Start development server
npm run dev
```

## Available Scripts

```bash
# Development
npm run dev         # Start development server with hot reload
npm run build      # Build TypeScript code
npm run start      # Start production server
npm run lint       # Run ESLint
npm run format     # Run Prettier

# Database
npm run db:migrate   # Run pending migrations
npm run db:reset    # Reset database
npm run db:seed     # Seed sample data
npm run db:refresh  # Full reset and seed

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Project Structure

```markdown
src/
├── modules/              # Feature modules (domain-driven)
│   ├── auth/            # Authentication & authorization
│   ├── users/           # User management
│   ├── products/        # Product catalog
│   ├── orders/          # Order processing
│   ├── cart/            # Shopping cart
│   └── payments/        # Payment processing
├── common/              # Shared code
│   ├── middlewares/     # Express middlewares
│   ├── utils/           # Utility functions
│   └── types/          # TypeScript types
├── config/             # Configuration
├── database/           # Database setup & migrations
└── server.ts           # Application entry point
```

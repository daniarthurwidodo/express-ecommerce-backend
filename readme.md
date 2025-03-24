# Express E-commerce Backend

A modular e-commerce backend system built with Express.js and TypeScript.

## Features

- 🔐 Authentication (Local + Google OAuth)
- 📧 Email verification
- 🛍️ Product management
- 🛒 Shopping cart & wishlist
- 💳 Payment integration (Midtrans)
- 🔍 Advanced search with ELK stack
- 🚀 Performance optimization with Redis
- 📊 Monitoring and logging

## Prerequisites

- Node.js >= 14
- PostgreSQL >= 14
- Docker (optional)
- Google OAuth credentials
- SMTP server access

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/express-ecommerce-backend.git
cd express-ecommerce-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configurations:

```plaintext
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce

# JWT
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=your-email@gmail.com
```

## Running the Application

### Using Docker (recommended)

1. Start the services:

```bash
docker-compose up -d
```

2. Run database migrations and seed data:

```bash
npm run db:refresh
```

### Without Docker

1. Start PostgreSQL on your machine

2. Run database setup:

```bash
npm run db:refresh
```

3. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation

Swagger documentation is available at `http://localhost:3000/api-docs`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run db:reset` - Reset database
- `npm run db:seed` - Seed database
- `npm run db:refresh` - Reset and seed database

## Testing

Run the test suite:

```bash
npm test
```

## Project Structure

```
src/
├── modules/          # Feature modules
│   ├── auth/
│   ├── users/
│   ├── products/
│   └── orders/
├── common/           # Shared code
├── config/          # Configuration
├── database/        # Database setup
└── server.ts        # Entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

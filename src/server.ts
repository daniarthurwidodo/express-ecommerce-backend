import dotenv from 'dotenv';
import { Application } from './app/Application';
import { MiddlewareConfig } from './config/MiddlewareConfig';
import { SessionConfig } from './config/SessionConfig';
import { SwaggerConfig } from './config/SwaggerConfig';
import sequelize from './config/database';

// Load environment variables
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const application = new Application([
  new MiddlewareConfig(),
  new SessionConfig(),
  new SwaggerConfig(port)
]);

let app: any;

// Database connection and server start
async function startServer() {
  app = await application.initialize();
  try {
    await sequelize.authenticate();
    console.log('📦 Database connection established successfully');
    
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('🔄 Database models synchronized');

    await app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
      console.log(`📚 Swagger documentation available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

if (require.main === module) {
  startServer();
}

export default app;
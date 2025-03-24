import dotenv from 'dotenv';
import { Application } from './app/Application';
import { MiddlewareConfig } from './config/MiddlewareConfig';
import { SessionConfig } from './config/SessionConfig';
import { SwaggerConfig } from './config/SwaggerConfig';

// Load environment variables
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = new Application([
  new MiddlewareConfig(),
  new SessionConfig(),
  new SwaggerConfig(port)
]).initialize();

if (require.main === module) {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    console.log(`📚 Swagger documentation available at http://localhost:${port}/api-docs`);
  });
}

export default app;
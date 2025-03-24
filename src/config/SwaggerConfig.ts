import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { IAppConfig } from '../interfaces/IAppConfig';

export class SwaggerConfig implements IAppConfig {
  private readonly port: number;

  constructor(port: number) {
    this.port = port;
  }

  configure(app: Express): void {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'E-Commerce API',
          version: '1.0.0',
          description: 'Express E-Commerce API Documentation'
        },
        servers: [
          {
            url: `http://localhost:${this.port}`
          }
        ]
      },
      apis: ['./src/modules/*/routes/*.ts']
    };

    const swaggerDocs = swaggerJsDoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }
}
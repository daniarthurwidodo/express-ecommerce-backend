import express, { Express } from 'express';
import { IAppConfig } from '../interfaces/IAppConfig';

export class Application {
  private readonly app: Express;
  private readonly configs: IAppConfig[];

  constructor(configs: IAppConfig[]) {
    this.app = express();
    this.configs = configs;
  }

  public initialize(): Express {
    // Apply all configurations
    this.configs.forEach(config => config.configure(this.app));

    // Health check route
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    return this.app;
  }
}
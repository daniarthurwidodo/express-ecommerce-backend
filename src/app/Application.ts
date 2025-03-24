import express, { Express } from 'express';
import { IAppConfig } from '../interfaces/IAppConfig';
import authRoutes from '../modules/auth/routes/authRoutes';
import passport from '../config/auth';

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

    // Initialize passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Mount routes
    this.app.use('/auth', authRoutes);

    // Health check route
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    return this.app;
  }
}
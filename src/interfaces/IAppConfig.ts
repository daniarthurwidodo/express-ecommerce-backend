import { Express } from 'express';

export interface IAppConfig {
  configure(app: Express): void;
}
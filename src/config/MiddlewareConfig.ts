import { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { IAppConfig } from '../interfaces/IAppConfig';

export class MiddlewareConfig implements IAppConfig {
  configure(app: Express): void {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
  }
}
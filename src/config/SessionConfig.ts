import { Express } from 'express';
import session from 'express-session';
import passport from 'passport';
import { IAppConfig } from '../interfaces/IAppConfig';

export class SessionConfig implements IAppConfig {
  configure(app: Express): void {
    app.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
  }
}
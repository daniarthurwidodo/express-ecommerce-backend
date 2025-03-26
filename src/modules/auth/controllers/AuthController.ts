import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../users/models/User';
import { KafkaService, eventTopics } from '../../../utils/kafka';

export class AuthController {
  private static instance: AuthController;
  private kafkaService?: KafkaService;

  constructor() {
    if (!AuthController.instance) {
      // Initialize Kafka service
      try {
        this.kafkaService = new KafkaService();
        this.kafkaService.connect();
      } catch (error) {
        console.warn('Kafka service not initialized:', error);
        this.kafkaService = undefined;
      }
      AuthController.instance = this;
    }
    return AuthController.instance;
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Add validation for required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          status: 'error',
          message: 'All fields are required: email, password, firstName, lastName'
        });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already registered'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        authProvider: 'local'
      });
      console.log(this.kafkaService);
      // Try to emit Kafka event if service is available
      if (this.kafkaService) {
        try {
          await this.kafkaService.emit(eventTopics.USER_CREATED, {
            userId: user.id,
            email: user.email,
            timestamp: new Date()
          });
        } catch (kafkaError) {
          console.warn('Failed to emit Kafka event:', kafkaError);
          // Continue with registration even if Kafka fails
        }
      }

      res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error); // Add detailed error logging
      res.status(500).json({
        status: 'error',
        message: 'Error registering user',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user = req.user as any;
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error logging in',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async googleCallback(req: Request, res: Response) {
    try {
      const user = req.user as any;
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // For web clients, redirect with token
      if (req.query.web) {
        return res.redirect(`/auth/success?token=${token}`);
      }

      // For API clients, return JSON
      res.json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            authProvider: user.authProvider
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error processing Google authentication',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}
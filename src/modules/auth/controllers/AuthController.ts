import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ulid } from 'ulid';
import User from '../../users/models/User';
import { EmailService } from '../services/EmailService';
import { Op } from 'sequelize';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already registered'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = ulid();
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        authProvider: 'local',
        verificationToken,
        verificationTokenExpires,
        isEmailVerified: false
      });

      // Send verification email
      await EmailService.sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        status: 'success',
        message: 'Registration successful. Please check your email to verify your account.',
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
      res.status(500).json({
        status: 'error',
        message: 'Error registering user',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;

      const user = await User.findOne({
        where: {
          verificationToken: token,
          verificationTokenExpires: {
            [Op.gt]: new Date()
          }
        }
      });

      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid or expired verification token'
        });
      }

      await user.update({
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      });

      res.json({
        status: 'success',
        message: 'Email verified successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error verifying email',
        error: process.env.NODE_ENV === 'development' ? error : undefined
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
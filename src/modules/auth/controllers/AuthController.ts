import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../users/models/User';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const token = jwt.sign(
        { userId: req.user! },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  }
}
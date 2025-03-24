import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     description: Login with email and password
 */
router.post('/login', passport.authenticate('local'), authController.login);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     description: Login with Google
 */
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.login
);

export default router;
import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/AuthController';
import { validateRegister, validateLogin } from '../middleware/authValidation';

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
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *               lastName:
 *                 type: string
 *                 minLength: 2
 */
router.post('/register', validateRegister, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     description: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 */
router.post('/login', validateLogin, passport.authenticate('local'), authController.login);

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
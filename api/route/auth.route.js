import express from 'express';
import { google, signIn, signUp, signOut, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google', google);
router.get('/signout', signOut);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;
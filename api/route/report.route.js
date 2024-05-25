import express from 'express';
import { reportUser } from '../controllers/report.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.post('/report', verifyToken, reportUser);


export default router;
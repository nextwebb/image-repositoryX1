import express from 'express';

import { VerifyEmail } from './handlers';

const router = express.Router();

router.get('/auth/login', VerifyEmail);
// router.post('/auth/register', VerifyEmail);
// router.post('/auth/register', VerifyEmail);
// router.post('/auth/forgotpassword', VerifyEmail);

export default router;

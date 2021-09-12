import { Request, Response } from 'express';

const VerifyEmail = async (req: Request, res: Response) => res.send('login');

export default VerifyEmail;

import express from 'express';
import loginUser, { registerUser } from '../../controller/auth.js';
const Router = express.Router();
const authRoute = Router.post('/register', registerUser).post(
	'/login',
	loginUser
);

export default authRoute;

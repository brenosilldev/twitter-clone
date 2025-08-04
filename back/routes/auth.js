import {Router} from "express";
import { Signup, login, logout, getUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlware/middlware.js";

const AuthRouter = Router();

AuthRouter.post('/signup', Signup);
AuthRouter.post('/login', login);
AuthRouter.post('/logout', logout);
AuthRouter.get('/get-user', authMiddleware, getUser);


export default AuthRouter;
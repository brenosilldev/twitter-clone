import {Router} from "express";
import AuthRouter from "./auth.js";
import UserRouter from "./user.js";


const Routes = Router();

Routes.use('/auth',AuthRouter);
Routes.use('/user',UserRouter);

export default Routes


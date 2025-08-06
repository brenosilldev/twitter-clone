import {Router} from "express";
import AuthRouter from "./auth.js";
import UserRouter from "./user.js";
import PostRouter from "./post.js";
import NotificationRouter from "./notification.js";

const Routes = Router();

Routes.use('/auth',AuthRouter);
Routes.use('/user',UserRouter);
Routes.use('/post',PostRouter);
Routes.use('/notification',NotificationRouter);

export default Routes


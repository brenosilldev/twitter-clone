import { Router } from "express";
import { GetNotifications, DeleteNotification } from "../controllers/notification.controller.js";
import { authMiddleware } from "../middlware/middlware.js";

const NotificationRouter = Router();

NotificationRouter.get('/notifications',authMiddleware,GetNotifications);
NotificationRouter.delete('/delete',authMiddleware,DeleteNotification);

export default NotificationRouter;
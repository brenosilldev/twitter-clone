import {Router} from "express";
import { authMiddleware } from "../middlware/middlware.js";
import { FollowUnfollowUser, GetUserProfile, GetSuggestedUsers, UpdateUserProfile} from "../controllers/user.controller.js";


const UserRouter = Router();

UserRouter.get('/profile/:username', authMiddleware, GetUserProfile);
UserRouter.post('/suggestions', authMiddleware, GetSuggestedUsers);
UserRouter.post('/followers/:id', authMiddleware, FollowUnfollowUser);
UserRouter.post('/update-profile', authMiddleware, UpdateUserProfile);

export default UserRouter;
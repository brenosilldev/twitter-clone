import {Router} from "express";
import { createPost, likePost,commentPost,deletePost ,getAllPosts,GetLikesPosts,GetFollowingPosts,GetUserPosts} from "../controllers/post.controller.js";
import { authMiddleware } from "../middlware/middlware.js";

const PostRouter = Router();

PostRouter.post('/create', authMiddleware, createPost);
PostRouter.post('/like/:id', authMiddleware, likePost);
PostRouter.post('/comment/:id', authMiddleware, commentPost);
PostRouter.delete('/delete/:id', authMiddleware, deletePost);
PostRouter.get('/getall', authMiddleware, getAllPosts);
PostRouter.get('/likes/:id', authMiddleware, GetLikesPosts);
PostRouter.get('/following', authMiddleware, GetFollowingPosts);
PostRouter.get('/user/:username', authMiddleware, GetUserPosts);

export default PostRouter;
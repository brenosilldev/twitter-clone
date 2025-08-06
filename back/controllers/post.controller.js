import Post from "../models/post.model.js";
import Notification from "../models/notification.js";
import {v2 as cloudinary} from 'cloudinary';
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
    try {

        const {text} = req.body;
        let {image} = req.body;
        const userId = req.id;

        if(image){   
            const uploadResponse = await cloudinary.uploader.upload(image)
            image = uploadResponse.secure_url;
        }


        await Post.create({text, image,user:userId});

        return res.status(201).json({
            message: "Post created successfully",           
        });


    } catch (error) {
        console.log(`Error creating post: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}   


export const likePost = async (req, res) => {
    try {
        const {id} = req.params;
     
        const userId = req.id;

        const post = await Post.findById(id);

        if(!post) return res.status(404).json({message: "Post not found"});

        const isLiked = post.likes.includes(userId);

        if(isLiked){

            await Post.findByIdAndUpdate(id, {$pull: {likes: userId}});
            await User.findByIdAndUpdate(userId, {$pull: {likesPost: id}});
            return res.status(200).json({message: "Post unliked successfully"});
        }else{

            await Post.findByIdAndUpdate(id, {$push: {likes: userId}});         
            await User.findByIdAndUpdate(userId, {$push: {likesPost: id}});
            await Notification.create({
                from: userId,
                to: post.user,
                notification: "like",
            });
            
            return res.status(200).json({message: "Post liked successfully"});
        }


    } catch (error) {
        console.log(`Error liking post: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}


export const commentPost = async (req, res) => {
    try {

        const {id} = req.params;
        const {text} = req.body;

        const userId = req.id;

        if(!text) return res.status(400).json({message: "Comment is required"});

        const post = await Post.findById(id);

        if(!post) return res.status(404).json({message: "Post not found"});

        const comment = await Post.findByIdAndUpdate(id, {$push: {comments: {user: userId, text: text}}});

        if(!comment) return res.status(400).json({message: "Failed to add comment"});

        return res.status(200).json({message: "Comment added successfully", comment: comment});


    } catch (error) {
        console.log(`Error liking post: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}

export const deletePost = async (req, res) => {
    try {

        const {id} = req.params;
        const userId = req.id;

        const post = await Post.findById(id);

        if(!post) return res.status(404).json({message: "Post not found"});

        if(post.user.toString() !== userId) return res.status(403).json({message: "You are not authorized to delete this post"});

        
        if(post.image){
            const publicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }
        
        await Post.findByIdAndDelete(id);

        return res.status(200).json({message: "Post deleted successfully"});


    } catch (error) {
        console.log(`Error deleting post: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}       

export const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });

        if(posts.length === 0) return res.status(404).json({message: "No posts found"});

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts: posts,
        });


    } catch (error) {
        console.log(`Error getting all posts: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}

export const GetLikesPosts = async (req, res) => {
    try {
        
        const userId = req.params.id;
        console.log(userId);

        const user = await User.findById(userId);
        
        if(!user) return res.status(404).json({message: "User not found"});     

      

        const post = await Post.find({_id: {$in: user.likesPost}}).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });


        if(!post) return res.status(404).json({message: "Post not found"});

        
        return res.status(200).json({
            message: "Likes fetched successfully",
            likes: post,
        });

    } catch (error) {

        console.log(`Error getting likes post: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}  


export const GetFollowingPosts = async (req, res) => {  
    try {

        const userId = req.id;

        const user = await User.findById(userId).populate({
            path: "following",
            select: "-password",
        });

        if(!user) return res.status(404).json({message: "User not found"});

        const following = user.following;

        const posts = await Post.find({user: {$in: following}})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });

        console.log(posts);

        return res.status(200).json({
          
            posts: posts,
        });

    } catch (error) {
        console.log(`Error getting following posts: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}   



export const GetUserPosts = async (req, res) => {
    try {

        const username = req.params.username;

        const user = await User.findOne({username: username});

        if(!user) return res.status(404).json({message: "User not found"});

        const posts = await Post.find({user: user._id}).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });

        return res.status(200).json(posts);

    } catch (error) {
        console.log(`Error getting user posts: ${error.message}`);
    }
}   
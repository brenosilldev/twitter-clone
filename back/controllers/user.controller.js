import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import {v2 as cloudinary} from 'cloudinary';
import bcrypt from "bcryptjs";


export const GetUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.username);

        if(!user) return res.status(404).json({message: "User not found"});

        return res.status(200).json(user);
    } catch (error) {
        console.log(`Error getting user profile: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}

export const FollowUnfollowUser = async (req, res) => {
    try {

        const {id} = req.params;
        const userTomodify = await User.findById(id);
        const currentUser = await User.findById(req.id);

        if(req.id === id) return res.status(400).json({message: "You cannot follow yourself"});

        if(!userTomodify || !currentUser) return res.status(404).json({message: "User not found"});


        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            await User.findByIdAndUpdate(id, {$pull: {followers: req.id}});
            await User.findByIdAndUpdate(req.id, {$pull: {following: id}});
            return res.status(200).json({message: "User unfollowed successfully"});
        }else{
            await User.findByIdAndUpdate(id, {$push: {followers: req.id}});
            await User.findByIdAndUpdate(req.id, {$push: {following: id}});
            
            await Notification.create({
                from: req.id,
                to: userTomodify._id,
                notification: "follow", 
            });
            
            return res.status(200).json({message: "User followed successfully"});
        }


    } catch (error) {
        console.log(`Error following user: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}

export const GetSuggestedUsers = async (req, res) => {
    try {

        const usersFollowingByme = await User.findById(req.id).select("following");

        const users = await User.aggregate([
            {
                $match: {_id: {$ne: req.id}}
            },
            {
                $sample: {size: 10}
            }
        ]);

        const filteredUsers = users.filter(user => !usersFollowingByme.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach((user) => (user.password = null));

        return res.status(200).json(suggestedUsers);


    } catch (error) {
        console.log(`Error getting suggested users: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}

export const UpdateUserProfile = async (req, res) => {
    try {

        let {username,name,email,bio,currentPassword,newPassword}  = req.body;
        let { coverPicture, profilePicture} = req.body;
        
        const user = await User.findById(req.id);

        if(!user) return res.status(404).json({message: "User not found"});

      
        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({message: "Please provide both current and new password"});
        }

        if(currentPassword && newPassword){
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if(!isPasswordCorrect) return res.status(400).json({message: "Invalid password"});

            if(newPassword.length < 6) return res.status(400).json({message: "Password must be at least 8 characters long"});
        }


        if(profilePicture){     
            
            if(user.profilePicture){
                const publicId = user.profilePicture.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            

            const uploadResponse = await cloudinary.uploader.upload(profilePicture)
            profilePicture = uploadResponse.secure_url;
        }

        if(coverPicture){  

            if(user.coverPicture){
                const publicId = user.coverPicture.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadResponse = await cloudinary.uploader.upload(coverPicture)
            coverPicture = uploadResponse.secure_url;           
        }


        user.username = username;
        user.name = name;
        user.email = email;
        user.bio = bio;

        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }
        if (profilePicture) {
            user.profilePicture = profilePicture;
        }
        if (coverPicture) {
            user.coverPicture = coverPicture;
        }

        const updatedUser = await user.save();

        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        return res.status(200).json(userResponse.populated({
            path: "likesPost",
           
        }));


        
    } catch (error) {

        console.log(`Error updating user profile: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}
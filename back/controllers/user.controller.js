import User from "../models/user.model.js";
import Notification from "../models/notification.js";


export const GetUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.username);

        if(!user) return res.status(404).json({message: "User not found"});
te
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
        const {username,name,email,bio,password,newPassword}  = req.body;
        let { coverPicture, profilePicture} = req.body;
        
        const user = await User.findById(req.id);

        if(!user) return res.status(404).json({message: "User not found"});
        
    } catch (error) {
        console.log(`Error updating user profile: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}
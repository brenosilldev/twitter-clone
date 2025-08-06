import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/Token.js";

export const Signup = async (req, res) => {
    try {
        const {name, email, password, username} = req.body;

        const usernameExists = await User.findOne({username});
        if(usernameExists) return res.status(400).json({message: "Username already exists"});

        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({message: "User already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await  new User({name, email, password: hashedPassword, username}).save();

        if(user){
            generateToken(res, user._id);
           
        }


        return res.status(201).json({
            message: "User created successfully",
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                profilePicture: user.profilePicture,
                coverPicture: user.coverPicture,
                coverImage: user.coverImage,
                followers: user.followers,
                following: user.following,
                bio: user.bio,
        });

    } catch (error) {
        console.log(`Error creating user: ${error.message}`);
         return res.status(500).json({message: error.message});
    }
}

export const login = async (req, res) => {

    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user) return res.status(401).json({message: "User not found"});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({message: "Invalid password"});

        generateToken(res, user._id);
        return res.status(200).json({
            message: "User logged in successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture,
            coverImage: user.coverImage,
            followers: user.followers,
            following: user.following,
            bio: user.bio,
        });
    } catch (error) {
         console.log(`Error creating user: ${error.message}`);
         return res.status(500).json({message: error.message});   
    }
    
}

export const logout = async (req, res) => {   
    try {
        res.clearCookie('token');
        return res.status(200).json({message: "Logged out"});
    } catch (error) {
        console.log(`Error logging out: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}



export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.id);

        if(!user) return res.status(404).json({message: "User not found"});

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture,
            coverImage: user.coverImage,
            followers: user.followers,
            following: user.following,
            bio: user.bio,
            likesPost: user.likesPost,
            posts: user.posts,
        });

    } catch (error) {

        console.log(`Error getting user: ${error.message}`);
        return res.status(500).json({message: error.message});
    }
}


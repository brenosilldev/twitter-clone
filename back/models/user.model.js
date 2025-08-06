import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePicture: {type: String, default: ""},
    coverPicture: {type: String, default: ""},
    coverImage: {type: String, default: ""},
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    bio: {type: String, default: ""},
    likesPost: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: [],
        }
    ],
   

}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export { User };
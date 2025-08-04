import jwt from "jsonwebtoken";

export const generateToken = (res,id) => {

    const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "12h"});

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 12 * 60 * 60 * 1000,
    });


}

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}
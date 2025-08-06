import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";



export const GetNotifications = async (req, res) => {
    try {
        const id = req.id;

        const notifications = await Notification.find({to: id}).populate({
            path: "from",
            select: "username profilePicture",
        });

        await Notification.updateMany({to: id}, {read: true});

        res.status(200).json(notifications);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const DeleteNotification = async (req, res) => {
    try {
        const id = req.id;
        await Notification.deleteMany({to: id});
        res.status(200).json({message: "Notification deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
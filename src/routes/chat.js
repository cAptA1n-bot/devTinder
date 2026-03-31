const express = require("express");
const Chat = require("../models/chat");
const { userAuth } = require("../middleware/auth");

const chatRouter = express.Router();

chatRouter.get("/chats/:targetUserId", userAuth, async(req, res) => {
    try{
        const userId = req.user;
        const targetUserId = req.params.targetUserId;
        const chat = await Chat.findOne({participants: {$all: [userId, targetUserId]}}).populate("messages.senderId", "firstName lastName"); 
        if(!chat){
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })
            await chat.save();
        }
        res.status(200).json({data: chat});
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
})

module.exports = chatRouter;
const express = require("express");
const { userAuth } = require("../middleware/auth");

const chatRouter = express.Router();

chatRouter.get("/chats/:targetUserId", userAuth, async(req, res) => {
    try{
        const userId = req.user;
        const targetUserId = req.params.targetUserId;
        const chat = await Chat.findOne({participants: {$all: [userId, targetUserId]}})
        console.log(chat);
        res.status(200).json({data: chat});
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
})

module.exports = chatRouter;
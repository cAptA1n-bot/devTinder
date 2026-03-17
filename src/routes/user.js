const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middleware/auth');
const connectionRequest = require('../models/ConnectionRequest');
const User = require('../models/user');

const USER_SAFE_DATA = "firstName lastName about photoUrl age gender skills";

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try{
        const loggedinUser = req.user;
        const requests = await connectionRequest.find({
            toUserId: loggedinUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        res.json({
            message: "data fetched successfully",
            data: requests
        })
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

userRouter.get('/user/connections', userAuth, async(req, res) => {
    try{
        const loggedinUser = req.user;
    const connections = await connectionRequest.find({
        $or: [
            {fromUserId: loggedinUser._id, status: "accepted"},
            {toUserId: loggedinUser._id, status: "accepted"}
        ]
    }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
    const data = connections.map((row) => {
        if(row.fromUserId._id.toString() === loggedinUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
    });

    res.json(data);
    }
    catch(err){
        res.status(400).send({message: err.message})
    }
    
})

userRouter.delete('/user/connections/:userId', userAuth, async(req, res) => {
    const loggedInUser = req.user;
    connectedUserId = req.params.userId;

    try{
        const connections = await connectionRequest.find({
            $or: [
                {fromUserId: connectedUserId , toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id, toUserId: connectedUserId}
            ]
        })
        if(connections.length === 0){
            return res.status(404).send("User not found")
        }
        await connectionRequest.deleteOne({_id: connections[0]._id});
        res.status(204).json({"message": "Conneciton removed"});
    }
    catch(err){
        res.status(400).send("Unable to fulfill request");
    }
})

userRouter.get('/feed', userAuth, async(req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50? 50: limit;
        const skip = (page-1)*limit;
        const loggedinUser = req.user;
        const connectedUsers = await connectionRequest.find({
            $or: [{fromUserId: loggedinUser._id}, {toUserId: loggedinUser._id}]
        })
        const hiddenUserSet = new Set();
        connectedUsers.forEach((user) => {
            hiddenUserSet.add(user.toUserId.toString());
            hiddenUserSet.add(user.fromUserId.toString());
        })
        const feed = await User.find({
            $and: [
                {_id: {$nin: Array.from(hiddenUserSet)}},
                {_id: {$ne: loggedinUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({data: feed});
    }
    catch(err) {
        res.status(400).json({message: "ERROR: "+ err.message});
    }
})

module.exports = userRouter;
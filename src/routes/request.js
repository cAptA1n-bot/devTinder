const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequestModel = require('../models/ConnectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userid", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userid;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send(`Invalid status type: ${status}`);
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).send("User not found");
        }

        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }]
        })
        if (existingRequest) {
            return res.status(400).send("Request already exist");
        }

        const connectionRequest = new ConnectionRequestModel({ fromUserId, toUserId, status });
        const data = await connectionRequest.save();
        res.json({
            message: "Requeset sent successfully",
            data
        });
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestid", userAuth, async (req, res) => {
    try {
        const { status, requestid } = req.params;
        const loggedinUser = req.user;
        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Status not allowed");
        }
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestid,
            toUserId: loggedinUser._id,
            status: "interested",
        })
        if (!connectionRequest) {
            return res.status(404).send("Connection Request not found");
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: `Connection requested ${status}`,
            data
        })
    }
    catch (err) {
        res.status(400).send("Something went wrong"+ err.message);
    }

})

module.exports = requestRouter;
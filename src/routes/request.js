const express = require('express');
const {userAuth} = require('../middleware/auth');

const requestRouter = express.Router();

requestRouter.post("/sendconnectionrequest", userAuth, (req, res) => {
    console.log("Sending a connection request");
    res.send("Connection request sent");
})

module.exports = requestRouter;
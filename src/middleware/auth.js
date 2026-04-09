const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const {client} = require("../utils/redisClient.js")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Not logged in");
        }
        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedObj;
        const cachedUser = await client.get(_id.toString());
        if(cachedUser){
            req.user = JSON.parse(cachedUser);
            return next();
        }
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        await client.set(`user:${user._id.toString()}`, JSON.stringify(user), {EX: 300});
        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = { userAuth };
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Not logged in");
        }
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = { userAuth };
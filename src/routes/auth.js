const express = require('express');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const {signUpValidation, loginValidation} = require('../utils/validator');
const sendEmail = require("../utils/sendEmail.js");

const authRouter = express.Router();

authRouter.post("/signup", async(req, res) => {
    try{
        signUpValidation(req);
        const {firstName, lastName, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({firstName, lastName, email, password: hashedPassword});
        const savedUser = await user.save();

        const emailRes = await sendEmail.run();

        const token = await user.getJwt();
        res.cookie("token", token, {expires: new Date(Date.now() + 7*24*60*60*1000)});
        res.json({message:"SignUp successfull", data: savedUser});
    }
    catch(err){

        res.status(400).send("ERROR: "+ err.message)
    }
})

authRouter.post("/login", async(req,res) => {
    try{
        const {email, password} = req.body;
    loginValidation(email);
    const user = await User.findOne({email});
    if(!user){
        throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validateUser(password);
    if(isPasswordValid){
        const token = await user.getJwt();
        res.cookie("token", token, {expires: new Date(Date.now() + 7*24*60*60*1000)});
        res.send(user);
    }
    else{
        throw new Error("Invalid credentials");
    }
    }
    catch(err){
        res.status(400).send(err.message)
    }
    

})

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("Logout Successful");
})

module.exports = authRouter;
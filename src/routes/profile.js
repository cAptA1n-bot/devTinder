const express = require('express');
const {userAuth} = require('../middleware/auth');
const {editDataValidation, isStrongPass, validateAge} = require('../utils/validator');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async(req,res) => {
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req,res) => {
    try{
        if(!editDataValidation(req)){
            res.status(404).send("Invalid edit request");
        }
        validateAge(req.body.age);
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key])
        await loggedInUser.save();
        res.json({message: `${loggedInUser.firstName}'s profile updated successfuly`, data: loggedInUser});
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async(req, res) => {
    try{
        const {oldPassword, newPassword} = req.body;
    if(!(await req.user.validateUser(oldPassword))){
        return res.status(400).send("invalid");
    }
    if(oldPassword === newPassword){
        return res.send("can not set same password again");
    }
    isStrongPass(newPassword);
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    const loggedInUser = req.user;
    loggedInUser.password = newHashedPassword;
    loggedInUser.tokens = [];
    await loggedInUser.save();
    res.clearCookie("token");
    res.send("Password changed successfuly. Login again!");
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
    
})

module.exports = profileRouter;
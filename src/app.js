require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const {signUpValidation, loginValidation} = require('./utils/validator');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async(req, res) => {
    
    
    try{
        signUpValidation(req);
        const {firstName, lastName, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({firstName, lastName, email, password: hashedPassword});
        await user.save();
        res.send("Signup successful")
    }
    catch(err){

        res.status(400).send("ERROR: "+ err.message)
    }
})

app.post("/login", async(req,res) => {
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
        res.send("Login Successful");
    }
    else{
        throw new Error("Invalid credentials");
    }
    }
    catch(err){
        res.send("ERROR: "+err.message)
    }
    

})

app.get("/profile", userAuth, async(req,res) => {
    try{
        const user = req.user;
        res.send(user);
    
    }
    catch(err){
        res.send("ERROR: "+err.message)
    }
})

app.post("/sendconnectionrequest", userAuth, (req, res) => {
    console.log("Sending a connection request");
    res.send("Connection request sent");
})


connectDB()
    .then(() => {
        console.log("Database connection established...")
        app.listen(3000, () => {
            console.log("Server listening on port 3000...");
        })
    })
    .catch((err) => {
        console.log("Database connection failed");
    })
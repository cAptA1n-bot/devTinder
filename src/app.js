const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const {signUpValidation, loginValidation} = require('./utils/validator');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json())

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(isPasswordValid){
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

app.get("/feed",async(req,res) => {
    try{
        const user = await User.find();
        res.send(user);
    }
    catch(err){
        res.send("Something went wrong");
    }
})

app.get("/user", async(req, res) => {
    try{
        const user = await User.find({email: req.body.email})
        res.send(user);
    }
    catch(err){
        res.send("Something went wrong");
    }
})

app.delete("/user", async(req, res) => {
    const userId = req.body.userId;
    try{
        await User.findByIdAndDelete(userId);
        res.status(200).send("User deleted successfully");
    }
    catch(err) {
        res.send("Something went wrong");
    }
})

app.patch("/user/:id", async(req, res) => {
    const userId= req.params?.id;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => {
            ALLOWED_UPDATES.includes(k)
        })
        if(!isUpdateAllowed){
            throw new Error("Updates not allowed")
        }
        const changes = await User.findByIdAndUpdate(userId, data, {returnDocument: 'after', runValidators: true});
        if(!changes){
            res.status(404).send("User not found");
        }
        res.status(200).send(changes);
    }
    catch(err) {
        res.send("Something went wrong");
    }
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
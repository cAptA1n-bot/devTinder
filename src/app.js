const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/user/signup", async(req, res) => {
    const user = new User({
        firstName: "Prince",
        lastName: "Yadav", 
        email: "prince@yadav.com",
        password: "prince123"
    })
    try{
        await user.save();
        res.send("Signup successful")
    }
    catch(err){
        console.log("Signup failed with error: ", err.message)
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
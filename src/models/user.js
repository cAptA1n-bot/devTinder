const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlen: 25,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        maxlen: 25,
        trim: true
    },
    email: {
        type: String,
        required: true,
        maxlen: 50,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid email address")
            }
        }
        
    }, 
    password: {
        type: String,
        required: true,
        minlen: 5,
        trim: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Set a strong password");
            }
        }
    },
    age: {
        type: Number,
        min: 1,
        max: 120,
        trim: true
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender is invalid");
            }
        },
        trim: true
    },
    photoUrl:{
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYgizZqMv5a7Qo5ZXvwKCHeRsslPrArnCZ4g&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid image");
            }
        }
    },
    about:{
        type: String,
        maxlen: 200,
        trim: true
    },
    skills:{
        type:[String],
        validate(value){
            if(value.length > 20){
                throw new Error("Only 20 skills allowed");
            }
        }
    }

}, {timestamps: true})

module.exports = mongoose.model("User", userSchema);
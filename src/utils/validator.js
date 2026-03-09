const validator = require('validator');

const signUpValidation = (req) => {
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is invalid");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is invalid");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Set a strong password");
    }
}

const loginValidation = (email) => {
    if(!validator.isEmail(email)){
        throw new Error("Invalid credentials");
    }
}

const editDataValidation = (req) => {
    const editableData = ["firstName", "lastName", "age", "gender", "skills", "photoUrl", "about"];
    isEditAllowed = Object.keys(req.body).every((field) => editableData.includes(field));
    return isEditAllowed;
}

const isStrongPass = (pass) => {
    if(!validator.isStrongPassword(pass)){
        throw new Error("Password too weak");
    }
}

const validateAge = (age) => {
    
    if(age === "" || age === null || age === undefined || isNaN(Number(age))){
        throw new Error("Age is invalid");
    }
}

module.exports = {signUpValidation, loginValidation, editDataValidation, isStrongPass, validateAge};
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

module.exports = {signUpValidation, loginValidation};
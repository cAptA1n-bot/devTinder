const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://projectAlpha:devTinder123@projectalpha.ewnmpjm.mongodb.net/devTinder?appName=projectAlpha");
}

module.exports = connectDB;
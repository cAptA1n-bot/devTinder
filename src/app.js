require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const http = require('http');
const {initializeSocket} = require('./utils/socket');
const cors = require('cors');


const app = express();


require("./utils/cronjob.js");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

const server = http.createServer(app);
initializeSocket(server);


connectDB()
    .then(() => {
        console.log("Database connection established...")
        server.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}...`);
        })
    })
    .catch((err) => {
        console.log("Database connection failed");
    })
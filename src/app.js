const express = require('express');

const app = express();

app.use('/test', (req,res) => {
    res.send("This is the testing page");
})

app.use('/hello', (req,res) => {
    res.send("Hello World!");
})

app.listen(3000, () => {
    console.log("Server listening on port 3000");
})
console.log("socket server");
const express = require("express");
const http = require('http');
const app = express();

app.listen(3000, () => {
    console.log("run server port 5000");
});
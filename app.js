const express = require("express");
const http = require('http');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();

const { Server } = require('socket.io');

const httpServer = http.createServer(app);
// const io = new Server();
// io.attach(httpServer);

app.use(logger('dev'));
const io = new Server(httpServer);

const authenticateSocket = (socket, next) => {
    // try{
    const token = socket.handshake.auth.token;
    // console.log(token);
    // console.log(socket);

    if(token != "123"){
        console.log(token);
        return next(new Error("socket token error!"));
    }
    
    // socket.handshake.headers.origin
    // socket.handshake.headers.host
    // Check if server is valid (localhost:3000);

    // const validServers = ['127.0.0.1:5000'];
    // if (!validServers.includes(socket.handshake.headers.host)) {
    //     console.log("hello host name");
    //   return next(new Error('Invalid server'));
    // }

    return next();

    // }
    // catch(error) {
    //     throw new Error("socket authentication require here!");
    // }
}

io.use((socket, next) => {
    authenticateSocket(socket, next);
});

io.on('connection', (socket) => {
    console.log("socket connected server side!", socket.id);

    socket.on('disconnect', () => {
        console.log("socket disconnect!");
    });

});

io.use((error, socket, next) => {
    console.error('Socket authentication error:', error.message);
    // Handle the error appropriately
    if (socket) {
        setTimeout(function(){socket.disconnect()}, 200)
    }
    return next(error); // Pass the error to the next middleware
});



app.get('/', function (req, res, next) {
    // res.send("Authorization");
    res.sendFile(path.join(path.resolve(), './public/index.html'));
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack, '----------------------');
    res.status(400).json({
        data : true
    });
});


httpServer.listen(5000, () => {
    console.log("servre run 5000");
});

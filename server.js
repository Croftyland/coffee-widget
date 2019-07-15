const express = require('express');
const app = express();
const socketio = require('socket.io')

// console.log(namespaces[0]);
app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);
const io = socketio(expressServer);





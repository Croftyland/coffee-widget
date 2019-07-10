const express = require('express');
const app = express();
const socketio = require('socket.io')

let namespaces = require('./data/data');
// console.log(namespaces[0]);
app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);
const io = socketio(expressServer);


// io.on = io.of('/').on = io.sockets.on
// io.emit = io.of('/').emit = io.sockets.emit
io.on('connection',(socket)=>{
    // console.log(socket.handshake)
    // build an array to send back with the img and endpoint for each WS
    let wsData = namespaces.map((ws)=>{
        return {
            img: ws.img,
            endpoint: ws.endpoint
        }
    })
    // console.log(nsData)
    // send the wsData back to the client. We need to use socket, NOT io, because we want it to
    // go to just this client.
    socket.emit('wsList',wsData);
})


// loop through each namespace and listen for a connection
namespaces.forEach((namespace)=>{
    // console.log(namespace)
    // const thisWs = io.of(namespace.endpoint)
    io.of(namespace.endpoint).on('connection',(wsSocket)=>{
        console.log(wsSocket.handshake)
        const username = wsSocket.handshake.query.username;
        // console.log(`${nsSocket.id} has join ${namespace.endpoint}`)
        // a socket has connected to one of our chatgroup namespaces.
        // send that ns group info back
        wsSocket.emit('wsRoomLoad',namespace.rooms)
        wsSocket.on('joinRoom',(roomToJoin,numberOfUsersCallback)=>{
            // deal with history... once we have it
            console.log(wsSocket.rooms);
            const roomToLeave = Object.keys(wsSocket.rooms)[1];
            wsSocket.leave(roomToLeave);
            updateUsersInRoom(namespace, roomToLeave)
            wsSocket.join(roomToJoin)
            // io.of('/wiki').in(roomToJoin).clients((error, clients)=>{
            //     console.log(clients.length)
            //     numberOfUsersCallback(clients.length);
            // })
            const wsRoom = namespace.rooms.find((room)=>{
                return room.roomTitle === roomToJoin;
            })
            wsSocket.emit('historyCatchUp', wsRoom.history)
            updateUsersInRoom(namespace, roomToJoin);
        })
        wsSocket.on('newMessageToServer',(msg)=>{
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: 'https://via.placeholder.com/30'
            }
            // console.log(fullMsg)
            // Send this message to ALL the sockets that are in the room that THIS socket is in.
            // how can we find out what rooms THIS socket is in?
            // console.log(wsSocket.rooms)
            // the user will be in the 2nd room in the object list
            // this is because the socket ALWAYS joins its own room on connection
            // get the keys
            const roomTitle = Object.keys(wsSocket.rooms)[1];
            // we need to find the Room object for this room
            const wsRoom = namespace.rooms.find((room)=>{
                return room.roomTitle === roomTitle;
            })
            // console.log("The room object that we made that matches this WS room is...")
            // console.log(wsRoom)
            wsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients',fullMsg);
        })
        wsSocket.on('wishCoffeeToServer',(phrase)=>{
            const fullPharse = {
                text: phrase.text,
                time: Date.now(),
                username: username,
                avatar: 'https://via.placeholder.com/30'
            }
            const roomTitle = Object.keys(wsSocket.rooms)[1];
            const wsRoom = namespace.rooms.find((room)=>{
                return room.roomTitle === roomTitle;
            })
            wsRoom.addMessage(fullPharse);
            io.of(namespace.endpoint).to(roomTitle).emit('coffee',fullPharse);
        })
        wsSocket.on('confirmToServer',(con)=>{
            const fullCon = {
                text: con.text,
                time: Date.now(),
                username: username,
                avatar: 'https://via.placeholder.com/30'
            }
            const roomTitle = Object.keys(wsSocket.rooms)[1];
            const wsRoom = namespace.rooms.find((room)=>{
                return room.roomTitle === roomTitle;
            })
            wsRoom.addMessage(fullCon);
            io.of(namespace.endpoint).to(roomTitle).emit('confirm',fullCon)
        })
    })
})

function updateUsersInRoom(namespace, roomToJoin){
    // Send back the number of users in this room to ALL sockets connected to this room
    io.of(namespace.endpoint).in(roomToJoin).clients((error,clients)=>{
        // console.log(`There are ${clients.length} in this room`);
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers',clients.length)
    })
}

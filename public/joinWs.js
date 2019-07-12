function joinWs(endpoint){
    if(wsSocket){
        // check to see if wsSocket is actually a socket
        wsSocket.close();
        // remove the eventListener before it's added again
        document.querySelector('#user-input').removeEventListener('submit',formSubmission);

    }
    wsSocket = io(`http://localhost:9000${endpoint}`)
    wsSocket.on('wsRoomLoad',(wsRooms)=>{
        // console.log(wsRooms)
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = "";
        wsRooms.forEach((room)=>{
            let glyph;
            if(room.privateRoom){
                glyph = 'lock'
            }else{
                glyph = 'globe'
            }
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`
        })
        // add click listener to each room
        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach((elem)=>{
            elem.addEventListener('click',(e)=>{
                //console.log("Someone clicked on ",e.target.innerText);
                joinRoom(e.target.innerText)
            })
        })
        // add room automatically... first time here
        const topRoom = document.querySelector('.room')
        const topRoomName = topRoom.innerText;
        // console.log(topRoomName);
        joinRoom(topRoomName)
        
    })
    wsSocket.on('messageToClients',(msg)=>{
        console.log(msg)
        const newMsg = buildHTML(msg);
        document.querySelector('#messages').innerHTML += newMsg
    })
    document.querySelector('.message-form').addEventListener('submit',formSubmission);




}

function formSubmission(event){
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    console.log(newMessage);
    wsSocket.emit('newMessageToServer',{text: newMessage})
}


function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleString();
    const newHTML = `
    <li>
        <div class="user-image">
            <img src="${msg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>    
    `
    return newHTML;
}


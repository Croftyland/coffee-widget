function joinWs(endpoint){
    if(wsSocket){
        // check to see if wsSocket is actually a socket
        wsSocket.close();
        // remove the eventListener before it's added again
        // document.querySelector('#user-input').removeEventListener('submit',formSubmission);
        document.querySelector('#hero--button-2').removeEventListener('submit',confirmSuggest)
        document.querySelector('#hero--button-1').removeEventListener('submit',coffeeMaker);

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
    // wsSocket.on('messageToClients',(msg)=>{
    //     console.log(msg)
    //     const newMsg = buildHTML(msg);
    //     document.querySelector('#messages').innerHTML += newMsg
    // })
    // document.querySelector('.message-form').addEventListener('submit',formSubmission);



    wsSocket.on('coffee', (phrase)=>{
        console.log(phrase)
        const newWish = wishCoffee(phrase);
        document.querySelector('#messages').innerHTML += newWish
    })
    document.querySelector('.message-form').addEventListener('submit',coffeeMaker);

    wsSocket.on('confirm', (con)=>{
        console.log(con)
        const confirmation = confirm(con);
        document.querySelector('#messages').innerHTML += confirmation
    })
    document.querySelector('.message-form').addEventListener('submit',confirmSuggest)

}

// function formSubmission(event){
//     event.preventDefault();
//     const newMessage = document.querySelector('#user-message').value;
//     console.log(newMessage);
//     wsSocket.emit('newMessageToServer',{text: newMessage})
// }

function confirmSuggest(e){
    console.log(e);
    e.preventDefault();
    const newConfirm = document.querySelector('#user-confirm').value;
    wsSocket.emit('confirmToServer',{text: newConfirm})
}

function coffeeMaker(evn){
    evn.preventDefault();
    console.log(evn);
    const newCoffee = document.querySelector('#coffee-message').value;
    wsSocket.emit('wishCoffeeToServer',{text: newCoffee})
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

function wishCoffee(phase){
    const convertedDate = new Date(phase.time).toLocaleString();
    const coffeeForm = `
    <li>
        <div class="user-image">
            <img src="${phase.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${phase.username} <span>${convertedDate}</span></div>
            <div class="message-text">I want coffee.Who with me?</div>
        </div>
    </li>    
    `
    return coffeeForm;
}

function confirm(con){
    const convertedDate = new Date(con.time).toLocaleString();
    const confirmationForm = `
    <li>
        <div class="user-image">
            <img src="${con.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${con.username} <span>${convertedDate}</span></div>
            <div class="message-text">I wish</div>
            <div class="message-text">Congrats! What a match with ${con.username}! Run away and make dreams come true</div>
        </div>
    </li>    
    `
    return confirmationForm;
}

function joinWs(endpoint){
    if(wsSocket){
        // check to see if wsSocket is actually a socket
        wsSocket.close();
        // remove the eventListener before it's added again
        document.querySelector('#user-input').removeEventListener('submit',formSubmission);
        document.querySelector('#hero--button-1').removeEventListener('submit',coffeeMaker);
        document.querySelector('#hero--button-2').removeEventListener('submit',confirmSuggest)

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


    let first = document.getElementById('hero--button-1');
    let second = document.getElementById('hero--button-2');
    let third  = document.getElementById('user-message');


    first.addEventListener('click', function() {
        wsSocket.on('coffee', (phrase)=>{
            console.log(phrase)
            const newWish = wishCoffee(phrase);
            document.querySelector('#messages').innerHTML += newWish
        })
        document.querySelector('.message-form').addEventListener('submit',coffeeMaker);
    },false);


    second.addEventListener('click', function() {
        wsSocket.on('confirm', (con)=>{
            console.log(con)
            const confirmation = confirm(con);
            document.querySelector('#messages').innerHTML += confirmation
        })
        document.querySelector('.message-form').addEventListener('submit',confirmSuggest)
    },false);

    third.addEventListener('click', function() {
        wsSocket.on('messageToClients',(msg)=>{
            console.log(msg)
            const newMsg = buildHTML(msg);
            document.querySelector('#messages').innerHTML += newMsg
        })
        document.querySelector('.message-form').addEventListener('submit',formSubmission);
    },false);

}

function formSubmission(event){
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    console.log(newMessage);
    wsSocket.emit('newMessageToServer',{text: newMessage})
}

function coffeeMaker(evn){
    evn.preventDefault();
    console.log(evn);
    const newCoffee = document.querySelector('#coffee-message').value;
    wsSocket.emit('wishCoffeeToServer',{text: newCoffee})
}

function confirmSuggest(e){
    console.log(e);
    e.preventDefault();
    const newConfirm = document.querySelector('#user-confirm').value;
    wsSocket.emit('confirmToServer',{text: newConfirm})
}


// function buildHTML(msg){
//     const convertedDate = new Date(msg.time).toLocaleString();
//     const newHTML = `
//     <li>
//         <div class="user-image">
//             <img src="${msg.avatar}" />
//         </div>
//         <div class="user-message">
//             <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
//             <div class="message-text">${msg.text}</div>
//         </div>
//     </li>
//     `
//     return newHTML;
// }

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


//how I want to correct my code to work properly. I understood that in chat.html couldn't be 3 form submit

//<body>
//
// 		 <p id="messegeForForm"></p>
// 		 <p id="buttonCount"></p>
// 		 <div id="users"></div>
//
// 		 <script src="/socket.io/socket.io.js"></script>
// 		 <script>
// 			 let socket = io.connect();
//
// 			 //Once we're connected, display the user ID on the webpage
// 			 socket.on('connect', function(){
// 			  	document.getElementById("messegeForForm").innerHTML = "I want coffee";
// 			 });
//
//
//
// 			 //what to do when the server tells this user their button was clicked by any of the users
// 			 socket.on('coffeeWish', function(){
// 				 //console.log('clicked');
//
// 				 document.getElementById("buttonCount").innerHTML = "Who will join?';
// 			 });
//
// 			 //Add a button for each user that is connected to the server
// 			 socket.on('userList', function(data){
// 				 document.getElementById("users").innerHTML = "";
// 				 for(var i = 0; i < data.length; i++){
// 					 //console.log(data[i]);
// 					 var btn = document.createElement("BUTTON");
// 					 btn.onclick = userButtonClicked;
// 					 var textnode = document.createTextNode(data[i]);
// 					 btn.appendChild(textnode);
// 					 document.getElementById("users").appendChild(btn);
// 				 }
// 			 });
//
// 			 //When any of the user buttons on this page are clicked
// 			 function userButtonClicked(){
// 				 //Tell the server this button was clicked and send to the user the message
// 				 socket.emit('coffeeWish', this.innerHTML);
// 			 }
// 		</script>
//    </body>

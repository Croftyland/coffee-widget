function joinRoom(roomName){
    // Send this roomName to the server!
    wsSocket.emit('joinRoom', roomName,(newNumberOfMembers)=>{
        // we want to update the room member total now that we have joined!
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
    })
    wsSocket.on('historyCatchUp',(history)=>{
        // console.log(history)
        const messagesUl = document.querySelector('#messages');
        messagesUl.innerHTML = "";
        history.forEach((msg,phase,con)=>{
            const newMsg = buildHTML(msg);
            const newCoffee = wishCoffee(phase);
            const newConf = wishCoffee(con);
            messagesUl.innerHTML += newMsg;
            messagesUl.innerHTML += newCoffee;
            messagesUl.innerHTML += newConf;
        })
        messagesUl.scrollTo(0,messagesUl.scrollHeight);
    })
    wsSocket.on('updateMembers',(numMembers)=>{
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`
        document.querySelector('.curr-room-text').innerText = `${roomName}`
    })
    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input',(e)=>{
        console.log(e.target.value)
        let messages = Array.from(document.getElementsByClassName('message-text'));
        console.log(messages);
        messages.forEach((msg)=>{
            if(msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1){
                // the msg does not contain the user search term!
                msg.style.display = "none";
            }else{
                msg.style.display = "block"
            }
        })
    })

};

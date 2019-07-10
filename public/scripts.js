const username = prompt("What is your username?")
// const socket = io('http://localhost:9000'); // the / namespace/endpoint
const socket = io('http://localhost:9000',{
    query: {
        username
    }
});
let wsSocket = "";
// listen for wsList, which is a list of all the namespaces.
socket.on('wsList',(wsData)=>{
    // console.log(wsData)
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    wsData.forEach((ws)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ws=${ws.endpoint} ><img src="${ws.img}" /></div>`
    })

    // Add a clicklistener for each WS
    console.log(document.getElementsByClassName('namespace'))
    Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        // console.log(elem)
        elem.addEventListener('click',(e)=>{
            const wsEndpoint = elem.getAttribute('ws');
            console.log(`${wsEndpoint} I should go to now`)
            joinWs(wsEndpoint)
        })
    })
    joinWs('/bike');
})

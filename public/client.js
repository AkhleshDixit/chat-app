var socket = io();
var textarea = document.querySelector('#textarea');
var messageArea = document.querySelector('.message__area');

let user;
var para;
let typingTime = 1;

do {
    user = prompt("Write your name here");
} while (!user);

function appendMessage(msg,type)
{
    var today = new Date();
    var time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    var messageBox = document.createElement('div'); 
    var className = type;
    messageBox.classList.add('message',className);
    var messageToBeInserted = `
    <h4>${msg.name}</h4>
    <h6>${time}</h6>
    <p>${msg.message}</p>
    `;
    messageBox.innerHTML = messageToBeInserted;
    messageArea.appendChild(messageBox);
}

function scrollToBottom()
{
    messageArea.scrollTop = messageArea.scrollHeight;
}

textarea.addEventListener('keyup', function(e) {
    var text =  e.target.value.trim();
    if (typingTime === 1 && text !=='') {
        
        //sending message to server
        socket.emit('msgTyping',`${user} is typing a message....`);
        typingTime = 0;
    }
    if(text === '' && e.key !=='Enter'){
        //sending message to server
        socket.emit('typingStopped','stopped typing');
        typingTime = 1;
    }
})

textarea.addEventListener('keyup',(e)=>{
    if(e.key === 'Enter'){
        
        let msg = {
            name:user,
            message:e.target.value.trim()
        }
        e.target.value = '';
        
        //sending message to server
        if(msg.message !== ''){
            typingTime =1;
            socket.emit('message',msg);
            appendMessage(msg,'outgoing'); //appending message
            scrollToBottom();
        }
    }
})

//recieve messages from server
socket.on('message',function(msg){
    messageArea.removeChild(para); //removing child
    appendMessage(msg,'incoming'); //appending message
    scrollToBottom();
})

socket.on('typingStopped',function(msg){
    messageArea.removeChild(para); //removing child
})

socket.on('msgTyping',function(msg){
    para = document.createElement('p'); //creating element
    para.classList.add('typing'); //adding class
    para.innerHTML = msg; //adding message
    messageArea.appendChild(para); //appending child
    scrollToBottom();
})

socket.on('welcome',function(msg){
    var parag = document.createElement('p'); //creating element
    parag.classList.add('welcomePara'); //adding class
    parag.innerHTML = msg; //adding message
    messageArea.appendChild(parag); //appending child
    scrollToBottom();
})
socket.on('joined',function(msg){
    var parag = document.createElement('p'); //creating element
    parag.classList.add('joinedPara'); //adding class
    parag.innerHTML = msg; //adding message
    messageArea.appendChild(parag); //appending child
    scrollToBottom();
})
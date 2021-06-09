var express = require('express');
var app = new express();
var http = require('http').createServer(app); //creating server
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/public')); //adding static files

var PORT = process.env.PORT || 3000;

app.get('/',function(req,res){
    res.sendFile(__dirname+'./index.html');
})

io.on('connection',function(socket){
    console.log('connected to client');
    //welcoming connected client
    socket.emit('welcome',`Welcome to ChattingApp`);

    //sending response of connection to other client
    socket.broadcast.emit('joined',`Someone has joined the chat`);

    //recieving responses from client
    socket.on('msgTyping',function(msg){
        //sending response to other client
        socket.broadcast.emit('msgTyping',msg);
    })
    
    socket.on('message',function(msg){
        //sending response to other client
        socket.broadcast.emit('message',msg);
    })
    
    socket.on('typingStopped',function(msg){
        //sending response to other client
        socket.broadcast.emit('typingStopped',msg);
    })
})

//listenting port
http.listen(PORT,()=>{
console.log('connected to server');
});
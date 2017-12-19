const express = require('express');
const socket = require('http').Server(express);
const io = require('socket.io')(socket);

socket.listen(3002);

io.on('connection', function (socket) {

    console.log('Client connecté avec id ' + socket.id);

    socket.emit('Notification', 'Bienvenue sur OnepointMan !');

    socket.on('mapUserID', function (data) {
        console.log('Socket id : ' + socket.id);
        console.log('Received user id : ' + data["userId"]);
    });
});

module.exports = socket;
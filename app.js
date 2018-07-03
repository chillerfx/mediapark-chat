const express = require("express");
const socket = require("socket.io")
const app = express()
const http = require("http").Server(app);
const io = socket(http);

let models = require("./models");
let User = models.User
let Message = models.Message

app.set('port', process.env.PORT || 3000);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
/* Creating empty tables */
Message.sync({force: true})
User.sync({force: true})


http.listen(app.get("port"))

io.on('connection', (socket) => {
    /* Creates new user and message */
    function createUserMessage(user, message) {
        return User.create({
            name: user,
        }).then(newUser => {
            return Message.create({
                message: message,
                UserId: newUser.id
            }).then(m => {
                sendMessage(m.id)
                sendUsers(newUser.id)
            })
        })
    }
    function createMessage(userId, message) {
        console.log(`userId ${userId}, message ${message}`)
        Message.create({
            message: message,
            UserId: userId
        }).then(m => {
            sendMessage(m.id)
        })
    }
    function sendUsers(id) {
        User.findAll({where : {id : id}})
        .then(u => {
            socket.emit('users', u)
        })
    }
    function sendMessage(id) {
        Message.findAll({
            where: { id : id},
            include: [{
                model: User,
            }]
        })
        .then(messages => {
            socket.emit('messages', messages)
        })
    }
    /* Send all messages and users on new connection */
    Message.findAll({
        include: [{
            model: User,
        }]
    })
    .then(messages => {
        socket.emit('messages', messages)
    })

    User.findAll()
    .then(users => {
        socket.emit('users', users)
    })

    socket.on('message', (message) => {
        User.findAll({
            where: {name : message.user}
        })
        .then(userarr => {
            if(userarr === undefined || userarr.length == 0) {
                createUserMessage(message.user, message.message)
            } else {
                createMessage(userarr[0].id, message.message)
            }
            socket.emit('message')
        })
    })
});

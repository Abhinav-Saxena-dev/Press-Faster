
const express = require('express')
const app = express()
const socketio = require("socket.io")
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const quotableApi = require('./Api/quotableApi')

const connectDB = require('./Database/connect')

dotenv.config({path : './config.env'})

const PORT = process.env.PORT
const URL = process.env.DATABASE

const expressServer = app.listen(PORT)
const io = socketio(expressServer, {
    cors : {
        origin : "https://try-type.netlify.app"
    }
})

app.get('/', (req,res) => {
    res.status(200).json({msg : "Backend server is on"})
})

const Game = require('./models/Game')

connectDB(URL)

io.on('connect', (socket) => {

    socket.on('userInput', async ({userInput, gameID}) => {
        try{
            let game = await Game.findById(gameID)
            if(!game.isOpen && !game.isOver){
                let player = game.players.find(player => player.socketID === socket.id)
                let word = game.words[player.currentWordIndex];
                if(word === userInput){
                    player.currentWordIndex++;
                    if(player.currentWordIndex !== game.words.length){
                        game = await game.save();
                        io.to(gameID).emit('updateGame', game);
                    }
                    else{
                        let endTime = new Date().getTime();
                        let {startTime} = game;
                        player.WPM = calculateWPM(endTime, startTime, player)
                        game = await game.save();
                        // Using this done, if the user finishes the sentence before time runs out, then emitting this event
                        // will stop the timer.
                        socket.emit('done', game)
                        io.to(gameID).emit('updateGame', game)
                    }
                }
            }
        }catch(err){
            console.log(err);
        }
    })

    socket.on('timer', async ({playerID, gameID}) => {
        
        let countDown = 5;
        let game = await Game.findById(gameID);
        let player = game.players.id(playerID)  // this function searches for the _id property having value specified in param.

        if(player.isPartyLeader){

            // In this setInterval, we are emitting the timer event every second and thus updating the countdown value on
            // client side.
            let timerID = setInterval(async () => {
                if(countDown >= 0){
                    io.to(gameID).emit('timer', {countDown, msg : "Starting Game"})
                    countDown--;
                }
                else{
                    game.isOpen = false
                    game = await game.save();
                    io.to(gameID).emit('updateGame', game);
                    startGameClock(gameID)
                    clearInterval(timerID);
                }
            }, 1000)
        }
    })

    socket.on('join-game', async ({gameID, nickname}) =>{
        
        try{
            let game = await Game.findById(gameID)// checking to see if the gameID exists, meaning if the room is created.
            if(game.isOpen){
                
                gameID = game._id.toString();
                socket.join(gameID)

                let player = {
                    socketID : socket.id,
                    nickname,
                }

                game.players.push(player);
                game = await game.save();

                io.to(gameID).emit('updateGame', game)
            }
        }catch(err){
            console.log(err);
        }
    })

    socket.on('create-game', async (nickname) => {

        try{
            const quotableData = await quotableApi();

            let game = new Game();
            game.words = quotableData

            let player = {
                socketID : socket.id,
                isPartyLeader : true,
                nickname,
            }

            game.players.push(player)

            game = await game.save();

            const gameID = game._id.toString();

            socket.join(gameID)
            io.to(gameID).emit('updateGame', game);
            
        }catch(err){
            console.log(err);
        }
    })
})

const startGameClock = async (gameID) => {
    let game = await Game.findById(gameID)
    game.startTime = new Date().getTime(); // gives us milliseconds.
    game = await game.save();
    let time = 60; 

    let timerID = setInterval(function gameIntervalFunc(){
        if(time > 0){
            const fomratTime = calculateTime(time)
            io.to(gameID).emit('timer', {countDown : fomratTime, msg : "Time left"})
            time--
        }
        else{
            (async () => {
                const endTime = new Date().getTime();
                let game = await Game.findById(gameID)
                let {startTime} = game;
                game.isOver = true;

                // We are calculating WPM when a user has finished the passage. If they are unable to do so in the alloted
                // time then this code below will allow us to calculate their WPM. 
                game.players.forEach((player, index) => {
                    if(player.WPM === -1){
                        game.players[index].WPM = calculateWPM(endTime, startTime, player);
                    }
                })

                game = await game.save()
                io.to(gameID).emit('updateGame', game)
                clearInterval(timerID)
            })() 
        }
        return gameIntervalFunc; // We do it this way because setInterval will execute the function after 1 second as
    }(), 1000)                   // specified, but we want it to be executed immediately.
}

const calculateTime = (time) => {
    let mins = Math.floor(time/60);
    let secs = time % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
}

const calculateWPM = (endTime, startTime, player) => {
    let numberOfWords = player.currentWordIndex;
    const timeInSeconds = (endTime - startTime) / 1000
    const timeInMinutes = timeInSeconds/60;
    const WPM = Math.floor(numberOfWords/timeInMinutes)
    return WPM;
}
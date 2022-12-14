const mongoose = require('mongoose')

const PlayerSchema = new mongoose.Schema({
    currentWordIndex : {
        type : Number,
        default : 0 
    },
    isPartyLeader : {
        type : Boolean,
        default : false
    },
    WPM : {
        type : Number,
        default : -1,
    },
    nickname : {
        type : String
    },
    socketID : {
        type : String,
    },
});

const GameSchema = new mongoose.Schema({
    words : [{
        type : String
    }],
    isOpen : {
        type : Boolean,
        default : true,
    },
    isOver : {
        type : Boolean,
        default : false
    },
    players : [PlayerSchema],
    startTime : {
        type : Number
    },
})

module.exports = Game = mongoose.model('game', GameSchema)
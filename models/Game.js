const mongoose = require('mongoose')

const PlayerSchema = new mongoose.Schema({
    curretnWordIndex : {
        type : Number,
        default : 0 
    },
    isParty : {
        type : Boolean,
        default : false
    },

})
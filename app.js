const express = require('express')
const app = express()
const socketio = require("socket.io")
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const connectDB = require('./Database/connect')

dotenv.config({path : './config.env'})

const PORT = process.env.PORT

const expressServer = app.listen(PORT)
const io = socketio(expressServer)

connectDB()
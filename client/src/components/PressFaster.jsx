import React from "react";

import StartBtn from "./StartBtn";
import CountDown from "./Countdown";
import DisplayWords from "./DisplayWords";
import ProgressBar from "./ProgressBar";
import Form from "./Form";
import Scoreboard from "./Scoreboard";
import DisplayGameCode from "./DisplayGameCode";

import { Redirect } from "react-router-dom";

import socket from "../socketConfig";

//Returns the current user from the list of users.
const findPlayer = players => {
    return players.find(player => player.socketID === socket.id)
}

const PressFaster = ({gameState}) => {
    const {_id, players, words, isOpen, isOver} = gameState

    const player = findPlayer(players)

    //if _id is empty then that means the user did not go through the Join game procedure.
    if(_id === ""){
        return <Redirect to = '/' />
    }

    return (
        <div className="text-center">
            <DisplayWords player={player} words = {words} />
            <ProgressBar players = {players} player = {player} wordsLength = {words.length}/>
            <Form isOpen = {isOpen} isOver = {isOver} gameID = {_id} />
            <CountDown />
            <StartBtn player = {player} gameID = {_id}/>
            <DisplayGameCode gameID = {_id}/>
            <Scoreboard players = {players} />
        </div>
    )
}

export default PressFaster;
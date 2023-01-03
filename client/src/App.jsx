import React, { useEffect, useState } from 'react';

import {Route, Switch, useHistory} from "react-router-dom";

import GameMenu from './components/GameMenu';

import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import PressFaster from './components/PressFaster';

import socket from './socketConfig';

function App() {

  let history = useHistory();

  const [gameState, setGameState] = useState({_id : "", isOpen : false, players : [], words : []});

  // Setting state on client side once the object is saved in database.
  useEffect(() => {
    socket.on("updateGame", (game) => {
      console.log(game);
      setGameState(game);

    })
    return () => {
      socket.removeAllListeners();    // When the component is removed, return cleans up by invoking the code.
    }        
  }, [])

  useEffect(() => { 
    if(gameState._id)
      history.push(`/game/${gameState._id}`)
  }, [gameState._id]);

  return (
    <div>
      <Switch>
          <Route exact path = '/' component = {GameMenu} />
          <Route path = '/game/create' component = {CreateGame} />
          <Route path = '/game/join' component = {JoinGame} />
          <Route path = '/game/:gameID' render = {(props) => <PressFaster {...props} gameState = {gameState} />}/>

      </Switch>
    </div>
  )
}

export default App;

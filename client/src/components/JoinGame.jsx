import React, { useState } from "react";
import socket from "../socketConfig";

const JoinGame = () => {
  const [userInput, setUserInput] = useState({
    gameID: "",
    nickname: "",
  });

  const onChange = (e) => {
    setUserInput({...userInput, [e.target.name] : e.target.value});
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(userInput);
    socket.emit("join-game", userInput);
  };

  return (
    <div className="row">
      <div className="col-sm"></div>
      <div className="col-sm-8">
        <h1 className="text-center">Join Game</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="nickname">Enter Nick Name</label>
            <input
              type="text"
              name="nickname"
              value={userInput.nickname}
              onChange={onChange}
              placeholder=""
              className="form-control"
            />

            <label htmlFor="gameID">Enter Game ID</label>
            <input
              type="text"
              name="gameID"
              value={userInput.gameID}
              onChange={onChange}
              placeholder=""
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
      <div className="col-sm"></div>
    </div>
  );
};

export default JoinGame;

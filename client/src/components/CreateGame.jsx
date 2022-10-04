import React, { useState } from "react";
import socket from "../socketConfig";

const CreateGame = () => {

    const [nickname, setNickname] = useState("")

    const onChange = e => {
        setNickname(e.target.value)
    }

    const onSubmit = e => {
        e.preventDefault();
        socket.emit('create-game', nickname)
    }

    return(
        <div className="row">
            <div className="col-sm"></div>
            <div className="col-sm-8">
                <h1 className="text-center">Create Game</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="nickname">Enter Nick Name</label>
                        <input type="text" name="nickname" 
                        value = {nickname}
                        onChange={onChange}
                        placeholder = ""
                        className="form-control"
                        />
                    </div>
                    <button type = "submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
            <div className="col-sm"></div>
        </div>
    )
}

export default CreateGame;
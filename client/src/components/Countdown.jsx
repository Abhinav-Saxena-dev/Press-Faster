import React, {useState, useEffect} from "react";

import socket from "../socketConfig";

const CountDown = () => {
    const [timer, setTimer] = useState({
        countDown : "",
        msg : "",
    })

    useEffect(() => {
        
        // This event will invoked a lot of times as this will be used to display the time to the user.
        socket.on('timer', (data) => {
            setTimer(data)
        })

        // This removes the listener so that the user can see how much is left when paragraph is completed.
        socket.on('done', () => {
            socket.removeListeners('timer')
        })
    }, [])

    const {countDown, msg} = timer;

    return(
        <div>
            <h1>{countDown}</h1>
            <h3>{msg}</h3>
        </div>
    )
}

export default CountDown;
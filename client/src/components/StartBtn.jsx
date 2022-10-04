import React, {useState} from "react";

import socket from "../socketConfig";

// The point of this component is that the button should only visible to the party leader.
const StartBtn = ({player, gameID}) => {
    
    const [showBtn, setShowBtn] = useState(true)
    
    const {isPartyLeader} = player;
    
    const onClick = (e) => {
        socket.emit('timer', {playerID : player._id, gameID}) // Will only the socket on server side see this or will client side also see this
        setShowBtn(false);
    }

    return(
        isPartyLeader && showBtn
        ? 
        <button type = "button" onClick = {onClick} className = "btn btn-primary">
        Start the Battle
        </button>
        :
        null
    )
}

export default StartBtn;
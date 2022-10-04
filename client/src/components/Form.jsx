import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import socket from "../socketConfig"; 

const Form = ({isOpen, isOver, gameID}) => {
    const [userInput, setUserInput] = useState("")
    const textInput = useRef()

    useEffect(() => {
        if(!isOpen){
            textInput.current.focus()
        }
    }, [isOpen])

    const handleChange = (e) => {
        let value = e.target.value
        let lastChar = value.charAt(value.length - 1)
        if(lastChar === ' '){
            socket.emit('userInput', {userInput, gameID})
            resetForm();
        }
        else{
            setUserInput(value)
        }
    }

    const resetForm = () => {
        setUserInput("")
    }

    return(
        <div className="row my-3">
            <div className="col-sm"></div>
            <div className="col-sm4">
                <form>
                    <div className="form-group">
                        <input  type="text" 
                                readOnly={isOpen || isOver} 
                                onChange = {handleChange} 
                                value = {userInput}
                                ref = {textInput}
                                className = "form-control"
                                />
                    </div>
                </form>
            </div>
            <div className="col-sm"></div>

        </div>
    )
}

export default Form;
import React, { useState } from "react";

export default function MessageInput({
    send,
    }: {
        send: (val: string) => void
    }){
    const [value, setValue] = useState("")
    // let [state, setState] = useState({})
    // state = {
    //     color: 'blue',
    // };
    // onchange = () => {
    //     useState({color: 'red'});
    // };
    return ( 
     <>
        <label >
        Your first name:
        <input 
        value={value}
        onChange={(e)=>setValue(e.target.value)} 
        placeholder="Tyoe your message..." 
        
        />
        <button onClick={() => send(value)}>Send</button>

        </label>

    </>
    )
}
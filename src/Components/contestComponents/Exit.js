import React from 'react';

function Exit(){
    const exit = ()=>{
        window.location.reload(true);
    }
    return(
        <button className="ExitButton" onClick={exit}>Exit</button>
    )
}

export default Exit
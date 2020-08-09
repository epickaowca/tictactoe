import React from 'react';

function BeforeStart(props){
    return(
        <div className="BeforeStart">
            <button onClick={props.play}>Play</button>
        </div>
    )
}

export default BeforeStart
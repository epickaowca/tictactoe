import React from 'react';

function WhoseTurn(props){
    const { whoseturn, sign } = props
    return(
        <div className="whoseturn">
            {whoseturn===sign ? "You'r turn" : "Opponents turn"}
        </div>
    )
}

export default WhoseTurn
import React from 'react';
import fireb from '../../Fireb';
import gsap from 'gsap';

class Score extends React.Component{
    constructor(){
        super()
        this.state = {
            player: 0,
            opponent: 0
        }
    }

    componentDidMount(){
        const { room } = this.props
        fireb.database().ref(`${room}/winCells`).on('value', res=>{
            const { round, playerSign } = this.props
            if(res.val()){
                if(res.val()[`round${round}`] === "draw"){
                }else{
                    let winRes = res.val()[`round${round}`][3];
                    let winP;
                    if(winRes===playerSign){
                        winP = document.querySelector("#scorePlayer")
                        this.setState(prev=>{
                            return{
                                player: +prev.player + 1
                            }
                        })
                    }else{
                        winP = document.querySelector("#scoreOpponent")
                        this.setState(prev=>{
                            return{
                                opponent: +prev.opponent + 1
                            }
                        })
                    }
                    gsap.timeline()
                    .to(winP, 0.5, {y: "-5px"})
                    .to(winP, 0.5, {y: "0px"})
                }
            }
        })
    }
    render(){
        const { opponent, player } = this.state
        return(
            
            <div className="Score">
                <span>
                    <p>Enemy:</p>
                    <p id="scoreOpponent">{opponent}</p>
                </span>
                <span>
                    <p>You:</p>
                    <p id="scorePlayer">{player}</p>
                </span>
            </div>
        )
    }
}

export default Score
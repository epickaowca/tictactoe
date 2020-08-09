import React from 'react';
import fireb from '../Fireb';
import gsap from 'gsap';
import Oimg from '../img/O.png';
import Ximg from '../img/X.png';
import Table from './contestComponents/Table';
import WhoseTurn from './contestComponents/WhoseTurn';
import Score from './contestComponents/Score';
import Motion from './contestComponents/Motion';
import Exit from './contestComponents/Exit';

class Contest extends React.Component{
    constructor(){
        super()
        this.state={
            playerSign: "",
            opponentSign: "",
            whoseturn: "",
            round: 1,
        }
        this.tableRef = React.createRef()
    }
  
    componentDidMount(){
        const {room, player, opponent} = this.props;
      
        const playerSign = Math.floor(Math.random()*10) > 5 ? "X" : "O";
        const opponentSign = playerSign==="X" ? "O" : "X";
        fireb.database().ref(`${room}`).once("value", (res)=>{
            if(Object.values(res.val())[0].playerName===player){
                fireb.database().ref(`${room}/${opponent}/sign`).set(opponentSign)
                .then(fireb.database().ref(`${room}/${player}/sign`).set(playerSign))
                .then(this.setState({
                    playerSign: playerSign,
                    opponentSign: opponentSign,
                    whoseturn: "X",
                    round: 1
                    },this.startingAnimation))
            }else{
                fireb.database().ref(`${room}/${player}/sign`).on("value", (res)=>{
                    if(res && res.val()){
                        const opponentSign = res.val() === "X" ? "O" : "X";
                        this.setState({
                            playerSign: res.val(),
                            opponentSign: opponentSign,
                            whoseturn: "X",
                            round: 1
                        },this.startingAnimation)
                    }
                })
            }
        })
    }

    startingAnimation=()=>{
        const { playerSign } = this.state
        const propswho = playerSign==="X" ?  360 : 180
        const h1Anim = gsap.timeline({paused: true});
        const h1 = document.querySelectorAll(".startingContent h1");
        const ox = document.querySelector(".OX");
        const sCon = document.querySelector(".startingContent");
        h1Anim.to(h1, 1, {scale: 1, ease: "back.out(3)"})
        .to(h1, .5, {scale: .9, ease: "back.out(3)"})
        .to(h1, 1, {x: `${window.innerWidth}px`})
        .set(h1, {display: "none"})
        .to(ox, 1, {opacity: 1},"-=.5")
        .to(ox, 1, {rotation: 360, ease: "none"}, "-=.5")
        .set(ox, {rotation: 0})
        .to(ox, 2, {rotation: propswho, ease: "power4.out"})
        .to(ox, 1, {height: "90%", ease: "power4.out"}, "-=.8")
        .set(ox, {zIndex: -2})
        .to(sCon, .5, {scale: 0})
        .set(sCon, {display: "none"})
        .to(".table div", .5, {scale: 1})
        .addLabel("Landing")
        .to(".whoseturn", .5, {opacity: 1}, "Landing")
        .to(".Score", .5, {opacity: 1}, "Landing")
        .to(".motionContainer", .5, {opacity: 1}, "Landing")

        setTimeout(()=>{
        h1Anim.play()
        }, 1000)

    }

    roundEnd=(result)=>{
        if(this.state.round === 3){
            this.GameEnd();
            return;
        }
        const { round, playerSign} = this.state;
        const sCon = document.querySelector(".startingContent");
        const ox = document.querySelector(".OX");
        const h1Rotate = ox.style.transform.slice(29,32)==="180" ? "0" : "180";
        const nextRound = +round + 1;
        const resDiv = document.querySelector(".Result");
        const h1 = document.querySelector(".startingContent h1");

        resDiv.innerHTML = result==="draw" ? "DRAW!"  :  result===playerSign ? "You win" : "You lose";
        h1.innerHTML = `Round ${nextRound}`;

        this.setState(prev=>{
            return{
                playerSign: prev.opponentSign,
                opponentSign: prev.playerSign,
                blockThrow: true,
            }
        })
        const nextRoundAnim = gsap.timeline({onComplete: ()=>{
            this.setState(()=>{
                return{
                    round: nextRound,
                    whoseturn: "X"
            }
            })
            document.querySelectorAll(".table div").forEach(rect=>{
                rect.style.backgroundImage = "";
                rect.style.backgroundSize = "";
            })
            this.tableRef.current.listenForWin();
            this.tableRef.current.listenForMove();
      
        }})
        .set(resDiv, {display: "flex"})
        .to(resDiv, 1, {scale: 1.5})
        .set(sCon, {display: "flex"})
        .set(h1, {x: "0px", display: "block", scale: 0})
        .to(sCon, 0.5, {scale: 1})
        .set(resDiv, {display: "none", scale: 0})
        .to(h1, 0.7,{scale: 1, ease: "back.out(3)"})
        .set(ox, {zIndex: 2})
        .to(ox, 0.4, {height: "60%"})
        .to(ox, 2, {rotation: h1Rotate, ease: "power4.inOut"})
        .to(ox, 1, {height: "90%", ease: "power4.inOut"})
        .set(ox, {zIndex: -2})
        .to(sCon, 0.7, {scale: 0})
        .set(sCon, {display: "none"})

        nextRoundAnim.play()
    }

    GameEnd=()=>{
        const { room } = this.props;
        const { playerSign } = this.state
        let SconTop = window.innerWidth<=450 ? "30%" : "40%";
        const h1 = document.querySelector(".startingContent h1");
        h1.innerHTML = "";
        const score = document.querySelector(".Score");
        const sCon = document.querySelector(".startingContent");
        const extBtn = document.querySelector(".ExitButton");

        gsap.timeline({onComplete:()=>{
            if(playerSign==="X"){
                fireb.database().ref(room).remove();
            }
        }})
        .add("hide")
        .to(".motionContainer", .5, {opacity: 0}, "hide")
        .to(".whoseturn", .5, {opacity: 0}, "hide")
        .set(".motionContainer", {visibility: "hidden"})
        .set(".whoseturn", {visibility: "hidden"})
        .set(sCon, {display: "flex"})
        .to(sCon, .5, {scale: 1})
        .to(score, 1, {marginLeft: "0px", top: SconTop})
        .to(score, .5, {scale: 1.5, x:"-50%", y: '50%'})
        .to(extBtn, .5, {visibility: "visible", opacity: 1})
    }
  
    changeTurn=(stop)=>{
        if(stop){
            this.setState(prev=>{return{whoseturn: "noOne"}})
        }else{
            this.setState(prev=>{return{whoseturn: prev.whoseturn==="X" ? "O" : "X"}})
        }
    }

    opponentsTurn=()=>{
        const wt = document.querySelector(".whoseturn")
        gsap.timeline().to(wt, 0.3, {scale: 1.3})
        .to(wt, 0.3, {scale: 1})
    }

    render(){
        const { tableRef, props, state, roundEnd, opponentsTurn, changeTurn } = this;
        const { whoseturn, playerSign, round } = this.state;
        const { room, opponent, player} = this.props;
        return(
            <div className="GameContainer">
                <div className="Result"></div>
                <div className="overlay"></div>
                <div className="OX">
                    <img src={Oimg} alt="X Mark"></img>
                    <img src={Ximg} alt="O Mark"></img>
                </div>
                <div className="startingContent">
                    <h1>Who will</h1>
                    <h1>start</h1>
                </div>
                <Table ref={tableRef} sentProps={props} sentState={state} roundEnd={roundEnd} turnAnim={opponentsTurn} changeTurn={changeTurn}   />
                <WhoseTurn whoseturn={whoseturn} sign={playerSign}/>
                <Score playerSign={playerSign} room={room} round={round} />
                <Motion room={room} player={player} opponent={opponent} />
                <Exit />
            </div>
        )
    }
}

export default Contest
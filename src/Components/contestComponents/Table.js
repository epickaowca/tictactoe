import React from 'react';
import fireb from '../../Fireb';
import gsap from 'gsap';
import imgO from '../../img/O.png';
import imgX from '../../img/X.png';

class Table extends React.Component{
    constructor(){
        super();
        this.state={
            round: 1
        }
   
    }
    componentDidMount(){
        document.querySelectorAll(".table div").forEach(card=>card.addEventListener("click", this.throwCard));
        this.listenForMove();
        this.listenForWin();
    }

    throwCard=(e)=>{
        const { whoseturn, playerSign, round, } = this.props.sentState;
        const { room, player, opponent } = this.props.sentProps;
  
        if(whoseturn===playerSign){
            this.props.changeTurn();
            const id = e.target.id;
            fireb.database().ref(`${room}/allMoves`).once("value", res=>{
                if(res.val()===null || !res.val()[id]){
                    e.target.style.backgroundImage = playerSign==="X" ? `url(${imgX})` : `url(${imgO})`;
                    fireb.database().ref(`${room}/${player}/move/round${round}`).set(id);
                    fireb.database().ref(`${room}/allMoves/${id}`).set(playerSign)
                    .then(
                        //check for win
                        fireb.database().ref(`${room}/allMoves`).once("value", (res)=>{
                            let win = false;
                            let sign = "O";
                            for(let i=0; i<2; i++){
                                if(i===1) sign="X";
                                let jhelper = 1;
                                for(let j=1; j<4; j++){
                                    if(res.val()["cell"+jhelper]===sign && res.val()["cell"+(jhelper+1)]===sign && res.val()["cell"+(jhelper+2)]===sign){
                                        let winCells = [];
                                        for(let x=0; x<3; x++){
                                            const cell = document.querySelector(`#cell${jhelper+x}`).id;
                                            winCells.push(cell)
                                        }
                                        winCells.push(playerSign);
                                        this.iJustWin(winCells);
                                        win = true;
                                        break;
                                    }else if(res.val()["cell"+j]===sign && res.val()["cell"+(j+3)]===sign && res.val()["cell"+(j+6)]===sign){
                                        let winCells = [];
                                        let xHelper=0;
                                        for(let x=0; x<3; x++){
                                            const cell = document.querySelector(`#cell${j+xHelper}`).id;
                                            winCells.push(cell);
                                            xHelper+=3;
                                        }
                                        winCells.push(playerSign);
                                        this.iJustWin(winCells);
                                        win = true;
                                        break;
                                    }
                                    jhelper=jhelper+3;
                                }
                                if(res.val()["cell1"]===sign && res.val()["cell5"]===sign && res.val()["cell9"]===sign){

                                    if(win !== true){

                                        let winCells = [];
                                        for(let i=1; i<10; i+=4){
                                            const cell = document.querySelector(`#cell${i}`).id;
                                            winCells.push(cell);
                                        }
                                        winCells.push(playerSign);
                                        win = true;
                                        this.iJustWin(winCells);
                                    
                                    }

                                }else if(res.val()["cell3"]===sign && res.val()["cell5"]===sign && res.val()["cell7"]===sign){
                                    if(win !== true){

                                        let winCells = [];
                                        for(let i=3; i<8; i+=2){
                                            const cell = document.querySelector(`#cell${i}`).id;
                                            winCells.push(cell);
                                        }
                                        winCells.push(playerSign);
                                        win = true
                                        this.iJustWin(winCells);
                                    
                                    }
                                }
                            }
                            if( Object.values(res.val()).length===9 && win !== true ){
                                fireb.database().ref(`${room}/winCells/round${round}`).set("draw");
                                fireb.database().ref(`${room}/allMoves`).remove();
                                fireb.database().ref(`${room}/${player}/move`).remove();
                                fireb.database().ref(`${room}/${opponent}/move`).remove();
                            }
                        })
                    )
                }else{
                    this.props.changeTurn();
                }
            })
        }else{
            this.props.turnAnim()
        }
    }

    listenForMove=()=>{
        const { room, opponent} = this.props.sentProps;
        const { round } = this.props.sentState;
        fireb.database().ref(`${room}/${opponent}`).on("value", res=>{
            if(res.val() && res.val().move){
                if(res.val().move[`round${round}`]){
                    this.props.changeTurn()
                    const id = res.val().move[`round${round}`];
                    document.querySelector(`#${id}`).style.backgroundImage = this.props.sentState.opponentSign === "X" ? `url(${imgX})` : `url(${imgO})`;
                }
            }
        })
    }

    listenForWin=()=>{
        const { room } = this.props.sentProps
        const { round } = this.props.sentState
        const { roundEnd } = this.props
        fireb.database().ref(`${room}/winCells/round${round}`).on("value", (res)=>{
            if(res.val()!==null){
                if(res.val()==="draw"){
                    this.props.roundEnd("draw");
                    this.props.changeTurn(true);
                }else{
                    let rectWin = [];
                    for(let i = 0; i<3; i++){
                        const rect = document.querySelector(`#${res.val()[i]}`);
                        rectWin.push(rect);
                    }
                    this.props.changeTurn(true);
                    gsap.timeline({onComplete:()=>{roundEnd(res.val()[3])}})
                    .to(rectWin, 0.7, {backgroundSize: "0px"})
                }
            }
        })
    }


    iJustWin=(cells)=>{
        const { room, player, opponent } = this.props.sentProps;
        const { round } = this.props.sentState;
        fireb.database().ref(`${room}/winCells/round${round}`).set(cells);
        fireb.database().ref(`${room}/allMoves`).remove();
        fireb.database().ref(`${room}/${player}/move`).remove();
        fireb.database().ref(`${room}/${opponent}/move`).remove();
    }

    
    render(){
        return(
            <div className="table">
                <div id="cell1"></div>
                <div id="cell2"></div>
                <div id="cell3"></div>
                <div id="cell4"></div>
                <div id="cell5"></div>
                <div id="cell6"></div>
                <div id="cell7"></div>
                <div id="cell8"></div>
                <div id="cell9"></div>
             </div>
        )
    }
}


export default Table
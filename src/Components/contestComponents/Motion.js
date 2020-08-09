import React from 'react';
import textImg from '../../img/text.png';
import gsap from 'gsap';
import fireb from '../../Fireb';

class Motion extends React.Component{
    constructor(){
        super()
        this.state = {

        }
    }
    
    componentDidMount(){
        this.setState({
            textImg: document.querySelector(".motionContainer img"),
            prevMot: document.querySelector(".motionContainer_preview")
        })
        this.listenForMotion();
        document.querySelectorAll(".motionContainer_preview_items_item").forEach(mot=>{
            mot.addEventListener("click", (e)=>{
                this.sendMotion(e);
            });
        })
     }s

    showMotion=()=>{
        const { textImg, prevMot } = this.state;
        textImg.style.display = "none";
        prevMot.style.display = "flex";
    }
    exitMotion=()=>{
        const { textImg, prevMot } = this.state;
        textImg.style.display = "block";
        prevMot.style.display = "none";
    }
    sendMotion=(e)=>{
        const { room, player } = this.props;
        const { textImg, prevMot } = this.state;
        let motionMess
        motionMess = e.target.children.length===0 ? e.target.innerHTML : e.target.children[0].innerHTML  ;
        const motion = document.querySelector(".motionContainer_playerMotion");
        prevMot.style.display = "none";
        motion.innerHTML=motionMess;
        gsap.timeline()
        .set(motion, {visibility: "visible", opacity: 1, y: "0px"})
        .to(motion, 1, {y: "-20px"})
        .to(motion, 0.2, {opacity: 0, visibility: "hidden"})
        .set(textImg, {display: "block"});
        fireb.database().ref(`${room}/${player}/motion`).set(motionMess);
    }
    listenForMotion=()=>{
        const { room, opponent } = this.props;
        fireb.database().ref(`${room}/${opponent}/motion`).on("value", res=>{
            if(res.val()){
                const motionMess = res.val();
                const motionDiv = document.querySelector(".motionContainer_opponentMotion")
                motionDiv.innerHTML = motionMess;
                gsap.timeline()
                .set(motionDiv, {visibility: "visible", opacity: 1, y: "0px"})
                .to(motionDiv, 1, {y: "20px"})
                .to(motionDiv, 0.2, {opacity: 0, visibility: "hidden"})
            }
        })
    }

    render(){
        return(
            <div className="motionContainer">
                <div className="motionContainer_opponentMotion"></div>
                <div className="motionContainer_playerMotion"></div>
                <img onClick={this.showMotion} src={textImg} alt="motion"></img>
                <div className="motionContainer_preview">
                    <div className="motionContainer_preview_items">
                        <div className="motionContainer_preview_items_item"><p>Hi!</p></div>
                        <div className="motionContainer_preview_items_item"><p>Oops</p></div>
                    </div>
                    <div className="motionContainer_preview_items">
                        <div className="motionContainer_preview_items_item"><p>Wow!</p></div>
                        <div className="motionContainer_preview_items_item"><p>Well played</p></div>
                        <div className="motionContainer_preview_items_item"><p>Thanks</p></div>
                    </div>
                    <button onClick={this.exitMotion} className="motionContainer_preview_exit">X</button>
                </div>
            </div>
        )
    }
}

export default Motion
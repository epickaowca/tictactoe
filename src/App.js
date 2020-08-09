import React from 'react';
import './App.scss';
import fireb from './Fireb';
import BeforeStart from './Components/BeforeStart'
import Contest from './Components/Contest'

class App extends React.Component{
  constructor(){
    super();
    this.state={
      isLoading: false,
      name: "",
      room: ""
    }
  }
  
  

  randomTime=()=> Math.floor(Math.random() * (1500 - 500 + 1000) ) + 500;

  play=()=>{
    const loading = document.querySelector(".Loading")
    this.setState({name: this.ID(), isLoading: true}, ()=>{
      fireb.database().ref(`waitingRoom/${this.state.name}`).set("waiting")
      .then(()=>{
              fireb.database().ref("users").once("value")
              .then(res=>res.val())
              .then(res=>{
                  if(res!==null && Object.values(res).length>0) this.icanplay(res);
                  else this.imustwait();
              })
      })
      .catch(error => {
        if(error){
          loading.innerHTML="Waiting in queue..."
          setTimeout(()=>{this.play()},this.randomTime())
        }
      })
    })


  }

  icanplay=(res)=>{
      const opponent =  Object.values(res)[0].player
      fireb.database().ref(`users/${opponent}`).set({
        player: opponent,
        status: "already",
        opponent: this.state.name
      })
      .then(
        fireb.database().ref(`users/${opponent}`).on("value", res=>{
          if(res){
            if(!res.val()) return;
              if(res.val().status==="already") return;  
              this.setState(()=>{
                return{room: res.val().status, isLoading: false, opponent: opponent}
                },()=>{
                  fireb.database().ref(`waitingRoom/${this.state.name}`).remove();
                  fireb.database().ref(`users/${opponent}`).remove();
                }
              )

          }
        })
      )
  }

  imustwait=()=>{
    const loading = document.querySelector(".Loading");
    loading.innerHTML="Waiting for players...";
    const {name} = this.state;
    fireb.database().ref(`users/${name}`).set({
      player: name,
      status: "can play",
      opponent: ""
    })
    .then(()=>{
      fireb.database().ref(`waitingRoom/${name}`).remove();
      fireb.database().ref(`users/${name}`).on("value", res=>{   
        if(!res.val()) return;
        const {opponent} = res.val();
        if(opponent.length>0){
          fireb.database().ref(`table/${name+opponent}`).set({
            [name]: {playerName: name},
            [opponent]: {playerName: opponent}
          })
          .then(
              fireb.database().ref(`users/${name}`).set({
              player: name,
              status: `table/${name+opponent}`,
              opponent: ""
            }))
          .then(this.setState(prev=>{return{room:`table/${name+opponent}`, isLoading: false, opponent: opponent}}))
        }
      })
    })
  }


  ID=()=>  '_' + Math.random().toString(36).substr(2, 9);

  render(){
    return (
      <div>
        <h1 className="Loading">{this.state.isLoading && "Loading.."}</h1>
        {this.state.name==="" && <BeforeStart play={this.play} /> }
        {this.state.room!=="" && <Contest room={this.state.room} player={this.state.name} opponent={this.state.opponent} />}
      </div>
    )
  }
}

export default App;

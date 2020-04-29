import React, { Component } from 'react';
import {Link} from "react-router-dom";
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import logo from 'logo.svg';
//import { Socket } from 'react-socket-io';
import openSocket from "socket.io-client";
import io from "socket.io-client";
import bgimage from "./background.jpg"
import history from "history.js"
const uri = 'http://127.0.0.1:5000';
const options = { transports: ['websocket'] };
var sectionStyle = {
  width: "100%",
  backgroundImage: "url("+ bgimage + ")"
};

//const socket = openSocket('http://127.0.0.1:5000',options);

class Chatbot extends Component{


	constructor(props){
		super(props);

		this.state = {
			socket:null,
			response: false,
      isStart : false,
      loc: this.props.location.state.key,
      cid:this.props.location.state.cid,
      ispublic:this.props.location.state.ispublic,
      user : localStorage.getItem('user_id')
		};
	}

  Interviewstart = () => {
    alert("insideclick")
    this.setState({isStart:true});
  }

	componentDidMount() {
		this.initSocket()
    addResponseMessage("Welcome to Ezhire! Your interview is about to begin. Are you ready?");
    //user=localStorage.getItem('user_id')
    var data1 ={"interviewid": this.state.loc, "user" : this.state.user, "cname" : this.state.cid, "ispublic":this.state.ispublic}
    fetch("http://127.0.0.1:5000/finishinterview",{
        method:'POST',
    body:JSON.stringify(data1),
      })
      .then(res => res.json())
      .then(res =>{
      console.log("Success")
      this.setState({isStart:true})
})
  }


  initSocket = ()=>{
  	const socket = io(uri)
  	socket.on('connect',()=>{
  		console.log("Connected")
  	})
  	this.setState({socket})
  }
  handleNewUserMessage = (newMessage) => {
  	let counter=0
    console.log(`New message incoming! ${newMessage}`);
    const data={"message":newMessage, "cid" : this.state.cid, "intid" : this.state.loc, "user" : this.state.user}
    this.state.socket.emit("message", data)
    
    this.state.socket.on("after-long-process",  (res) => {
    	//const response = this.state;
    	console.log("The message is ",res,counter)

    	this.setState({response:res['mess']})
    if(counter==0){
    	addResponseMessage(res['mess'])
    	counter= counter+1
    	console.log("The counter is",counter)
      if(res['mess'] =='Thank you!'){
      let socket=io(uri)
      socket.on('disconnect',()=>{
      console.log("Client Disconnected")
      })
      alert("You have successfully completed your interview!")
      history.push('/admin/pastinterview')
    }
    }

     })

  }
render(){
  if(this.state.isStart){
	return(
  
		<div className="App">
    <img src={bgimage} width="900px" height="auto"/>
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          profileAvatar={logo}
          title="InterviewScreen"
          subtitle="You know you can do this"
          fullScreenMode={false}

          //showCloseButton={true}
        />
      </div>
      );
    }
    else{
      return(
        <div className="App">
        <h1> Click on the icon below to start the interview, Once you start it there is no going back my friend! </h1>
      </div>

      );
    }
}
}
export default Chatbot;
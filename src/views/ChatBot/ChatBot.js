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
import Config from "../../Config.js"
const uri = Config.serverurl;
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
    fetch(Config.serverurl+"/finishinterview",{
        method:'POST',
    body:JSON.stringify(data1),
      })
      .then(res => res.json())
      .then(res =>{
      this.setState({isStart:true})
})
  }


  initSocket = ()=>{
  	const socket = io(uri)
  	socket.on('connect',()=>{
  	})
  	this.setState({socket})
  }
  handleNewUserMessage = (newMessage) => {
  	let counter=0
    const data={"message":newMessage, "cid" : this.state.cid, "intid" : this.state.loc, "user" : this.state.user}
    this.state.socket.emit("message", data)
    
    this.state.socket.on("after-long-process",  (res) => {
    	//const response = this.state;

    	this.setState({response:res['mess']})
    if(counter==0){
    	addResponseMessage(res['mess'])
    	counter= counter+1
      if(res['mess'] =='Thank you!'){
      let socket=io(uri)
      socket.on('disconnect',()=>{
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
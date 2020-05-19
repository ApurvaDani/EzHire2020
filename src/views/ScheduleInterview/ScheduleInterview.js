import React from 'react';
import InterCard from './InterCard.js'
import GridContainer from "components/Grid/GridContainer.js";
import history from "history.js"
import ReactLoading from 'react-loading';
import Config from "../../Config.js"
import Auth from "../../Auth.js"

export default function ScheduleInterview(){
Auth()
let ans
let todoiter=""
const [isloaded, setLoad] = React.useState('false')
const [isschedule, setSchedule] = React.useState('false')
const user=localStorage.getItem('user_id')
var data ={"user":user}
fetch(Config.serverurl+"/scheduleinterview",{
        method:'POST',
		body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
		localStorage.setItem("interdata",JSON.stringify(res))

		setLoad('true')
		data=""
})
        //x=JSON.stringify(x)
        //alert(ans)
        
 if(isloaded=='true'){
 	ans = localStorage.getItem('interdata')
 	if(ans!="null"){
 	ans=JSON.parse(ans)
 	ans=Object.entries(ans).map(([key, value]) => {
        return (
            <InterCard key={key} name={value.name} role={value.role} opento={value.opento} cid={key} cname={user}/>
        )
    })
 }
 else{
 	ans="Start by clicking on Set Interviews to schedule interviews"
 }
	return(
			<GridContainer>
   			{ans}
			</GridContainer>
		)
}

else{
	return(
	<div style={{display: 'flex', justifyContent: 'center'}}>
	<ReactLoading type={'cylon'} color={'skyblue'} height={'18%'} width={'25%'} />
	<br />
	</div>
	)
}
}
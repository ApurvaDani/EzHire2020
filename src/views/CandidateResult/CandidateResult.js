import React from "react"
import { useLocation } from "react-router-dom";
import CandCard from "./CandCard.js"
import GridContainer from "components/Grid/GridContainer.js";
import ReactLoading from 'react-loading';
import Config from "../../Config.js"
import Auth from "../../Auth.js"

export default function CandidateResult(){
Auth()
let location = useLocation();
let interviewname
let interviewid
let companyid
let candetails
const [isloaded, setLoad] = React.useState(false)
const [isfetch, setFetch] = React.useState(true)

function fetchcall(){
	alert(isfetch)
	if(isfetch){
	setFetch(false)
}
	else{
		setFetch(true)
	}

	alert(isfetch)
	alert(isfetch)
}

if(location.state){
		interviewname = location.state.name
		interviewid = location.state.cid
		companyid = location.state.cname
		var data ={"interviewid": interviewid, "companyid" : companyid}
		fetch(Config.serverurl+"/candidateresult",{
        method:'POST',
		body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
		localStorage.setItem("candetails",JSON.stringify(res))

		setLoad(true)
		data=""
})
if(isloaded){
candetails=localStorage.getItem('candetails')
candetails=JSON.parse(candetails)
if(Object.entries(candetails).length!= 0){
candetails=Object.entries(candetails).map(([key, value]) => {

        return (
            <CandCard key={key} fname={value.firstName} lname={value.lastName} email={value.email} aboutme={value.aboutMe} cid={companyid} intid={interviewid} user={key} fetch={fetchcall}/>
        )
    })
}
else{
	candetails="No candidate has yet appeared for the interview!"
}

return(
	<GridContainer>
	{candetails}
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
else{
	return(
	<h3>Please select interview from Your Interviews to check the results </h3>
	)
}
}

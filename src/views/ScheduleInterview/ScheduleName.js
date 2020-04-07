import React from "react"

export default function ScheduleName(){
	const intname = localStorage.getItem('interview_schedule_name')
	const [isloaded, setLoad] = React.useState(intname)
	if (isloaded == undefined){
		return(
		<h1> Not Defined {intname} </h1>
		)
	}
	else{
		return(
		<h1> Defined {intname} </h1>
		)
	}
	}
}
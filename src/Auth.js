import React,{useState} from 'react';
import history from "./history"


const Auth = () => {
		if(!localStorage.getItem('user_id')){
		history.push('/signin')

}
}


export default Auth
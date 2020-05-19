import ReactLoading from 'react-loading';
import React,{useEffect} from "react";
// react plugin for creating charts
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import InterviewCard from "./InterviewCard.js"
import MaterialTable from 'material-table'
import { Link } from 'react-router-dom'; 
import Config from "../../Config.js"
import Auth from "../../Auth.js"

export default function PublicInterview(){
Auth()
const [isloaded, setLoad] = React.useState(false)
let ans
let tabledata=[]
let namejson={}
let k
//const [isschedule, setSchedule] = React.useState('false')
const user=localStorage.getItem('user_id')
var data ={"user":user}
var iterate={"iter":'1'}
fetch(Config.serverurl+"/publicinterview",{
        method:'POST',
    body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
    //localStorage.setItem("interdata",JSON.stringify(res))
        console.log(res)
        localStorage.setItem("intercand",JSON.stringify(res))
        //res=JSON.stringify(res)
        //console.log("details " + typeof(res)+res)

    setLoad(true)
    data=""
})

  if(isloaded){
   ans = localStorage.getItem('intercand')
        if(ans!="null"){
            let isspublic=true
        ans=JSON.parse(ans)
        ans=Object.entries(ans).map(([key, value]) => {
        k=Object.entries(iterate).map(([key1, value1]) => {
            return(
                <Link
                            to={{
                                pathname: "startinterview/",
                                state: {
                                    key: key,
                                    cid: value.user,
                                    ispublic : isspublic
                                }
                            }}
                        >Go To Interview</Link>
                )
        })
        namejson={name : value.name, cname: value.cname, role:value.role, togo:k}
        tabledata.push(namejson)
        namejson={}
        })
 }
 return(
        <MaterialTable
          columns={[
            { title: 'Interview Name', field: 'name' },
            { title: 'Company Name', field: 'cname' },
            { title: 'Role', field: 'role'},
            { title: 'Link', field: 'togo'}
          ]}
          data={tabledata}
          title={'Public Interviews'}
        />
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
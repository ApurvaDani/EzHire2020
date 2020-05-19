import React from "react"
import { useLocation } from "react-router-dom";
import MaterialTable from 'material-table'
import ReactLoading from 'react-loading';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Config from "../../Config.js"
import Auth from "../../Auth.js"
const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
   modal: {
    display: 'inline-grid',
    alignItems: 'center',
    justifyContent: 'center',
    overflow:'scroll',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



export default function TableList() {
  Auth()
  let interfbnames=[]
  let namejson={}
  let interviewname
  let pastinterview
  let statusint
  let [isloaded, setLoad] = React.useState('false')
  const classes = useStyles();
  let user=localStorage.getItem('user_id')
  var data ={"user": user}
  fetch(Config.serverurl+"/pastinterview",{
        method:'POST',
    body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
    localStorage.setItem("pastinterview",JSON.stringify(res))
    setLoad('true')
    data=""
})
if(isloaded=='true'){
  pastinterview=localStorage.getItem('pastinterview')
  if(pastinterview!="null"){
  pastinterview=JSON.parse(pastinterview)
  let result=Object.entries(pastinterview).map(([key, value]) => {
        //console.log(value)
        Object.entries(value['results']).map(([key1, value1]) => {
          console.log(key1 + " yoo "+user)
          if(key1==user){
            statusint=value1.Status
          }
          
        })
        namejson={cname : value.cname, role: value.role, location:value.location, status:statusint}
        interfbnames.push(namejson)
        namejson={}
    })
  return (

        <MaterialTable
          columns={[
            { title: 'Company Name', field: 'cname' },
            { title: 'Role', field: 'role' },
            { title: 'Job Location', field: 'location' },
            { title: 'Status', field: 'status'}
          ]}
          options={{
      selection: false
          }}
          data={interfbnames}
          title={"Interviews Taken"}
          //onSelectionChange={(rows) => handleselection(rows)}
          //onRowClick={(event,rowData) => viewResume()}
        />
  );
}
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

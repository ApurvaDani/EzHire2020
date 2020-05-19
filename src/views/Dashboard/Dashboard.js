import React,{useEffect} from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Open_Chatbot from "views/Open_Chatbot/Open_Chatbot.js"
import InterviewCard from "./InterviewCard.js"
import ReactLoading from 'react-loading';
import { bugs, website, server } from "variables/general.js";
import Config from "../../Config.js"
import Auth from "../../Auth.js"


import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

function loaddata(){

}

export default function Dashboard() {

  Auth()
  const classes = useStyles();
  let ans
  let count
  function openchat(){
    window.open("https://www.google.com/")
  }
const [isloaded, setLoad] = React.useState(false)
//const [isschedule, setSchedule] = React.useState('false')
const user=localStorage.getItem('user_id')
var data ={"user":user}
fetch(Config.serverurl+"/dashboardinterview",{
        method:'POST',
    body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
    //localStorage.setItem("interdata",JSON.stringify(res))
        localStorage.setItem("intercand",JSON.stringify(res))
        //res=JSON.stringify(res)
        //console.log("details " + typeof(res)+res)

    setLoad(true)
    data=""
})

  if(isloaded){
   ans = localStorage.getItem('intercand')
        if(ans!="null"){
        ans=JSON.parse(ans)
        count=0
        ans=Object.entries(ans).map(([key, value]) => {
        count=count+1
        return (
            <InterviewCard key={key} name={value.name} cname={value.cname} date={value.selectedDate} role={value.role} user={value.user} intkey={key} />
        )

    })
 }
  return (
    <div> 
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Scheduled Interviews</p>
              <h3 className={classes.cardTitle}>
                {count} <small></small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Get started below
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Interviews Given</p>
              <h3 className={classes.cardTitle}>8</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                See the stats in Past Interviews section
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Recruited By</p>
              <h3 className={classes.cardTitle}>4 <small> Companies </small></h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
               Thats a great number
              </div>
             </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Profile Reach</p>
              <h3 className={classes.cardTitle}>175+ <small>Recruiters </small></h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
       {ans}
        
      </GridContainer>
    </div>
  );
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

import React from "react"
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { makeStyles } from "@material-ui/core/styles";
import AccessTime from "@material-ui/icons/AccessTime";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Icon from "@material-ui/core/Icon"; 
import { Link } from 'react-router-dom'; 
import history from "history.js"
const useStyles = makeStyles(styles)
function InterCard(props){
  localStorage.removeItem('interview_schedule_name');
	const classes = useStyles();
  const [isloaded, setLoad] = React.useState('false')
  function handleClick(name){
   return
  }
 	return(
 	 <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
            <h4> {props.name} </h4>
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>{props.role}</h4>
              <h4 className={classes.cardTitle}>{props.opento}</h4>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />  <Link
                            to={{
                                pathname: "nameschedule",
                                state: {
                                    name: props.name,
                                    cid: props.cid,
                                    cname:props.cname
                                }
                            }}
                        >Schedule Interview</Link>
              </div>
            </CardFooter>
             <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />  <Link
                            to={{
                                pathname: "results",
                                state: {
                                    name: props.name,
                                    cid: props.cid,
                                    cname:props.cname
                                }
                            }}
                        >View Candidate Results</Link>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
 	)
 }

 export default InterCard
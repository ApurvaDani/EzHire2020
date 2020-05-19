import React from "react"
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Icon from "@material-ui/core/Icon";
import Open_Chatbot from "views/Open_Chatbot/Open_Chatbot.js"
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import LocalOffer from "@material-ui/icons/LocalOffer";
import ChartistGraph from "react-chartist";
import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";
import AccessTime from "@material-ui/icons/AccessTime";
import { Link } from 'react-router-dom'; 
const useStyles = makeStyles(styles)

export default function InterviewCard(props){

	const classes = useStyles();
	function openchat(event){

  }
	return(
		 <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="info">
            <h5 className={classes.cardTitle}><i><font color="white">{props.name}</font></i></h5>
            </CardHeader>
            <CardBody>
              <h3 className={classes.cardTitle}>{props.cname}</h3>
              <p className={classes.cardCategory}> {props.role} </p>
              <p className={classes.cardCategory}> {props.date} </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> <Link
                            to={{
                                pathname: "startinterview/",
                                state: {
                                    key: props.intkey,
                                    cid: props.user,
                                    ispublic: false
                                }
                            }}
                        >Go To Interview</Link>
              </div>
            </CardFooter>
            
          </Card>
        </GridItem>
		)
}

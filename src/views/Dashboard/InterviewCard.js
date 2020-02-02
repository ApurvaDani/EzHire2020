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
const useStyles = makeStyles(styles)

export default function InterviewCard(props){

	const classes = useStyles();
	function openchat(event){

    console.log(event.target.id)
  }
	return(
		 <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="danger">
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>{props.companyname}</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> <a href="" id={props.companyname} onClick={openchat}>Go to interview </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
		)
}
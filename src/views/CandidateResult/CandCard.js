import React,{useState, useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import avatar from "assets/img/faces/apurva.jpg";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PDFViewer from 'pdf-viewer-reactjs'
import ChartistGraph from "react-chartist";
import {Pie, Doughnut} from 'react-chartjs-2';
import history from 'history.js'
import Config from "../../Config.js"

 


const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles1 = makeStyles(theme => ({
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

const useStyles = makeStyles(styles);
//const useStyles1 = makeStyles(styles);
export default function CandCard(props){
	const classes = useStyles();
	const classes1 = useStyles1();
	const [open, setOpen] = React.useState(false);
  let ans
  let options
	function OpenModal(){
  const handleClose = () => {
        setOpen(false);
  };
	var data ={"cid": props.cid, "intid": props.intid, "user":props.user}
		fetch(Config.serverurl+"/interviewresults",{
        method:'POST',
		body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
    localStorage.setItem('result', JSON.stringify(res))
})
options={
width:"150px",
height:"150px",
donut:false
}
if(open){
let type="Pie"
   ans = localStorage.getItem('result')
   let graphdata
   let graphdata1
   let data5
   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const RADIAN = Math.PI / 180;
  let count=0
  let count2=0
  const label= ['Correct', 'Incorrect']
  const label2=['Easy', 'Medium', 'Hard']
        if(ans!="null"){
        ans=JSON.parse(ans)
        ans=Object.entries(ans).map(([key, value]) => {
  const data1 = {
  labels: ['Correct', 'Incorrect'],
  datasets: [
    {
      label: key,
      backgroundColor: [
        '#79088B',
        '#F91EE1'
      ],
      hoverBackgroundColor: [
      '#501800',
      '#4B5000'
      ],
      data: [value.total_score, value.out_of-value.total_score]
    }
  ]
}

const data2 = {
  labels: ['Easy', 'Medium', 'Hard'],
  datasets: [
    {
      label: key,
      backgroundColor: [
        '#0EF0F7',
        '#099CF6',
        '#0742F9'
      ],
      hoverBackgroundColor: [
      '#175000',
      '#003350',
      '#35014F'
      ],
      data: [value.easy_answered, value.medium_answered, value.hard_answered]
    }
  ]
}
const data3 = {
  datasets: [
    {
      backgroundColor: [
        '#A9A7A7',
        '#060606'
      ],
      hoverBackgroundColor: [
      '#175000',
      '#003350'
      ],
      data: [100-value.proficiency, value.proficiency]
    }
  ]
}
var prof = value.proficiency



        return (
            <GridContainer key={key}>
            <div class="col-md-3">
            <p>{key}</p>
             <Pie
          data={data1}
          options={{
            title:{
              display:true,
              text:'Correctness',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
        </div>
        <br />
        <div class="col-md-3">
         <Pie
          data={data2}
          options={{
            title:{
              display:true,
              text:'Level',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
        </div>
        <div class="col-md-3">
         <Pie
          data={data3}
          options={{
            title:{
              display:true,
              text:'Proficiency: '+ prof + '%',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            },
            cutoutPercentage:50
          }}
        />
        </div>

            </GridContainer>
        )
    })
  }
  else{
    return(<h1>Hi</h1>)
  }
}



  return (
  	 <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes1.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes1.paper}>
            <h2 id="transition-modal-title">Results</h2>
            <br />
              {ans}
          </div>
        </Fade>
      </Modal>
    </div>
  )
}
function viewResults(){
			setOpen(true)
}

function setfetch(){
  props.fetch()
}
function Accept(){
  var data ={"cid": props.cid, "intid": props.intid, "user":props.user}
    fetch(Config.serverurl+"/acceptcandidate",{
        method:'POST',
    body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
    alert('Candidate Result Updated!')
    history.push('/adminco/schedule')
})
}
function Decline(){
  var data ={"cid": props.cid, "intid": props.intid, "user":props.user}
    fetch(Config.serverurl+"/rejectcandidate",{
        method:'POST',
    body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
    alert('Candidate Result Updated!')
    history.push('/adminco/schedule')
})
}
	return(
		<GridItem xs={12} sm={12} md={4}>
		<OpenModal />
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardCategory}>Hey</h4>
              <h5 className={classes.cardTitle}>{props.fname} {props.lname}</h5>
              <p className={classes.cardTitle}> {props.email} </p>
              <p className={classes.description}>
               {props.aboutme}
              </p>
              <Button color="primary" round onClick={viewResults}>
                Show Results
              </Button>
              <div>
                <Button color="primary" round onClick={Accept}>
                Accept
              </Button>
              <Button color="primary" round onClick={Decline}>
                Decline
              </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>

      
   )
}

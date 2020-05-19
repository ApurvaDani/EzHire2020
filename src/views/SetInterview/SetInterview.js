import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Icon from "@material-ui/core/Icon";  
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import SaveIcon from '@material-ui/icons/Save';
import history from "history.js"
import Config from "../../Config.js"
import Auth from "../../Auth.js"

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const defaultProps = {
  borderColor: 'primary.main',
  m: 1,
  border: 1,
};
function SetInterview(){
  Auth()
	const classes = useStyles();
	const today = new Date()
	const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [degree, setDegree] = React.useState('');
  const [opento, setOpento] = React.useState('');
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [role, setRole] = React.useState('');
  const [description, setDescription] = React.useState('');

  function SubmitInterview(e){
    alert(name + role + location + selectedDate + degree + opento + description)
    e.preventDefault()
    const user=localStorage.getItem('user_id')
    const cname = localStorage.getItem('companyname')
    var data ={"name":name,"role":role,"location":location,"selectedDate":selectedDate,"degree":degree,"opento":opento,"description":description,"cname":cname, "user":user}
       fetch(Config.serverurl+"/companyinterview",{
        method:'POST',
        body:JSON.stringify(data),
      })
      .then(res => res.json())
        setDescription("")
        setSelectedDate("")
        setRole("")
        setLocation("")
        setName("")
        setDegree("")
        setOpento("")


    }
	return(
	<div>	
  <GridItem xs={12} sm={12} md={7}>
          <Card chart>
            <CardHeader color="danger">
            <h4><i><b>Interview Details</b></i></h4>
            </CardHeader>
            <CardBody>
              <form className={classes.root} id='form_interview' noValidate autoComplete="off">
  <TextField
    id="outlined-secondary"
    label="Interview Name"
    variant="outlined"
    color="secondary"
    value={name}
    onChange={(e)=>setName(e.target.value)}
  />
    <TextField
    id="outlined-secondary"
    label="Interview Role"
    variant="outlined"
    color="secondary"
    value={role}
    onChange={(e)=>setRole(e.target.value)}
  />
   <br />
    <TextField
    id="outlined-secondary"
    label="Job Location"
    variant="outlined"
    value={location}
    color="secondary"
    onChange={(e)=>setLocation(e.target.value)}
  />
     <TextField
    id="outlined-secondary"
    label="Interview Valid Till"
    variant="outlined"
    color="secondary"
    type="date"
    value={selectedDate}
    onChange={(e)=>setSelectedDate(e.target.value)}
  />

  <br />
   <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-helper-label">Degree Requirements</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={degree}
          onChange={(e)=>setDegree(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"UnderGraduate"}>UnderGraduate</MenuItem>
          <MenuItem value={"PostGraduate"}>PostGraduate</MenuItem>
          <MenuItem value={"Doctorate"}>Doctorate</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-helper-label">Open To?</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={opento}
          onChange={(e)=>setOpento(e.target.value)}
        >
          <MenuItem value={"Private"}>Private</MenuItem>
          <MenuItem value={"Public"}>Public</MenuItem>
        </Select>
      </FormControl>
  <br />
  <TextField
          id="standard-textarea"
          label="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          display="inline"
          style = {{width: 400}}
          multiline

   />
     <Button
        variant="contained"
        color="danger"
        size="large"
        className={classes.button}
        startIcon={<SaveIcon />}
        onClick={SubmitInterview}
      >
        Set Interview
      </Button>

</form>
            </CardBody>
            <CardFooter chart>
            </CardFooter>
          </Card>
        </GridItem>

</div>
		)
}
export default SetInterview
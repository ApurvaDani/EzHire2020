import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Input } from '@material-ui/core';
import history from "./history"
import Config from "./Config.js"

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Tab(props) {
  const classes = useStyles();
  const [page, setPage] = useState("")

  function changeViewee() {
    setPage(0)
  }


  return(
   <Grid container spacing={2}>
   <Grid item xs={12} sm={6}>
   <Button
   fullWidth
  variant="contained"
  color="primary"
  className={classes.submit}
  onClick={props.method}> Interviewee
  </Button>
 </Grid>
 <Grid item xs={12} sm={6}>
   <Button
   fullWidth
  variant="contained"
  color="primary"
  className={classes.submit}
  onClick={props.method1}> Interviewer
  </Button>
 </Grid>
 </Grid>

    )
}

function Interviewee(props){
    const classes = useStyles();
    const [ifname, isetfname]= useState("")
    const [ilname, isetlname]= useState("")
    const [iemail, isetemail]= useState("")
    const [ipass, isetpass]= useState("")
    const [icity, isetcity]= useState("")
    const [icode, isetcode]= useState("")
    const [iabtme, isetabtme]= useState("")
    function isubmit(e){
      e.preventDefault()
       var type="0"
       var data ={"firstName":ifname,"lastName":ilname,"email":iemail,"password":ipass,"city":icity,"postalCode":icode,"username" :iemail, "aboutMe":iabtme, "type":type}
       fetch(Config.serverurl+"/register",{
        method:'POST',
        body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
       if(res['success'] == "Successfull response"){
        history.push('/signin')
       }
       else{
        alert("Account creation failed due to one or many of the following results: \n1)Email already exists\n2)Password length is less than 6 characters.")
       }
      });
       
    }
    if(props.display===1)
    {

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(e)=>isetfname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={(e)=>isetlname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e)=>isetemail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e)=>isetpass(e.target.value)}
              />
            </Grid>
             <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="city"
                name="city"
                variant="outlined"
                required
                fullWidth
                id="city"
                label="City"
                autoFocus
                onChange={(e)=>isetcity(e.target.value)}
              />
            </Grid>
             <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="postalcode"
                name="postalcode"
                variant="outlined"
                required
                fullWidth
                id="postalcode"
                label="Postal Code"
                autoFocus
                onChange={(e)=>isetcode(e.target.value)}
              />
            </Grid>
             <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="aboutme"
                name="aboutme"
                variant="outlined"
                required
                fullWidth
                id="postalcode"
                label="About Me"
                autoFocus
                onChange={(e)=>isetabtme(e.target.value)}
                multiline
              />
            </Grid>
  
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={isubmit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
  else{
    return(null)
  }
}

function Interviewer(props){
    const classes = useStyles();
    const [ccname, csetcname]= useState("")
    const [cemail, csetemail]= useState("")
    const [cpass, csetpass]= useState("")
    const [ccity, csetcity]= useState("")
    
    function csubmit(e){
      e.preventDefault()
          var type="1"
          var data ={"companyname":ccname,"email":cemail,"password":cpass,"city":ccity,"type":type}
       alert(ccname+cemail+cpass+ccity)
       fetch(Config.serverurl+"/register",{
        method:'POST',
        body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
        let userprofile=res
        localStorage.setItem("userprofile",userprofile)
      });

       history.push('/signin')

    }
    if(props.display===0){
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="cname"
                name="companyname"
                variant="outlined"
                required
                fullWidth
                id="companyname"
                label="Company Name"
                autoFocus
                onChange={(e)=>csetcname(e.target.value)}

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="city_c"
                label="City"
                name="cityName"
                autoComplete="cname"
                onChange={(e)=>csetcity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e)=>csetemail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e)=>csetpass(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={csubmit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
  else{
    return(null)
  }
}

export default function SignUp() {
  const classes = useStyles();
  const [page, setPage]= useState(0)
  const setInterviewer = () => {
    setPage(1)
  }
    const setInterviewee = () => {
    setPage(0)
  }
  return(
   <div>
   <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Tab method={setInterviewer} method1={setInterviewee} />
      </div>
      </Container>
   <Interviewer display={page} />
   <Interviewee display={page} />
   </div>
   )
}
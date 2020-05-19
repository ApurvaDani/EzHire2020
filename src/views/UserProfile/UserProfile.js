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
import PropTypes from "prop-types";
// @material-ui/core components
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import Config from "../../Config.js"
import avatar from "assets/img/faces/apurva.jpg";
import Auth from "../../Auth.js"

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

const useStyles = makeStyles(styles);
 


export default function UserProfile() {
  Auth()
  const classes = useStyles();
  const [isLoad, setLoad] = React.useState("false")
  const [username, usetusername]= React.useState("")
  const [firstName, usetfirstName]= React.useState("")
  const [lastName, usetlastName]= React.useState("")
  const [email, usetemail]= React.useState("")
  const [city, usetcity]= React.useState("")
  const [postalCode,usetpostalCode]= React.useState("")
  const [aboutMe,usetaboutMe]= React.useState("")
  const [tl, setTL] = React.useState(false);
  let bot="bottom"
  let cen="center"
  React.useEffect(() => {
    // Specify how to clean up after this effect:
    return function cleanup() {
      // to stop the warning of calling setState of unmounted component
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  });
  const showNotification = place => {
    switch (place) {
      case "tl":
        if (!tl) {
          setTL(true);
          setTimeout(function() {
            setTL(false);
          }, 1000);
        }
      }
  }
  useEffect(() => {
  const user=localStorage.getItem('user_id')
  let data1 ={"user" : user}
  fetch(Config.serverurl+"/getprofile",{
     method:'POST',
    body:JSON.stringify(data1),
      })
      .then(res => res.json())
      .then(res =>{
      
  let userprofile=res
  if(isLoad=="false"){
  usetusername(userprofile.username)
  usetfirstName(userprofile.firstName)
  usetlastName(userprofile.lastName)
  usetemail(userprofile.email)
  usetcity(userprofile.city)
  usetpostalCode(userprofile.postalCode)
  usetaboutMe(userprofile.aboutMe)
  setLoad("true")
}
})
  })
  function updateprofile(){
    var data ={"fname": firstName,"lname":lastName,"email":email,"city":city,"code":postalCode,"aboutme" :aboutMe}
  }

  if(isLoad == "true"){
  

  return (
    <div>
    

      <GridContainer>

        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Username"
                    id="username"
                    inputProps={{
                      value:username,
                      onChange:(e) => usetusername(e.target.value)
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    disabled="True"
                    labelText="Email address"
                    id="email-address"
                     inputProps={{
                      value:email,
                      onChange:(e) => usetemail(e.target.value)
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    id="first-name"
                     inputProps={{
                      value:firstName,
                      onChange:(e) => usetfirstName(e.target.value)
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    id="last-name"
                     inputProps={{
                      value:lastName,
                      onChange:(e) => usetlastName(e.target.value)
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="City"
                    id="city"
                     inputProps={{
                      value:city,
                      onChange:(e) => usetcity(e.target.value)
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Postal Code"
                    id="postal-code"
                     inputProps={{
                      value:postalCode,
                      onChange:(e) => usetpostalCode(e.target.value)
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel>
                  <CustomInput
                    labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                    id="about-me"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value:aboutMe,
                      onChange:(e) => usetaboutMe(e.target.value),
                      multiline: true,
                      rows: 5
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={() => showNotification("tl")}>Update Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardCategory}>{city}</h4>
              <h5 className={classes.cardTitle}>{firstName} {lastName}</h5>
              <p className={classes.cardTitle}> {email} </p>
              <p className={classes.description}>
               {aboutMe}
              </p>
              <Button color="primary" round>
                Follow
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
       <Snackbar
                  place="tl"
                  color="info"
                  anchorOrigin={{bot}, {cen}}
                  icon={AddAlert}
                  message="Welcome to MATERIAL DASHBOARD React - a beautiful freebie for every web developer."
                  open={tl}
                />
    </div>
  )
 
}
else{
 return(
  <div>
  <h2>Loading </h2>
  </div>
  )

}
}

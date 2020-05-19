import React, {Component} from "react"
import { useLocation } from "react-router-dom";
import MaterialTable from 'material-table'
import ReactLoading from 'react-loading';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PDFViewer from 'pdf-viewer-reactjs'
import { useAlert, positions, Provider as AlertProvider } from 'react-alert'
import history from "history.js"
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
export default function ScheduleName(){
		Auth()
		const classes = useStyles();
		let location = useLocation();
		let interviewname
		let interviewid
		let companyid
		let namejson={}
		let userjson={}
		let [isloaded, setLoad] = React.useState('false')
		let [isscheduled, setSchedule] = React.useState(false)
  		const [open, setOpen] = React.useState(false);

  		const handleClose = () => {
    		setOpen(false);
  		};
		if(location.state){
		interviewname = location.state.name
		interviewid = location.state.cid
		companyid = location.state.cname
		var data ={"companyid": companyid, "interviewid": interviewid}
		fetch(Config.serverurl+"/interviewnames",{
        method:'POST',
		body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
		localStorage.setItem("internames",JSON.stringify(res))

		setLoad('true')
		data=""
})
		}
		else{
			interviewname="false"
		}
		

		var count
		let interviewusers = []
		let interfbnames = []
		let interuserid = []
 function OpenModal(){

  return (
  	 <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Resume</h2>
            <PDFViewer
            document={{
                url: 'https://arxiv.org/pdf/quant-ph/0410100.pdf',
            }}
        />
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

		function viewResume(){
			setOpen(true)
		}

		function handleselection(rows){
			interviewusers=[]
			for(count=0; count<rows.length;count++){
					interviewusers.push(rows[count].username)
			}
		}

		function ScheduleInterview(){
			let pos
			let finalnames=[]
			console.log(interuserid)
			console.log(interviewusers)
			Object.entries(interuserid).map(([key, value]) => {
				pos=interviewusers.indexOf(value.key)
				if(pos!==-1){
				finalnames.push(value.value)
			}

			}
			)
		var data ={"interviewname": finalnames, "interviewid" : interviewid, "companyid":companyid, "isTaken":'false'}
		console.log(data)
		setSchedule(true)
		fetch(Config.serverurl+"/schedulenames",{
        method:'POST',
		body:JSON.stringify(data),
      })
      .then(res => res.json())
      .then(res =>{
		setSchedule(false)
 		alert("Interview Scheduled")
 		history.push('/adminco/schedule')
})
			
		}		
		if(location.state){
		if(isloaded==='true'){
		let fbnames = localStorage.getItem('internames')
		fbnames=JSON.parse(fbnames)
		console.log(fbnames)
		let interviewidp
		let companyidp
		let interviewpresent
 		let result=Object.entries(fbnames).map(([key, value]) => {
 				if(value.type==0){
 				//interviewidp = location.state.cid
				//companyidp = location.state.cname
 				interviewpresent = value.interviews
 				console.log("Interviews inside "+ interviewpresent)
 				//interviewpresent = interviewpresent.companyidp
 				//interviewpresent = interviewpresent.interviewidp
 				if(true){
 				namejson={name : value.firstName, surname: value.lastName, username:value.username }
 				userjson = {key: value.username, value : key}
        		interfbnames.push(namejson)
        		interuserid.push(userjson)
        		}
        	}
        		namejson={}
    })
 		console.log(interfbnames)
		return(
			<div>
			<OpenModal />
		<MaterialTable
          columns={[
            { title: ' First Name', field: 'name' },
            { title: 'Last Name', field: 'surname' },
            { title: 'User Name', field: 'username'}
          ]}
          options={{
      selection: true
    			}}
          data={interfbnames}
          title={interviewname}
          onSelectionChange={(rows) => handleselection(rows)}
          onRowClick={(event,rowData) => viewResume()}
        />
        <Button
        variant="contained"
        color="danger"
        size="large"
        className={classes.button}
        onClick={ScheduleInterview}
      >
 		{isscheduled && <i className="fa fa-refresh fa-spin">  </i>}
        Schedule Interview
      </Button>
        </div>
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
		else{
			return(

			<h2> Please select an interview from Your Interviews Tab to proceed! </h2>
			)
		}

}
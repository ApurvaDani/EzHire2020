from flask import Flask, render_template,request,jsonify,session
import os
import requests
import pyrebase
from flask_cors import CORS,cross_origin
import json
import time
import pandas as pd
from flask_socketio import SocketIO, send,emit
from answer_evaluation_graph import main


app = Flask(__name__)
cors = CORS(app)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app, cors_allowed_origins="*")
config = {
    'apiKey': "AIzaSyCxI5iyU4O-9HLNI6zL6TwLhJVD1XxV9SQ",
    'authDomain': "ezhire-4d3b2.firebaseapp.com",
    'databaseURL': "https://ezhire-4d3b2.firebaseio.com",
    'projectId': "ezhire-4d3b2",
    'storageBucket': "ezhire-4d3b2.appspot.com",
    'messagingSenderId': "994011825630",
    'appId': "1:994011825630:web:f892a3aecf3b23f37c094f",
    'measurementId': "G-SSBXV8PB9Z"
}

firebase = pyrebase.initialize_app(config)

auth = firebase.auth()
app.secret_key = "abc"  
db=firebase.database()
storage=firebase.storage()

print("Hey")
@socketio.on('connect')
def on_connect():
	print("Heyaaaa")
	emit('my response', {'data': 'Connected'})


@socketio.on('message')
def handleMessage(msg):
	print('Message: ', msg)
	print(msg['message'])
	response = main(str(msg['message']))
	data={'mess':str(response)}
	emit('after-long-process',data)
	if(data['mess'] == 'Thank you!'):
		print("Storing data..")
		file="results.csv"
		file1="scores.csv"
		path=msg['cid']+"/"+msg['intid']+"/"+msg['user']+"/results.csv"
		path1=msg['cid']+"/"+msg['intid']+"/"+msg['user']+"/scores.csv"
		storage.child(path).put(file)
		storage.child(path1).put(file1)
		intdata={'Status' : 'Pending'}
		db.child("companyinterview").child(msg['cid']).child(msg['intid']).child('results').child(msg['user']).set(intdata)
		print("Data Stored")

	



@app.route('/', methods = ['GET', 'POST'])
def login():
	#print("Hello")
	if request.method == 'POST':
		print("Hey baby")
		response={'mess':"Login Successful"}
		#response.header.add('Access-Control-Allow-Origin','*')
		byte_data = request.get_data()
		my_string=byte_data.decode("utf-8")
		json_data=json.loads(my_string)
		#print("This is the react message bitch!!",json_data)
		email= json_data['email']
		password= json_data['password']
		#print("This is the react message bitch!!",json_data['message'])
		#print("Email is ",email)
		#print("Password is ",password)
		#print("Trying verification.....")
		#user = auth.sign_in_with_email_and_password(email,password)
		#time.sleep(20)
		#print("Sign in successful",user)
		#x=30+50
		#time.sleep(20)
		#print("Trying to return the message...")
		#response={'mess':"Login Successful Bitches!"}
		try:
			#print("Trying verification.....")
			user = auth.sign_in_with_email_and_password(email,password)
			#print("Sign in successful ",user)
			#print("The user_id is ",user['localId'])
			localid=user['localId'].replace('"','')
			user_profile=db.child("users").child(localid).get().val()
			user_profile=json.dumps(user_profile)
			print("After Login ",user_profile, type(user_profile))
			response={'mess':"Login Successful Bitch", 'user_data':user_profile, 'user_id' :localid}

			#return json.dumps(response)
		except Exception as e:
			#print(e)
			response={'mess':"Login Unsuccessful"}
			#return json.dumps(response)
		return json.dumps(response) 
		#return 'Hello World!!!'
	#return json.dumps(response)

@app.route('/signup', methods = ['GET', 'POST'])
def signup():
	#data={"Name":"Aadit Kachalia","Age":"21","email":"aaditkachalia@gmail.com"}
	if request.method == 'POST':
		user_key=request.get_data()
		user_id=user_key.decode("utf-8")
		#print("The user key is ",user_id)
		db=firebase.database()
		success={'success':"Successfull response"}
		user_id=user_id.replace('"','')   
		user_profile=db.child("users").child(user_id).get().val()
		#print("The details are....",user_profile)
		hey=json.dumps(user_profile)
		#print("YOYOYOYOYO",hey)
		#return json.dumps(user_profile)
	return json.dumps(hey)
@app.route('/scheduleinterview', methods = ['GET', 'POST'])
def scheduleinterview():
	if request.method == 'POST':
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		print(data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		print("JSON_Data is ", json_data, type(json_data))
		user=json_data['user']
		#user = unquote(user)
		#user=user.decode("utf-8")
		#user=user.strip()
		#user=user.replace("'",'') 
		print("User is ", user)
		interviewdata=db.child("companyinterview").child(user).get().val()
		#interviewdata=json.dumps(interviewdata)
		print(type(jsonify(interviewdata)),interviewdata)
	return(jsonify(interviewdata))

@app.route('/getprofile', methods = ['GET', 'POST'])
def getprofile():
	if request.method == 'POST':
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		print(data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		print("JSON_Data is ", json_data, type(json_data))
		user=json_data['user']
		#user = unquote(user)
		#user=user.decode("utf-8")
		#user=user.strip()
		#user=user.replace("'",'') 
		print("User is ", user)
		profiledata=db.child("users").child(user).get().val()
		#interviewdata=json.dumps(interviewdata)
		print(type(jsonify(profiledata)),profiledata)
	return(jsonify(profiledata))


@app.route('/dashboardinterview', methods = ['GET', 'POST'])
def dashboardinterview():
	if request.method == 'POST':
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		#print(data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		#print("JSON_Data is ", json_data, type(json_data))
		user=json_data['user']
		print(user)
		#user = unquote(user)
		#user=user.decode("utf-8")
		#user=user.strip()
		#user=user.replace("'",'') 
		#print("User is ", user)
		dashinterviews=db.child("users").child(user).child("interviews").get().val()
		dashinterviews=json.dumps(dashinterviews)
		dashinterviews=json.loads(dashinterviews)
		details={}
		intdet={}
		if(dashinterviews!=None):
			for i in dashinterviews.items():
				details[i[0]] = i[1]
			print("Details are ", details)
			for i in details.items():
				for j in i[1].items():
					taken = j[1]
					print(taken)
					taken=taken['isTaken']
					if(taken=='false'):
						interdetails = db.child("companyinterview").child(i[0]).child(j[0]).get().val()
						interdetails=json.dumps(interdetails)
						interdetails=json.loads(interdetails)
						intdet[j[0]] = interdetails
		#print(intdet)
		#interdetails=json.dumps(interdetails)
		#interdetails=json.loads(interdetails)
		#print(dashinterviews, type(dashinterviews))
		#interview=json.dumps(interviewdata)
		#print(type(jsonify(interviewdata)),interviewdata)

	return(intdet)
@app.route('/publicinterview', methods = ['GET', 'POST'])
def publicinterview():
	if request.method == 'POST':
		data=request.get_data()
		toshow=[]
		#user = urllib.unquote(data).decode('utf8')
		#print(data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		#print("JSON_Data is ", json_data, type(json_data))
		user=json_data['user']
		print(user)
		#user = unquote(user)
		#user=user.decode("utf-8")
		#user=user.strip()
		#user=user.replace("'",'') 
		#print("User is ", user)
		dashinterviews=db.child("companyinterview").get().val()
		dashinterviews=json.dumps(dashinterviews)
		dashinterviews=json.loads(dashinterviews)
		details={}
		intdet={}
		if(dashinterviews!=None):
			for i in dashinterviews.items():
				print("--------------Company----------------")
				x=i[1]
				for j in x.items():
					print("-----Interview-------")
					y=j[1]
					toshow=[]
					if(y['opento'] == 'Public'):
						if('candidates' in y):
							z=y['candidates']
							print(z)
							for a in z.items():
								toshow.append(a[1])
							if(user not in toshow):
								intdet[j[0]]=j[1]
						else:
							intdet[j[0]]=j[1]

			# print("Details are ", details)
			# for i in details.items():
			# 	for j in i[1].items():
			# 		taken = j[1]
			# 		print(taken)
			# 		taken=taken['isTaken']
			# 		if(taken=='false'):
			# 			interdetails = db.child("companyinterview").child(i[0]).child(j[0]).get().val()
			# 			interdetails=json.dumps(interdetails)
			# 			interdetails=json.loads(interdetails)
			# 			intdet[j[0]] = interdetails
		print(intdet)
		#interdetails=json.dumps(interdetails)
		#interdetails=json.loads(interdetails)
		#print(dashinterviews, type(dashinterviews))
		#interview=json.dumps(interviewdata)
		#print(type(jsonify(interviewdata)),interviewdata)

	return(intdet)

@app.route('/pastinterview', methods = ['GET', 'POST'])
def pastinterview():
	if request.method == 'POST':
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		#print(data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		#print("JSON_Data is ", json_data, type(json_data))
		user=json_data['user']
		print(user)
		#user = unquote(user)
		#user=user.decode("utf-8")
		#user=user.strip()
		#user=user.replace("'",'') 
		#print("User is ", user)
		dashinterviews=db.child("users").child(user).child("interviews").get().val()
		dashinterviews=json.dumps(dashinterviews)
		dashinterviews=json.loads(dashinterviews)
		details={}
		intdet={}
		if(dashinterviews!=None):
			for i in dashinterviews.items():
				details[i[0]] = i[1]
			print("Details are ", details)
			for i in details.items():
				for j in i[1].items():
					taken = j[1]
					taken=taken['isTaken']
					if(taken=='true'):
						interdetails = db.child("companyinterview").child(i[0]).child(j[0]).get().val()
						interdetails=json.dumps(interdetails)
						interdetails=json.loads(interdetails)
						intdet[j[0]] = interdetails
		#print(intdet)
		#interdetails=json.dumps(interdetails)
		#interdetails=json.loads(interdetails)
		#print(dashinterviews, type(dashinterviews))
		#interview=json.dumps(interviewdata)
		#print(type(jsonify(interviewdata)),interviewdata)
		print("Data to be sent", intdet)
	return(intdet)
@app.route('/interviewnames', methods = ['GET', 'POST'])
def interviewnames():
	if request.method == 'POST':
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		#print(data)
		alreadythere=[]
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		#print("JSON_Data is ", json_data, type(json_data))
		companyid=json_data['companyid']
		interviewid=json_data['interviewid']
		#user = unquote(user)
		#user=user.decode("utf-8")
		#user=user.strip()
		#user=user.replace("'",'') 
		#print("User is ", user)
		interviewdata=db.child("users").get().val()
		interviewdata=json.dumps(interviewdata)
		interviewdata=json.loads(interviewdata)
		candidates = db.child('companyinterview').child(companyid).child(interviewid).child('candidates').get().val()
		candidates=json.dumps(candidates)
		candidates=json.loads(candidates)
		print(candidates)
		if(candidates is not None):
			for i in candidates.items():
				alreadythere.append(i[1])
				print(interviewdata)
				interviewdata.pop(i[1])
			print(alreadythere)
		else:
			interviewdata=interviewdata
		print(type(jsonify(interviewdata)),interviewdata)
	return(jsonify(interviewdata))


@app.route('/candidateresult', methods = ['GET', 'POST'])
def candidateresult():
	if request.method == 'POST':
		canres={}
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		#print(data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		#print("JSON_Data is ", json_data, type(json_data))
		companyid=json_data['companyid']
		interviewid=json_data['interviewid']
		#user = unquote(user)
		#user=user.decode("utf-8")
		#user=user.strip()
		#user=user.replace("'",'') 
		#print("User is ", user)
		candidates=db.child("companyinterview").child(companyid).child(interviewid).child('results').get().val()
		candidates=json.dumps(candidates)
		candidates=json.loads(candidates)
		if(candidates!=None):
			for i in candidates.items():
				candidateuser=db.child("users").child(i[0]).get().val()
				candidateuser=json.dumps(candidateuser)
				candidateuser=json.loads(candidateuser)
				canres[i[0]]=candidateuser

		#interviewdata=json.dumps(interviewdata)
		#print(type(jsonify(interviewdata)),interviewdata)
	return(jsonify(canres))

@app.route('/schedulenames', methods = ['GET', 'POST'])
def schedulenames():
	if request.method == 'POST':
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		print("Data is ",data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		print("JSON_Data is ", json_data, type(json_data['interviewname']))
		names_list=json_data['interviewname']
		interviewid=json_data['interviewid']
		companyid = json_data['companyid']
		isTaken = {'isTaken' : 'false'}
		for names in names_list:
			#value={}
			#value[str(companyid)]=interviewid
			didset = db.child("users").child(names).child("interviews").child(companyid).child(interviewid).set(isTaken)
			print("Setting in child users ", didset)
			didset = db.child("companyinterview").child(companyid).child(interviewid).child('candidates').push(names)
		#user=json_data['user']
		#user = unquote(user)
		#user=user.decode("utf-8")
		#user=user.strip()
		#user=user.replace("'",'') 
		#print("User is ", user)
		#interviewdata=db.child("companyinterview").child(user).get().val()
		#interviewdata=json.dumps(interviewdata)
		#print(type(jsonify(interviewdata)),interviewdata)
	return(jsonify("Good to go!"))

@app.route('/finishinterview', methods = ['GET', 'POST'])
def finishinterview():
	if request.method == 'POST':
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		print("Data is ",data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		names=json_data['user']
		interviewid=json_data['interviewid']
		companyid = json_data['cname']
		ispublic= json_data['ispublic']
		isTaken = {'isTaken' : 'true'}
		print("Outpublic", ispublic)
		if(ispublic):
			didset = db.child("users").child(names).child("interviews").child(companyid).child(interviewid).set(isTaken)
			print("Setting in child users ", didset)
			didset = db.child("companyinterview").child(companyid).child(interviewid).child('candidates').push(names)
		else:
			didset = db.child("users").child(names).child("interviews").child(companyid).child(interviewid).set(isTaken)
			print("Taking Interview ",didset)
	return(jsonify("Good to go!"))

@app.route('/acceptcandidate', methods = ['GET', 'POST'])
def acceptcandidate():
	if request.method == 'POST':
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		print("Data is ",data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		user=json_data['user']
		interviewid=json_data['intid']
		companyid = json_data['cid']
		status = {'Status' : 'Accepted'}
		didset = db.child("companyinterview").child(companyid).child(interviewid).child('results').child(user).set(status)
		print(" Accepted ",didset)
	return(jsonify("Good to go!"))

@app.route('/rejectcandidate', methods = ['GET', 'POST'])
def rejectcandidate():
	if request.method == 'POST':
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		print("Data is ",data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		user=json_data['user']
		interviewid=json_data['intid']
		companyid = json_data['cid']
		status = {'Status' : 'Decline'}
		didset = db.child("companyinterview").child(companyid).child(interviewid).child('results').child(user).set(status)
		print(" Rejected ",didset)
	return(jsonify("Good to go!"))

@app.route('/interviewresults', methods = ['GET', 'POST'])
def interviewresults():
	if request.method == 'POST':
		result_res={}
		data=request.get_data()
		#user = urllib.unquote(data).decode('utf8')
		print("Data is ",data)
		json_data=data.decode("utf-8")
		#print(user)
		json_data=json.loads(json_data)
		user=json_data['user']
		interviewid=json_data['intid']
		companyid = json_data['cid']
		#isTaken = {'isTaken' : 'true'}
		path=companyid+"/"+interviewid+"/"+user+"/scores.csv"
		didset = storage.child(path).download("result_download.csv")
		df=pd.read_csv('result_download.csv')
		topic=df['topic'].tolist()
		count=0
		tosend={}
		for i in topic:
  			score={}
  			score['total_score']=int(df['total_score'][count])
  			score['out_of']=int(df['out_of'][count])
  			score['easy_answered']=int(df['easy_answered'][count])
  			score['medium_answered']=int(df['medium_answered'][count])
  			score['hard_answered']=int(df['hard_answered'][count])
  			score['proficiency'] = int(df['proficiency'][count])
  			tosend[i]=score
  			count=count+1

		
		#didset = db.child("users").child(user).child("interviews").child(companyid).child(interviewid).set(isTaken)
		print("Tosend ", tosend, type(tosend))
		tosend=json.dumps(tosend)
	return(tosend)

@app.route('/companyinterview', methods = ['GET', 'POST'])
def companyinterview():
	#data={"Name":"Aadit Kachalia","Age":"21","email":"aaditkachalia@gmail.com"}
	if request.method == 'POST':
		data=request.get_data()
		interviewdata=data.decode("utf-8")
		json_data=json.loads(interviewdata)
		print(interviewdata)
		user=json_data['user']
		#print("The user key is ",user_id)
		db=firebase.database()
		#success={'success':"Successfull response"}
		user=user.replace('"','')   
		didset = db.child("companyinterview").child(user).push(json_data)
		print(didset)
		#user_profile=db.child("users").child(user_id).get().val()
		#print("The details are....",user_profile)
		#hey=json.dumps(user_profile)
		#print("YOYOYOYOYO",hey)
		#return json.dumps(user_profile)
	return json.dumps("Success")

@app.route('/register', methods = ['GET', 'POST'])
def register():
	#data={"Name":"Aadit Kachalia","Age":"21","email":"aaditkachalia@gmail.com"}
	if request.method == 'POST':
		user_key=request.get_data()
		user_detail=user_key.decode("utf-8")
		json_data=json.loads(user_detail)
		#print("The json_data is ",json_data)
		db=firebase.database()
		email=json_data['email']
		password=json_data['password']
		x=auth.create_user_with_email_and_password(email, password)
		#user_id=x['localId']
		print("Account successfully created bitchhhhhh")
		user_id = auth.sign_in_with_email_and_password(email,password)
		print("userid is ",user_id)
		success={'success':"Successfull response"}
		# for element in json_data:
		# 	element.pop('password',True)
		localid=user_id['localId'].replace('"','')
		set_account = db.child("users").child(localid).set(json_data)
		#print("Successfully created")
		#user_id=user_id.replace('"','')   
		#user_profile=db.child("users").child(localid).get().val()
		#print("The details are....",user_profile)
		#hey=json.dumps(user_profile)
		#print("YOYOYOYOYO",hey)
		#return json.dumps(user_profile)
	return json.dumps(success)

@app.route('/dashboard',methods=['GET','POST'])
def dashboard():
	if request.method == 'POST':
		user_key=request.get_data()
		user_key=request.get_data()
		user_id=user_key.decode("utf-8")
		#print("The user key is ",user_id)
		db=firebase.database()
		final_interview={}
		success={'success':"Successfull Interview"}
		user_id=user_id.replace('"','') 
		#print("The user id is ",user_id)
		interview_detail = db.child("interview").get().val()
		#print("Before any processing ", interview_detail)
		interview_detail = json.dumps(interview_detail)
		interview_detail=json.loads(interview_detail)
		#print("interview_detail", len(interview_detail))
		if interview_detail is None:
			final_interview={}
		else:
			for i in interview_detail.items():
				print("Interview details", i)
				if i[1]["user_id"] == user_id:
					final_interview[i[0]] = i[1] 
			final_interview=json.dumps(final_interview)
	return json.dumps(final_interview)   

if __name__ == '__main__':
	socketio.run(app,debug=True,port=5000)
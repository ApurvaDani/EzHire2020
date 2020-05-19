import pandas as pd
import random
from sentence_transformers import SentenceTransformer
import scipy.spatial
import nltk
from nltk.corpus import stopwords 
from nltk.tokenize import word_tokenize


questionsdf = pd.read_csv("question-dataset.csv")

topics = questionsdf.topic.unique()
topicsList = topics.tolist()

answerDf = pd.read_csv("answer-dataset.csv")
answerList = answerDf.answer.tolist()
corpus = answerList


# followupQ = False

# add topics the interviewer wants to judge on
starTopic = []


embedder = SentenceTransformer('bert-base-nli-mean-tokens')
corpus_embeddings = embedder.encode(corpus)

resultDf = pd.DataFrame(columns=['questionid', 'topic', 'difficulty', 'question', 'userAnswer', 'score'])

	
counter = 0
topicScore = 0

currentTopic = ""

startCounter = 0

currentEasyQuestionsList = []

currentMediumQuestionsList = []

currentHardQuestionsList = []

greetings = ["Let's move to a new topic. ", "Great! Moving on, ", "Awesome! Moving forward.. ", "Moving on.. ", "Let's take this discussion forward. "]

fillers = []
lowScoreFillers = ["Are you nervous? Try taking a deep breath and relax. \n ", "Don't stress, you got this! \n "]
goodScoreFillers = ["Great answer, keep going! \n ", "Awesome! \n ", "Looks like you knew this one! \n ", "Good to see you know what you're talking about! \n ", "Absolutely correct! \n "]

def requiredDownloads():
	nltk.download('stopwords')
	nltk.download('punkt')
	
	main(topics) 



def evaluateAnswer(answer):

	global counter
	global topicScore
	global questionsdf
	global topics
	global answerDf
	global answerList
	global corpus
	global starTopic
	global embedder
	global corpus_embeddings
	global resultDf
	global currentTopic
	global nextQuestionId
	

	closest_n = 5

	topFive = []
	topFiveScores = []
	queries = [answer]
	query_embeddings = embedder.encode(queries)
	for (query, query_embedding) in zip(queries, query_embeddings):
		distances = scipy.spatial.distance.cdist([query_embedding],
		        corpus_embeddings, 'cosine')[0]

		results = zip(range(len(distances)), distances)
		results = sorted(results, key=lambda x: x[1])

		idealAnswerDf = answerDf.loc[answerDf['qid'] == nextQuestionId]
		topic = questionsdf.loc[questionsdf['id'] == nextQuestionId, 'topic'].iloc[0]
		nextQuestionDifficulty = questionsdf.loc[questionsdf['id'] == nextQuestionId, 'difficulty'].iloc[0]
		nextQuestion = questionsdf.loc[questionsdf['id'] == nextQuestionId, 'question'].iloc[0]

		idealAnswerScore = []
		for idealAnswer in idealAnswerDf.answer.tolist():

			ideal_text_tokens = word_tokenize(idealAnswer)
			idealAnswerWithoutSW = [word for word in ideal_text_tokens if not word in stopwords.words()]

			answer_tokens = word_tokenize(answer.lower())
			answerWithoutSW = [word for word in answer_tokens if not word in stopwords.words()]

			wordfreq = []
			for w in answerWithoutSW:
				wordfreq.append(answerWithoutSW.count(w))
    		
			if len(answerWithoutSW) < (len(idealAnswerWithoutSW) / 3) or max(wordfreq)>5:
				idealAnswerScore.append(0)
				rating = max(idealAnswerScore)
				continue

			for (idx, distance) in results[0:closest_n]:

    #             print(corpus[idx].strip(), "(Score: %.4f)" % (1-distance))

				topFive.append(corpus[idx].strip())
				topFiveScores.append(1 - distance)

			if idealAnswer in topFive:
				idealIndex = topFive.index(idealAnswer)

				rankScore = (5 - idealIndex) * 0.6
				print ("Rank Points: ", rankScore)

				differenceScore = topFiveScores[0] \
				    - topFiveScores[idealIndex]
				print ('difference score initial: ', differenceScore)
				if differenceScore > 0.3:
					differenceScore = 0
				elif differenceScore == 0:
					differenceScore = 1
				else:
					differenceScore = (5 - differenceScore * 16.67) \
						* 0.2

				print ('\n Difference Score: ', differenceScore)

				similarityScore = 5 * topFiveScores[idealIndex] * 0.2
				print ('\n Similarity Score: ', similarityScore)

				finalScore = round(rankScore + differenceScore + similarityScore)

				print ('\n Total points for this answer: ', finalScore)

				idealAnswerScore.append(finalScore)
			else:
				print("\n 0 points for this answer.")
				idealAnswerScore.append(0)

			rating = max(idealAnswerScore)

		resultDf = resultDf.append({'questionid': nextQuestionId, 'topic': topic, 'difficulty': nextQuestionDifficulty, 'question': nextQuestion, 'userAnswer': answer, 'score': rating}, ignore_index = True)

	return rating



def generateQuestion(topic, difficulty, followup = False):
	global counter
	global topicScore
	global questionsdf
	global topics
	global answerDf
	global answerList
	global corpus
	global starTopic
	global embedder
	global corpus_embeddings
	global resultDf
	global currentTopic
	global nextQuestionId
	global currentEasyQuestionsList
	global currentMediumQuestionsList
	global currentHardQuestionsList

	# topicDf = questionsdf[questionsdf['topic'] == currentTopic]
	# questionsDifficultyDf = topicDf[topicDf['difficulty'] == difficulty]
	# currentQuestionsList = questionsDifficultyDf.id.tolist()
	
	if followup == True:
		nextQuestionId = questionsdf.loc[questionsdf['id'] == nextQuestionId, 'followup'].iloc[0]
		nextQuestion = questionsdf.loc[questionsdf['id'] == nextQuestionId, 'question'].iloc[0]
		followup = False
		# return nextQuestion

	if difficulty == "E":
		nextQuestionId = random.choice(currentEasyQuestionsList)
		nextQuestion = questionsdf.loc[questionsdf['id'] == nextQuestionId, 'question'].iloc[0]

		currentEasyQuestionsList.remove(nextQuestionId)

	elif difficulty == "M":
		nextQuestionId = random.choice(currentMediumQuestionsList)
		nextQuestion = questionsdf.loc[questionsdf['id'] == nextQuestionId, 'question'].iloc[0]

		currentMediumQuestionsList.remove(nextQuestionId)

	elif difficulty == "H":
		nextQuestionId = random.choice(currentHardQuestionsList)
		nextQuestion = questionsdf.loc[questionsdf['id'] == nextQuestionId, 'question'].iloc[0]

		currentHardQuestionsList.remove(nextQuestionId)


	# nextQuestionId = random.choice(currentQuestionsList)
	# nextQuestion = questionsDifficultyDf.loc[questionsDifficultyDf['id'] == nextQuestionId, 'question'].iloc[0]

	# currentQuestionsList.remove()

	return nextQuestion


def topicWiseScoring(results):
	columns = ["topic", "easy_score", "medium_score", "hard_score", "easy_answered", "medium_answered", "hard_answered", "total_score", "out_of", "proficiency"]
	topicScores = pd.DataFrame(columns = columns)

	for topic in results.topic.unique():
		easy_score = medium_score = hard_score = 0
		easy_answered = medium_answered = hard_answered = 0
		total_score = 0
		proficiency = 0


		topicDf = results[results["topic"] == topic]

		out_of = 5 * (len(topicDf))

		if len(topicDf[topicDf['difficulty'] == "E"]) != 0:
			easy = topicDf[topicDf['difficulty'] == "E"]
			easy_score = easy.score.sum()
			easy_answered = len(easy)

			total_score = total_score + easy_score
			proficiency = proficiency + ((easy_score/(5*easy_answered))*25)

		if len(topicDf[topicDf['difficulty'] == "M"]) != 0:
			medium = topicDf[topicDf['difficulty'] == "M"]
			medium_score = medium.score.sum()
			medium_answered = len(medium)

			total_score = total_score + medium_score
			proficiency = proficiency + ((medium_score/(5*medium_answered))*40)
            
		if len(topicDf[topicDf['difficulty'] == "H"]) != 0:
			hard = topicDf[topicDf['difficulty'] == "H"]
			hard_score = hard.score.sum()
			hard_answered = len(hard)

			total_score = total_score + hard_score
			proficiency = proficiency + ((hard_score/(5*hard_answered))*35)

		proficiency = round(proficiency, -1)    
		topicScores = topicScores.append({"topic": topic, "easy_score": easy_score, "medium_score": medium_score, "hard_score": hard_score,
                                          "easy_answered": easy_answered, "medium_answered": medium_answered, "hard_answered": hard_answered,
                                          "total_score": total_score, "out_of": out_of, "proficiency": proficiency}, ignore_index = True)
        
	return topicScores

# def createQuestionsLists():

## MAIN:

def main(answer):

	global counter
	global topicScore
	global questionsdf
	global topics
	global answerDf
	global answerList
	global corpus
	global starTopic
	global embedder
	global corpus_embeddings
	global resultDf
	global topicsList
	global currentTopic
	global nextQuestionId
	global startCounter
	global currentEasyQuestionsList
	global currentMediumQuestionsList
	global currentHardQuestionsList
	global greetings
	global fillers
	global goodScoreFillers
	global lowScoreFillers

	if startCounter == 0:
		currentTopic = random.choice(topicsList)

		topicDf = questionsdf[questionsdf['topic'] == currentTopic]
		
		questionsDifficultyDf = topicDf[topicDf['difficulty'] == "E"]
		currentEasyQuestionsList = questionsDifficultyDf.id.tolist()
		currentEasyQuestionsList = [i for i in currentEasyQuestionsList if i < 9000]

		questionsDifficultyDf = topicDf[topicDf['difficulty'] == "M"]
		currentMediumQuestionsList = questionsDifficultyDf.id.tolist()
		currentMediumQuestionsList = [i for i in currentMediumQuestionsList if i < 9000]

		questionsDifficultyDf = topicDf[topicDf['difficulty'] == "H"]
		currentHardQuestionsList = questionsDifficultyDf.id.tolist()
		currentHardQuestionsList = [i for i in currentHardQuestionsList if i < 9000]


		nextQuestion = generateQuestion(currentTopic,"E")
		nextQuestion = "Let's get started! Here's your first question: " + nextQuestion
		startCounter += 1

	else: 

		currentAnswerScore = evaluateAnswer(answer)

		if questionsdf.loc[questionsdf['id'] == nextQuestionId, 'followup'].iloc[0] != 9999 and currentAnswerScore in range(2,5):
			nextQuestion = generateQuestion(currentTopic, "F", followup = True)
			# return nextQuestion

		else:
			topicScore = topicScore + currentAnswerScore

			if topicScore < 5 and counter < 2 and len(currentEasyQuestionsList) != 0:
				# difficulty = questionsdf.loc[questionsdf['id'] == nextQuestionId, 'difficulty'].iloc[0]
				# topic = questionsdf.loc[questionsdf['id'] == questionId, 'topic'].iloc[0]
				counter += 1
				
				nextQuestion = generateQuestion(currentTopic, "E")

				if counter == 2:
					nextQuestion = random.choice(lowScoreFillers) + nextQuestion

				
			elif topicScore in range(5,15) and counter < 4 and len(currentMediumQuestionsList) != 0:

				counter += 1
				nextQuestion = generateQuestion(currentTopic, "M")

				if counter == 2:
					nextQuestion = random.choice(goodScoreFillers) + nextQuestion
				elif counter == 4:
					nextQuestion = random.choice(lowScoreFillers) + nextQuestion

			elif topicScore in range(15,25) and counter < 6 and len(currentHardQuestionsList) != 0:
				counter += 1
				nextQuestion = generateQuestion(currentTopic, "H")

				if counter == 4:
					nextQuestion = random.choice(goodScoreFillers) + nextQuestion
				elif counter == 6:
					nextQuestion = random.choice(lowScoreFillers) + nextQuestion


			else:

				try:
					topicsList.remove(currentTopic)
					currentTopic = random.choice(topicsList)

					topicDf = questionsdf[questionsdf['topic'] == currentTopic]
					
					questionsDifficultyDf = topicDf[topicDf['difficulty'] == "E"]
					currentEasyQuestionsList = questionsDifficultyDf.id.tolist()
					currentEasyQuestionsList = [i for i in currentEasyQuestionsList if i < 9000]

					questionsDifficultyDf = topicDf[topicDf['difficulty'] == "M"]
					currentMediumQuestionsList = questionsDifficultyDf.id.tolist()
					currentMediumQuestionsList = [i for i in currentMediumQuestionsList if i < 9000]

					questionsDifficultyDf = topicDf[topicDf['difficulty'] == "H"]
					currentHardQuestionsList = questionsDifficultyDf.id.tolist()
					currentHardQuestionsList = [i for i in currentHardQuestionsList if i < 9000]

					counter = 0
					topicScore = 0

					nextQuestion = generateQuestion(currentTopic,"E")
					greet = random.choice(greetings)
					nextQuestion = greet + nextQuestion

					greetings.remove(greet)

				except:
					nextQuestion = "Thank you!"

					score_chartDf = topicWiseScoring(resultDf)
					scores_csv = score_chartDf.to_csv(r"scores.csv",index = None, header=True)
					export_csv = resultDf.to_csv(r"results.csv",index = None, header=True)
					
					
				# topicsList.remove(currentTopic)


	return nextQuestion



if __name__== "__main__":

	ques = main("")
	print(ques)

	while True:
		ans = input("your answer: ")
		ques = main(ans)
		print(ques)
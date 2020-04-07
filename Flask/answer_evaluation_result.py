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

#             print("\n First ideal answer:", idealAnswer)

#             idealAnswer = answerDf.loc[answerDf['qid'] == questionId, 'answer'].iloc[0]

    #         print("\n \n \n Ideal Answer: ", idealAnswer, "\n \n \n")

    #         Print all the results:
    #         print("\n\n======================\n\n")
    #         print("Query:", query)
    #         print("\nTop 5 most similar sentences in corpus:")

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

				idealAnswerScore.append(0)

			rating = max(idealAnswerScore)

		resultDf = resultDf.append({'questionid': nextQuestionId, 'topic': topic, 'difficulty': nextQuestionDifficulty, 'question': nextQuestion, 'userAnswer': answer, 'score': rating}, ignore_index = True)

	return rating


def generateQuestion(topic, difficulty):
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

	if startCounter == 0:
		currentTopic = random.choice(topicsList)

		topicDf = questionsdf[questionsdf['topic'] == currentTopic]
		
		questionsDifficultyDf = topicDf[topicDf['difficulty'] == "E"]
		currentEasyQuestionsList = questionsDifficultyDf.id.tolist()

		questionsDifficultyDf = topicDf[topicDf['difficulty'] == "M"]
		currentMediumQuestionsList = questionsDifficultyDf.id.tolist()

		questionsDifficultyDf = topicDf[topicDf['difficulty'] == "H"]
		currentHardQuestionsList = questionsDifficultyDf.id.tolist()


		nextQuestion = generateQuestion(currentTopic,"E")
		startCounter += 1

	else: 

		currentAnswerScore = evaluateAnswer(answer)

		topicScore = topicScore + currentAnswerScore

		if topicScore < 5 and counter < 2:
			# difficulty = questionsdf.loc[questionsdf['id'] == nextQuestionId, 'difficulty'].iloc[0]
			# topic = questionsdf.loc[questionsdf['id'] == questionId, 'topic'].iloc[0]
			counter += 1
			nextQuestion = generateQuestion(currentTopic, "E")

			
		elif topicScore in range(5,15) and counter < 4:

			counter += 1
			nextQuestion = generateQuestion(currentTopic, "M")

		elif topicScore in range(15,25) and counter < 6:
			counter += 1
			nextQuestion = generateQuestion(currentTopic, "H")


		else:

			try:
				topicsList.remove(currentTopic)
				currentTopic = random.choice(topicsList)

				topicDf = questionsdf[questionsdf['topic'] == currentTopic]
				
				questionsDifficultyDf = topicDf[topicDf['difficulty'] == "E"]
				currentEasyQuestionsList = questionsDifficultyDf.id.tolist()

				questionsDifficultyDf = topicDf[topicDf['difficulty'] == "M"]
				currentMediumQuestionsList = questionsDifficultyDf.id.tolist()

				questionsDifficultyDf = topicDf[topicDf['difficulty'] == "H"]
				currentHardQuestionsList = questionsDifficultyDf.id.tolist()

				counter = 1
				topicScore = 0

				nextQuestion = generateQuestion(currentTopic,"E")
			except:
				nextQuestion = "Thank you for interviewing with us! We will get back with the results shortly."

				export_csv = resultDf.to_csv("results.csv",index = None, header=True)
				
				
			# topicsList.remove(currentTopic)


	return nextQuestion



if __name__== "__main__":

	ques = main("")
	print(ques)

	while True:
		ans = input("your answer: ")
		ques = main(ans)
		print(ques)
	














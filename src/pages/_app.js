import { useState, useEffect } from "react"
import QuestionBox from "./QuestionBox"
import { v4 as uuidv4 } from "uuid"
import Confetti from "react-confetti"
import PropTypes from "prop-types"

function WelcomeScreen({ onStart }) {
	return (
		<div>
			<main className='welcome-screen'>
				<h1>Quizzical</h1>
				<h2>
					Unleash your inner trivia enthusiast <br /> in a thrilling journey
					through knowledge!
				</h2>
				<button onClick={onStart}>Start quiz</button>
			</main>
		</div>
	)
}

WelcomeScreen.propTypes = {
	onStart: PropTypes.func.isRequired,
}

async function getQA() {
	try {
		const res = await fetch(
			"https://opentdb.com/api.php?amount=5&category=11&difficulty=easy&type=multiple"
		)
		const data = await res.json()

		return data.results.map(result => {
			const answers = [result.correct_answer, ...result.incorrect_answers]
			for (let i = answers.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[answers[i], answers[j]] = [answers[j], answers[i]]
			}
			return {
				question: result.question,
				answers: answers,
				correctAnswer: result.correct_answer,
				id: uuidv4(),
			}
		})
	} catch (error) {
		console.log("error:", error)
		return null
	}
}

function QuizScreen({ onPlayAgain }) {
	const [questions, setQuestions] = useState([])
	const [correctAnswers, setCorrectAnswers] = useState([])
	const [userAnswers, setUserAnswers] = useState([])
	const [summary, setSummary] = useState("")
	const [checkAnswers, setCheckAnswers] = useState(false)
	const [showConfetti, setShowConfetti] = useState(false)

	useEffect(() => {
		if (
			checkAnswers &&
			userAnswers.every((answer, index) => answer === correctAnswers[index])
		) {
			setShowConfetti(true)
		}
	}, [checkAnswers, correctAnswers, userAnswers])

	useEffect(() => {
		getQA().then(data => {
			if (data) {
				const correctAnswers = data.map(
					questionData => questionData.correctAnswer
				)
				setQuestions(data)
				setCorrectAnswers(correctAnswers)
				setUserAnswers(Array(data.length).fill(null))
			}
		})
	}, [])

	useEffect(() => {
		if (checkAnswers) {
			let correctAnswersCount = 0
			for (let i = 0; i < correctAnswers.length; i++) {
				if (correctAnswers[i] === userAnswers[i]) {
					correctAnswersCount++
				}
			}

			setSummary(
				`You scored ${correctAnswersCount}/${questions.length} correct answers!`
			)
		}
	}, [userAnswers, correctAnswers, checkAnswers, questions.length])

	function handleClick() {
		setCheckAnswers(true)
	}

	function handleAnswerSelected(questionIndex, answer) {
		setUserAnswers(prevAnswers => {
			const newAnswers = [...prevAnswers]
			newAnswers[questionIndex] = answer
			return newAnswers
		})
	}

	function playAgain() {
		setQuestions([])
		setCorrectAnswers([])
		setUserAnswers([])
		setSummary("")
		setCheckAnswers(false)
		onPlayAgain()
	}

	return (
		<div>
			<main className='quiz-screen'>
				{questions.map((questionData, index) => (
					<QuestionBox
						key={questionData.id}
						question={questionData.question}
						answers={questionData.answers}
						correctAnswer={questionData.correctAnswer}
						questionIndex={index}
						handleAnswerSelected={handleAnswerSelected}
						checkAnswers={checkAnswers}
					/>
				))}

				{!checkAnswers && <button onClick={handleClick}>Check answers</button>}

				<p>{summary}</p>
				{checkAnswers && <button onClick={playAgain}>Play again</button>}
			</main>
			{showConfetti && <Confetti />}
		</div>
	)
}

QuizScreen.propTypes = {
	onPlayAgain: PropTypes.func.isRequired,
}

function App() {
	const [quizStarted, setQuizStarted] = useState(false)

	function handlePlayAgain() {
		setQuizStarted(false)
	}

	return (
		<div>
			{quizStarted ? (
				<QuizScreen onPlayAgain={handlePlayAgain} />
			) : (
				<WelcomeScreen onStart={() => setQuizStarted(true)} />
			)}
		</div>
	)
}

export default App

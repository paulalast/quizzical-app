import { useState, useEffect } from "react"
import PropTypes from "prop-types"

function QuestionBox({
	question,
	answers,
	correctAnswer,
	questionIndex,
	handleAnswerSelected,
	checkAnswers,
}) {
	const [selectedAnswer, setSelectedAnswer] = useState(null)

	function handleAnswer(event) {
		const answer = event.target.value
		setSelectedAnswer(answer)
	}

	function normalText(text) {
		const textArea = document.createElement("textarea")
		textArea.innerHTML = text
		return textArea.value
	}

	useEffect(() => {
		if (checkAnswers) {
			handleAnswerSelected(questionIndex, selectedAnswer)

			answers.forEach((answer, index) => {
				if (answer !== selectedAnswer) {
					const labelElement = document.querySelector(
						`label[for="answer-${questionIndex}-${index}"]`
					)
					labelElement.classList.add("fade")
				}
			})
		}
	}, [
		checkAnswers,
		answers,
		handleAnswerSelected,
		questionIndex,
		selectedAnswer,
	])

	return (
		<div className='question-box'>
			<h2 className='question'>{normalText(question)}</h2>
			<div className='answers-box'>
				{answers.map((answer, index) => (
					<div key={index}>
						<input
							type='radio'
							id={`answer-${questionIndex}-${index}`}
							name={question}
							value={answer}
							checked={selectedAnswer === answer}
							onChange={handleAnswer}
							disabled={checkAnswers}
						/>
						<label
							htmlFor={`answer-${questionIndex}-${index}`}
							className={
								checkAnswers
									? selectedAnswer === null
										? answer === correctAnswer
											? "correct"
											: ""
										: selectedAnswer === answer
										? answer === correctAnswer
											? "correct"
											: "incorrect"
										: answer === correctAnswer
										? "correct"
										: ""
									: ""
							}
						>
							{normalText(answer)}
						</label>
					</div>
				))}
			</div>
		</div>
	)
}

QuestionBox.propTypes = {
	question: PropTypes.string.isRequired,
	answers: PropTypes.arrayOf(PropTypes.string).isRequired,
	correctAnswer: PropTypes.string.isRequired,
	questionIndex: PropTypes.number.isRequired,
	handleAnswerSelected: PropTypes.func.isRequired,
	checkAnswers: PropTypes.bool.isRequired,
}

export default QuestionBox

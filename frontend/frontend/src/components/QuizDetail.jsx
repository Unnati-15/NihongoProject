import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdvancedNavbar from './AdvancedNavbar';

const QuizDetail = () => {
    const { quizId,levelId,categoryId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch quiz details and its questions
        axios.get(`http://127.0.0.1:8000/api/quizzes/${quizId}/`)
            .then((response) => setQuiz(response.data))
            .catch((error) => console.error('Error fetching quiz:', error));

        axios.get(`http://127.0.0.1:8000/api/levels/${levelId}/categories/${categoryId}/quizzes/${quizId}/questions/`)
            .then((response) => setQuestions(response.data))
            .catch((error) => console.error('Error fetching questions:', error));
    }, [levelId,categoryId,quizId]);

    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            const index = newAnswers.findIndex(answer => answer.questionId === questionId);
            if (index !== -1) {
                newAnswers[index] = { questionId, answerId };
            } else {
                newAnswers.push({ questionId, answerId });
            }
            return newAnswers;
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = () => {
        axios.post(`http://127.0.0.1:8000/api/submit-quiz/`, { answers: selectedAnswers })
            .then(response => {
                setQuizSubmitted(true);
            })
            .catch(error => console.error('Error submitting quiz:', error));
    };

    if (quizSubmitted) {
        return (
            <div>
                <h1>Quiz Submitted</h1>
                <button onClick={() => navigate('/')}>Go back to Home</button>
            </div>
        );
    }

    return (
        <>
        <AdvancedNavbar/>
        <div>
            {quiz && (
                <>
                    <h1>{quiz.title}</h1>
                    <p>{quiz.description}</p>

                    {questions.length > 0 && (
                        <div>
                            <h3>Question {currentQuestionIndex + 1} of {questions.length}</h3>
                            <div>
                                <p>{questions[currentQuestionIndex].question_text}</p>
                                <ul>
                                    {questions[currentQuestionIndex].answers.map((answer) => (
                                        <li key={answer.id}>
                                            <input
                                                type="radio"
                                                name={`question-${questions[currentQuestionIndex].id}`}
                                                value={answer.id}
                                                checked={selectedAnswers.find(ans => ans.questionId === questions[currentQuestionIndex].id && ans.answerId === answer.id)}
                                                onChange={() => handleAnswerChange(questions[currentQuestionIndex].id, answer.id)}
                                            />
                                            {answer.answer_text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                {currentQuestionIndex > 0 && (
                                    <button onClick={handlePrevQuestion}>Previous</button>
                                )}
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button onClick={handleNextQuestion}>Next</button>
                                ) : (
                                    <button onClick={handleSubmitQuiz}>Submit Quiz</button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div></>
    );
};

export default QuizDetail;

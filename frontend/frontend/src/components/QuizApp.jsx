import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvancedNavbar from './AdvancedNavbar';
import { Link } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Confetti from 'react-confetti';
import { ClipLoader } from 'react-spinners';

export const QuizApp = () => {
    const [levels, setLevels] = useState([]);
    const [categories, setCategories] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedQuiz, setSelectedQuiz] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [loadingLevels, setLoadingLevels] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [error, setError] = useState(null);
    const [learnerInfo, setLearnerInfo] = useState({});
    const [quizInfo, setQuizInfo] = useState({});
    const [questionDetails, setQuestionDetails] = useState([]);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [attemptDate, setAttemptDate] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const scorePercentage = (score / totalScore) * 100;
    // const [timeLeft, setTimeLeft] = useState(null);
    // const [timerId, setTimerId] = useState(null);

    // const startTimer = (timeLimit) => {
    //     // Ensure timeLeft is set to the quiz time limit when starting the timer
    //     setTimeLeft(timeLimit);
    
    //     const id = setInterval(() => {
    //         setTimeLeft((prevTime) => {
    //             if (prevTime <= 0) {
    //                 clearInterval(id); // Stop the timer if time runs out
    //                 handleSubmitQuiz(); // Automatically submit the quiz when time is up
    //                 return 0;
    //             }
    //             return prevTime - 1; // Decrease time by 1 second
    //         });
    //     }, 1000);
    
    //     setTimerId(id); // Store the timer ID for cleanup
    // };
    
    // const formatTime = (timeInSeconds) => {
    //     const minutes = Math.floor(timeInSeconds / 60);
    //     const seconds = timeInSeconds % 60;
    //     return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    // };
    // Fetch levels on component mount
    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/levels/');
                setLevels(response.data);
            } catch (err) {
                setError('Failed to load levels');
            } finally {
                setLoadingLevels(false);
            }
        };
        fetchLevels();
    }, []);

    // Fetch categories when a level is selected
    useEffect(() => {
        const fetchCategories = async () => {
            if (!selectedLevel) return;

            setLoadingCategories(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/levels/${selectedLevel}/categories/`);
                setCategories(response.data);
            } catch (err) {
                setError('Failed to load categories');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [selectedLevel]);

    // Fetch quizzes when a category is selected
    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!selectedCategory || !selectedLevel) return;

            setLoadingQuizzes(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/levels/${selectedLevel}/categories/${selectedCategory}/quizzes/`);
                const quizData = response.data;

            // Set quiz info and time limit
            setQuizzes(quizData);
            
            } catch (err) {
                setError('Failed to load quizzes');
            } finally {
                setLoadingQuizzes(false);
            }
        };
        fetchQuizzes();
    }, [selectedCategory, selectedLevel]);

    // useEffect(() => {
    //     // Cleanup timer when component is unmounted or when timerId changes
    //     return () => clearInterval(timerId);
    // }, [timerId]);

    // Fetch questions when a quiz is selected
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!selectedQuiz || !selectedCategory || !selectedLevel) return;
    
            setLoadingQuestions(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/levels/${selectedLevel}/categories/${selectedCategory}/quizzes/${selectedQuiz}/questions`);
                const queData = response.data;
                setQuestions(queData);
            //     console.log(queData);
            //     console.log(queData.question.time_limit);
            //     setTimeLeft(queData.questions.time_limit);
            //     startTimer(queData.questions.time_limit);
            // console.log('Time Limit:', queData.question.time_limit);
                // setTimeLeft(queData.time_limit); // Ensure this is in seconds
                // startTimer(queData.time_limit); // Start the timer after the time limit is set
                
                // console.log('Time Limit:', queData.time_limit);
            } catch (err) {
                setError('Failed to load questions');
            } finally {
                setLoadingQuestions(false);
            }
        };
        fetchQuestions();
    }, [selectedQuiz, selectedCategory, selectedLevel]);

    useEffect(() => {
        if (quizSubmitted) {
            setIsModalVisible(true);
        }
    }, [quizSubmitted]);

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const onLevelSelect = (levelId) => {
        setSelectedLevel(levelId);
        setCategories([]);
        setSelectedCategory('');
        setQuizzes([]);
        setSelectedQuiz('');
        setQuestions([]);
        setCurrentQuestionIndex(0);
    };

    const onCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setQuizzes([]);
        setSelectedQuiz('');
        setQuestions([]);
        setCurrentQuestionIndex(0);
    };

    const onQuizSelect = (quizId) => {
        setSelectedQuiz(quizId);
        setQuestions([]);
        // setTimeLeft('');
        // startTimer('');
        setCurrentQuestionIndex(0);
    };

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

    const handleSubmitQuiz = async () => {
        // Format the selected answers to match the backend structure
        const formattedAnswers = selectedAnswers.map((answer) => ({
            question_id: answer.questionId,
            answer_id: answer.answerId,
        }));

        // Make a POST request to the backend to submit the quiz
        try {
            const response = await axios.post('http://127.0.0.1:8000/submit-quiz/', {
                quiz_id: selectedQuiz,  // Send the selected quiz ID
                answers: formattedAnswers,  // Send the selected answers
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            setQuizSubmitted(true);
            setLearnerInfo(response.data.learner);
            setQuizInfo(response.data.quiz);
            setAttemptDate(response.data.quiz.attempt_date);
            setQuestionDetails(response.data.question_details);
            setTotalAttempts(response.data.total_attempts);
            setScore(response.data.quiz.score);
            setTotalScore(response.data.quiz.total_score);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            setError('There was an error submitting your quiz.');
        }
    };

    if (quizSubmitted) {
        return (
            <main>
                <AdvancedNavbar />
                <div className="my-8 p-6 bg-white shadow-lg rounded-lg text-center">
                    {/* Show Confetti if score is 80% or more */}
                    {score >= totalScore * 0.8 && <Confetti />}
    
                    {/* Score Text and Percentage */}
                    <h3 className="text-3xl font-bold mb-2">Your Score</h3>
                    <p className="text-4xl font-extrabold text-indigo-600">{score} / {totalScore}</p>
                    <p className="text-lg">({scorePercentage.toFixed(2)}%)</p>
    
                    {/* Emojis/Icons Based on Score */}
                    <div className="mt-4">
                        {score === totalScore ? (
                            <p className="text-yellow-500 text-4xl">🏆 Perfect Score!</p>
                        ) : score >= totalScore * 0.7 ? (
                            <p className="text-green-500 text-4xl">😊 Well done!</p>
                        ) : (
                            <p className="text-red-500 text-4xl">😞 Better luck next time!</p>
                        )}
                    </div>
    
                    {/* Circular Progress Bar */}
                    <div className="w-40 h-40 mx-auto mt-6">
                        <CircularProgressbar
                            value={scorePercentage}
                            text={`${score} / ${totalScore}`}
                            styles={{
                                path: {
                                    stroke: scorePercentage >= 80 ? '#4caf50' : scorePercentage >= 50 ? '#ff9800' : '#f44336',
                                },
                                text: {
                                    fill: scorePercentage >= 80 ? '#4caf50' : scorePercentage >= 50 ? '#ff9800' : '#f44336',
                                    fontSize: '16px',
                                },
                            }}
                        />
                    </div>
    
                    {/* Button to View Feedback */}
                    <div className="mt-6">
                        <p className="text-lg">Your score: {score} / {totalScore}</p>
                        <button
                            className="btn btn-outline mt-4"
                            onClick={() => setIsModalVisible(true)}
                        >
                            <Link to="/profile">View Feedback</Link>
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <AdvancedNavbar />
            <div className="min-h-screen max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto p-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg space-y-8 mt-4 mb-40">
                {error && <p className="text-red-600 text-center text-xl font-semibold">{error}</p>}
    
                {/* Level Selection */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Select Level</h2>
                    {loadingLevels ? (
                        <div className="flex justify-center">
                            <ClipLoader size={50} color="#fff" />
                        </div>
                    ) : (
                        <select
                            className="select select-bordered w-full max-w-lg rounded-xl  text-lg"
                            onChange={(e) => onLevelSelect(e.target.value)}
                            value={selectedLevel}
                        >
                            <option value="">-- Select Level --</option>
                            {levels.map(level => (
                                <option key={level.id} value={level.id}>{level.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Category Selection */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Select Category</h2>
                    {loadingCategories ? (
                        <div className="flex justify-center">
                            <ClipLoader size={50} color="#fff" />
                        </div>
                    ) : (
                        <select
                            className="select select-bordered w-full max-w-lg rounded-xl  text-lg"
                            onChange={(e) => onCategorySelect(e.target.value)}
                            disabled={!selectedLevel}
                        >
                            <option value="">-- Select Category --</option>
                            {categories.length > 0 ? (
                                categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))
                            ) : (
                                <option value="">No categories available</option>
                            )}
                        </select>
                    )}
                </div>

                {/* Quiz Selection */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Select Quiz</h2>
                    {loadingQuizzes ? (
                        <div className="flex justify-center">
                            <ClipLoader size={50} color="#fff" />
                        </div>
                    ) : (
                        <select
                            className="select select-bordered w-full max-w-lg rounded-xl  text-lg"
                            onChange={(e) => onQuizSelect(e.target.value)}
                            disabled={!selectedCategory}
                        >
                            <option value="">-- Select Quiz --</option>
                            {quizzes.length > 0 ? (
                                quizzes.map(quiz => (
                                    <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                                ))
                            ) : (
                                <option value="">No quizzes available</option>
                            )}
                        </select>
                    )}
                </div>

                {/* Question Display and Answer Selection */}
                {loadingQuestions ? (
                    <div className="flex justify-center">
                        <ClipLoader size={50} color="#fff" />
                    </div>
                ) : (
                    questions.length > 0 && (
                        <div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">Question</h2>
                                {/* <div className="text-center">
    <p className="text-2xl text-white font-semibold">Time Remaining: {formatTime(timeLeft)}</p>
</div> */}
                                <div className="p-6 bg-white shadow-xl rounded-xl">
                                    <p className="text-lg font-medium">{questions[currentQuestionIndex].question_text}</p>
                                    <ul className="space-y-3 mt-4">
                                        {questions[currentQuestionIndex].answers.map((answer) => (
                                            <li key={answer.id} className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    name={`question-${questions[currentQuestionIndex].id}`}
                                                    value={answer.id}
                                                    checked={selectedAnswers.find(ans => ans.questionId === questions[currentQuestionIndex].id && ans.answerId === answer.id)}
                                                    onChange={() => handleAnswerChange(questions[currentQuestionIndex].id, answer.id)}
                                                    className="h-5 w-5 text-indigo-600"
                                                />
                                                <span>{answer.answer_text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-between space-x-4 mt-8">
                                {currentQuestionIndex > 0 && (
                                    <button
                                        className="btn btn-secondary py-2 px-6 text-white rounded-lg transition-all duration-200 transform hover:bg-indigo-600"
                                        onClick={handlePrevQuestion}
                                    >
                                        Previous
                                    </button>
                                )}
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                        className="btn btn-primary py-2 px-6 text-white rounded-lg transition-all duration-200 transform hover:bg-indigo-600"
                                        onClick={handleNextQuestion}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-success py-2 px-6 text-white rounded-lg transition-all duration-200 transform hover:bg-green-600"
                                        onClick={handleSubmitQuiz}
                                    >
                                        Submit Quiz
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        </main>
    );
};

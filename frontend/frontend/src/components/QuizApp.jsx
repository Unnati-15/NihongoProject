import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    const [attemptDate, setAttemptDate] = useState('');

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
                setQuizzes(response.data);
            } catch (err) {
                setError('Failed to load quizzes');
            } finally {
                setLoadingQuizzes(false);
            }
        };
        fetchQuizzes();
    }, [selectedCategory, selectedLevel]);

    // Fetch questions when a quiz is selected
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!selectedQuiz || !selectedCategory || !selectedLevel) return;

            setLoadingQuestions(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/levels/${selectedLevel}/categories/${selectedCategory}/quizzes/${selectedQuiz}/questions`);
                setQuestions(response.data);
            } catch (err) {
                setError('Failed to load questions');
            } finally {
                setLoadingQuestions(false);
            }
        };
        fetchQuestions();
    }, [selectedQuiz, selectedCategory, selectedLevel]);

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
            setScore(response.data.quiz.score); // Get the score from the response
        } catch (error) {
            console.error('Error submitting quiz:', error);
            setError('There was an error submitting your quiz.');
        }
    };

    if (quizSubmitted) {
        return (
            <main>
            <AdvancedNavbar/>
            <div className="p-8 bg-white rounded-xl shadow-md">
                <h1 className="text-3xl font-bold text-center text-green-600">Quiz Submitted</h1>
                <div className="mt-6">
                    <h2 className="text-xl font-bold">Learner Information</h2>
                    <p><strong>Username:</strong> {learnerInfo.username}</p>
                    <p><strong>Email:</strong> {learnerInfo.email}</p>

                    <h2 className="text-xl font-bold mt-4">Quiz Information</h2>
                    <p><strong>Quiz Title:</strong> {quizInfo.title}</p>
                    <p><strong>Your Score:</strong> {score}</p>
                    <p><strong>Attempt Date:</strong> {new Date(attemptDate).toLocaleString()}</p>

                    <h2 className="text-xl font-bold mt-4">Question Details</h2>
                    {questionDetails.map((question) => (
                        <div key={question.question_id} className="border p-4 mt-2 rounded-md">
                            <p><strong>Question:</strong> {question.question_text}</p>
                            <p><strong>Selected Answer:</strong> {question.selected_answer}</p>
                            <p><strong>Correct Answer:</strong> {question.correct_answer}</p>
                            <p><strong>Is Correct:</strong> {question.is_correct ? "Yes" : "No"}</p>
                        </div>
                    ))}

                    <h2 className="text-xl font-bold mt-4">Total Attempts</h2>
                    <p>{totalAttempts} attempts made for this quiz.</p>

                    <button className="btn btn-primary mt-6" onClick={() => window.location.reload()}>Go back to Home</button>
                </div>
            </div></main>
        );
    }

    return (
        <main>
            <AdvancedNavbar/>
        
        <div className="p-8 bg-gray-100 rounded-xl shadow-md">
            {error && <p className="text-red-600">{error}</p>}

            {/* Level Selection */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Select Level</h2>
                {loadingLevels ? (
                    <p className="text-center">Loading levels...</p>
                ) : (
                    <select
                        className="select select-bordered w-full max-w-xs"
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
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Select Category</h2>
                {loadingCategories ? (
                    <p className="text-center">Loading categories...</p>
                ) : (
                    <select
                        className="select select-bordered w-full max-w-xs"
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
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Select Quiz</h2>
                {loadingQuizzes ? (
                    <p className="text-center">Loading quizzes...</p>
                ) : (
                    <select
                        className="select select-bordered w-full max-w-xs"
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
                <p className="text-center">Loading questions...</p>
            ) : (
                questions.length > 0 && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold mb-2">Question</h2>
                            <div className="p-4 bg-white border rounded-lg shadow-md">
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
                        </div>

                        <div className="flex justify-between">
                            {currentQuestionIndex > 0 && (
                                <button className="btn btn-secondary" onClick={handlePrevQuestion}>Previous</button>
                            )}
                            {currentQuestionIndex < questions.length - 1 ? (
                                <button className="btn btn-primary" onClick={handleNextQuestion}>Next</button>
                            ) : (
                                <button className="btn btn-success" onClick={handleSubmitQuiz}>Submit Quiz</button>
                            )}
                        </div>
                    </div>
                )
            )}
        </div>
        </main>
    );
};

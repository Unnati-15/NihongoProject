import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
    const [levels, setLevels] = useState([]); // List of levels
    const [selectedLevel, setSelectedLevel] = useState(null); // Selected level
    const [categories, setCategories] = useState([]); // List of categories for selected level
    const [selectedCategory, setSelectedCategory] = useState(null); // Selected category
    const [quizzes, setQuizzes] = useState([]); // List of quizzes for selected category
    const [questions, setQuestions] = useState([]); // List of questions for selected quiz
    const [selectedQuiz, setSelectedQuiz] = useState(null); // Selected quiz
    const [userAnswers, setUserAnswers] = useState({}); // User's answers
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    // Fetch levels on component mount
    useEffect(() => {
        axios.get("http://localhost:8000/api/levels/")
            .then(response => {
                setLevels(response.data);
            })
            .catch(error => console.error("Error fetching levels:", error));
    }, []);

    // Fetch categories when level is selected
    const handleLevelChange = (e) => {
        const levelId = e.target.value;
        setSelectedLevel(levelId);
        setSelectedCategory(null); // Reset selected category
        setCategories([]); // Reset categories before fetching

        // Fetch categories based on selected level
        axios.get(`http://localhost:8000/api/levels/${levelId}/`)
            .then(response => {
                console.log("Categories response:", response.data);
                setCategories(response.data.categories || []); // Assuming response has `categories` field
            })
            .catch(error => console.error("Error fetching categories:", error));
    };

    // Fetch quizzes when category is selected
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setQuizzes([]); // Reset quizzes before fetching

        // Fetch quizzes based on selected category
        axios.get(`http://localhost:8000/api/categories/${categoryId}/`)
            .then(response => {
                setQuizzes(response.data.quizzes || []); // Assuming response has `quizzes` field
            })
            .catch(error => console.error("Error fetching quizzes:", error));
    };

    // Fetch questions for the selected quiz
    const handleQuizSelect = (quizId) => {
        setSelectedQuiz(quizId);
        
        // Fetch questions for the selected quiz
        axios.get(`http://localhost:8000/api/questions/${quizId}/`)
            .then(response => setQuestions(response.data))
            .catch(error => {
                console.error("Error fetching questions:", error);
                alert("Failed to load questions. Please try again.");
            });
    };

    // Handle user's answer change
    const handleAnswerChange = (questionId, answerId) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answerId
        }));
    };

    // Submit quiz
    const handleSubmitQuiz = () => {
        setLoading(true); // Show loading indicator

        const answers = Object.keys(userAnswers).map(questionId => ({
            question_id: questionId,
            answer_id: userAnswers[questionId]
        }));

        axios.post(`http://localhost:8000/submit-quiz/${selectedQuiz}/`, answers)
            .then(response => {
                const { correct_answers, total_questions, score } = response.data;
                console.log(response.data);

                // Navigate to the quiz result page with the results
                navigate(`/quiz-result`, { state: { correct_answers, total_questions, score } });
            })
            .catch(error => {
                console.error("Error submitting quiz:", error);
                alert("Failed to submit quiz. Please try again.");
            })
            .finally(() => {
                setLoading(false); // Hide loading indicator after submission
            });
    };

    // Disable submit button if not all questions are answered
    const isSubmitDisabled = questions.length > 0 && Object.keys(userAnswers).length !== questions.length;

    return (
        <div className="container mx-auto p-4">
            {/* Select Level */}
            <div className="form-control">
                <label className="label">Select Level</label>
                <select className="select select-bordered" onChange={handleLevelChange} value={selectedLevel}>
                    <option value="">Select Level</option>
                    {levels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                </select>
            </div>

            {/* Select Category */}
            {selectedLevel && (
                <div className="form-control mt-4">
                    <label className="label">Select Category</label>
                    <select className="select select-bordered" onChange={handleCategoryChange} value={selectedCategory}>
                        <option value="">Select Category</option>
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))
                        ) : (
                            <option>No categories available</option>
                        )}
                    </select>
                </div>
            )}

            {/* Available Quizzes */}
            {selectedCategory && (
                <div className="mt-4">
                    <h3 className="text-xl">Available Quizzes</h3>
                    <ul>
                        {quizzes.map(quiz => (
                            <li key={quiz.id} className="mt-2">
                                <button className="btn btn-primary" onClick={() => handleQuizSelect(quiz.id)}>
                                    Start Quiz: {quiz.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Questions for selected quiz */}
            {selectedQuiz && (
                <div className="mt-4">
                    <h3 className="text-xl">Questions for Quiz: {selectedQuiz}</h3>
                    <ul>
                        {questions.map(question => (
                            <li key={question.id} className="mt-2">
                                <p><strong>{question.question_text}</strong></p>
                                <ul>
                                    {question.answers.map(answer => (
                                        <li key={answer.id}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`question_${question.id}`}
                                                    value={answer.id}
                                                    checked={userAnswers[question.id] === answer.id}
                                                    onChange={() => handleAnswerChange(question.id, answer.id)}
                                                />
                                                {answer.answer_text}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Submit Quiz */}
            {selectedQuiz && questions.length > 0 && (
                <div className="mt-4">
                    <button 
                        className="btn btn-primary" 
                        onClick={handleSubmitQuiz} 
                        disabled={isSubmitDisabled || loading}>
                        {loading ? "Submitting..." : "Submit Quiz"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;

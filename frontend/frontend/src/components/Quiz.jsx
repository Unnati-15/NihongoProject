import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // For error messages
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/levels/")
      .then(response => setLevels(response.data))
      .catch(err => {
        console.error("Error fetching levels:", err);
        setError("Failed to load levels. Please try again later.");
      });
  }, []);

  const handleLevelChange = (e) => {
    const levelId = e.target.value;
    setSelectedLevel(levelId);
    setSelectedCategory(null); // Reset category selection when level changes
    setQuizzes([]);
    setQuestions([]);
    setUserAnswers({});
    axios.get(`http://localhost:8000/api/categories/${levelId}/`)
      .then(response => setCategories(response.data))
      .catch(err => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      });
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setQuizzes([]);
    setQuestions([]);
    setUserAnswers({});
    axios.get(`http://localhost:8000/api/quizzes/${categoryId}/`)
      .then(response => setQuizzes(response.data))
      .catch(err => {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      });
  };

  const handleQuizSelect = (quizId) => {
    setSelectedQuiz(quizId);
    setUserAnswers({}); // Reset answers when selecting a new quiz
    axios.get(`http://localhost:8000/api/questions/${quizId}/`)
      .then(response => setQuestions(response.data))
      .catch(err => {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again.");
      });
  };

  const handleAnswerChange = (questionId, answerId) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answerId
    }));
  };

//   const handleSubmitQuiz = async () => {
//     setLoading(true);

//     const answers = Object.keys(userAnswers).map(questionId => {
//       const selectedAnswerId = userAnswers[questionId];
//       const question = questions.find(q => q.id === parseInt(questionId));
//       const selectedAnswer = question.answers.find(a => a.id === selectedAnswerId);

//       return {
//         learner: localStorage.getItem('username'),  // Use actual logged-in user ID here
//         question: questionId,
//         selected_answer: selectedAnswerId,
//         time_taken: 10,  // Time logic if needed
//       };
//     });
//     console.log(answers);
    
//     // Get the token from localStorage (or sessionStorage)
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert("User not authenticated!");
//       return;
//     }

//     try {
//       // Fetch learner ID by username (if not stored) and send quiz answers
//       const username = localStorage.getItem('username');
//       const userResponse = await axios.get(`http://localhost:8000/user_by_username/${username}/`, {
//         headers: {
//           Authorization: `Token ${token}`,
//         }
//       });

//       const learnerId = userResponse.data.id;

//       // Now use learner ID instead of username
//       const answersWithLearnerId = answers.map(answer => ({
//         ...answer,
//         learner: learnerId, // Replace username with learner ID
//       }));

//       // Send the answers to the backend with the token in the headers
//       const response = await axios.post(`http://localhost:8000/submit-quiz/${selectedQuiz}/`, answersWithLearnerId, {
//         headers: {
//           Authorization: `Token ${token}` // Include the token in the request headers
//         }
//       });
//       console.log(response.data);
//       const { correct_answers, total_questions, score } = response.data;
//       navigate(`/quiz-result`, { state: { correct_answers, total_questions, score } });

//     } catch (err) {
//       console.error("Error submitting quiz:", err);
//       setError("Failed to submit quiz. Please try again.");
//     } finally {
//       setLoading(false); // Hide loading indicator after submission
//     };
//   };
const handleSubmitQuiz = async () => {
  setLoading(true);
  const answers = Object.keys(userAnswers).map(questionId => {
      const selectedAnswerId = userAnswers[questionId];
      const question = questions.find(q => q.id === parseInt(questionId));
      const selectedAnswer = question.answers.find(a => a.id === selectedAnswerId);

      return {
          learner: localStorage.getItem('username'), // Ensure learner is an integer
          question: parseInt(questionId), // Ensure question is an integer
          selected_answer: selectedAnswerId,
          time_taken: 10,  // Assuming this is the time taken for the quiz
      };
  });

  // Log the data to verify it's in the right structure and format
  console.log(answers);

  // Get the token from localStorage (or sessionStorage)
  const token = localStorage.getItem('token');
  if (!token) {
      alert("User not authenticated!");
      return;
  }

  try {
      // Fetch learner ID by username (if not stored) and send quiz answers
      const username = localStorage.getItem('username');
      const userResponse = await axios.get(`http://localhost:8000/user_by_username/${username}/`, {
          headers: {
              Authorization: `Token ${token}`,
          }
      });

      const learnerId = userResponse.data.id;
      console.log(learnerId);

      // Now use learner ID instead of username
      const answersWithLearnerId = answers.map(answer => ({
          ...answer,
          learner: learnerId, // Replace username with learner ID
      }));

      // Wrap answers in an array (API expects a list of answers)
      const response = await axios.post(`http://localhost:8000/submit-quiz/${selectedQuiz}/`, answersWithLearnerId, {
          headers: {
              Authorization: `Token ${token}` // Include the token in the request headers
          }
      });
      console.log(response.data);
      const { correct_answers, total_questions, score } = response.data;
      navigate(`/quiz-result`, { state: { correct_answers, total_questions, score } });
  
  } catch(err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
  } finally {
      setLoading(false); // Hide loading indicator after submission
  };
};


  const isSubmitDisabled = questions.length > 0 && Object.keys(userAnswers).length !== questions.length;
console.log(selectedQuiz);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Quiz Selection</h1>

      {error && <div className="text-red-500 mt-4">{error}</div>} {/* Display error message */}

      <div className="form-control mt-4">
        <label className="label">Select Level</label>
        <select
          className="select select-bordered"
          onChange={handleLevelChange}
          value={selectedLevel || ""}
        >
          <option value="">Select Level</option>
          {levels.map(level => (
            <option key={level.id} value={level.id}>{level.name}</option>
          ))}
        </select>
      </div>

      {selectedLevel && (
        <div className="form-control mt-4">
          <label className="label">Select Category</label>
          <select
            className="select select-bordered"
            onChange={handleCategoryChange}
            value={selectedCategory || ""}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedCategory && (
        <div className="mt-4">
          <h3 className="text-xl">Available Quizzes</h3>
          <ul>
            {quizzes.map(quiz => (
              <li key={quiz.id} className="mt-2">
                <button
                  className="btn btn-primary"
                  onClick={() => handleQuizSelect(quiz.id)}
                >
                  Start Quiz: {quiz.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedQuiz && questions.length > 0 && (
        
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

          <div className="mt-4">
            <button
              className="btn btn-primary"
              onClick={handleSubmitQuiz}
              disabled={isSubmitDisabled || loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Submit Quiz"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;

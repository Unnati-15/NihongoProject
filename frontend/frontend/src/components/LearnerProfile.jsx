import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdvancedNavbar from './AdvancedNavbar';

const SkillLevelButton = ({ learnerId, currentSkillLevel }) => {
  const [skillLevel, setSkillLevel] = useState(currentSkillLevel);

  // Function to handle the button click and update the skill level
  const handleSkillLevelChange = async (newSkillLevel) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/update-skill-level/${learnerId}/`, {
        skill_level: newSkillLevel,
      });
      setSkillLevel(response.data.skill_level); // Update the state with the new skill level
      console.log('Skill level updated:', response.data);
    } catch (error) {
      console.error('Error updating skill level:', error);
    }
  };
return (
  <div className="mb-8">
    <p className="text-lg font-semibold">After clicking this button please logout and then login again to access particular skill level specific facilities</p>
    <button
      onClick={() => handleSkillLevelChange('beginner')}
      className="btn btn-primary mx-2 mt-2 text-center"
    >
      Set to Beginner
    </button>
    
  </div>
);
};
const LearnerProfile = () => {
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [learnerData, setLearnerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('profile');
  useEffect(() => {
    const fetchLearnerData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/learner/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.length > 0) {
          setLearnerData(response.data[0]); // Set the first learner object
        } else {
          setError('No learner data found.');
        }
        setLoading(false);
      } catch (err) {
        setError('Error fetching learner data.');
        setLoading(false);
      }
    };
    fetchLearnerData();
  }, []);
  

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/learner-quiz-attempts/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        setQuizAttempts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching quiz data.');
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const filteredQuizAttempts = quizAttempts.filter((attempt) =>
    attempt.quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
  );

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">{error}</div>;
  }

  if (filteredQuizAttempts.length === 0) {
    return <div className="text-center text-xl text-gray-600">No quiz attempts available.</div>;
  }
console.log(learnerData.skill_level);

  return (
    <>
    <AdvancedNavbar/>
    <div className="profile-container p-8 max-w-7xl mx-auto mb-40">
      
{/* Navigation Buttons */}
<div className="mb-8 flex justify-center gap-6">
  <button
    onClick={() => setCurrentView('profile')}
    className={`btn px-6 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform 
    ${currentView === 'profile' ? 'bg-teal-600 text-white shadow-xl' : 'bg-gray-200 text-teal-600 hover:bg-teal-600 hover:text-white hover:scale-105'}`}
  >
    Learner Profile
  </button>
  <button
    onClick={() => setCurrentView('quiz')}
    className={`btn px-6 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform 
    ${currentView === 'quiz' ? 'bg-teal-600 text-white shadow-xl' : 'bg-gray-200 text-teal-600 hover:bg-teal-600 hover:text-white hover:scale-105'}`}
  >
    Quiz Results
  </button>
  <button
    onClick={() => setCurrentView('skillLevel')}
    className={`btn px-6 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform 
    ${currentView === 'skillLevel' ? 'bg-teal-600 text-white shadow-xl' : 'bg-gray-200 text-teal-600 hover:bg-teal-600 hover:text-white hover:scale-105'}`}
  >
    Skill Level
  </button>
</div>

 {/* Learner Info */}
{currentView === 'profile' && learnerData && (<>
  <div className="card-body items-center text-center max-w-lg mx-auto font-semibold p-6 rounded-xl shadow-2xl bg-gradient-to-r from-green-100 via-green-100 to-green-100 mb-8">
    <h2 className="text-3xl font-extrabold text-teal-700 mb-4">{learnerData.user.username}'s Profile</h2>
    
    <div className="mb-4">
      <p className="text-lg text-teal-600 flex items-center justify-center space-x-2">
        
        <strong>Name:</strong> {learnerData.user?.first_name || 'N/A'} {learnerData.user?.last_name || ''}
      </p>
    </div>

    <div className="mb-4">
      <p className="text-lg text-teal-600 flex items-center justify-center space-x-2">
        
        <strong>Email:</strong> {learnerData.user?.email || 'N/A'}
      </p>
    </div>

    <div className="mb-6">
      <p className="text-lg text-teal-600 flex items-center justify-center space-x-2">
        
        <strong>Skill Level:</strong> {learnerData.skill_level || 'N/A'}
      </p>
    </div>

    <div className="flex justify-center gap-4">
      <button className="btn px-6 py-2 text-md font-semibold rounded-full bg-teal-600 text-white hover:bg-teal-500 transform transition-all duration-300">
        Edit Profile
      </button>
      <button onClick={() => setCurrentView('skillLevel')} className="btn px-6 py-2 text-md font-semibold rounded-full border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transform transition-all duration-300">
        Change Skill Level
      </button>
    </div>
  </div>
</>)}

{/* Skill Level Button */}
{/* <SkillLevelButton learnerId={learnerData.id} currentSkillLevel={learnerData.skill_level} /> */}

{currentView === 'quiz' && (<>
  <h1 className="text-4xl font-semibold text-center text-teal-600 mb-8">Your Quiz Attempts</h1>

  {/* Search Bar */}
  <div className="mt-6 mb-6 flex justify-center items-center gap-4">
    <button className="btn btn-primary mx-auto text-md font-semibold bg-teal-600 hover:bg-teal-700 transition duration-300 px-6 py-2 rounded-md shadow-lg">
      <Link to='/quiz' className="text-white">Back to Quiz</Link>
    </button>
    <input
      type="text"
      placeholder="Search by quiz title..."
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold mx-auto text-teal-600"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  {/* Cards for each quiz attempt */}
  <div className="space-y-6">
    {filteredQuizAttempts.map((attempt, index) => {
      // Calculate total score
      const totalQuestions = attempt.question_details.length;
      const correctAnswers = attempt.question_details.filter(q => q.is_correct).length;
      const scorePercentage = (correctAnswers / totalQuestions) * 100;

      // Circle circumference calculation
      const radius = 18; // Circle radius
      const circumference = 2 * Math.PI * radius; // Full circle length (circumference)

      // Calculate stroke dasharray for the score percentage
      const strokeDasharray = (scorePercentage / 100) * circumference;

      return (
        <div key={index} className="relative bg-white shadow-lg rounded-lg overflow-hidden border-l-4 border-teal-500 transform transition duration-500 hover:scale-105">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-teal-600">{attempt.quiz.title}</h3>
            <p className="text-gray-600 text-sm">{new Date(attempt.attempt_date).toLocaleString()}</p>

            {/* Progress Bar */}
            <div className="mt-6 w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-teal-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>

            {/* Score Percentage and Badge */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <span className="text-teal-500 font-semibold text-xl">{Math.round(scorePercentage)}%</span>
              <span
                className={`px-3 py-1 rounded-full text-white font-semibold 
                  ${scorePercentage === 100 ? 'bg-green-500' : 
                    scorePercentage >= 75 ? 'bg-teal-500' : 
                    scorePercentage >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
              >
                {scorePercentage === 100 ? 'Excellent' : 
                  scorePercentage >= 75 ? 'Good' : 
                  scorePercentage >= 50 ? 'Needs Improvement' : 'Try Again'}
              </span>
            </div>

            {/* Questions Section */}
            <div className="mt-6 space-y-4">
              {attempt.question_details.map((questionDetail, qIndex) => (
                <div key={qIndex} className="mb-4 p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-xl transition duration-300 ease-in-out">
                  <h4 className="font-semibold text-teal-600">{questionDetail.question.question_text}</h4>
                  <div className="mt-2 text-sm text-gray-700">
                    <p><strong>Selected Answer:</strong> {questionDetail.selected_answer.answer_text}</p>
                    <p><strong>Correct Answer:</strong> {questionDetail.correct_answer.answer_text}</p>
                    <p className={`font-bold mt-2 ${questionDetail.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                      {questionDetail.is_correct ? 'Correct' : 'Incorrect'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider between attempts */}
            {index < filteredQuizAttempts.length - 1 && (
              <div className="mt-6 border-t-2 border-teal-100"></div>
            )}
          </div>
        </div>
      );
    })}
  </div>
</>)}

{currentView === 'skillLevel' && (
  <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 className="text-3xl font-semibold text-teal-600 mb-6 text-center">Manage Skill Level</h1>
    
    <p className="text-lg text-gray-700 mb-4 text-center">
      Want to learn advanced Japanese then click here to change your skill level
    </p>

    <div className="flex justify-center mt-4">
      <SkillLevelButton 
        learnerId={learnerData.id} 
        currentSkillLevel={learnerData.skill_level} 
      />
    </div>

    {/* Optional Divider */}
    <div className="mt-8 border-t-2 border-teal-200"></div>

    {/* Skill Level Info */}
    <div className="mt-6 text-center text-gray-600">
      <p className="font-medium text-lg">
        <strong>Your current skill level:</strong> {learnerData.skill_level || 'Not set'}
      </p>
    </div>
  </div>
)}


    </div></>
  );
};

export default LearnerProfile;

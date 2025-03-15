import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import MainPage from "./components/MainPage";
import MainNavbar from "./components/MainNavbar";
import LearnerRegistration from "./components/LearnerRegistration";
import UserLogin from "./components/UserLogin";
import UserLogout from "./components/UserLogout";
import BeginnerPages from "./components/BeginnerPages";
import AdvancedPages from "./components/AdvancedPages";
import Phrases from "./components/Phrases";
import About from "./components/About";
import Contact from "./components/Contact";
import TranslateForm from "./components/TranslateForm";
import FileUpload from "./components/FileUpload";
import Resources from "./components/Resources";
import HiraganaLearning from "./components/HiraganaLearning";
import KatakanaLearning from "./components/KatakanaLearning";
import KanjiLearning from "./components/KanjiLearning";
import Quiz from "./components/Quiz";
import QuizResult from "./components/QuizResult";
import { FlashCard } from "./components/FlashCard";
import { More } from "./components/More";
import Write from "./components/Write";
import FlashcardApp from "./components/FlashcardApp";
import QuizDetail from "./components/QuizDetail";
import { QuizApp } from "./components/QuizApp";
const App = () => {
  const [token, setToken] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedSkillLevel = localStorage.getItem('skill_level');

    if (storedToken && storedSkillLevel) {
      setToken(storedToken);
      setSkillLevel(storedSkillLevel);
    }
  }, []);

  return (
    <Router>
      <Helmet>
        <title>Kantanna Nihongo</title>
      </Helmet>
      <MainApp token={token} skillLevel={skillLevel} setToken={setToken} />
    </Router>
  );
};

// MainApp: The part of the app where routing happens

// eslint-disable-next-line react/prop-types
const MainApp = ({ token, skillLevel, setToken }) => {
  const location = useLocation(); // This will now work because it's inside Router
  const showMainNavbar = !['/beginner-pages', '/advanced-pages','/phrases','/hiragana','/katakana','/kanji','/quiz','/write','/flashcard','/more'].includes(location.pathname);

  return (
    <>
      {showMainNavbar && <MainNavbar />}
      <Routes>
        <Route path="/login" element={<UserLogin setToken={setToken} />} />
        <Route path="/register" element={<LearnerRegistration />} />
        <Route path="/logout" element={<UserLogout setToken={setToken}  />} />
        
        {/* Protecting the /beginner-pages route */}
        <Route
          path="/beginner-pages"
          element={token ? (skillLevel === 'beginner' ? <BeginnerPages /> : <MainPage />) : <Navigate to="/login" />}
        />

        {/* Protecting the /phrases route */}
        <Route
          path="/phrases"
          element={token ? (skillLevel === 'beginner' ? <Phrases/> : <BeginnerPages />) : <Navigate to="/login" />}
        />
      
        {/* Protecting the /phrases route */}
        <Route
          path="/hiragana"
          element={token ? (skillLevel === 'beginner' ? <HiraganaLearning /> : <BeginnerPages />) : <Navigate to="/login" />}
        />
         {/* Protecting the /phrases route */}
         <Route
          path="/katakana"
          element={token ? (skillLevel === 'beginner' ? <KatakanaLearning /> : <BeginnerPages />) : <Navigate to="/login" />}
        /> {/* Protecting the /phrases route */}
        <Route
          path="/kanji"
          element={token ? (skillLevel === 'beginner' ? <KanjiLearning /> : <BeginnerPages />) : <Navigate to="/login" />}
        />


      { /* Protecting the /advanced-pages route */}
        <Route
          path="/advanced-pages"
          element={token ? (skillLevel === 'advanced' ? <AdvancedPages /> : <MainPage />) : <Navigate to="/login" />}
        />
        {/* Protecting the /phrases route */}
        <Route
          path="/quiz"
          element={token ? (skillLevel === 'advanced' ? <QuizApp /> : <AdvancedPages />) : <Navigate to="/login" />}
        />
        {/* <Route path="/quiz/:quizId" exact element={token ? (skillLevel === 'advanced' ? <QuizDetail /> : <AdvancedPages />) : <Navigate to="/login" />} /> */}
        {/* <Route
          path="/quiz-result"  
          element={token ? (skillLevel === 'advanced' ? <QuizResult /> : <AdvancedPages />) : <Navigate to="/login" />}
        /> */}
        <Route
          path="/flashcard"
          element={token ? (skillLevel === 'advanced' ? <FlashCard/> : <AdvancedPages />) : <Navigate to="/login" />}
        />
        <Route
          path="/write"
          element={token ? (skillLevel === 'advanced' ? <Write/> : <AdvancedPages />) : <Navigate to="/login" />}
        />
        <Route
          path="/more"
          element={token ? (skillLevel === 'advanced' ? <More/> : <AdvancedPages />) : <Navigate to="/login" />}
        />

        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<About />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="/translate" element={<TranslateForm />}/>
        <Route path="/translate-pdf" element={<FileUpload />}/>
        <Route path="/resources" element={ <Resources/>}/>
        <Route path="/flashcard_app" element={token ? (skillLevel === 'advanced' ? <FlashcardApp/> : <AdvancedPages />) : <Navigate to="/login" />}/>
      </Routes>
      <Footer />
    </>
  );
};

export default App;

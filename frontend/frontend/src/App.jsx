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
import LearnerProfile from "./components/LearnerProfile";
import InterpreterForm from "./components/InterpreterForm";
import { InterpreterPages } from "./components/InterpreterPages";
import CompanyForm from "./components/CompanyForm";
import { CompanyPages } from './components/CompanyPages';
import InterpreterProfile from "./components/InterpreterProfile";
import CompanyList from "./components/CompanyList";
import BeginnerProfile from "./components/BeginnerProfile";
const App = () => {
  const [token, setToken] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [role,setRole] = useState(''); 
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedSkillLevel = localStorage.getItem('skill_level');
    const storedRole = localStorage.getItem('role');

    if (storedToken && storedSkillLevel && storedRole) {
      setToken(storedToken);
      setSkillLevel(storedSkillLevel);
      setRole(storedRole);
    }
  }, []);

  return (
    <Router>
      <Helmet>
        <title>Kantanna Nihongo</title>
      </Helmet>
      <MainApp token={token} skillLevel={skillLevel} role={role} setToken={setToken} />
    </Router>
  );
};

// MainApp: The part of the app where routing happens

// eslint-disable-next-line react/prop-types
const MainApp = ({ token, skillLevel,role, setToken }) => {
  const location = useLocation(); // This will now work because it's inside Router
  const showMainNavbar = !['/beginner-pages', '/advanced-pages','/phrases','/hiragana','/katakana','/kanji','/quiz','/quizapp','/profile','/profilepage','/interpreter-pages','/interpreter-profile','/company-list','/company-pages','/job-posts','/write','/flashcard','/more'].includes(location.pathname);

  return (
    <>
      {showMainNavbar && <MainNavbar />}
      <Routes>
        <Route path="/login" element={<UserLogin setToken={setToken} />} />
        <Route path="/register" element={<LearnerRegistration />} />
        <Route path="/register/interpreter/" element={<InterpreterForm/>}/>
        <Route path="/register/company/" element={<CompanyForm/>}/>
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
        <Route
          path="/quizapp"
          element={token ? (skillLevel === 'beginner' ? <Quiz /> : <BeginnerPages />) : <Navigate to="/login" />}
        />
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
        <Route path="/profile" element={token ?  <LearnerProfile/> : <QuizApp />}/>
        <Route path="/profilepage" element={token ?  <BeginnerProfile/> : <QuizApp />}/>
        <Route path="/interpreter-profile" element={token ? (role=== 'interpreter' ? <InterpreterProfile/> : <InterpreterPages />)  : <Navigate to="/login"/> }/>  
        <Route path="/company-list" element={token ? (role=== 'company' ? <CompanyPages/> : <CompanyPages/>)  : <Navigate to="/login"/>}/>
        <Route path="/interpreter-pages" element={token ? (role=== 'interpreter' ? <InterpreterPages/> : <InterpreterPages />)  : <Navigate to="/login"/>}/>  
        <Route path="/company-pages" element={token ? (role=== 'company' ?  <CompanyPages/> : <MainPage />)  : <Navigate to="/login"/>}/>
        <Route path="/job-posts" element={token ? (role=== 'company' ? <CompanyList/>: <MainPage />)  : <Navigate to="/login"/>}/>
      </Routes>
      <Footer />
    </>
  );
};

export default App;

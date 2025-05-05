import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIAssistant from './pages/AIAssistant';
import Projects from './pages/Projects';
import Deadlines from './pages/Deadlines';
import Resources from './pages/Resources';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import FeedbackForm from './pages/FeedbackForm';
import CalendarPage from './pages/CalendarPage';
import { useTranslation } from 'react-i18next';

console.log("React version in runtime:", React?.version);
console.log("React useMemo:", React?.useMemo);

const App = () => {
  const [darkMode] = useState(localStorage.getItem("theme") === "dark");
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const savedLang = localStorage.getItem("i18nextLng") || 'en';
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route path="/projects" element={<Projects darkMode={darkMode} />} />
        <Route path="/deadlines" element={<Deadlines />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/calendar" element={<CalendarPage darkMode={darkMode} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<FeedbackForm/>}/>
      </Routes>
    </Router>
  );
};

export default App;

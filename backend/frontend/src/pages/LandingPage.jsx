import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LandingPage() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white px-4 relative">
      <h1 className="text-5xl font-extrabold mb-4 text-center drop-shadow-lg">
        {t('landing.title')}
      </h1>
      <p className="text-lg mb-12 text-center max-w-xl drop-shadow-md">
        {t('landing.subtitle')}
      </p>

      <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
        <Link
          to="/login"
          className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-indigo-100 transition w-60 text-center"
        >
          {t('landing.login')}
        </Link>
        <Link
          to="/register"
          className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-indigo-100 transition w-60 text-center"
        >
          {t('landing.register')}
        </Link>
        <Link
          to="/feedback"
          className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-indigo-100 transition w-60 text-center"
        >
          {t('landing.feedback')}
        </Link>
        <Link
          to="/about"
          className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-indigo-100 transition w-60 text-center"
        >
          {t('landing.about')}
        </Link>
      </div>

      <footer className="mt-16 text-sm text-white/80">
        &copy; {new Date().getFullYear()} AI Project Management. {t('landing.rights')}
      </footer>

      {/* Кнопка перемикання мови */}
      <button
        onClick={toggleLanguage}
        className="fixed bottom-4 right-4 bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-indigo-100 transition text-sm"
      >
        {i18n.language === 'uk' ? '🇺🇦 Українська' : '🇬🇧 English'}
      </button>
    </div>
  );
}

export default LandingPage;

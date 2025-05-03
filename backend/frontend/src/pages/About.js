import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${darkMode ? 'from-gray-900 to-black text-white' : 'from-indigo-50 to-white text-gray-900'} transition-all`}>

      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow transition"
        >
          ← {t('common.back')}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-6">
        <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 space-y-6 transition-all text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-100">
          <h1 className="text-4xl font-bold text-center mb-4">👨‍💻 {t('about.title')}</h1>

          {t('about.description')
            .split('\n\n')
            .map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">{paragraph}</p>
            ))}

         {/* Social Icons */}
<div className="flex justify-center items-center gap-8 pt-6">
  {/* Telegram */}
  <a
    href="https://t.me/blackcockniggaballs"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-500/10 transition"
  >
    <img
      src="/icons/telegram.svg"
      alt="Telegram"
      className="w-10 h-10"
    />
  </a>

  {/* Instagram */}
  <a
    href="https://instagram.com/snap_hustler"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-pink-500/10 transition"
  >
    <img
      src="/icons/instagram.svg"
      alt="Instagram"
      className="w-10 h-10"
    />
  </a>

  {/* Strava */}
  <a
    href="https://strava.com/athletes/62434221"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-500/10 transition"
  >
    <img
      src="/icons/strava.svg"
      alt="Strava"
      className="w-10 h-10"
    />
  </a>
</div>

          <div className="text-center text-sm text-gray-400 dark:text-gray-500 pt-6">
            © {new Date().getFullYear()} AI Project Manager. {t('landing.rights')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

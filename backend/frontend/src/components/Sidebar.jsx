import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const linkClass = (path) =>
    `px-3 py-2 rounded transition font-medium ${
      location.pathname === path
        ? 'bg-indigo-200 dark:bg-gray-700 text-indigo-900 dark:text-white font-semibold'
        : 'hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100'
    }`;

  return (
    <div className="w-64 min-h-screen bg-white dark:bg-gray-800 shadow-md px-4 py-6 space-y-4 border-r transition-all">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        ️ {t('sidebar.title')}
      </h2>

      <nav className="flex flex-col gap-2">
        <Link to="/ai" className={linkClass('/ai')}>
          🧠 {t('sidebar.ai')}
        </Link>
        <Link to="/projects" className={linkClass('/projects')}>
          📁 {t('sidebar.projects')}
        </Link>
        <Link to="/deadlines" className={linkClass('/deadlines')}>
          ⏰ {t('sidebar.deadlines')}
        </Link>
        <Link to="/calendar" className={linkClass('/calendar')}>
          📅 {t('sidebar.calendar')}
        </Link>
        <Link to="/analytics" className={linkClass('/analytics')}>
          📊 {t('sidebar.analytics')}
        </Link>
        <Link to="/settings" className={linkClass('/settings')}>
          ⚙️ {t('sidebar.settings')}
        </Link>
      </nav>

      <div className="pt-6 border-t dark:border-gray-700">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
        >
          {darkMode ? `🌞 ${t('theme.light')}` : `🌙 ${t('theme.dark')}`}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

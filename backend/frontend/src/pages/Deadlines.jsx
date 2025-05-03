import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu, AlarmClock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Deadlines = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const getTimeLeft = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return t('deadlines.overdue');

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days >= 1) return t('deadlines.daysLeft', { count: days });
    return t('deadlines.hoursLeft', { count: hours });
  };

  const getDeadlineColor = (text) => {
    const daysMatch = text?.match(/\d+/);
    if (!daysMatch) return 'text-red-400'; // якщо не вдалось витягти цифру — вважаємо прострочено
    const count = parseInt(daysMatch[0]);

    if (text.includes(t('deadlines.hoursLeft', { count: '' }).replace(/\d+/g, ''))) {
      return 'text-yellow-400';
    }

    if (count <= 1) return 'text-red-400';
    if (count <= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  const activeProjectsWithDeadlines = projects.filter(p =>
    p.deadline && p.status !== 'Завершено'
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-indigo-300 dark:from-gray-900 dark:to-gray-800 transition-all relative">
      <div className={`fixed top-0 left-0 z-50 h-full transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} onNavigate={closeSidebar} />
      </div>

      {isSidebarOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 z-40 bg-black bg-opacity-30"></div>
      )}

      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md"
        title={t('common.menu')}
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 px-4 py-8 transition-all">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 text-gray-900 dark:text-white">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlarmClock /> {t('deadlines.title')}
          </h1>

          {activeProjectsWithDeadlines.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">{t('deadlines.noProjects')}</p>
          ) : (
            <div className="space-y-4">
              {activeProjectsWithDeadlines
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .map(p => {
                  const timeLeft = getTimeLeft(p.deadline);
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl shadow bg-gray-100 dark:bg-gray-700 hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{p.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {t(`projects.category.${p.category}`)} — {t(`projects.status.${p.status}`)}
                          </p>
                        </div>
                        <span className={`text-sm font-medium ${getDeadlineColor(timeLeft)}`}>
                          {timeLeft}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                        {t('deadlines.deadlineLabel', { date: new Date(p.deadline).toLocaleString() })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deadlines;
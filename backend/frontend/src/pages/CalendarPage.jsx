import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function CalendarPage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [projects, setProjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(savedProjects);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const eventsForDate = projects.filter(
    (p) => new Date(p.deadline).toDateString() === selectedDate.toDateString()
  );

  const deadlineSoon = (deadline) => {
    const daysLeft = Math.floor((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 1) {
      return daysLeft === 0 ? '⏳ ' + t('calendar.todayDeadline') : '⚠️ ' + t('calendar.oneDayLeft');
    }
    return null;
  };

  return (
    <div
      className={`flex min-h-screen relative transition-all ${
        darkMode
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white'
          : 'bg-gradient-to-br from-blue-100 via-indigo-100 to-white text-gray-900'
      }`}
    >
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} onNavigate={closeSidebar} />
      </div>

      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black bg-opacity-30"
        ></div>
      )}

      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md"
        title={t('common.menu')}
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center"> {t('calendar.title')}</h1>

        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 space-y-6 text-gray-800 dark:text-gray-100 transition-all">
          <div className="flex justify-center">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className={`calendar-styled rounded-3xl shadow-none w-full max-w-2xl ${
                darkMode ? 'dark-calendar' : ''
              }`}
              tileContent={({ date }) => {
                const hasEvent = projects.some(
                  (p) => new Date(p.deadline).toDateString() === date.toDateString()
                );
                return hasEvent ? (
                  <span className="text-red-500 ml-1 animate-pulse">•</span>
                ) : null;
              }}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mt-4 text-center">
              {showAll
                ? ` ${t('calendar.allEvents')}`
                : ` ${t('calendar.eventsOn', { date: selectedDate.toDateString() })}`}
            </h2>

            {(!showAll && eventsForDate.length === 0) ? (
              <p className="text-gray-400 text-center">{t('calendar.noEvents')}</p>
            ) : (
              <ul className="mt-2 space-y-2 list-disc list-inside">
                {(showAll ? projects : eventsForDate).map((e, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span>{e.title} <span className="text-sm text-indigo-300">({t(`projects.category.${e.category}`)})</span></span>
                    <span className="text-sm text-red-400">
                      {deadlineSoon(e.deadline)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-6 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                {showAll ? ' ' + t('calendar.showSelected') : ' ' + t('calendar.showAll')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
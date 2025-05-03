import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Resources = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-full transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}>
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
        title="Меню"
      >
        <Menu size={24} />
      </button>

      {/* Main content */}
      <div className="flex-1 px-4 py-8 transition-all">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 text-gray-800 dark:text-gray-100">
          <h1 className="text-3xl font-bold">{t('resources.title')}</h1>
          <p>{t('resources.description')}</p>

          {/* Можна додати список або секції з ресурсами */}
        </div>
      </div>
    </div>
  );
};

export default Resources;

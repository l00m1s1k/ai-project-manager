import React, { useState, useEffect } from 'react';
import { User, Globe, Sun, Moon, Bell, BellOff, X, Menu } from 'lucide-react';
import Modal from 'react-modal';
import Sidebar from '../components/Sidebar';
import { useTranslation } from 'react-i18next';

if (Modal.defaultStyles) {
  Modal.setAppElement('#root');
}

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem('notifications') === 'true');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    login: '',
    avatar: null
  });

  const [editForm, setEditForm] = useState({
    name: '',
    login: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('profile');
    const userLogin = localStorage.getItem('user_login');

    if (saved) {
      const parsed = JSON.parse(saved);
      const updatedProfile = {
        ...parsed,
        login: parsed.login || userLogin || ''
      };
      setProfileData(updatedProfile);
      setEditForm({ name: updatedProfile.name, login: updatedProfile.login });
    } else if (userLogin) {
      const updatedProfile = {
        name: '',
        login: userLogin,
        avatar: null
      };
      setProfileData(updatedProfile);
      setEditForm({ name: '', login: userLogin });
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('notifications', notificationsEnabled.toString());
  }, [notificationsEnabled]);

  const handleLanguageChange = async (language) => {
    try {
      await i18n.changeLanguage(language);
      localStorage.setItem('i18nextLng', language);
    } catch (error) {
      console.error('Language change error:', error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...profileData,
      name: editForm.name,
      login: editForm.login
    };
    setProfileData(updated);
    localStorage.setItem('profile', JSON.stringify(updated));
    closeEditModal();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = {
        ...profileData,
        avatar: reader.result.toString()
      };
      setProfileData(updated);
      localStorage.setItem('profile', JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`min-h-screen transition-all pt-16 bg-gradient-to-br ${darkMode ? 'from-gray-900 to-gray-800 text-white' : 'from-gray-100 to-indigo-300 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-full transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-40 bg-black bg-opacity-30" />
      )}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md"
        title={t('settings.menu')}
      >
        <Menu size={24} />
      </button>

      {/* Content */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8 mt-* transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">️ {t('settings.title')}</h1>

        {/* Профіль */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="text-blue-500" /> {t('settings.profile')}
          </h2>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Аватар" className="w-16 h-16 rounded-full object-cover border-2 border-blue-400" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User className="text-blue-500" size={24} />
                </div>
              )}
              <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
               <p className="font-medium">{profileData.login || t('settings.notSpecified')}</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400">
                   {profileData.name ? profileData.name : 'Додайте пошту'}
              </p>
          </div>

          </div>
          <button onClick={openEditModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
            <User size={18} /> {t('settings.editProfile')}
          </button>
        </div>

        {/* Мова */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="text-purple-500" /> {t('settings.language')}
          </h2>
          <select
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-2 text-sm rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="uk">Українська 🇺🇦</option>
            <option value="en">English 🇬🇧</option>
          </select>
        </div>

        {/* Темна тема і сповіщення */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('settings.appearance')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{darkMode ? t('settings.darkTheme') : t('settings.lightTheme')}</h3>
              <button onClick={toggleDarkMode} className={`p-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                {darkMode ? <Moon className="text-yellow-300" /> : <Sun className="text-yellow-500" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t('settings.notifications')}</h3>
              <button
                onClick={toggleNotifications}
                className={`p-2 rounded-full ${notificationsEnabled ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-200 dark:bg-gray-600'}`}
              >
                {notificationsEnabled ? <Bell className="text-blue-500" /> : <BellOff className="text-gray-500" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальне вікно */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{t('settings.editProfile')}</h2>
            <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="login" className="block text-sm font-medium mb-1">{t('settings.login')}</label>
              <input
                id="login"
                type="text"
                value={editForm.login}
                onChange={(e) => setEditForm({ ...editForm, login: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
           <label htmlFor="name" className="block text-sm font-medium mb-1">Email</label>
            <input
                id="name"
                type="email"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="example@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="login" className="block text-sm font-medium mb-1">{t('settings.login')}</label>
              <input
                id="login"
                type="text"
                value={editForm.login}
                onChange={(e) => setEditForm({ ...editForm, login: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={closeEditModal} className="px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                {t('settings.cancel')}
              </button>
              <button type="submit" className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">
                {t('settings.save')}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
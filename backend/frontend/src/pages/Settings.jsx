import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import { Menu, Sun, Moon, Bell, BellOff, X } from 'lucide-react';
import Modal from 'react-modal';

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editForm, setEditForm] = useState({ login: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('https://ai-project-manager-4frq.onrender.com/api/profile/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (!res.ok) throw new Error('Auth error');
        const data = await res.json();
        setUserData(data);
        setEditForm({ login: data.username || '', email: data.email || '' });
      } catch (err) {
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('https://ai-project-manager-4frq.onrender.com/api/profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          username: editForm.login,
          email: editForm.email,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Помилка оновлення профілю');
        return;
      }

      setUserData(data);
      setSuccess(true);
      closeEditModal();
    } catch (err) {
      console.error(err);
      setError('Помилка підключення до сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-900 bg-white text-gray-900 dark:text-white">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <div className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <button onClick={toggleSidebar} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            <Menu />
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('settings.profile')}</h2>
          {userData ? (
            <div className="space-y-2">
              <p><strong>{t('settings.login')}:</strong> {userData.username}</p>
              <p><strong>Email:</strong> {userData.email || '—'}</p>
              <button onClick={openEditModal} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                {t('settings.edit')}
              </button>
            </div>
          ) : (
            <p>Завантаження профілю...</p>
          )}
        </div>

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
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{t('settings.updateSuccess')}</p>}
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {t('settings.cancel')}
                </button>
                <button type="submit" className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700">
                  {loading ? '...' : t('settings.save')}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Settings;

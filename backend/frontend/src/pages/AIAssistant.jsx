import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

function AIAssistant() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [task, setTask] = useState('');
  const [response, setResponse] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Функція для отримання токена з localStorage
  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  useEffect(() => {
    // Перевіряємо авторизацію при завантаженні компонента
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSend = async () => {
    if (!task.trim()) return;
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch('https://ai-project-manager-4frq.onrender.com/api/ai-help/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ task })
      });

      if (res.status === 401) {
        setError('⛔ Ви не авторизовані. Увійдіть, щоб отримати відповідь від AI.');
        navigate('/login');
        return;
      }

      if (res.status === 429) {
        setError('⚠️ Досягнуто ліміт запитів. Спробуйте через хвилину.');
        return;
      }

      const data = await res.json();

      if (res.ok) {
        setResponse(data.response || data.answer);
        setTask('');
        await loadTasks();
      } else {
        setError(data.error || 'Помилка відповіді від AI');
      }
    } catch (err) {
      console.error('AI error:', err);
      setError('❌ Помилка з\'єднання з сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`https://ai-project-manager-4frq.onrender.com/api/tasks/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (res.status === 401) {
        navigate('/login');
        return;
      }

      await loadTasks();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Помилка при видаленні задачі');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`https://ai-project-manager-4frq.onrender.com/api/tasks/${id}/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ title: editedTitle })
      });

      if (res.status === 401) {
        navigate('/login');
        return;
      }

      setEditingId(null);
      setEditedTitle('');
      await loadTasks();
    } catch (err) {
      console.error('Update error:', err);
      setError('Помилка при оновленні задачі');
    }
  };

  const loadTasks = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch('https://ai-project-manager-4frq.onrender.com/api/tasks/', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (res.status === 401) {
        navigate('/login');
        return;
      }

      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      console.error('Помилка завантаження задач:', err);
      setError('Помилка завантаження задач');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const groupTasksByDate = (tasks) => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    return {
      today: tasks.filter(task => task.created_at?.slice(0, 10) === today),
      yesterday: tasks.filter(task => task.created_at?.slice(0, 10) === yesterday),
      older: tasks.filter(task =>
        task.created_at?.slice(0, 10) !== today && task.created_at?.slice(0, 10) !== yesterday)
    };
  };

  const renderGroup = (label, list) => (
    list.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2">{label}</h3>
        <div className="space-y-4">
          {list.map((task) => (
            <div
              key={task.id}
              className="relative bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <button
                onClick={() => handleDelete(task.id)}
                className="absolute top-2 right-2 text-sm text-red-400 hover:text-red-600"
                title={t('ai.delete')}
              >
                ✕
              </button>

              {editingId === task.id ? (
                <div className="flex gap-2">
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-grow px-2 py-1 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                  <button onClick={() => handleUpdate(task.id)} className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">✅</button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500">❌</button>
                </div>
              ) : (
                <div
                  className="font-semibold cursor-pointer"
                  onClick={() => {
                    setEditingId(task.id);
                    setEditedTitle(task.title);
                  }}
                  title={t('ai.edit')}
                >
                  {task.title}
                </div>
              )}

              <div className="text-sm mt-1 whitespace-pre-wrap">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked.parse(task.ai_response || '')),
                  }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-2">{task.created_at}</div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const filtered = tasks.filter((task) =>
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.ai_response?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = groupTasksByDate(filtered);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-indigo-300 dark:from-gray-900 dark:to-gray-800 transition-all relative">
      <div className={`fixed top-0 left-0 z-50 h-full transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} onNavigate={closeSidebar} />
      </div>

      {isSidebarOpen && <div onClick={closeSidebar} className="fixed inset-0 z-40 bg-black bg-opacity-30" />}

      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md"
        title={t('ai.menu')}
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 text-gray-800 dark:text-gray-100">
          <h1 className="text-3xl font-bold">🧠 {t('ai.title')}</h1>

          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder={t('ai.placeholder')}
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none bg-white dark:bg-gray-700"
            rows={4}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className={`bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-indigo-700 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? t('ai.sending') : t('ai.send')}
          </button>

          {loading && <div className="text-sm text-gray-500">AI думає...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}

          {response && (
            <div className="bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 p-4 rounded-xl shadow-sm">
              <h2 className="font-semibold text-indigo-700 dark:text-indigo-300">{t('ai.responseTitle')}</h2>
              <div
                className="mt-2 space-y-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(marked.parse(response || '')),
                }}
              />
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold mb-4">📋 {t('ai.savedTasks')}</h2>
            <input
              type="text"
              placeholder={t('ai.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />

            {renderGroup(`📅 ${t('ai.today')}`, grouped.today)}
            {renderGroup(`📅 ${t('ai.yesterday')}`, grouped.yesterday)}
            {renderGroup(`📅 ${t('ai.earlier')}`, grouped.older)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
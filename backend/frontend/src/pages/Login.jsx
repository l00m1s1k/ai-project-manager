import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem(form.username);
    if (!storedUser || JSON.parse(storedUser).password !== form.password) {
      setError(t('login.error'));
    } else {
      localStorage.setItem('loggedIn', 'true');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white px-4">
      <button
  onClick={() => navigate(-1)}
  className="absolute top-4 left-4 flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm bg-indigo-300 hover:bg-indigo-200 text-indigo-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-all duration-200"
>
  <span className="text-lg">←</span> {t('common.back') || 'Back'}
</button>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">{t('login.title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t('login.username')}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="w-full p-2 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
          />
          <input
            type="password"
            placeholder={t('login.password')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full p-2 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded">
            {t('login.button')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

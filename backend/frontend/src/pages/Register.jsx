import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUserExists(false);

    try {
      const response = await fetch('https://ai-project-manager-4frq.onrender.com/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: login, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && (data.username || data.detail || JSON.stringify(data).toLowerCase().includes('exist'))) {
          setUserExists(true);
        } else {
          setError(data?.error || 'Не вдалося зареєструватися. Спробуйте ще раз.');
        }
        return;
      }

      localStorage.setItem('user_login', login);
      navigate('/ai');
    } catch (err) {
      console.error(err);
      setError('Помилка зʼєднання з сервером.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
        {/* Кнопка Назад */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          ← Назад
        </button>

        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Реєстрація</h2>

        {/* Повідомлення про помилки */}
        {userExists && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg text-sm text-center mb-4">
            Користувач з таким логіном вже існує.{' '}
            <Link
              to="/login"
              className="underline text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Увійти
            </Link>
          </div>
        )}
        {error && !userExists && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Логін</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-2xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="meow"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Пароль</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-2xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9 text-gray-500 dark:text-gray-300"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-2xl"
          >
            Зареєструватися
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
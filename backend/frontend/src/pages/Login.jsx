import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!login || !password) {
      setError('Усі поля обовʼязкові');
      return;
    }

    try {
      const response = await fetch('https://ai-project-manager-4frq.onrender.com/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: login, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.detail === 'No active account found with the given credentials') {
          setError('Неправильний логін або пароль');
        } else {
          setError(data.error || 'Не вдалося увійти. Спробуйте ще раз.');
        }
        return;
      }

      localStorage.setItem('user_login', data.username || login);
      navigate('/ai');
    } catch (error) {
      console.error(error);
      setError('Помилка зʼєднання з сервером.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white px-4">
      <div className="relative max-w-xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-all duration-200"
        >
          <span className="text-lg">←</span> Назад
        </button>

        <h2 className="text-3xl font-bold text-center">Вхід</h2>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Логін</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="w-full p-3 border rounded-2xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ваш логін"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-2xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ваш пароль"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-2xl transition-all"
          >
            Увійти
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Не маєте акаунта?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Зареєструйтеся
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
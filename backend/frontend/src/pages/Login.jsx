import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!login || !password) {
      setError('Усі поля обовʼязкові для заповнення');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://ai-project-manager-4frq.onrender.com/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: login, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        if (data?.detail === 'No active account found with the given credentials') {
          setError('Неправильний логін або пароль');
        } else {
          setError(data?.error || 'Не вдалося увійти. Спробуйте ще раз.');
        }
        return;
      }

      setSuccess('Вхід успішний! Перенаправлення...');
      localStorage.setItem('user_login', data.username || login);

      // ⏳ Затримка 2 секунди перед переходом
      setTimeout(() => navigate('/ai'), 1000);
    } catch (err) {
      console.error(err);
      setError('Помилка зʼєднання з сервером.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8">
        {/* Кнопка Назад */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          ← Назад
        </button>

        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Вхід</h2>

        {/* Повідомлення */}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm text-center mb-4 animate-pulse">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
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
              placeholder="Ваш логін"
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
              placeholder="Ваш пароль"
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
            disabled={loading}
            className={`w-full py-3 px-4 mt-4 text-white text-sm font-semibold rounded-2xl ${
              loading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Не маєте акаунта?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">
            Зареєструйтесь
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
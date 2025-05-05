import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [duplicateUser, setDuplicateUser] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDuplicateUser(false);

    if (!login || !password) {
      setError('Усі поля обовʼязкові');
      return;
    }

    if (password.length < 6) {
      setError('Пароль має містити щонайменше 6 символів');
      return;
    }

    try {
      const response = await fetch('https://ai-project-manager-4frq.onrender.com/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: login, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log('Registration error response:', data);

        if (response.status === 400 &&
            (data.username || data.error || '').toLowerCase().includes('already exists')) {
          setDuplicateUser(true);
          return;
        }

        setError(data.error || 'Не вдалося зареєструватися. Спробуйте ще раз.');
        return;
      }

      const data = await response.json();
      localStorage.setItem('user_login', data.username || login);
      navigate('/ai');
    } catch (error) {
      console.error('Registration failed:', error);
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

        <h2 className="text-3xl font-bold text-center">Реєстрація</h2>

        {duplicateUser && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded text-center">
            Користувач вже існує,{' '}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 font-medium underline"
            >
              бажаєте увійти?
            </Link>
          </div>
        )}

        {error && !duplicateUser && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
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
              placeholder="Введіть логін"
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
              placeholder="Введіть пароль"
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
            Зареєструватися
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
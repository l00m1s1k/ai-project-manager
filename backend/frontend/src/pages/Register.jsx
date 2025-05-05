import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ai-project-manager-4frq.onrender.com/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: login, password }), // 🔥 ключова зміна
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Не вдалося зареєструватися. Спробуйте ще раз.');
        return;
      }

      localStorage.setItem('user_login', data.username || login);
      navigate('/ai');
    } catch (error) {
      console.error(error);
      setError('Помилка з’єднання з сервером.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white px-4">
      <div className="relative max-w-xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-all duration-200"
        >
          <span className="text-lg">←</span> Назад
        </button>

        <h2 className="text-3xl font-bold text-center">Реєстрація</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Логін</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="w-full p-2 border rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Введіть логін"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Введіть пароль"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-all"
          >
            Зареєструватися
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
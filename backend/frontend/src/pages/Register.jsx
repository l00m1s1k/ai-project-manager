import React, { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://ai-project-manager-4frq.onrender.com/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      const data = await res.json();
      setMessage(res.ok ? '✅ Реєстрація успішна' : data.error || '❌ Помилка');
    } catch (err) {
      console.error(err);
      setMessage('❌ Помилка з’єднання');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 transition">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">📝 Реєстрація</h2>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Логін"
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Пароль"
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition"
        >
          Зареєструватися
        </button>
        {message && <p className="text-center text-sm text-gray-600 dark:text-gray-300">{message}</p>}
      </form>
    </div>
  );
}

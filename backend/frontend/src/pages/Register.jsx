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
      if (res.ok) {
        setMessage('Реєстрація успішна');
      } else {
        setMessage(data.error || 'Помилка');
      }
    } catch (err) {
      console.error(err);
      setMessage('Помилка з*єднання');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input name="username" value={form.username} onChange={handleChange} placeholder="Логін" className="input" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Пароль" className="input" />
      <button type="submit" className="btn">Зареєструватися</button>
      {message && <p>{message}</p>}
    </form>
  );
}
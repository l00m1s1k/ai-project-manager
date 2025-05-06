import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const FeedbackForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://ai-project-manager-4frq.onrender.com/api/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Помилка при надсиланні');

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setFormData({ name: '', message: '' });

    } catch (err) {
      setError('Не вдалося надіслати. Спробуйте ще раз.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white px-4">
      <div className="relative max-w-xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-all duration-200"
        >
          <span className="text-lg">←</span> {t('common.back') || 'Back'}
        </button>

        <h1 className="text-3xl font-bold text-center">{t('feedback.title')}</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          {t('feedback.messagePrompt') || 'We’d love to hear your feedback!'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              {t('feedback.name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              {t('feedback.message')}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-all"
          >
            {t('feedback.send')}
          </button>

          {submitted && (
            <p className="text-green-500 text-center font-medium mt-2">
              {t('feedback.success') || 'Повідомлення надіслано!'}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center font-medium mt-2">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
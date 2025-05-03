import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BackButton = ({ className = '' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition ${className}`}
    >
      <ArrowLeft size={18} />
      {t('common.back') || 'Back'}
    </button>
  );
};

export default BackButton;
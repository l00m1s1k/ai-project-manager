import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu, Trash2, Pencil, PlusCircle, CalendarDays, Layers, Activity, Percent, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STATUS_OPTIONS = ['У процесі', 'Завершено', 'Відкладено'];
const CATEGORY_OPTIONS = ['Навчання', 'Робота', 'Особисте', 'Інше'];

const LiveTimer = ({ work_log }) => {
  const [time, setTime] = useState(getTotal());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTotal());
    }, 1000);
    return () => clearInterval(interval);
  }, [work_log]);

  function getTotal() {
    let total = 0;
    for (const log of work_log || []) {
      const start = new Date(log.start);
      const end = log.end ? new Date(log.end) : new Date();
      total += end - start;
    }
    const secs = Math.floor(total / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    return {
      hours,
      mins: mins % 60,
      secs: secs % 60,
    };
  }

  return (
    <span className="text-sm text-gray-700 dark:text-gray-300">
      ⏱ {time.hours} год {time.mins} хв {time.secs} с
    </span>
  );
};

const ManualTimerButtons = ({ project, setProjects }) => {
  const hasActive = project.work_log?.some(w => w.end === null);

  const toggleTimer = () => {
    const now = new Date().toISOString();
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== project.id) return p;

        const updated = { ...p };
        if (!updated.work_log) updated.work_log = [];

        if (hasActive) {
          updated.work_log = updated.work_log.map(w => {
            if (!w.end) return { ...w, end: now };
            return w;
          });
        } else {
          updated.work_log.push({ start: now, end: null });
        }

        return updated;
      })
    );
  };

  return (
    <button
      onClick={toggleTimer}
      className={`ml-2 px-4 py-1 rounded-md text-sm font-medium shadow transition ${
        hasActive
          ? 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white'
          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
      }`}
    >
      {hasActive ? 'Пауза' : 'Старт'}
    </button>
  );
};

const Projects = () => {
  const { t } = useTranslation();

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [newProject, setNewProject] = useState({
    title: '',
    status: STATUS_OPTIONS[0],
    progress: 0,
    category: CATEGORY_OPTIONS[3],
    deadline: '',
  });

  const [filterStatus, setFilterStatus] = useState('Всі');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleAdd = () => {
    if (newProject.title.trim() === '') return;
    const now = new Date().toISOString();
    const project = {
      ...newProject,
      id: Date.now(),
      created_at: now,
      work_log: newProject.status === 'У процесі' ? [{ start: now, end: null }] : [],
      completed_at: newProject.status === 'Завершено' ? now : null,
    };
    setProjects([...projects, project]);
    setNewProject({
      title: '',
      status: STATUS_OPTIONS[0],
      progress: 0,
      category: CATEGORY_OPTIONS[3],
      deadline: '',
    });
  };

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const updateEditing = (field, value) => {
    setEditingProject(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    const now = new Date().toISOString();
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== editingProject.id) return p;
        const updated = { ...editingProject };

        if (!updated.work_log) updated.work_log = [];

        const prevStatus = p.status;
        const newStatus = updated.status;

        if (newStatus === 'У процесі') {
          const isActive = updated.work_log.some(w => w.end === null);
          if (!isActive) {
            updated.work_log.push({ start: now, end: null });
          }
        }

        if ((newStatus === 'Відкладено' || newStatus === 'Завершено')) {
          updated.work_log = updated.work_log.map(w => {
            if (!w.end) return { ...w, end: now };
            return w;
          });
        }

        if (newStatus === 'Завершено' && !updated.completed_at) {
          updated.completed_at = now;
        }

        return updated;
      })
    );
    setEditingProject(null);
  };

  const filtered = filterStatus === 'Всі'
    ? projects
    : projects.filter(p => p.status === filterStatus);

  const sortedFiltered = [...filtered].sort((a, b) => {
    const order = { 'У процесі': 0, 'Відкладено': 1, 'Завершено': 2 };
    return order[a.status] - order[b.status];
  });

  const getTotalTime = (work_log) => {
    let total = 0;
    for (const log of work_log || []) {
      const start = new Date(log.start);
      const end = log.end ? new Date(log.end) : new Date();
      total += end - start;
    }
    const secs = Math.floor(total / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    return { hours, mins: mins % 60, secs: secs % 60 };
  };

  const formatTime = ({ hours, mins }) => {
    return `${hours} год ${mins} хв`;
  };

  const isDeadlineSoon = (deadline) => {
    const now = new Date();
    const date = new Date(deadline);
    const diff = date - now;
    return diff < 86400000 && diff > 0;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-indigo-300 dark:from-gray-900 dark:to-gray-800 transition-all relative">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-full transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} onNavigate={closeSidebar} />
      </div>

      {isSidebarOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 z-40 bg-black bg-opacity-30"></div>
      )}

      {/* Меню */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md"
        title={t('common.menu')}
      >
        <Menu size={24} />
      </button>

      {/* Модальне вікно для редагування */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('projects.editProject')}</h2>
              <button
                onClick={() => setEditingProject(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('projects.title')}</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => updateEditing('title', e.target.value)}
                  className="w-full p-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('projects.status.title')}</label>
                <select
                  value={editingProject.status}
                  onChange={(e) => updateEditing('status', e.target.value)}
                  className="w-full p-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{t(`projects.status.${s}`)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('projects.category.title')}</label>
                <select
                  value={editingProject.category}
                  onChange={(e) => updateEditing('category', e.target.value)}
                  className="w-full p-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                >
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c}>{t(`projects.category.${c}`)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('projects.progress')}</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingProject.progress}
                    onChange={(e) => updateEditing('progress', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-sm font-medium w-12 text-center">
                    {editingProject.progress}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('projects.deadline')}</label>
                <input
                  type="date"
                  value={editingProject.deadline}
                  onChange={(e) => updateEditing('deadline', e.target.value)}
                  className="w-full p-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <button
                onClick={saveChanges}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-4 font-semibold transition"
              >
                {t('projects.saveChanges')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Основний контент */}
      <div className="flex-1 px-4 py-8 transition-all text-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-10">
          <h1 className="text-3xl font-bold">{t('projects.myProjects')}</h1>

          {/* Форма створення */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <PlusCircle /> {t('projects.addProject')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Layers size={18} />
                <input
                  type="text"
                  placeholder={t('projects.titlePlaceholder')}
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full p-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={e => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full p-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div className="flex items-center gap-2">
                <Activity size={18} />
                <select
                  value={newProject.status}
                  onChange={e => setNewProject({ ...newProject, status: e.target.value })}
                  className="w-full p-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{t(`projects.status.${s}`)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Layers size={18} />
                <select
                  value={newProject.category}
                  onChange={e => setNewProject({ ...newProject, category: e.target.value })}
                  className="w-full p-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                >
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c}>{t(`projects.category.${c}`)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                <Percent size={18} />
                <div className="w-full flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newProject.progress}
                    onChange={e => setNewProject({ ...newProject, progress: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-sm font-medium w-12 text-center">
                    {newProject.progress}%
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md mt-4 shadow font-semibold transition"
            >
              ➕ {t('projects.add')}
            </button>
          </div>

          {/* Фільтр за статусом */}
          <div className="mt-10 mb-4">
            <label className="mr-2 font-medium">{t('projects.filter')}:</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="p-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <option value="Всі">{t('projects.all')}</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{t(`projects.status.${s}`)}</option>
              ))}
            </select>
          </div>

          {/* Рендер проєктів */}
          {sortedFiltered.map(project => {
            const total = getTotalTime(project.work_log || []);
            return (
              <div key={project.id} className="bg-white dark:bg-gray-800 mb-6 p-5 rounded-xl shadow hover:shadow-lg transition-all duration-300 relative space-y-2">
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="text-yellow-400 hover:text-yellow-600"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h3 className="text-lg font-bold">{project.title}</h3>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-300">
                  <span>{t(`projects.category.${project.category}`)}</span>
                  <span className={project.status === 'Завершено' ? 'text-green-500 font-semibold' : ''}>
                    {t(`projects.status.${project.status}`)}
                  </span>
                </div>

                {project.deadline && (
                  <div className={`text-xs mt-1 ${isDeadlineSoon(project.deadline) ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                    ⏰ {t('projects.deadline')}: {project.deadline}
                  </div>
                )}

                <div className="text-xs mt-1 text-right text-gray-500 dark:text-gray-400">
                  {project.progress}% {t('projects.progress')}
                </div>

                {/* Таймер та ручне керування */}
                {project.status === 'У процесі' && (
                  <div className="flex items-center justify-between text-sm mt-2 px-2 py-1 border dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700">
                    <LiveTimer work_log={project.work_log} />
                    <ManualTimerButtons project={project} setProjects={setProjects} />
                  </div>
                )}

                {project.status === 'Завершено' && (
                  <div className="text-xs italic text-green-500 mt-2">
                    ✅ {t('projects.timeSpent')}: {formatTime(total)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Projects;
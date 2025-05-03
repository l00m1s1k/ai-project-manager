import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu, BarChart, LayoutList, Download } from 'lucide-react';
import {
  AreaChart, Area, BarChart as BarChartRecharts, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';

const Analytics = () => {
  const { t } = useTranslation();

  const tabs = [t('analytics.success'), t('analytics.overdue'), t('analytics.created')];
  const timeRanges = [
    { label: t('analytics.range.5d'), value: 5 },
    { label: t('analytics.range.7d'), value: 7 },
    { label: t('analytics.range.30d'), value: 30 },
    { label: t('analytics.range.3m'), value: 90 },
    { label: t('analytics.range.6m'), value: 180 },
    { label: t('analytics.range.1y'), value: 365 }
  ];

  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(t('analytics.success'));
  const [projects, setProjects] = useState([]);
  const [chartType, setChartType] = useState('area');
  const [timeRange, setTimeRange] = useState(7);
  const chartRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('projects');
    if (saved) {
      const parsed = JSON.parse(saved);
      const withCreatedAt = parsed.map(p => ({
        ...p,
        created_at: p.created_at || new Date().toISOString(),
        // Додаємо поле completed_at, якщо воно відсутнє для завершених проектів
        completed_at: p.status === 'Завершено' && !p.completed_at ? p.created_at : p.completed_at
      }));
      setProjects(withCreatedAt);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const generateDateRange = (days) => {
    const now = new Date();
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (days - 1 - i));
      return date.toISOString().split('T')[0];
    });
  };

  const groupByDate = (filterFn, dateField = 'created_at') => {
    const dateRange = generateDateRange(timeRange);
    const result = {};
    dateRange.forEach(date => {
      result[date] = 0;
    });

    projects.filter(filterFn).forEach(p => {
      const date = new Date(p[dateField]).toISOString().split('T')[0];
      if (result[date] !== undefined) result[date] += 1;
    });

    return Object.entries(result).map(([date, value]) => ({
      date,
      value,
      label: `${value} ${t('analytics.projects')}`,
    }));
  };

  const isOverdue = (p) =>
    p.deadline &&
    new Date(p.deadline) < new Date() &&
    p.status !== 'Завершено'; // Змінив з t('projects.status.done') на 'Завершено'

  // Оновлений фільтр для успішних проектів
  const successData = groupByDate(
    (p) => p.status === 'Завершено' && p.completed_at, // Змінив з t('projects.status.done') на 'Завершено'
    'completed_at'
  );
  const overdueData = groupByDate(p => isOverdue(p), 'deadline');
  const createdData = groupByDate(() => true);

  const renderChart = (data, color) => {
    const commonProps = {
      data,
      margin: { top: 10, right: 20, left: 0, bottom: 0 }
    };

    const customTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 p-2 rounded shadow">
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-sm text-indigo-500">📌 {payload[0].value} {t('analytics.projects')}</p>
          </div>
        );
      }
      return null;
    };

    if (chartType === 'bar') {
      return (
        <BarChartRecharts {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip content={customTooltip} />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </BarChartRecharts>
      );
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} domain={[0, 'auto']} />
        <Tooltip content={customTooltip} />
        <Area type="monotone" dataKey="value" stroke={color} fill="url(#colorFill)" />
      </AreaChart>
    );
  };

  const exportToPDF = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`analytics_${activeTab}_${timeRange}days.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className={`flex min-h-screen transition-all bg-gradient-to-br  dark:from-gray-900 dark:to-gray-800 ${darkMode ? 'from-gray-900 to-gray-800 text-white' : 'from-gray-100 to-indigo-300 text-gray-900'}`}>
      <div className={`fixed top-0 left-0 z-50 h-full transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}>
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} onNavigate={closeSidebar} />
      </div>

      {isSidebarOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 z-40 bg-black bg-opacity-30" />
      )}

      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 px-4 py-8 transition-all">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6" ref={chartRef}>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart />  {t('analytics.title')}
            </h1>
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="px-3 py-2 text-sm rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setChartType(chartType === 'area' ? 'bar' : 'area')}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <LayoutList size={18} />
                {chartType === 'area' ? t('analytics.barChart') : t('analytics.areaChart')}
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                title={t('analytics.exportPDF')}
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-6 border-b dark:border-gray-700 pb-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-lg transition font-semibold ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="pt-4 overflow-x-auto min-w-[700px]">
            <ResponsiveContainer width="100%" height={300}>
              {activeTab === t('analytics.success') && renderChart(successData, '#22c55e')}
              {activeTab === t('analytics.overdue') && renderChart(overdueData, '#f43f5e')}
              {activeTab === t('analytics.created') && renderChart(createdData, '#3b82f6')}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
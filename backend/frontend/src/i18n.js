import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      sidebar: {
        title: 'Functions',
        ai: 'AI Assistant',
        projects: 'Projects',
        deadlines: 'Deadlines',
        calendar: 'Calendar',
        analytics: 'Analytics',
        settings: 'Settings'
      },
      theme: {
        light: 'Light Theme',
        dark: 'Dark Theme'
      },
      ai: {
        title: 'AI Assistant',
        placeholder: 'Enter a task to analyze...',
        send: 'Send',
        responseTitle: 'AI Response:',
        savedTasks: 'Saved Tasks',
        search: 'Search tasks...',
        today: 'Today',
        yesterday: 'Yesterday',
        earlier: 'Earlier',
        delete: 'Delete task',
        edit: 'Edit task',
        menu: 'Menu'
      },
      feedback: {
        title: 'Feedback',
        name: 'Your name',
        message: 'Your message',
        send: 'Send',
        success: 'Thank you for your feedback!',
        messagePrompt: 'We would be happy to hear your impressions!'
      },
      about: {
        title: 'About Us',
        content: 'About page content will be here.',
        description: `Hi! My name is Andrii, and I’m the developer of an innovative AI assistant for project management. My main goal is to combine modern technologies, artificial intelligence, and user-friendly design to create a powerful tool for managing tasks.

This project is built to help people better plan, track, and achieve their goals. It includes smart suggestions, calendar integration, task performance analytics, and more.

Thanks for using this app! If you have ideas for improvements — feel free to share them via the feedback form. 💬`
      },
      analytics: {
        title: 'Project Analytics',
        success: 'Success',
        overdue: 'Overdue',
        load: 'Load',
        export: 'Export to PDF',
        bar: 'Bar Chart',
        area: 'Area Chart',
        days: 'days',
        range: {
          '5d': '5 days',
          '7d': '7 days',
          '30d': '30 days',
          '90d': '3 months',
          '180d': '6 months',
          '365d': '1 year',
          '3m': '3 months',
          '6m': '6 months',
          '1y': '1 year'
        },
        barChart: '📊 Bar Chart',
        areaChart: '🌊 Area Chart'
      },
      calendar: {
        title: 'Calendar',
        eventsOn: 'Events on {{date}}',
        noEvents: 'No events',
        allEvents: 'All events',
        showAll: 'Show all events',
        showSelected: 'Show selected day',
        todayDeadline: 'Deadline today!',
        oneDayLeft: '1 day left!'
      },
      deadlines: {
        title: 'Deadline Tracker',
        noProjects: 'No projects with deadlines.',
        overdue: 'Overdue',
        daysLeft: '{{count}} days left',
        hoursLeft: '{{count}} hours left',
        deadlineLabel: 'Deadline: {{date}}'
      },
      landing: {
        title: 'AI Project Manager',
        subtitle: 'Smart project management with AI',
        start: '🚀 AI Assistant',
        mainButton: '🚀 AI Assistant',
        login: '🔐 Login',
        register: '✍ Register',
        feedback: '💬 Feedback',
        about: 'ℹ️ About',
        rights: 'All rights reserved.'
      },
      login: {
        title: 'Login',
        username: 'Username',
        password: 'Password',
        button: 'Login',
        error: 'Invalid username or password'
      },
      register: {
        title: 'Register',
        username: 'Username',
        password: 'Password',
        button: 'Register',
        error: 'User already exists'
      },
      projects: {
        myProjects: 'My Projects',
        addProject: 'Add Project',
        titlePlaceholder: 'Enter project title',
        status: {
          'У процесі': 'In Progress',
          'Завершено': 'Completed',
          'Відкладено': 'Postponed'
        },
        category: {
          'Навчання': 'Education',
          'Робота': 'Work',
          'Особисте': 'Personal',
          'Інше': 'Other'
        },
        progress: 'Progress (%)',
        add: 'Add',
        filter: 'Filter',
        all: 'All',
        editProject: 'Edit Project',
        save: 'Save',
        cancel: 'Cancel',
        deadline: 'Deadline',
        lessThanDay: '(less than a day!)'
      },
      settings: {
        title: 'Settings',
        profile: 'Profile',
        editProfile: 'Edit Profile',
        changeAvatar: 'Change Avatar',
        language: 'Language',
        darkTheme: 'Dark Theme',
        lightTheme: 'Light Theme',
        notifications: 'Notifications',
        cancel: 'Cancel',
        save: 'Save',
        name: 'Name',
        login: 'Login',
        appearance: 'Appearance'
      },
      common: {
        menu: 'Menu',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back'
      }
    }
  },
  uk: {
    translation: {
      sidebar: {
        title: 'Функції',
        ai: 'AI-помічник',
        projects: 'Проєкти',
        deadlines: 'Дедлайни',
        calendar: 'Календар',
        analytics: 'Аналітика',
        settings: 'Налаштування'
      },
      theme: {
        light: 'Світла тема',
        dark: 'Темна тема'
      },
      ai: {
        title: 'AI-помічник',
        placeholder: 'Введіть завдання, яке потрібно проаналізувати...',
        send: 'Надіслати',
        responseTitle: 'AI-відповідь:',
        savedTasks: 'Збережені завдання',
        search: 'Пошук задач...',
        today: 'Сьогодні',
        yesterday: 'Вчора',
        earlier: 'Раніше',
        delete: 'Видалити задачу',
        edit: 'Редагувати задачу',
        menu: 'Меню'
      },
      feedback: {
  title: 'Зворотний зв’язок',
  name: 'Ваше ім’я',
  message: 'Ваше повідомлення',
  send: 'Надіслати',
  success: 'Дякуємо за зворотний звʼязок!',
  messagePrompt: 'Будемо раді почути ваші враження!'
},
      about: {
        title: 'Про нас',
        content: 'Тут буде вміст сторінки About.',
        description: `Привіт! Мене звати Андрій, і я — розробник інноваційного AI-помічника для керування проєктами. Моє головне завдання — поєднати сучасні технології, штучний інтелект та продуманий інтерфейс для створення зручного інструменту керування задачами.

Цей проєкт створений для того, щоб допомогти людям ефективніше планувати, відстежувати й досягати своїх цілей. Він містить інтелектуальні підказки, інтеграцію календаря, аналітику виконання задач і багато іншого.

Дякую, що користуєшся цим застосунком. Якщо маєш ідеї для покращення — не соромся написати через форму зворотного зв’язку! 💬`
},
      analytics: {
        title: '📈 Аналітика проєктів',
        success: 'Успішність',
        overdue: 'Заборгованість',
        load: 'Навантаження',
        created: 'Створено',
        export: 'Експорт у PDF',
        bar: 'Бар-графік',
        area: 'Площинний графік',
        range: {
  '5d': '5 днів',
  '7d': '7 днів',
  '30d': '30 днів',
  '90d': '3 місяці',
  '180d': '6 місяців',
  '365d': '1 рік',
  '3m': '3 місяці',
  '6m': '6 місяців',
  '1y': '1 рік'
},
        barChart: '📊 Бар-графік',
        areaChart: '🌊 Площинний графік'
      },
      calendar: {
        title: '📆 Календар',
        events: '📋 Події на',
        noEvents: 'Подій немає',
        showAll: '📅 Показати всі події',
        showSelected: '🔍 Показати вибраний день',
        deadlineToday: ' Сьогодні дедлайн!',
        deadlineSoon: '️ Залишився 1 день!',
        allEvents: '📋 Всі події',
        oneDayLeft: '️ Залишився 1 день!',
        todayDeadline: ' Сьогодні дедлайн!',
        eventsOn: '📋 Події на {{date}}'
      },
      deadlines: {
        title: '⏰ Трекер дедлайнів',
        overdue: '⏱️ Просрочено',
        daysLeft: 'Залишилось: {{count}} дн.',
        hoursLeft: 'Залишилось: {{count}} год.',
        deadlineLabel: ' Дедлайн: {{date}}',
        noProjects: 'Немає проєктів із дедлайнами.'
      },
      landing: {
  title: 'AI Project Manager',
  subtitle: 'Розумна система для керування проєктами з AI',
  start: '🚀 AI Асистент',
  mainButton: '🚀 AI Асистент',
  login: '🔐 Увійти',
  register: '✍️ Зареєструватися',
  feedback: '💬 Зворотний зв’язок',
  about: 'ℹ️ Про нас',
  rights: 'Усі права захищені.'
},
      login: {
        title: 'Вхід',
        username: 'Імʼя користувача',
        password: 'Пароль',
        button: 'Увійти',
        error: 'Неправильне імʼя користувача або пароль'
      },
      register: {
        title: 'Реєстрація',
        username: 'Імʼя користувача',
        password: 'Пароль',
        button: 'Зареєструватися',
        error: 'Користувач вже існує'
      },
      projects: {
        myProjects: '📁 Мої проєкти',
        addProject: '➕ Додати проєкт',
        titlePlaceholder: 'Введіть назву проєкту',
        status: {
          'У процесі': 'У процесі',
          'Завершено': 'Завершено',
          'Відкладено': 'Відкладено'
        },
        category: {
          'Навчання': 'Навчання',
          'Робота': 'Робота',
          'Особисте': 'Особисте',
          'Інше': 'Інше'
        },
        progress: 'Прогрес (%)',
        add: 'Додати',
        filter: 'Фільтр',
        all: 'Всі',
        editProject: '🛠️ Редагувати проєкт',
        save: 'Зберегти',
        cancel: 'Скасувати',
        deadline: '📅 Дедлайн',
        lessThanDay: '(менше доби!)'
      },
      settings: {
        title: '⚙️ Налаштування',
        profile: 'Профіль',
        editProfile: 'Змінити дані',
        changeAvatar: 'Змінити аватар',
        language: 'Мова',
        darkTheme: 'Темна тема',
        lightTheme: 'Світла тема',
        notifications: 'Сповіщення',
        cancel: 'Скасувати',
        save: 'Зберегти',
        name: 'Ім’я',
        login: 'Логін',
        appearance: 'Зовнішній вигляд'
      },
      common: {
        menu: 'Меню',
        save: 'Зберегти',
        cancel: 'Скасувати',
        delete: 'Видалити',
        edit: 'Редагувати',
        back: 'Назад'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'uk',
  lng: localStorage.getItem('i18nextLng') || 'uk',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;

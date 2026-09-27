/* ==========================================================================
   RAYMOND — ИИ-помощник кампуса
   Университет КАЗГЮУ имени М.С. Нарикбаева (MNU)
   Архитектура данных, ИИ-движок, Навигация, NFC и Интерактивные сценарии
   ========================================================================== */
"use strict";

// ==========================================================================
// 1. DICTIONARIES (Словари локализации и статусов)
// ==========================================================================
const DICTIONARIES = {
  status: {
    "in-office": { label: "В кабинете", dot: "status-online", badgeClass: "badge-success" },
    "teaching": { label: "Проводит занятие", dot: "status-busy", badgeClass: "badge-warning" },
    "offline": { label: "Не в сети", dot: "status-offline", badgeClass: "badge-neutral" },
    "open": { label: "Открыто", dot: "status-online", badgeClass: "badge-success" },
    "available": { label: "Доступно", dot: "status-online", badgeClass: "badge-success" },
    "closed": { label: "Закрыто", dot: "status-offline", badgeClass: "badge-neutral" },
    "live": { label: "Идёт сейчас", dot: "status-online", badgeClass: "badge-danger" },
    "upcoming": { label: "Предстоит", dot: "status-busy", badgeClass: "badge-info" },
    "done": { label: "Завершено", dot: "status-offline", badgeClass: "badge-neutral" }
  },

  categories: {
    faculty: "Преподаватели",
    advisors: "Эдвайзеры",
    admin: "Администрация"
  },

  nav: {
    home: "Главная",
    assistant: "ИИ-помощник",
    schedule: "Моё расписание",
    map: "Карта кампуса",
    people: "Люди",
    services: "Сервисы",
    card: "Студенческая карта"
  },

  ui: {
    appName: "RAYMOND",
    appSubtitle: "ИИ-помощник кампуса",
    online: "В сети",
    nextClassLabel: "Следующая пара",
    fastestRoute: "Самый быстрый маршрут",
    hurryButton: "Я спешу",
    hurryModalSub: "Вся важная информация для быстрого перехода",
    searchPlaceholder: "Спросите RAYMOND о чём угодно...",
    peopleSearchPlaceholder: "Найти преподавателя или эдвайзера...",
    mapSearchPlaceholder: "Поиск кабинетов, служб, аудиторий...",
    cardScannerTitle: "Личная информация",
    cardScannerSubtitle: "Приложите студенческую карту к считывателю",
    simulateCardTap: "Симулировать прикладывание карты",
    personalSession: "Личный сеанс",
    sessionAutoClose: "Сеанс завершится автоматически",
    buildRoute: "Построить маршрут",
    showOnMap: "Показать на карте",
    askQuestion: "Задать вопрос",
    viewProfile: "Профиль",
    teacherSchedule: "Расписание",
    startNavigation: "Начать маршрут",
    importantToday: "Важное сегодня",
    seeAll: "Все события"
  }
};

// ==========================================================================
// 2. MOCK DATA (Структурированные данные кампуса MNU)
// ==========================================================================
const MOCK_DATA = {
  // Студент (в приоритете: следующая пара, аудитория, время, маршрут)
  currentStudent: {
    name: "Абилмансур",
    id: "MNU-2024-1847",
    program: "Компьютерные науки",
    year: "2 курс",
    nextClass: {
      course: "AI Fundamentals",
      time: "14:00",
      endTime: "15:30",
      room: "306",
      floor: 3,
      teacher: "Dr. Anna Smith",
      startsInMinutes: 18,
      distanceMeters: 85,
      walkMinutes: 2
    }
  },

  // Преподаватели и сотрудники с реалистичными метками времени
  teachers: [
    {
      id: 1,
      name: "Dr. Anna Smith",
      title: "Dr.",
      subject: "AI Fundamentals",
      room: "421",
      floor: 4,
      status: "in-office",
      updatedAt: "Обновлено 2 минуты назад",
      available: "Доступен до 16:00",
      category: "faculty",
      email: "a.smith@mnu.edu.kz",
      initials: "AS",
      color: "red",
      nextClass: { time: "14:00", course: "AI Fundamentals", room: "306" }
    },
    {
      id: 2,
      name: "Dr. Michael Brown",
      title: "Dr.",
      subject: "Mathematics & Statistics",
      room: "214",
      floor: 2,
      status: "teaching",
      updatedAt: "Обновлено 10 минут назад",
      currentClass: "Высшая математика (семинар)",
      category: "faculty",
      email: "m.brown@mnu.edu.kz",
      initials: "MB",
      color: "blue",
      nextClass: { time: "16:00", course: "Статистика", room: "201" }
    },
    {
      id: 3,
      name: "Prof. Karimov",
      title: "Prof.",
      subject: "Database Systems",
      room: "302",
      floor: 3,
      status: "offline",
      updatedAt: "Обновлено 35 минут назад",
      lastSeen: "35 минут назад",
      category: "faculty",
      email: "k.karimov@mnu.edu.kz",
      initials: "KA",
      color: "gray",
      nextClass: { time: "16:00", course: "Database Systems", room: "302" }
    },
    {
      id: 4,
      name: "Dr. Lisa Chen",
      title: "Dr.",
      subject: "Data Science & Эдвайзинг",
      room: "215",
      floor: 2,
      status: "in-office",
      updatedAt: "Обновлено 5 минут назад",
      available: "Доступен до 17:30",
      category: "advisors",
      email: "l.chen@mnu.edu.kz",
      initials: "LC",
      color: "red",
      nextClass: { time: "15:00", course: "Консультация студентов", room: "215" }
    },
    {
      id: 5,
      name: "Данияр Сериков",
      title: "Эдвайзер",
      subject: "Академический эдвайзинг (IT и Право)",
      room: "215",
      floor: 2,
      status: "in-office",
      updatedAt: "Обновлено 8 минут назад",
      available: "Доступен до 18:00",
      category: "advisors",
      email: "d.serikov@mnu.edu.kz",
      initials: "ДС",
      color: "red",
      nextClass: null
    },
    {
      id: 6,
      name: "Деканат Высшей школы IT и Права",
      title: "Администрация",
      subject: "Приём заявлений, справки и академические вопросы",
      room: "110",
      floor: 1,
      status: "in-office",
      updatedAt: "Обновлено 4 минуты назад",
      available: "Приёмные часы: 09:00 – 17:00",
      category: "admin",
      email: "dean.office@mnu.edu.kz",
      initials: "ДЕК",
      color: "dark",
      nextClass: null
    },
    {
      id: 7,
      name: "ЦОС (Центр обслуживания студентов)",
      title: "Студенческий отдел",
      subject: "Транскрипты, справки с места учёбы, студенческие билеты",
      room: "105",
      floor: 1,
      status: "in-office",
      updatedAt: "Обновлено 1 минуту назад",
      available: "Пн–Пт: 09:00 – 18:00",
      category: "admin",
      email: "students@mnu.edu.kz",
      initials: "ЦОС",
      color: "red",
      nextClass: null
    }
  ],

  // Расписание
  schedule: {
    today: [
      { time: "09:00", endTime: "10:30", course: "ICT (Информационные технологии)", room: "302", floor: 3, teacher: "Dr. Anna Smith", type: "Лекция", status: "done" },
      { time: "11:00", endTime: "12:30", course: "Mathematics (Математика)", room: "214", floor: 2, teacher: "Dr. Michael Brown", type: "Семинар", status: "done" },
      { time: "14:00", endTime: "15:30", course: "AI Fundamentals", room: "306", floor: 3, teacher: "Dr. Anna Smith", type: "Лабораторная работа", status: "live" },
      { time: "16:00", endTime: "17:30", course: "Database Systems", room: "302", floor: 3, teacher: "Prof. Karimov", type: "Лекция", status: "upcoming" }
    ],
    tomorrow: [
      { time: "09:00", endTime: "10:30", course: "AI Fundamentals", room: "421", floor: 4, teacher: "Dr. Anna Smith", type: "Консультация", status: "upcoming" },
      { time: "11:00", endTime: "12:30", course: "Database Systems", room: "302", floor: 3, teacher: "Prof. Karimov", type: "Семинар", status: "upcoming" },
      { time: "14:00", endTime: "15:30", course: "Mathematics", room: "214", floor: 2, teacher: "Dr. Michael Brown", type: "Практикум", status: "upcoming" }
    ]
  },

  // Аудитории
  rooms: [
    { id: "r306", num: "306", floor: 3, name: "Кабинет 306", type: "Компьютерный класс", capacity: 40, desc: "Лаборатория искусственного интеллекта и практических занятий." },
    { id: "r214", num: "214", floor: 2, name: "Кабинет 214", type: "Семинарская аудитория", capacity: 25, desc: "Аудитория математических дисциплин." },
    { id: "r302", num: "302", floor: 3, name: "Кабинет 302", type: "Лекционный зал", capacity: 80, desc: "Большой лекционный зал компьютерных наук." },
    { id: "r421", num: "421", floor: 4, name: "Кабинет 421", type: "Кафедра IT / Кабинет преподавателя", capacity: 10, desc: "Рабочий кабинет преподавателей кафедры AI." },
    { id: "r215", num: "215", floor: 2, name: "Кабинет 215", type: "Офис эдвайзинга", capacity: 15, desc: "Академические консультации и помощь студентам." },
    { id: "r110", num: "110", floor: 1, name: "Кабинет 110", type: "Деканат", capacity: 20, desc: "Деканат и приёмная руководства школы." },
    { id: "r105", num: "105", floor: 1, name: "Кабинет 105", type: "ЦОС", capacity: 30, desc: "Единое окно обслуживания студентов." }
  ],

  // Университетские сервисы
  services: [
    {
      id: "library",
      name: "Библиотека",
      desc: "Учебная литература, электронные базы данных, зоны тишины и залы для командной работы.",
      icon: "📚",
      location: "Главный корпус, 1 этаж",
      hours: "Пн–Пт: 08:30 – 21:00 | Сб: 09:00 – 20:00",
      status: "open",
      targetRoom: "library"
    },
    {
      id: "it-support",
      name: "IT Support",
      desc: "Помощь с Wi-Fi, корпоративной почтой Canvas/Platonus, лицензиями ПО и студенческими аккаунтами.",
      icon: "💻",
      location: "Корпус B, Кабинет 102",
      hours: "Пн–Пт: 09:00 – 18:00",
      status: "available",
      targetRoom: "it"
    },
    {
      id: "advising",
      name: "Эдвайзинг",
      desc: "Помощь в составлении индивидуального учебного плана, выборе дисциплин и пререквизитов.",
      icon: "🎓",
      location: "Главный корпус, Кабинет 215",
      hours: "Пн–Пт: 10:00 – 17:30",
      status: "available",
      targetRoom: "r215"
    },
    {
      id: "student-affairs",
      name: "Студенческий отдел (ЦОС)",
      desc: "Официальные справки с места учёбы, оформление пропусков, переводы и академические отпуска.",
      icon: "🤝",
      location: "Корпус C, 1 этаж, Кабинет 105",
      hours: "Пн–Пт: 09:00 – 18:00",
      status: "open",
      targetRoom: "r105"
    },
    {
      id: "career",
      name: "Career Center",
      desc: "Стажировки, ярмарки вакансий, проверка резюме и программы партнёрства с работодателями.",
      icon: "💼",
      location: "Главный корпус, Кабинет 310",
      hours: "Пн–Пт: 10:00 – 17:00",
      status: "open",
      targetRoom: "career"
    },
    {
      id: "admin",
      name: "Администрация & Деканат",
      desc: "Руководство Высших школ, согласование официальных документов и заявлений.",
      icon: "🏛️",
      location: "Главный корпус, 1 этаж, Кабинет 110",
      hours: "Пн–Пт: 09:00 – 17:00",
      status: "open",
      targetRoom: "r110"
    },
    {
      id: "cafeteria",
      name: "Столовая кампуса",
      desc: "Горячие обеды, кофе-пойнты, свежая выпечка и комфортная зона отдыха.",
      icon: "🍽️",
      location: "Главный корпус, 1 этаж (восточное крыло)",
      hours: "Пн–Пт: 08:00 – 20:00 | Сб: 09:00 – 17:00",
      status: "open",
      targetRoom: "cafeteria"
    },
    {
      id: "lost-found",
      name: "Бюро находок",
      desc: "Регистрация и получение забытых вещей, документов, ключей и устройств.",
      icon: "🔍",
      location: "Главный вход, Пост охраны",
      hours: "Круглосуточно",
      status: "available",
      targetRoom: "security"
    }
  ],

  // Объявления "Важное сегодня"
  announcements: [
    {
      id: 1,
      tag: "warning",
      tagText: "Изменение аудитории",
      time: "08:45",
      text: "Занятие перенесено в аудиторию 306.",
      full: "В связи с техническими работами в корпусе семинар по искусственному интеллекту перенесён в аудиторию 306 (3 этаж, компьютерный класс)."
    },
    {
      id: 2,
      tag: "event",
      tagText: "Мероприятие",
      time: "09:30",
      text: "Career Workshop — сегодня в 15:00.",
      full: "Встреча с HR ведущих IT-компаний Казахстана в Актовом зале. Разбор резюме и консультации по стажировкам для студентов 2–4 курсов."
    },
    {
      id: 3,
      tag: "info",
      tagText: "Библиотека",
      time: "11:00",
      text: "Изменён график работы: в субботу открыто до 20:00.",
      full: "Для удобства студентов в период подготовки к промежуточным аттестациям время работы библиотеки в субботу продлено до 20:00."
    }
  ],

  // Локации для карты кампуса
  locations: {
    ground: [
      { id: "entrance", name: "Главный вход", icon: "🚪", floor: 0 },
      { id: "security", name: "Пост охраны", icon: "🛡️", floor: 0 },
      { id: "cafeteria", name: "Столовая", icon: "🍽️", floor: 0 },
      { id: "reception", name: "Ресепшн / Инфостойка", icon: "ℹ️", floor: 0 }
    ],
    floor1: [
      { id: "library", name: "Библиотека MNU", icon: "📚", floor: 1 },
      { id: "r105", name: "Кабинет 105 (ЦОС)", icon: "🤝", floor: 1 },
      { id: "r110", name: "Кабинет 110 (Деканат)", icon: "🏛️", floor: 1 },
      { id: "it", name: "IT Support (Каб. 102)", icon: "💻", floor: 1 },
      { id: "elevator", name: "Лифтовый холл", icon: "🛗", floor: 1 }
    ],
    floor2: [
      { id: "r201", name: "Кабинет 201", icon: "🚪", floor: 2 },
      { id: "r214", name: "Кабинет 214", icon: "🚪", floor: 2 },
      { id: "r215", name: "Кабинет 215 (Эдвайзинг)", icon: "🎓", floor: 2 },
      { id: "stairs", name: "Центральная лестница", icon: "🔼", floor: 2 }
    ],
    floor3: [
      { id: "r302", name: "Кабинет 302 (Лекционный зал)", icon: "📢", floor: 3 },
      { id: "r306", name: "Кабинет 306 (Лаборатория AI)", icon: "🖥️", floor: 3 },
      { id: "affairs", name: "Студенческий совет", icon: "🤝", floor: 3 }
    ],
    floor4: [
      { id: "r421", name: "Кабинет 421 (Кафедра IT)", icon: "👨‍🏫", floor: 4 },
      { id: "career", name: "Кабинет 310 (Career Center)", icon: "💼", floor: 4 },
      { id: "conference", name: "Конференц-зал", icon: "📋", floor: 4 }
    ]
  }
};

// ==========================================================================
// 3. MOCK AI ENGINE (Обработка естественных запросов на русском языке)
// ==========================================================================
const AI = {
  responses: [
    // 1. Где моя следующая пара?
    {
      patterns: [
        "где моя следующая пара", "где следующая пара", "следующая пара",
        "какая пара", "когда следующая пара", "next class", "my next class"
      ],
      handler: () => ({
        type: "schedule",
        header: "Следующая пара: AI Fundamentals",
        items: [
          { emoji: "📚", label: "Дисциплина", value: "AI Fundamentals (Лабораторная работа)" },
          { emoji: "🕐", label: "Время", value: "14:00 – 15:30" },
          { emoji: "📍", label: "Аудитория", value: "Кабинет 306, 3 этаж" },
          { emoji: "👤", label: "Преподаватель", value: "Dr. Anna Smith" },
          { emoji: "⏱️", label: "До начала", value: "Осталось 18 минут" }
        ],
        buttons: [
          { label: "🧭 Построить маршрут", action: "map:r306" },
          { label: "📅 Моё расписание", action: "schedule" },
          { label: "💬 Задать вопрос", action: "focus" }
        ]
      })
    },

    // 2. Где кабинет 306?
    {
      patterns: [
        "где находится кабинет 306", "где кабинет 306", "кабинет 306", "306",
        "как пройти в 306", "room 306", "find room 306"
      ],
      handler: () => ({
        type: "room",
        header: "Кабинет 306 — Лаборатория AI",
        items: [
          { emoji: "📍", label: "Расположение", value: "3 этаж, Главный корпус" },
          { emoji: "🏫", label: "Назначение", value: "Компьютерный класс (40 мест)" },
          { emoji: "📏", label: "Расстояние", value: "85 метров" },
          { emoji: "⏱️", label: "Время в пути", value: "≈ 2 минуты" }
        ],
        steps: [
          "Пройдите прямо через центральный холл 1 этажа.",
          "Поднимитесь на 3 этаж на лифте или по центральной лестнице.",
          "Поверните налево в сторону учебного крыла.",
          "Кабинет 306 находится справа по коридору."
        ],
        buttons: [
          { label: "🗺️ Показать на карте", action: "map:r306" },
          { label: "🧭 Построить маршрут", action: "map:r306" },
          { label: "💬 Задать вопрос", action: "focus" }
        ]
      })
    },

    // 3. Где кабинет 214?
    {
      patterns: ["кабинет 214", "214", "где 214", "room 214"],
      handler: () => ({
        type: "room",
        header: "Кабинет 214 — Семинарская аудитория",
        items: [
          { emoji: "📍", label: "Расположение", value: "2 этаж, Главный корпус" },
          { emoji: "🏫", label: "Тип", value: "Семинарская аудитория (25 мест)" },
          { emoji: "👤", label: "Преподаватель", value: "Dr. Michael Brown" }
        ],
        steps: [
          "Поднимитесь на 2 этаж по центральной лестнице.",
          "Поверните направо по коридору.",
          "Кабинет 214 расположен слева."
        ],
        buttons: [
          { label: "🗺️ Показать на карте", action: "map:r214" },
          { label: "🧭 Построить маршрут", action: "map:r214" }
        ]
      })
    },

    // 4. Где кабинет 421?
    {
      patterns: ["кабинет 421", "421", "где 421", "кафедра", "room 421"],
      handler: () => ({
        type: "room",
        header: "Кабинет 421 — Кафедра IT",
        items: [
          { emoji: "📍", label: "Расположение", value: "4 этаж, Главный корпус" },
          { emoji: "🏫", label: "Тип", value: "Кабинет преподавателей" },
          { emoji: "👤", label: "Преподаватели", value: "Dr. Anna Smith, кафедра AI" }
        ],
        steps: [
          "Воспользуйтесь лифтом до 4 этажа.",
          "При выходе из лифта поверните налево.",
          "Кабинет 421 — вторая дверь слева."
        ],
        buttons: [
          { label: "🗺️ Показать на карте", action: "map:r421" },
          { label: "👤 Найти преподавателя", action: "people" }
        ]
      })
    },

    // 5. Где мой эдвайзер?
    {
      patterns: [
        "где мой эдвайзер", "мой эдвайзер", "эдвайзер", "эдвайзеры",
        "academic advisor", "advisor", "где найти эдвайзера"
      ],
      handler: () => ({
        type: "person",
        header: "Ваш академический эдвайзер: Dr. Lisa Chen",
        items: [
          { emoji: "👤", label: "Специалист", value: "Dr. Lisa Chen / Данияр Сериков" },
          { emoji: "📍", label: "Кабинет", value: "Кабинет 215, 2 этаж" },
          { emoji: "🟢", label: "Статус", value: "В кабинете · Обновлено 5 минут назад" },
          { emoji: "🕐", label: "Приёмные часы", value: "Сегодня доступен до 17:30" }
        ],
        steps: [
          "Поднимитесь на 2 этаж по центральной лестнице.",
          "Пройдите в офис эдвайзинга (Кабинет 215)."
        ],
        buttons: [
          { label: "👤 Профиль эдвайзера", action: "people" },
          { label: "🧭 Построить маршрут", action: "map:r215" },
          { label: "💬 Задать вопрос", action: "focus" }
        ]
      })
    },

    // 6. Где сейчас профессор Smith?
    {
      patterns: [
        "где сейчас профессор smith", "где профессор smith", "профессор smith",
        "dr smith", "smith", "анна смит", "dr. anna smith", "где смит"
      ],
      handler: () => ({
        type: "person",
        header: "Dr. Anna Smith — AI Fundamentals",
        items: [
          { emoji: "📍", label: "Текущее местонахождение", value: "Кабинет 421 (4 этаж)" },
          { emoji: "🟢", label: "Статус", value: "В кабинете · Обновлено 2 минуты назад" },
          { emoji: "🕐", label: "Доступность", value: "Доступен до 16:00" },
          { emoji: "📚", label: "Следующая пара", value: "14:00 — AI Fundamentals, Кабинет 306" }
        ],
        buttons: [
          { label: "🧭 Построить маршрут", action: "map:r421" },
          { label: "👤 Профиль преподавателя", action: "people" },
          { label: "📅 Расписание", action: "schedule" }
        ]
      })
    },

    // 7. Профессор Michael Brown
    {
      patterns: ["michael brown", "brown", "браун", "математика преподаватель"],
      handler: () => ({
        type: "person",
        header: "Dr. Michael Brown — Высшая математика",
        items: [
          { emoji: "📍", label: "Текущее местонахождение", value: "Кабинет 214 (2 этаж)" },
          { emoji: "🟡", label: "Статус", value: "Проводит занятие · Обновлено 10 минут назад" },
          { emoji: "🕐", label: "Освободится", value: "В 12:30 (перерыв)" }
        ],
        buttons: [
          { label: "🧭 Построить маршрут", action: "map:r214" },
          { label: "👤 Профиль", action: "people" }
        ]
      })
    },

    // 8. Профессор Karimov
    {
      patterns: ["karimov", "каримов", "базы данных преподаватель"],
      handler: () => ({
        type: "person",
        header: "Prof. Karimov — Базы данных",
        items: [
          { emoji: "📍", label: "Последняя локация", value: "Кабинет 302 (3 этаж)" },
          { emoji: "⚪", label: "Статус", value: "Не в сети · Обновлено 35 минут назад" },
          { emoji: "📚", label: "Ближайшая лекция", value: "16:00 — Аудитория 302" }
        ],
        buttons: [
          { label: "👤 Профиль", action: "people" },
          { label: "🧭 К кабинету 302", action: "map:r302" }
        ]
      })
    },

    // 9. Как пройти в библиотеку?
    {
      patterns: [
        "как пройти в библиотеку", "где библиотека", "библиотека",
        "библиотека часы", "library", "books"
      ],
      handler: () => ({
        type: "service",
        header: "Библиотека MNU",
        items: [
          { emoji: "📍", label: "Расположение", value: "Главный корпус, 1 этаж" },
          { emoji: "🕐", label: "График работы", value: "Пн–Пт: 08:30 – 21:00 | Сб: до 20:00" },
          { emoji: "🟢", label: "Статус", value: "Открыто сейчас" },
          { emoji: "💡", label: "Услуги", value: "Коворкинг, тихие залы, выдача книг, Wi-Fi" }
        ],
        steps: [
          "От главного входа поверните направо.",
          "Пройдите через холл 35 метров.",
          "Вход в библиотеку расположен напротив лестницы."
        ],
        buttons: [
          { label: "🧭 Построить маршрут", action: "map:library" },
          { label: "📋 Все сервисы", action: "services" }
        ]
      })
    },

    // 10. Что у меня сегодня по расписанию?
    {
      patterns: [
        "что у меня сегодня по расписанию", "расписание на сегодня", "расписание",
        "моё расписание", "пары сегодня", "schedule", "my schedule", "timetable"
      ],
      handler: () => ({
        type: "schedule-list",
        header: "Расписание на сегодня (27 сентября)",
        items: [
          { emoji: "09:00", label: "ICT", value: "Аудит. 302 ✓ Завершено" },
          { emoji: "11:00", label: "Mathematics", value: "Аудит. 214 ✓ Завершено" },
          { emoji: "14:00", label: "AI Fundamentals", value: "Аудит. 306 ⏱ Следующая" },
          { emoji: "16:00", label: "Database Systems", value: "Аудит. 302 · Предстоит" }
        ],
        buttons: [
          { label: "📅 Моё расписание", action: "schedule" },
          { label: "🧭 Маршрут к следующей паре", action: "map:r306" }
        ]
      })
    },

    // 11. IT Support
    {
      patterns: ["it support", "вай фай", "wifi", "пароль", "компьютерная помощь", "техподдержка"],
      handler: () => ({
        type: "service",
        header: "IT Support — Техническая поддержка",
        items: [
          { emoji: "📍", label: "Расположение", value: "Корпус B, Кабинет 102" },
          { emoji: "🕐", label: "Время работы", value: "09:00 – 18:00 (будни)" },
          { emoji: "🟢", label: "Статус", value: "Доступно сейчас" },
          { emoji: "✉️", label: "Почта", value: "it-support@mnu.edu.kz" }
        ],
        buttons: [
          { label: "🧭 Построить маршрут", action: "map:it" },
          { label: "📋 Сервисы", action: "services" }
        ]
      })
    },

    // 12. Столовая
    {
      patterns: ["столовая", "где поесть", "обед", "еда", "cafeteria", "food"],
      handler: () => ({
        type: "service",
        header: "Кампусная столовая MNU",
        items: [
          { emoji: "📍", label: "Расположение", value: "Главный корпус, 1 этаж (восточное крыло)" },
          { emoji: "🕐", label: "График работы", value: "08:00 – 20:00" },
          { emoji: "🟢", label: "Статус", value: "Открыто" },
          { emoji: "🍽️", label: "Меню", value: "Горячие блюда, выпечка, салаты, напитки" }
        ],
        buttons: [
          { label: "🧭 Построить маршрут", action: "map:cafeteria" }
        ]
      })
    },

    // 13. События
    {
      patterns: ["события", "мероприятия", "что сегодня", "events"],
      handler: () => ({
        type: "events",
        header: "События в MNU сегодня",
        items: [
          { emoji: "💼", label: "15:00", value: "Career Workshop — Актовый зал A" },
          { emoji: "🎭", label: "17:00", value: "Встреча Студенческого совета — Кабинет 302" },
          { emoji: "📖", label: "18:00", value: "Научный семинар по AI — Кабинет 421" }
        ],
        buttons: [
          { label: "📢 Все объявления", action: "home" }
        ]
      })
    }
  ],

  // Сообщение по умолчанию / Не найдено
  fallback: {
    type: "fallback",
    header: "Я пока не нашёл ответа на этот вопрос.",
    text: "Попробуйте спросить о кабинетах, преподавателях, расписании или сервисах университета. Например: «Где моя следующая пара?», «Где находится кабинет 306?» или «Где сейчас профессор Smith?».",
    buttons: [
      { label: "📅 Моё расписание", action: "schedule" },
      { label: "🗺️ Карта кампуса", action: "map" },
      { label: "👥 Найти преподавателя", action: "people" },
      { label: "🔧 Сервисы", action: "services" }
    ]
  },

  query(input) {
    const q = (input || "").toLowerCase().trim();
    if (!q) return this.fallback;
    for (const r of this.responses) {
      if (r.patterns.some(p => q.includes(p.toLowerCase()))) {
        return r.handler();
      }
    }
    return this.fallback;
  }
};

// ==========================================================================
// 4. APPLICATION STATE (Состояние приложения)
// ==========================================================================
let state = {
  currentPage: "home",
  sidebarOpen: false,
  chatMessages: [],
  selectedFloor: "floor3",
  currentMapTarget: "r306",
  showRoute: true,
  peopleTab: "faculty",
  peopleSearch: "",
  studentAuthenticated: false,
  privacySeconds: 10,
  privacyTimer: null,
  lastInteractionTime: Date.now()
};

// ==========================================================================
// 5. NAVIGATION (Маршрутизация и переключение экранов)
// ==========================================================================
function navigate(page, params) {
  state.currentPage = page;

  // Обновляем активный пункт в сайдбаре
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  const navEl = document.getElementById("nav-" + page);
  if (navEl) navEl.classList.add("active");

  renderPage(page, params);

  if (window.innerWidth <= 900) closeSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleSidebar() {
  state.sidebarOpen = !state.sidebarOpen;
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (sidebar) sidebar.classList.toggle("open", state.sidebarOpen);
  if (overlay) overlay.classList.toggle("visible", state.sidebarOpen);
}

function closeSidebar() {
  state.sidebarOpen = false;
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.classList.remove("visible");
}

function renderPage(page, params) {
  const main = document.getElementById("main-content");
  if (!main) return;
  main.innerHTML = "";

  const pages = {
    home: renderHome,
    assistant: renderAssistant,
    schedule: renderSchedule,
    map: renderMap,
    people: renderPeople,
    services: renderServices,
    card: renderStudentCard
  };

  if (pages[page]) {
    pages[page](params);
  } else {
    renderHome();
  }
}

// ==========================================================================
// 6. DASHBOARD (Главная страница)
// ==========================================================================
function renderHome() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="dashboard-container">
      <!-- Верхний приветственный блок -->
      <section class="dashboard-hero">
        <div class="hero-badge">
          <span class="status-dot pulse"></span>
          <span>RAYMOND · ИИ-помощник кампуса MNU</span>
        </div>
        <h1 class="hero-title">Добрый день!</h1>
        <p class="hero-subtitle">Чем я могу помочь вам в университете?</p>

        <!-- Поисковая / чат строка -->
        <div class="ai-search-box" id="home-search-bar">
          <div class="ai-search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input class="ai-search-input" id="home-ai-input" 
                 placeholder="${DICTIONARIES.ui.searchPlaceholder}" 
                 onkeydown="if(event.key==='Enter') handleHomeSearch()" autocomplete="off" />
          <button class="ai-send-btn" onclick="handleHomeSearch()" aria-label="Спросить">
            <span>Спросить</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>

        <!-- Быстрые вопросы-подсказки -->
        <div class="suggestions-cloud">
          <button class="suggestion-chip" onclick="sendSuggestion('Где моя следующая пара?')">Где моя следующая пара?</button>
          <button class="suggestion-chip" onclick="sendSuggestion('Где находится кабинет 306?')">Где кабинет 306?</button>
          <button class="suggestion-chip" onclick="sendSuggestion('Где мой эдвайзер?')">Где мой эдвайзер?</button>
          <button class="suggestion-chip" onclick="sendSuggestion('Где сейчас профессор Smith?')">Где сейчас профессор Smith?</button>
          <button class="suggestion-chip" onclick="sendSuggestion('Как пройти в библиотеку?')">Как пройти в библиотеку?</button>
          <button class="suggestion-chip" onclick="sendSuggestion('Что у меня сегодня по расписанию?')">Что у меня сегодня по расписанию?</button>
        </div>
      </section>

      <!-- Главная фишка: кнопка "Я спешу" -->
      <section class="hurry-banner-section">
        <button class="hurry-banner-btn" onclick="showHurryModal()" aria-label="Я спешу — показать следующую пару и маршрут">
          <div class="hurry-badge-icon">⚡</div>
          <div class="hurry-banner-text">
            <span class="hurry-title">Я спешу</span>
            <span class="hurry-desc">Показать следующую пару, аудиторию и кратчайший маршрут</span>
          </div>
          <div class="hurry-cta">
            <span>Открыть</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </button>
      </section>

      <!-- Сетка быстрых действий (Quick Actions) -->
      <section class="quick-actions-section">
        <div class="section-heading">Быстрый доступ к сервисам кампуса</div>
        <div class="quick-grid">
          <button class="quick-card" onclick="navigate('schedule')">
            <div class="card-icon-bubble red-bubble">📅</div>
            <div class="card-info">
              <div class="card-title">Моё расписание</div>
              <div class="card-caption">Пары, аудитории и статус на сегодня</div>
            </div>
            <svg class="card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <button class="quick-card" onclick="navigate('map', {target:'r306'})">
            <div class="card-icon-bubble">🚪</div>
            <div class="card-info">
              <div class="card-title">Найти кабинет</div>
              <div class="card-caption">Поэтажная навигация и поиск аудитории</div>
            </div>
            <svg class="card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <button class="quick-card" onclick="navigate('people')">
            <div class="card-icon-bubble">👨‍🏫</div>
            <div class="card-info">
              <div class="card-title">Найти преподавателя</div>
              <div class="card-caption">Кабинеты, эдвайзеры и актуальный статус</div>
            </div>
            <svg class="card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <button class="quick-card" onclick="navigate('map')">
            <div class="card-icon-bubble">🗺️</div>
            <div class="card-info">
              <div class="card-title">Карта кампуса</div>
              <div class="card-caption">Схема этажей MNU и построение маршрута</div>
            </div>
            <svg class="card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <button class="quick-card featured" onclick="navigate('card')">
            <div class="card-icon-bubble red-bubble">🎓</div>
            <div class="card-info">
              <div class="card-title">Студенческая карта</div>
              <div class="card-caption">NFC-авторизация и приватный сеанс</div>
            </div>
            <svg class="card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <button class="quick-card" onclick="navigate('services')">
            <div class="card-icon-bubble">🏛️</div>
            <div class="card-info">
              <div class="card-title">Сервисы</div>
              <div class="card-caption">Библиотека, IT Support, ЦОС, столовая</div>
            </div>
            <svg class="card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </section>

      <!-- Информационные карточки (Следующая пара + Важное сегодня) -->
      <section class="dashboard-bottom-grid">
        <!-- Карточка следующей пары -->
        <div class="feature-card next-class-box">
          <div class="box-tag red-tag">СЛЕДУЮЩАЯ ПАРА</div>
          <div class="class-subject-title">AI Fundamentals</div>
          <div class="class-meta-list">
            <div class="class-meta-row">
              <span class="meta-label">Время:</span>
              <span class="meta-val">14:00 – 15:30</span>
            </div>
            <div class="class-meta-row">
              <span class="meta-label">Аудитория:</span>
              <span class="meta-val highlight-val">Аудитория 306</span>
            </div>
            <div class="class-meta-row">
              <span class="meta-label">Преподаватель:</span>
              <span class="meta-val">Dr. Anna Smith</span>
            </div>
            <div class="class-meta-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>До начала — 18 минут</span>
            </div>
          </div>
          <button class="btn-accent-action" onclick="navigate('map', {target:'r306'})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            <span>Построить маршрут</span>
          </button>
        </div>

        <!-- Важное сегодня -->
        <div class="feature-card announcements-box">
          <div class="box-header-row">
            <div class="box-tag">ВАЖНОЕ СЕГОДНЯ</div>
            <span class="date-badge">27 сен, сегодня</span>
          </div>
          <div class="announcements-list">
            ${MOCK_DATA.announcements.map(a => `
              <div class="ann-item" onclick="showAnnouncement(${a.id})">
                <div class="ann-header">
                  <span class="ann-pill ${a.tag}">${a.tagText}</span>
                  <span class="ann-time">${a.time}</span>
                </div>
                <div class="ann-body">${a.text}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
    </div>
  `;
}

function handleHomeSearch() {
  const input = document.getElementById("home-ai-input");
  if (!input) return;
  const q = input.value.trim();
  if (!q) return;
  navigate("assistant");
  setTimeout(() => sendMessage(q), 100);
}

function sendSuggestion(text) {
  navigate("assistant");
  setTimeout(() => sendMessage(text), 150);
}

// ==========================================================================
// 7. AI ASSISTANT (ИИ-помощник с детализированными шагами и кнопками действий)
// ==========================================================================
function renderAssistant() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="assistant-layout">
      <!-- Боковая панель истории диалогов -->
      <aside class="chat-sidebar">
        <div class="chat-sidebar-header">
          <span class="sidebar-title">Диалоги</span>
          <button class="btn-new-chat" onclick="clearChat()" title="Новый диалог">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        <div class="chat-history-list">
          <div class="history-card active">
            <div class="history-title">Текущая сессия</div>
            <div class="history-time">Сегодня, ${formatCurrentTime()}</div>
          </div>
          <div class="history-card" onclick="sendSuggestion('Где находится кабинет 306?')">
            <div class="history-title">Маршрут к кабинету 306</div>
            <div class="history-time">Вчера, 14:15</div>
          </div>
          <div class="history-card" onclick="sendSuggestion('Как пройти в библиотеку?')">
            <div class="history-title">График работы библиотеки</div>
            <div class="history-time">2 дня назад</div>
          </div>
          <div class="history-card" onclick="sendSuggestion('Где сейчас профессор Smith?')">
            <div class="history-title">Где найти Dr. Anna Smith</div>
            <div class="history-time">3 дня назад</div>
          </div>
        </div>

        <div class="chat-sidebar-bottom">
          <div class="chip-label">Популярные вопросы:</div>
          <div class="chip-stack">
            <button class="suggestion-chip" onclick="sendMessage('Где моя следующая пара?')">Где моя следующая пара?</button>
            <button class="suggestion-chip" onclick="sendMessage('Где находится кабинет 306?')">Где кабинет 306?</button>
            <button class="suggestion-chip" onclick="sendMessage('Где мой эдвайзер?')">Где мой эдвайзер?</button>
            <button class="suggestion-chip" onclick="sendMessage('Где сейчас профессор Smith?')">Где сейчас профессор Smith?</button>
            <button class="suggestion-chip" onclick="sendMessage('Как пройти в библиотеку?')">Как пройти в библиотеку?</button>
            <button class="suggestion-chip" onclick="sendMessage('Что у меня сегодня по расписанию?')">Что по расписанию?</button>
          </div>
        </div>
      </aside>

      <!-- Основная область чата -->
      <div class="chat-window">
        <div class="chat-header-bar">
          <div class="chat-bot-avatar">R</div>
          <div class="chat-bot-details">
            <div class="bot-name">RAYMOND</div>
            <div class="bot-status"><span class="status-dot pulse"></span> В сети — ИИ-помощник кампуса MNU</div>
          </div>
          <button class="btn-clear-chat" onclick="clearChat()">Очистить чат</button>
        </div>

        <!-- Контейнер сообщений -->
        <div class="chat-messages-container" id="chat-messages">
          ${state.chatMessages.length === 0 ? renderWelcomeMessageHTML() : ""}
          ${state.chatMessages.map(m => renderMessageHTML(m)).join("")}
        </div>

        <!-- Поле ввода -->
        <div class="chat-input-wrapper">
          <div class="chat-suggestions-bar">
            <button class="suggestion-chip" onclick="sendMessage('Где моя следующая пара?')">Где моя следующая пара?</button>
            <button class="suggestion-chip" onclick="sendMessage('Где находится кабинет 306?')">Где кабинет 306?</button>
            <button class="suggestion-chip" onclick="sendMessage('Где мой эдвайзер?')">Где мой эдвайзер?</button>
            <button class="suggestion-chip" onclick="sendMessage('Где сейчас профессор Smith?')">Где профессор Smith?</button>
            <button class="suggestion-chip" onclick="sendMessage('Как пройти в библиотеку?')">Библиотека</button>
          </div>

          <div class="chat-input-bar">
            <input class="chat-text-input" id="chat-input-field" 
                   placeholder="${DICTIONARIES.ui.searchPlaceholder}" 
                   onkeydown="if(event.key==='Enter') sendFromInput()" autocomplete="off" />
            <button class="chat-send-btn" onclick="sendFromInput()" aria-label="Отправить">
              <span>Отправить</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const msgs = document.getElementById("chat-messages");
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 50);
}

function renderWelcomeMessageHTML() {
  return `
    <div class="msg-row bot-row" id="welcome-msg">
      <div class="bot-avatar-circle">R</div>
      <div class="msg-bubble-box">
        <div class="welcome-card">
          <div class="welcome-heading">Добрый день, Абилмансур! 👋</div>
          <p class="welcome-text">
            Я <strong>RAYMOND</strong> — единая точка доступа студента к университету MNU.<br>
            Спросите меня об аудитории, расписании, эдвайзере, преподавателе или службах кампуса.
          </p>
          <div class="welcome-action-buttons">
            <button class="resp-action-btn primary" onclick="sendMessage('Где моя следующая пара?')">
              📅 Где моя следующая пара?
            </button>
            <button class="resp-action-btn primary" onclick="sendMessage('Где находится кабинет 306?')">
              🚪 Где кабинет 306?
            </button>
            <button class="resp-action-btn secondary" onclick="sendMessage('Где сейчас профессор Smith?')">
              👤 Где профессор Smith?
            </button>
            <button class="resp-action-btn secondary" onclick="navigate('map')">
              🗺️ Открыть карту кампуса
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function sendFromInput() {
  const input = document.getElementById("chat-input-field");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  sendMessage(text);
}

function sendMessage(text) {
  if (state.currentPage !== "assistant") {
    navigate("assistant");
    setTimeout(() => sendMessage(text), 200);
    return;
  }

  const welcome = document.getElementById("welcome-msg");
  if (welcome) welcome.remove();

  const msgs = document.getElementById("chat-messages");
  if (!msgs) return;

  // Добавляем сообщение пользователя
  const userMsg = { role: "user", text };
  state.chatMessages.push(userMsg);
  appendUserMessageDOM(msgs, userMsg);

  // Индикатор печати
  const typingId = "typing-" + Date.now();
  appendTypingIndicatorDOM(msgs, typingId);

  // Задержка ответа
  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    const response = AI.query(text);
    const aiMsg = { role: "raymond", response };
    state.chatMessages.push(aiMsg);
    appendBotMessageDOM(msgs, aiMsg);
    msgs.scrollTop = msgs.scrollHeight;
  }, 500);

  msgs.scrollTop = msgs.scrollHeight;
}

function appendUserMessageDOM(container, msg) {
  const div = document.createElement("div");
  div.className = "msg-row user-row";
  div.innerHTML = `
    <div class="user-avatar-circle">А</div>
    <div class="msg-bubble-box user-bubble">${escapeHtml(msg.text)}</div>
  `;
  container.appendChild(div);
}

function appendTypingIndicatorDOM(container, id) {
  const div = document.createElement("div");
  div.id = id;
  div.className = "msg-row bot-row";
  div.innerHTML = `
    <div class="bot-avatar-circle">R</div>
    <div class="typing-loading-box">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
      <span class="typing-text">RAYMOND ищет информацию...</span>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function appendBotMessageDOM(container, msg) {
  const div = document.createElement("div");
  div.innerHTML = renderMessageHTML(msg);
  container.appendChild(div.firstElementChild);
}

function renderMessageHTML(msg) {
  if (msg.role === "user") {
    return `
      <div class="msg-row user-row">
        <div class="user-avatar-circle">А</div>
        <div class="msg-bubble-box user-bubble">${escapeHtml(msg.text)}</div>
      </div>
    `;
  }

  const r = msg.response;
  let content = "";

  if (r.header) {
    content += `<div class="resp-card-title">${r.header}</div>`;
  }

  if (r.text) {
    content += `<p class="resp-card-desc">${r.text}</p>`;
  }

  if (r.items && r.items.length > 0) {
    content += `<div class="resp-items-grid">`;
    for (const item of r.items) {
      content += `
        <div class="resp-item-row">
          <span class="resp-item-emoji">${item.emoji}</span>
          <div class="resp-item-data">
            <span class="resp-item-label">${item.label}</span>
            <span class="resp-item-val">${item.value}</span>
          </div>
        </div>
      `;
    }
    content += `</div>`;
  }

  if (r.steps && r.steps.length > 0) {
    content += `
      <div class="resp-steps-box">
        <div class="steps-heading">Маршрут:</div>
        <ol class="steps-numbered-list">
          ${r.steps.map(s => `<li>${s}</li>`).join("")}
        </ol>
      </div>
    `;
  }

  if (r.buttons && r.buttons.length > 0) {
    content += `<div class="resp-buttons-row">`;
    for (const btn of r.buttons) {
      let clickHandler = "";
      if (btn.action === "focus") {
        clickHandler = "document.getElementById('chat-input-field')?.focus()";
      } else if (btn.action.startsWith("map:")) {
        const target = btn.action.split(":")[1];
        clickHandler = `navigate('map', {target:'${target}'})`;
      } else {
        clickHandler = `navigate('${btn.action}')`;
      }
      content += `<button class="resp-action-btn primary" onclick="${clickHandler}">${btn.label}</button>`;
    }
    content += `</div>`;
  }

  return `
    <div class="msg-row bot-row">
      <div class="bot-avatar-circle">R</div>
      <div class="msg-bubble-box">
        <div class="ai-structured-card">${content}</div>
      </div>
    </div>
  `;
}

function clearChat() {
  state.chatMessages = [];
  renderAssistant();
}

// ==========================================================================
// 8. SCHEDULE (Моё расписание)
// ==========================================================================
function renderSchedule() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="page-container">
      <div class="page-top-header">
        <div class="header-pretitle">Академический календарь · Осенний семестр</div>
        <h1 class="header-main-title">Моё расписание</h1>
        <p class="header-sub-desc">Воскресенье, 27 сентября 2026 года — 5 учебная неделя</p>
      </div>

      <!-- Действия расписания -->
      <div class="schedule-actions-bar">
        <button class="btn-accent-action" onclick="navigate('card')">
          <span>🎓 Личный доступ через карту студента</span>
        </button>
        <button class="btn-secondary-action" onclick="showHurryModal()">
          <span>⚡ Я спешу</span>
        </button>
      </div>

      <!-- Расписание на сегодня -->
      <div class="schedule-day-block">
        <div class="day-block-title">
          <span>Сегодня</span>
          <span class="day-badge red-badge">27 сентября</span>
        </div>
        <div class="classes-vertical-stack">
          ${MOCK_DATA.schedule.today.map(cls => renderClassItemHTML(cls)).join("")}
        </div>
      </div>

      <!-- Расписание на завтра -->
      <div class="schedule-day-block">
        <div class="day-block-title">
          <span>Завтра</span>
          <span class="day-badge">28 сентября</span>
        </div>
        <div class="classes-vertical-stack">
          ${MOCK_DATA.schedule.tomorrow.map(cls => renderClassItemHTML(cls)).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderClassItemHTML(cls) {
  const isLive = cls.status === "live";
  const statusDict = DICTIONARIES.status[cls.status] || DICTIONARIES.status.upcoming;

  return `
    <div class="class-card-item ${isLive ? 'current-active' : ''}" 
         onclick="navigate('map', {target:'r${cls.room}'})"
         title="Нажмите, чтобы проложить маршрут к кабинету ${cls.room}">
      <div class="class-time-column">
        <div class="time-start">${cls.time}</div>
        <div class="time-end">${cls.endTime}</div>
      </div>
      <div class="class-body-column">
        <div class="class-top-row">
          <div class="class-course-name">${cls.course}</div>
          <span class="class-status-pill ${cls.status}">
            <span class="status-dot"></span>
            ${statusDict.label}
          </span>
        </div>
        <div class="class-meta-tags">
          <span class="meta-tag-pill">📍 Аудитория ${cls.room} (${cls.floor} этаж)</span>
          <span class="meta-tag-pill">👤 ${cls.teacher}</span>
          <span class="meta-tag-pill">🏫 ${cls.type}</span>
        </div>
      </div>
      <div class="class-action-column">
        <button class="btn-route-tiny" onclick="event.stopPropagation(); navigate('map', {target:'r${cls.room}'})">
          <span>Маршрут</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  `;
}

// ==========================================================================
// 9. CAMPUS MAP (Интерактивная карта кампуса и маршрутизация)
// ==========================================================================
function renderMap(params) {
  const main = document.getElementById("main-content");
  if (!main) return;

  if (params && params.target) {
    state.currentMapTarget = params.target;
    state.showRoute = true;
    const room = MOCK_DATA.rooms.find(r => r.id === params.target);
    if (room) {
      state.selectedFloor = "floor" + room.floor;
    }
  }

  main.innerHTML = `
    <div class="map-page-layout">
      <!-- Боковая панель поиска локаций и этажей -->
      <aside class="map-sidebar-panel">
        <div class="map-panel-title">Карта кампуса MNU</div>

        <!-- Поиск на карте -->
        <div class="map-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="map-search-field" id="map-search-input" 
                 placeholder="${DICTIONARIES.ui.mapSearchPlaceholder}" 
                 oninput="filterMapLocations(this.value)" autocomplete="off" />
        </div>

        <!-- Переключатель этажей -->
        <div class="floor-selector-bar">
          ${[
            { key: "ground", label: "1 (Холл)" },
            { key: "floor1", label: "1 этаж" },
            { key: "floor2", label: "2 этаж" },
            { key: "floor3", label: "3 этаж" },
            { key: "floor4", label: "4 этаж" }
          ].map(f => `
            <button class="floor-btn ${state.selectedFloor === f.key ? 'active' : ''}" 
                    onclick="selectFloor('${f.key}')">${f.label}</button>
          `).join("")}
        </div>

        <!-- Список помещений выбранного этажа -->
        <div class="locations-scroll-list" id="map-locations-list">
          ${renderLocationListHTML()}
        </div>
      </aside>

      <!-- Холст карты -->
      <div class="map-canvas-container" id="map-canvas-container">
        <canvas id="campus-map-canvas"></canvas>

        <!-- Плашка информации о маршруте -->
        <div id="route-panel-holder">
          ${state.showRoute && state.currentMapTarget ? renderRoutePanelHTML() : ""}
        </div>
      </div>
    </div>
  `;

  setTimeout(() => drawMap(), 60);
}

function renderLocationListHTML() {
  const floor = state.selectedFloor;
  const locations = MOCK_DATA.locations[floor] || [];

  if (locations.length === 0) {
    return `<div class="empty-list-msg">На этом этаже нет выбранных локаций</div>`;
  }

  return locations.map(loc => `
    <div class="location-card-item ${state.currentMapTarget === loc.id ? 'active-target' : ''}" 
         onclick="selectMapTarget('${loc.id}')">
      <div class="loc-icon-bubble">${loc.icon}</div>
      <div class="loc-details">
        <div class="loc-title">${loc.name}</div>
        <div class="loc-sub">${loc.floor === 0 ? 'Цоколь / 1 этаж' : loc.floor + ' этаж'}</div>
      </div>
      <svg class="loc-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  `).join("");
}

function renderRoutePanelHTML() {
  let targetName = "Кабинет 306";
  const allLocs = Object.values(MOCK_DATA.locations).flat();
  const found = allLocs.find(l => l.id === state.currentMapTarget);
  if (found) targetName = found.name;

  return `
    <div class="route-hud-panel">
      <div class="hud-main-info">
        <div class="hud-label">МАРШРУТ К ОБЪЕКТУ</div>
        <div class="hud-target-name">${targetName}</div>
      </div>
      <div class="hud-stats-group">
        <div class="hud-stat-box">
          <div class="hud-stat-value">85 м</div>
          <div class="hud-stat-caption">Расстояние</div>
        </div>
        <div class="hud-divider"></div>
        <div class="hud-stat-box">
          <div class="hud-stat-value">≈ 2 мин</div>
          <div class="hud-stat-caption">Пешком</div>
        </div>
      </div>
      <button class="btn-start-navigation" onclick="startNavigationGuide()">
        ▶ Начать маршрут
      </button>
    </div>
  `;
}

function selectFloor(floorKey) {
  state.selectedFloor = floorKey;
  const list = document.getElementById("map-locations-list");
  if (list) list.innerHTML = renderLocationListHTML();

  document.querySelectorAll(".floor-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("onclick")?.includes(floorKey));
  });

  drawMap();
}

function selectMapTarget(id) {
  state.currentMapTarget = id;
  state.showRoute = true;

  for (const [fKey, list] of Object.entries(MOCK_DATA.locations)) {
    if (list.some(l => l.id === id)) {
      state.selectedFloor = fKey;
      break;
    }
  }

  const list = document.getElementById("map-locations-list");
  if (list) list.innerHTML = renderLocationListHTML();

  const hud = document.getElementById("route-panel-holder");
  if (hud) hud.innerHTML = renderRoutePanelHTML();

  drawMap();
}

function filterMapLocations(query) {
  const q = (query || "").toLowerCase().trim();
  const list = document.getElementById("map-locations-list");
  if (!list) return;

  if (!q) {
    list.innerHTML = renderLocationListHTML();
    return;
  }

  const all = Object.values(MOCK_DATA.locations).flat();
  const filtered = all.filter(l => l.name.toLowerCase().includes(q));

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-list-msg">Ничего не найдено по запросу "${query}"</div>`;
    return;
  }

  list.innerHTML = filtered.map(loc => `
    <div class="location-card-item ${state.currentMapTarget === loc.id ? 'active-target' : ''}" 
         onclick="selectMapTarget('${loc.id}')">
      <div class="loc-icon-bubble">${loc.icon}</div>
      <div class="loc-details">
        <div class="loc-title">${loc.name}</div>
        <div class="loc-sub">${loc.floor === 0 ? 'Цоколь' : loc.floor + ' этаж'}</div>
      </div>
    </div>
  `).join("");
}

function drawMap() {
  const canvas = document.getElementById("campus-map-canvas");
  if (!canvas) return;

  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;

  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  // Чистый фон кампуса в красно-белой палитре
  ctx.fillStyle = "#F7F7F8";
  ctx.fillRect(0, 0, W, H);

  // Сетка пола
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  const cx = W / 2;
  const cy = H / 2;

  // Контур здания MNU
  const bx = cx - 250, by = cy - 170, bw = 500, bh = 340;

  // Тень здания
  ctx.fillStyle = "rgba(0,0,0,0.03)";
  roundRect(ctx, bx + 4, by + 4, bw, bh, 20);
  ctx.fill();

  // Основа здания
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, bx, by, bw, bh, 20);
  ctx.fill();
  ctx.strokeStyle = "#D1D5DB";
  ctx.lineWidth = 2;
  roundRect(ctx, bx, by, bw, bh, 20);
  ctx.stroke();

  // Плашка названия этажа
  ctx.fillStyle = "#C8102E";
  roundRect(ctx, bx + 16, by + 16, 120, 28, 8);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 11px Inter, sans-serif";
  ctx.textAlign = "center";
  const floorNameMap = {
    ground: "1 ЭТАЖ / ХОЛЛ",
    floor1: "1 ЭТАЖ",
    floor2: "2 ЭТАЖ",
    floor3: "3 ЭТАЖ",
    floor4: "4 ЭТАЖ"
  };
  ctx.fillText(floorNameMap[state.selectedFloor] || "3 ЭТАЖ", bx + 76, by + 34);

  // Планы этажей
  const floorPlans = {
    ground: [
      { x: bx+20, y: by+60, w: 120, h: 80, label: "Главный вход", icon: "🚪", id: "entrance" },
      { x: bx+150, y: by+60, w: 120, h: 80, label: "Ресепшн", icon: "ℹ️", id: "reception" },
      { x: bx+280, y: by+60, w: 100, h: 80, label: "Пост охраны", icon: "🛡️", id: "security" },
      { x: bx+390, y: by+60, w: 90, h: 80, label: "Лифт", icon: "🛗", id: "elevator" },
      { x: bx+20, y: by+160, w: 360, h: 70, label: "Центральный холл", icon: "", id: "corridor" },
      { x: bx+20, y: by+250, w: 260, h: 70, label: "Столовая кампуса", icon: "🍽️", id: "cafeteria" },
      { x: bx+290, y: by+250, w: 190, h: 70, label: "Лестница", icon: "🔼", id: "stairs" }
    ],
    floor1: [
      { x: bx+20, y: by+60, w: 220, h: 120, label: "Библиотека MNU", icon: "📚", id: "library" },
      { x: bx+250, y: by+60, w: 110, h: 120, label: "IT Support", icon: "💻", id: "it" },
      { x: bx+370, y: by+60, w: 110, h: 120, label: "Лифт", icon: "🛗", id: "elevator" },
      { x: bx+20, y: by+190, w: 460, h: 40, label: "Коридор", icon: "", id: "corridor" },
      { x: bx+20, y: by+240, w: 220, h: 80, label: "Деканат (110)", icon: "🏛️", id: "r110" },
      { x: bx+250, y: by+240, w: 230, h: 80, label: "ЦОС (105)", icon: "🤝", id: "r105" }
    ],
    floor2: [
      { x: bx+20, y: by+60, w: 130, h: 100, label: "Кабинет 201", icon: "🚪", id: "r201" },
      { x: bx+160, y: by+60, w: 150, h: 100, label: "Кабинет 214", icon: "🚪", id: "r214" },
      { x: bx+320, y: by+60, w: 160, h: 100, label: "Эдвайзинг (215)", icon: "🎓", id: "r215" },
      { x: bx+20, y: by+170, w: 460, h: 50, label: "Коридор 2 этажа", icon: "", id: "corridor" },
      { x: bx+20, y: by+230, w: 240, h: 90, label: "Зона самоподготовки", icon: "📖", id: "study" },
      { x: bx+270, y: by+230, w: 210, h: 90, label: "Лестничный холл", icon: "🔼", id: "stairs" }
    ],
    floor3: [
      { x: bx+20, y: by+60, w: 160, h: 110, label: "Кабинет 302", icon: "📢", id: "r302" },
      { x: bx+190, y: by+60, w: 170, h: 110, label: "Кабинет 306", icon: "🖥️", id: "r306" },
      { x: bx+370, y: by+60, w: 110, h: 110, label: "Лифт & Лестница", icon: "🛗", id: "elevator" },
      { x: bx+20, y: by+180, w: 460, h: 50, label: "Центральный коридор", icon: "", id: "corridor" },
      { x: bx+20, y: by+240, w: 260, h: 80, label: "Студенческий совет", icon: "🤝", id: "affairs" },
      { x: bx+290, y: by+240, w: 190, h: 80, label: "Зона отдыха", icon: "☕", id: "lounge" }
    ],
    floor4: [
      { x: bx+20, y: by+60, w: 200, h: 120, label: "Кабинет 421", icon: "👨‍🏫", id: "r421" },
      { x: bx+230, y: by+60, w: 140, h: 120, label: "Career Center", icon: "💼", id: "career" },
      { x: bx+380, y: by+60, w: 100, h: 120, label: "Лифт", icon: "🛗", id: "elevator" },
      { x: bx+20, y: by+190, w: 460, h: 45, label: "Коридор 4 этажа", icon: "", id: "corridor" },
      { x: bx+20, y: by+245, w: 460, h: 75, label: "Конференц-зал", icon: "📋", id: "conference" }
    ]
  };

  const rooms = floorPlans[state.selectedFloor] || floorPlans.floor3;
  const startX = bx + 60;
  const startY = by + 205;

  // Отрисовка помещений
  for (const r of rooms) {
    const isTarget = state.currentMapTarget === r.id;
    const isCorridor = r.id === "corridor";

    if (isCorridor) {
      ctx.fillStyle = "#F3F4F6";
    } else if (isTarget) {
      ctx.fillStyle = "#FEE2E2"; // Мягкий акцентный красный фон для цели
    } else {
      ctx.fillStyle = "#FFFFFF";
    }

    roundRect(ctx, r.x, r.y, r.w, r.h, 10);
    ctx.fill();

    ctx.strokeStyle = isTarget ? "#C8102E" : "#E5E7EB";
    ctx.lineWidth = isTarget ? 2.5 : 1;
    roundRect(ctx, r.x, r.y, r.w, r.h, 10);
    ctx.stroke();

    if (!isCorridor) {
      if (r.icon) {
        ctx.font = "20px serif";
        ctx.textAlign = "center";
        ctx.fillText(r.icon, r.x + r.w / 2, r.y + r.h / 2 - 6);
      }
      ctx.fillStyle = isTarget ? "#8F1025" : "#171717";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(r.label, r.x + r.w / 2, r.y + r.h / 2 + 16);
    }
  }

  // Маршрут к цели (в фирменном красном цвете RAYMOND #C8102E)
  if (state.showRoute && state.currentMapTarget) {
    const targetRoom = rooms.find(r => r.id === state.currentMapTarget);
    if (targetRoom) {
      const tx = targetRoom.x + targetRoom.w / 2;
      const ty = targetRoom.y + targetRoom.h / 2;

      ctx.save();
      ctx.strokeStyle = "#C8102E";
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + 120, startY);
      ctx.lineTo(tx, startY);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.restore();

      // Финишная точка маршрута
      ctx.fillStyle = "#C8102E";
      ctx.beginPath();
      ctx.arc(tx, ty, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 10px Inter";
      ctx.textAlign = "center";
      ctx.fillText("✓", tx, ty + 3.5);
    }
  }

  // Точка "Вы здесь"
  ctx.fillStyle = "rgba(200, 16, 46, 0.15)";
  ctx.beginPath();
  ctx.arc(startX, startY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#C8102E";
  ctx.beginPath();
  ctx.arc(startX, startY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 8px Inter";
  ctx.textAlign = "center";
  ctx.fillText("Вы", startX, startY + 3);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function startNavigationGuide() {
  showToast("🧭 Маршрут активирован! Следуйте по красной линии к аудитории.", "success");
}

// ==========================================================================
// 10. PEOPLE (Люди: Преподаватели | Эдвайзеры | Администрация)
// ==========================================================================
function renderPeople() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="page-container">
      <div class="page-top-header">
        <div class="header-pretitle">Справочник кампуса · Персонал</div>
        <h1 class="header-main-title">Люди</h1>
        <p class="header-sub-desc">Поиск преподавателей, академических эдвайзеров и сотрудников администрации</p>
      </div>

      <!-- Поисковая строка -->
      <div class="people-search-container">
        <div class="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="people-input-box" id="people-filter-input" 
                 placeholder="${DICTIONARIES.ui.peopleSearchPlaceholder}" 
                 value="${escapeHtml(state.peopleSearch)}"
                 oninput="handlePeopleSearch(this.value)" autocomplete="off" />
        </div>
      </div>

      <!-- Вкладки категорий -->
      <div class="people-tabs-row">
        <button class="tab-chip ${state.peopleTab === 'faculty' ? 'active' : ''}" 
                onclick="setPeopleTab('faculty')">Преподаватели</button>
        <button class="tab-chip ${state.peopleTab === 'advisors' ? 'active' : ''}" 
                onclick="setPeopleTab('advisors')">Эдвайзеры</button>
        <button class="tab-chip ${state.peopleTab === 'admin' ? 'active' : ''}" 
                onclick="setPeopleTab('admin')">Администрация</button>
      </div>

      <!-- Сетка карточек -->
      <div class="people-cards-grid" id="people-grid-container">
        ${renderPeopleCardsHTML()}
      </div>
    </div>
  `;
}

function setPeopleTab(tab) {
  state.peopleTab = tab;
  const grid = document.getElementById("people-grid-container");
  if (grid) grid.innerHTML = renderPeopleCardsHTML();

  document.querySelectorAll(".tab-chip").forEach(c => {
    c.classList.toggle("active", c.getAttribute("onclick")?.includes(tab));
  });
}

function handlePeopleSearch(val) {
  state.peopleSearch = val;
  const grid = document.getElementById("people-grid-container");
  if (grid) grid.innerHTML = renderPeopleCardsHTML();
}

function renderPeopleCardsHTML() {
  const q = (state.peopleSearch || "").toLowerCase().trim();
  let list = MOCK_DATA.teachers.filter(t => t.category === state.peopleTab);

  if (q) {
    list = list.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.room.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    return `
      <div class="not-found-card">
        <div class="not-found-icon">🔍</div>
        <div class="not-found-title">Преподаватель или сотрудник не найден</div>
        <div class="not-found-desc">Попробуйте изменить запрос или переключить категорию выше.</div>
      </div>
    `;
  }

  return list.map(t => {
    const s = DICTIONARIES.status[t.status] || DICTIONARIES.status["in-office"];
    return `
      <div class="person-card">
        <div class="person-card-header">
          <div class="person-avatar-red">${t.initials}</div>
          <div class="person-main-info">
            <div class="person-full-name">${t.name}</div>
            <div class="person-discipline">${t.subject}</div>
            <div class="person-office-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Кабинет ${t.room} (${t.floor} этаж)</span>
            </div>
          </div>
        </div>

        <!-- Статус с меткой времени -->
        <div class="person-status-strip">
          <div class="status-indicator-dot ${s.dot}"></div>
          <div class="status-texts">
            <div class="status-primary-text">${s.label}</div>
            <div class="status-timestamp">${t.updatedAt}</div>
          </div>
        </div>

        ${t.available ? `<div class="person-availability-note">🕐 ${t.available}</div>` : ""}

        <!-- Кнопки действий -->
        <div class="person-card-buttons">
          <button class="btn-card-outline" onclick="showToast('Профиль ${t.name} открыт', 'info')">
            Профиль
          </button>
          <button class="btn-card-red" onclick="navigate('map', {target:'r${t.room}'})">
            🧭 Маршрут
          </button>
          <button class="btn-card-outline" onclick="navigate('schedule')">
            Расписание
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// ==========================================================================
// 11. SERVICES (Сервисы университета)
// ==========================================================================
function renderServices() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="page-container">
      <div class="page-top-header">
        <div class="header-pretitle">Университетская инфраструктура</div>
        <h1 class="header-main-title">Сервисы</h1>
        <p class="header-sub-desc">Ключевые точки обслуживания, учебные ресурсы и службы поддержки MNU</p>
      </div>

      <div class="services-modern-grid">
        ${MOCK_DATA.services.map(s => {
          const statusDict = DICTIONARIES.status[s.status] || DICTIONARIES.status.open;
          return `
            <div class="service-block-card" onclick="openServiceTarget('${s.targetRoom}')">
              <div class="service-block-top">
                <div class="service-icon-box">${s.icon}</div>
                <span class="service-status-pill ${s.status}">${statusDict.label}</span>
              </div>
              <div class="service-block-title">${s.name}</div>
              <div class="service-block-desc">${s.desc}</div>
              <div class="service-location-meta">
                <div class="service-meta-item">📍 ${s.location}</div>
                <div class="service-meta-item">🕐 ${s.hours}</div>
              </div>
              <button class="btn-service-action" onclick="event.stopPropagation(); openServiceTarget('${s.targetRoom}')">
                <span>Перейти к локации</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function openServiceTarget(targetRoom) {
  if (targetRoom) {
    navigate("map", { target: targetRoom });
  } else {
    showToast("Сервис доступен онлайн через студенческий портал", "info");
  }
}

// ==========================================================================
// 12. STUDENT CARD & NFC PRIVACY SESSION (Главная фишка: NFC + Приватность)
// ==========================================================================
function renderStudentCard() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="page-container">
      <div class="page-top-header">
        <div class="header-pretitle">Защищённая авторизация · NFC</div>
        <h1 class="header-main-title">${DICTIONARIES.ui.cardScannerTitle}</h1>
        <p class="header-sub-desc">${DICTIONARIES.ui.cardScannerSubtitle}</p>
      </div>

      <div class="student-card-view-center">
        ${state.studentAuthenticated ? renderAuthenticatedStudentHTML() : renderNfcScannerPromptHTML()}
      </div>
    </div>
  `;

  if (state.studentAuthenticated) {
    startPrivacyCountdown();
  }
}

function renderNfcScannerPromptHTML() {
  return `
    <div class="nfc-terminal-card">
      <div class="nfc-animation-zone">
        <div class="pulse-ring ring-1"></div>
        <div class="pulse-ring ring-2"></div>
        <div class="pulse-ring ring-3"></div>
        <div class="nfc-center-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C8102E" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><circle cx="7" cy="15" r="1"/></svg>
        </div>
      </div>

      <div class="nfc-terminal-content">
        <h2 class="nfc-prompt-title">Приложите студенческую карту</h2>
        <p class="nfc-prompt-desc">
          Бесконтактный ридер автоматически считает ваш пропуск MNU и загрузит личное расписание.
        </p>
      </div>

      <button class="btn-simulate-nfc" id="simulate-card-btn" onclick="simulateCardTap()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        <span>${DICTIONARIES.ui.simulateCardTap}</span>
      </button>

      <div class="nfc-privacy-disclaimer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>Безопасный личный сеанс · Автоматическое закрытие при отсутствии активности</span>
      </div>
    </div>
  `;
}

function renderAuthenticatedStudentHTML() {
  const student = MOCK_DATA.currentStudent;
  const next = student.nextClass;

  return `
    <div class="authenticated-container" id="auth-student-container">
      <!-- Плашка приватной сессии -->
      <div class="privacy-session-bar" id="privacy-session-bar">
        <div class="privacy-bar-left">
          <span class="privacy-lock-icon">🔒</span>
          <div>
            <div class="privacy-bar-title">Личный сеанс</div>
            <div class="privacy-bar-sub">Сеанс завершится автоматически при неактивности</div>
          </div>
        </div>
        <div class="privacy-bar-right">
          <div class="privacy-seconds-badge" id="privacy-timer-text">${state.privacySeconds} с</div>
          <button class="btn-privacy-exit" onclick="resetAndCloseSession()">Завершить</button>
        </div>
        <div class="privacy-progress-track">
          <div class="privacy-progress-fill" id="privacy-progress-fill" style="width: 100%;"></div>
        </div>
      </div>

      <!-- Приветствие студента -->
      <div class="student-info-card">
        <div class="student-card-top-row">
          <div class="student-avatar-big">А</div>
          <div class="student-text-group">
            <h2 class="student-welcome-name">Добро пожаловать, ${student.name}</h2>
            <div class="student-badge-line">
              <span class="badge-code">${student.id}</span>
              <span class="badge-dept">${student.program} · ${student.year}</span>
            </div>
          </div>
        </div>

        <!-- Следующая пара студента -->
        <div class="student-next-class-panel">
          <div class="panel-tag-red">СЛЕДУЮЩАЯ ПАРА</div>
          <div class="panel-course-title">${next.course}</div>
          <div class="panel-course-time">14:00</div>
          <div class="panel-course-room">Аудитория ${next.room}</div>
          <div class="panel-minutes-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>До начала — ${next.startsInMinutes} минут</span>
          </div>

          <div style="margin-top: 14px;">
            <button class="btn-accent-action" onclick="navigate('map', {target:'r${next.room}'})">
              <span>Построить маршрут</span>
            </button>
          </div>
        </div>

        <!-- Расписание на сегодня -->
        <div class="student-today-schedule-block">
          <div class="block-section-title">Сегодня</div>
          <div class="simple-schedule-list">
            <div class="sched-row">
              <span class="sched-hour">09:00</span>
              <span class="sched-title">ICT</span>
              <span class="sched-room-badge">302</span>
            </div>
            <div class="sched-row">
              <span class="sched-hour">11:00</span>
              <span class="sched-title">Mathematics</span>
              <span class="sched-room-badge">214</span>
            </div>
            <div class="sched-row active-now">
              <span class="sched-hour">14:00</span>
              <span class="sched-title">AI Fundamentals</span>
              <span class="sched-room-badge red">306</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function simulateCardTap() {
  const btn = document.getElementById("simulate-card-btn");
  if (btn) {
    btn.innerHTML = `<span>⟳ Считывание карты...</span>`;
    btn.disabled = true;
  }

  showToast("📡 Считывание NFC-карты MNU...", "info");

  setTimeout(() => {
    state.studentAuthenticated = true;
    state.privacySeconds = 10;
    showToast("✅ Карта подтверждена — Добро пожаловать, Абилмансур!", "success");
    renderStudentCard();
  }, 1200);
}

function startPrivacyCountdown() {
  clearInterval(state.privacyTimer);
  state.privacySeconds = 10;

  state.privacyTimer = setInterval(() => {
    state.privacySeconds--;

    const timerText = document.getElementById("privacy-timer-text");
    const progressFill = document.getElementById("privacy-progress-fill");

    if (timerText) timerText.textContent = state.privacySeconds + " с";
    if (progressFill) progressFill.style.width = ((state.privacySeconds / 10) * 100) + "%";

    if (state.privacySeconds <= 0) {
      clearInterval(state.privacyTimer);
      resetAndCloseSession();
    }
  }, 1000);
}

function resetAndCloseSession() {
  clearInterval(state.privacyTimer);
  state.studentAuthenticated = false;

  const container = document.getElementById("auth-student-container");
  if (container) {
    container.classList.add("session-fade-out");
  }

  setTimeout(() => {
    renderStudentCard();
    showToast("🔒 Личный сеанс завершён для безопасности данных", "info");
  }, 400);
}

// ==========================================================================
// 13. "Я СПЕШУ" (Мгновенный сценарий спешащего студента)
// ==========================================================================
function showHurryModal() {
  const next = MOCK_DATA.currentStudent.nextClass;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-overlay-backdrop";
  backdrop.id = "hurry-modal-overlay";
  backdrop.onclick = (e) => { if (e.target === backdrop) closeHurryModal(); };

  backdrop.innerHTML = `
    <div class="hurry-dialog-card">
      <div class="hurry-dialog-header">
        <div class="hurry-badge-round">⚡</div>
        <div class="hurry-header-text">
          <div class="dialog-title">Я спешу</div>
          <div class="dialog-subtitle">Вся необходимая информация для быстрого перехода</div>
        </div>
        <button class="btn-dialog-close" onclick="closeHurryModal()">&times;</button>
      </div>

      <!-- Блок следующей пары -->
      <div class="dialog-content-section">
        <div class="section-tag-red">СЛЕДУЮЩАЯ ПАРА</div>
        <div class="dialog-course-name">${next.course}</div>
        <div class="dialog-course-time">14:00</div>
        <div class="dialog-room-highlight">Аудитория ${next.room}</div>
        <div class="dialog-countdown-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>До начала — ${next.startsInMinutes} минут</span>
        </div>
      </div>

      <!-- Самый быстрый маршрут -->
      <div class="dialog-content-section light-bg">
        <div class="section-tag-gray">САМЫЙ БЫСТРЫЙ МАРШРУТ</div>
        <div class="route-metrics-row">
          <div class="metric-box">
            <div class="metric-num">${next.distanceMeters} м</div>
            <div class="metric-label">Расстояние</div>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-box">
            <div class="metric-num">≈ ${next.walkMinutes} мин</div>
            <div class="metric-label">Время в пути</div>
          </div>
        </div>
        <div class="route-directions-short">
          Главный вход → Лифт или лестница на 3 этаж → Налево → Кабинет 306 справа
        </div>
      </div>

      <!-- Кнопка построения маршрута -->
      <div class="dialog-actions-row">
        <button class="btn-accent-large" onclick="closeHurryModal(); navigate('map', {target:'r306'})">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          <span>Построить маршрут</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
}

function closeHurryModal() {
  const modal = document.getElementById("hurry-modal-overlay");
  if (modal) modal.remove();
}

// ==========================================================================
// 14. ANNOUNCEMENT MODAL & TOASTS
// ==========================================================================
function showAnnouncement(id) {
  const ann = MOCK_DATA.announcements.find(a => a.id === id);
  if (!ann) return;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-overlay-backdrop";
  backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };

  backdrop.innerHTML = `
    <div class="announcement-modal-card">
      <div class="ann-modal-header">
        <div class="ann-modal-tag ${ann.tag}">${ann.tagText}</div>
        <button class="btn-dialog-close" onclick="this.closest('.modal-overlay-backdrop').remove()">&times;</button>
      </div>
      <div class="ann-modal-title">${ann.text}</div>
      <div class="ann-modal-text">${ann.full}</div>
      <div class="ann-modal-footer">
        <button class="btn-secondary-action" onclick="this.closest('.modal-overlay-backdrop').remove()">Понятно</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-pill ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatCurrentTime() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ==========================================================================
// 15. INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderPage("home");

  window.addEventListener("resize", () => {
    if (state.currentPage === "map") drawMap();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeHurryModal();
      document.querySelectorAll(".modal-overlay-backdrop").forEach(m => m.remove());
    }
  });

  console.log(
    "%c RAYMOND %c ИИ-помощник кампуса MNU (MVP) ",
    "background: #C8102E; color: white; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;",
    "background: #171717; color: #FFFFFF; padding: 4px 8px; border-radius: 0 4px 4px 0;"
  );
});

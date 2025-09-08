# Схемы архитектуры NEWADMIN

## 1. Общая архитектура системы

```mermaid
graph TB
    %% Клиентская часть
    subgraph "CLIENT SIDE"
        Browser[🌐 Браузер]
        HTML[📄 newadmin.html]
        JS[⚡ newadmin.js]
        CSS[🎨 newadmin.css]

        Browser --> HTML
        HTML --> JS
        HTML --> CSS
    end

    %% Серверная часть
    subgraph "SERVER SIDE - NEWADMIN/"
        Router[🚦 router.js<br/>Express Router]
        Auth[🔐 auth.js<br/>Аутентификация]
        Index[📋 index.js<br/>Main Renderer]

        %% Модули операций
        subgraph "Operation Modules"
            FirstStart[🚀 firststart.js]
            Structures[🏗️ aktualizace_struktur.js]
            NullData[💾 aktualizace_nulovadata.js]
            Init[⚙️ inicializace.js]
            Services[🔧 start/stop_service.js]
            Console[📟 consolelog.js]
            Multiverse[🌌 zalozeni_multiverze.js]
        end

        Router --> Auth
        Router --> Index
        Router --> FirstStart
        Router --> Structures
        Router --> NullData
        Router --> Init
        Router --> Services
        Router --> Console
        Router --> Multiverse
    end

    %% Статические ресурсы
    subgraph "STATIC RESOURCES - WEB/static/v2/"
        subgraph "JavaScript"
            AdminJS[📜 js/admin/newadmin.js]
            Libraries[📚 jQuery, Bootstrap, etc.]
        end

        subgraph "Styles"
            AdminCSS[🎨 css/newadmin.css]
            Fonts[🔤 fonts/]
        end

        subgraph "Assets"
            Icons[🎯 mdi icons]
            Images[🖼️ img/]
        end
    end

    %% Коммуникация
    subgraph "COMMUNICATION"
        HTTP[📡 HTTP/REST API]
        WS[⚡ WebSocket]
        Cookies[🍪 Encrypted Cookies]
    end

    %% Внешние системы
    subgraph "EXTERNAL SYSTEMS"
        DB[(🗄️ MSSQL Database<br/>Multi-version)]
        Repository[📦 SVN Repository]
        Docker[🐳 Docker Services]
        NodeProc[⚙️ Node.js Processes]
    end

    %% Основные потоки данных
    Browser <-->|HTTP Requests| Router
    Browser <-->|WebSocket| WS
    Browser -->|Load Static| AdminJS
    Browser -->|Load Static| AdminCSS

    JS <-->|Real-time Logs| WS
    JS -->|API Calls| HTTP

    Auth -->|Store Session| Cookies
    Index -->|Render Template| HTML
    Index -->|Server Data Bootstrap| JS

    %% Операции с внешними системами
    FirstStart --> DB
    Structures --> DB
    NullData --> DB
    Init --> DB
    Services --> NodeProc
    Services --> Docker
    Multiverse --> Repository
    Console --> NodeProc

    %% Стили и цвета
    classDef client fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef server fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef static fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef comm fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef external fill:#ffebee,stroke:#c62828,stroke-width:2px

    class Browser,HTML,JS,CSS client
    class Router,Auth,Index,FirstStart,Structures,NullData,Init,Services,Console,Multiverse server
    class AdminJS,Libraries,AdminCSS,Fonts,Icons,Images static
    class HTTP,WS,Cookies comm
    class DB,Repository,Docker,NodeProc external
```

## 2. Детальная схема компонентов

```mermaid
graph LR
    %% Главные компоненты
    subgraph "🎯 CORE COMPONENTS"
        direction TB
        A[router.js] --> B[Rate Limiting]
        A --> C[Authentication]
        A --> D[Route Handlers]

        E[index.js] --> F[Status Collection]
        E --> G[Template Rendering]
        E --> H[Data Bootstrap]
    end

    %% Модульная система
    subgraph "🔧 MODULE SYSTEM"
        direction TB
        I[Dynamic Modals] --> J[fetchModalContent]
        I --> K[loadModalModule]
        L[Plugin System] --> M[Access Control]
        L --> N[Feature Detection]
    end

    %% Система логирования
    subgraph "📊 LOGGING SYSTEM"
        direction TB
        O[Log Panel] --> P[Multi-tab Interface]
        O --> Q[Real-time Updates]
        O --> R[Filtering & Search]
        S[WebSocket Handler] --> T[Message Routing]
        S --> U[Task Detection]
    end

    %% UI компоненты
    subgraph "🖥️ UI COMPONENTS"
        direction TB
        V[Dashboard Sections] --> W[System Services]
        V --> X[Database Operations]
        V --> Y[Business Modules]
        V --> Z[Dev Tools]

        AA[Modal System] --> BB[Confirmation Dialogs]
        AA --> CC[Form Validation]
        AA --> DD[Dynamic Content]
    end

    %% Связи между компонентами
    A -.-> E
    E -.-> I
    S -.-> O
    V -.-> AA
```

## 3. Поток взаимодействий пользователя

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant B as 🌐 Browser
    participant R as 🚦 Router
    participant A as 🔐 Auth
    participant I as 📋 Index
    participant WS as ⚡ WebSocket
    participant M as 🔧 Module
    participant DB as 🗄️ Database

    %% Аутентификация
    U->>B: Вход в систему
    B->>R: POST /auth
    R->>A: Проверка пароля
    A-->>R: Encrypted Cookie
    R-->>B: Set Cookie + Redirect

    %% Загрузка интерфейса
    B->>R: GET /
    R->>A: Проверка Cookie
    A-->>R: Valid Session
    R->>I: Render Dashboard
    I->>I: Collect Server Data
    I-->>B: HTML + Bootstrap Data

    %% WebSocket подключение
    B->>WS: Connect WebSocket
    WS-->>B: Connection Established

    %% Выполнение операции
    U->>B: Нажатие на модуль
    B->>B: openModal()
    B->>R: GET /module?ui=1
    R->>M: Load Module UI
    M-->>B: Modal Content

    U->>B: Подтверждение операции
    B->>R: GET /module?params
    R->>M: Execute Operation
    M->>DB: Database Operation
    M->>WS: Send Progress Updates
    WS-->>B: Real-time Logs
    DB-->>M: Operation Result
    M-->>R: HTTP Response
    R-->>B: Success/Error
```

## 4. Схема работы модальных окон (ваша зона ответственности)

```mermaid
flowchart TD
    A[👤 Пользователь нажимает кнопку] --> B{🔍 Тип запроса?}

    B -->|?ui=1| C[📄 Загрузка HTML формы]
    B -->|?script=1| D[⚡ Загрузка JavaScript]
    B -->|обычный| E[🔧 Выполнение операции]

    C --> F[🎨 Отображение модала]
    D --> G[🎯 Привязка событий к кнопкам]

    F --> H[👤 Пользователь заполняет форму]
    H --> I[👤 Нажимает 'Выполнить']
    G --> I

    I --> J[📡 Отправка параметров на сервер]
    J --> E

    E --> K{✅ Успешно?}
    K -->|Да| L[📊 Логирование результата]
    K -->|Нет| M[❌ Показать ошибку]

    L --> N[🔄 Обновление интерфейса]
    M --> N

    style C fill:#e3f2fd
    style D fill:#f3e5f5
    style E fill:#e8f5e8
    style L fill:#e8f5e8
    style M fill:#ffebee
```

## 5. Структура вашего модала

```mermaid
graph TD
    subgraph "📁 Ваш файл: my_modal.js"
        A[module.exports.get] --> B{Тип запроса}

        B -->|ui=1| C[HTML Content]
        B -->|script=1| D[JavaScript Module]
        B -->|обычный| E[Бизнес логика]

        C --> C1[title: 'Заголовок']
        C --> C2[content: 'HTML форма']
        C --> C3[buttons: 'Кнопки действий']

        D --> D1[init функция]
        D --> D2[Обработчики событий]
        D --> D3[Валидация формы]

        E --> E1[Получение параметров]
        E --> E2[Выполнение операций]
        E --> E3[Возврат результата]
    end

    subgraph "🌐 Что видит пользователь"
        F[Модальное окно] --> F1[Заголовок]
        F --> F2[Поля ввода]
        F --> F3[Кнопки]
    end

    C1 --> F1
    C2 --> F2
    C3 --> F3

    style C fill:#e3f2fd
    style D fill:#f3e5f5
    style E fill:#e8f5e8
```

---

## 🎯 Как использовать эти схемы:

1. **Схема 1** - общее понимание архитектуры
2. **Схема 2** - детали компонентов системы
3. **Схема 3** - поток действий пользователя
4. **Схема 4** - как работают ваши модалы
5. **Схема 5** - структура файла модала

**Для просмотра установите расширение "Mermaid Preview" в VS Code или откройте на [mermaid.live](https://mermaid.live)**

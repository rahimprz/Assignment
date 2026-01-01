# Currency Converter Application

A full-stack currency converter application built with **Angular 19** and **NestJS**, featuring real-time and historical exchange rates powered by FreeCurrencyAPI.

---

## 📋 Assignment Requirements Fulfilled

| Requirement | Implementation |
|-------------|----------------|
| ✅ Currency API for dynamic conversions | FreeCurrencyAPI integration with all supported currencies |
| ✅ Directives and structured components | Angular standalone components with Reactive Forms |
| ✅ Conversion history with date/time | SQLite database with TypeORM persistence |
| ✅ History persists on reload | Server-side database storage |
| ✅ Historical exchange rates | Date picker with historical API endpoint |
| ✅ Dropdown for both currency ends | Material Select components for From/To |
| ✅ Loaders for API requests | Progress bar + spinner in convert button |
| ✅ Mobile-first responsive design | Flexbox layout with media queries |
| ✅ API key secured on backend | Environment variables, never exposed to client |
| ✅ Backend in NestJS | Full NestJS implementation with modules/controllers/services |

---

## 🛠️ Tech Stack

### Frontend
- **Angular 19** (Standalone Components)
- **Angular Material** (UI Components)
- **SCSS** (Styling)
- **TypeScript**

### Backend
- **NestJS** (Node.js Framework)
- **TypeORM** (Database ORM)
- **SQLite** (Persistent Storage)
- **Axios** (HTTP Client)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rahimprz/currency-converter.git
   cd currency-converter
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` folder:
   ```env
   FREE_CURRENCY_API_KEY=your_api_key_here
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run start
   ```
   Backend runs on: `http://localhost:3000`

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on: `http://localhost:4200`

---

## 📁 Project Structure

```
Assignment/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── currency/        # Currency module
│   │   │   ├── currency.controller.ts
│   │   │   ├── currency.service.ts
│   │   │   ├── currency.module.ts
│   │   │   └── entities/
│   │   │       └── conversion-history.entity.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env                 # API Key (not committed)
│   └── currency_db.sqlite   # SQLite Database
│
├── frontend/                # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── converter/
│   │   │   │   └── history-list/
│   │   │   ├── services/
│   │   │   │   └── currency-api.service.ts
│   │   │   └── models/
│   │   └── styles.scss
│   └── angular.json
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/currency/latest` | Get latest exchange rates |
| `GET` | `/currency/historical?date=YYYY-MM-DD` | Get historical rates |
| `POST` | `/currency/convert` | Convert currency and save to history |
| `GET` | `/currency/history` | Get last 20 conversion records |

---

## ✨ Features

- **Real-time Currency Conversion** - Convert between 10+ major currencies
- **Historical Rates** - Select any past date for historical exchange rates
- **Persistent History** - All conversions are saved and displayed in a table
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Loading States** - Visual feedback during API calls
- **Clean UI** - Modern Material Design interface

---

## 👤 Author

**Muhammad Raahim**

- GitHub: [@rahimprz](https://github.com/rahimprz)

---

## 📝 Notes

- The FreeCurrencyAPI free tier limits the base currency to USD. The application handles this by calculating cross-rates automatically.
- Database file (`currency_db.sqlite`) is created automatically on first run.
- CORS is enabled for frontend-backend communication.

---

*Thank you for reviewing this submission. I look forward to hearing from you!*

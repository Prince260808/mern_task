# mern_task

# 📰 HN Reader — Full Stack MERN Application

> A production-ready web application that scrapes real-time stories from **Hacker News**, stores them in MongoDB, and delivers a seamless reading experience with JWT authentication and personal bookmarking — built entirely from scratch with the MERN stack.

---

## 🔗 Live Demo & Repository

| | Link |
|---|---|
| 🌐 **Live App** | https://hn-scraper.vercel.app |
| ⚙️ **Backend API** | https://hn-scraper-backend.onrender.com/api/health |
| 💻 **GitHub Repo** | https://github.com/your-username/hn-fullstack |

> **Try it yourself:** Register an account → Browse live HN stories → Bookmark your favourites → Log out and back in — your bookmarks are still there.

---

## 👨‍💻 About This Project

This project was built as a **Full Stack Developer technical assignment** to demonstrate real-world proficiency across the entire web development stack — from database design to REST API architecture to a polished, responsive frontend.

### What It Does
1. **Scrapes** the top 10 trending stories from Hacker News in real time
2. **Persists** those stories to a MongoDB database (with deduplication)
3. **Authenticates** users with secure JWT-based login and registration
4. **Lets users bookmark** stories to a personal reading list, stored per-account in the database
5. **Protects routes** on both the backend (middleware) and frontend (ProtectedRoute component)

### Why I Built It This Way
Every technical decision in this project was made deliberately — not just to make it work, but to make it maintainable, scalable, and secure. The architecture mirrors how real production MERN applications are structured at companies today.

---

## ⚡ Tech Stack

| Layer | Technology | Why This Choice |
|---|---|---|
| **Frontend** | React 18 + Vite | Vite's native ESM gives 10x faster HMR than Create React App |
| **Routing** | React Router v6 | Industry standard; declarative nested routing |
| **UI Framework** | Bootstrap 5 + Bootstrap Icons | Rapid responsive UI with zero custom CSS bloat |
| **HTTP Client** | Axios | Interceptors allow global JWT injection in one place |
| **State Management** | React Context + useReducer | Right-sized for auth state — no Redux overhead |
| **Backend** | Node.js + Express.js | Non-blocking I/O perfect for scraping + API workloads |
| **Database** | MongoDB + Mongoose | Document model fits HN story data naturally |
| **Authentication** | JWT + bcryptjs | Stateless auth; bcrypt's cost factor resists brute-force |
| **Web Scraping** | Axios + Cheerio | Server-side jQuery-like DOM parsing; no browser needed |
| **Deployment** | Vercel + Render + MongoDB Atlas | Industry-standard free-tier production stack |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                 │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │  Login   │  │ Register │  │  Stories Dashboard  │   │
│  └──────────┘  └──────────┘  └────────────────────┘   │
│                                ┌────────────────────┐   │
│       AuthContext (global)     │  Bookmarks (🔒)    │   │
│       Axios Interceptor        └────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS (JWT in Authorization header)
┌────────────────────▼────────────────────────────────────┐
│                  EXPRESS.JS REST API                     │
│                                                         │
│  ┌─────────────────┐      ┌──────────────────────────┐  │
│  │   Auth Routes   │      │     Story Routes          │  │
│  │  POST /register │      │  POST /scrape             │  │
│  │  POST /login    │      │  GET  /stories            │  │
│  │  GET  /me       │      │  GET  /stories/:id        │  │
│  └─────────────────┘      │  POST /stories/:id/bookmark│  │
│                           │  GET  /stories/bookmarks  │  │
│  ┌─────────────────┐      └──────────────────────────┘  │
│  │  JWT Middleware │ ◄── protects private routes         │
│  └─────────────────┘                                    │
└────────────────────┬────────────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼────────────────────────────────────┐
│                  MONGODB ATLAS                           │
│                                                         │
│  ┌────────────────┐      ┌───────────────────────────┐  │
│  │  Users         │      │  Stories                  │  │
│  │  _id           │      │  _id                      │  │
│  │  username      │      │  title                    │  │
│  │  email         │      │  url                      │  │
│  │  password(hash)│      │  points                   │  │
│  │  bookmarks[]──────────►  author                   │  │
│  │  timestamps    │      │  postedTime               │  │
│  └────────────────┘      │  hnId (unique)            │  │
│                          │  rank                     │  │
│                          │  timestamps               │  │
│                          └───────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                     ▲
           ┌─────────┴──────────┐
           │  HackerNews.com    │
           │  (Cheerio Scraper) │
           └────────────────────┘
```

---

## 📁 Folder Structure

```
hn-fullstack/
│
├── backend/                          # Node.js + Express API
│   ├── config/
│   │   └── db.js                     # MongoDB connection with error handling
│   │
│   ├── controllers/                  # Business logic layer (MVC)
│   │   ├── authController.js         # Register, Login, GetMe
│   │   └── storyController.js        # Scrape, GetAll, GetById, Bookmark
│   │
│   ├── middleware/
│   │   └── authMiddleware.js         # JWT verification — protects private routes
│   │
│   ├── models/                       # Mongoose schemas (MVC Model layer)
│   │   ├── User.js                   # username, email, hashed password, bookmarks[]
│   │   └── Story.js                  # title, url, points, author, time, hnId, rank
│   │
│   ├── routes/                       # Route definitions (MVC Controller wiring)
│   │   ├── authRoutes.js             # /api/auth/*
│   │   └── storyRoutes.js            # /api/stories/*
│   │
│   ├── utils/
│   │   ├── generateToken.js          # Signs JWT with 7-day expiry
│   │   └── scraper.js                # Axios + Cheerio HN scraper
│   │
│   ├── .env.example                  # Environment variable template
│   ├── package.json
│   └── server.js                     # Express app entry point
│
└── frontend/                         # React 18 + Vite SPA
    ├── src/
    │   ├── components/               # Reusable UI components
    │   │   ├── Navbar.jsx            # Responsive navbar, auth-aware links
    │   │   ├── ProtectedRoute.jsx    # Redirects unauthenticated users
    │   │   ├── StoryCard.jsx         # Story display card with bookmark toggle
    │   │   └── Spinner.jsx           # Loading state indicator
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global auth state (useReducer + localStorage)
    │   │
    │   ├── pages/
    │   │   ├── Register.jsx          # Registration form with validation
    │   │   ├── Login.jsx             # Login form
    │   │   ├── Stories.jsx           # Main dashboard — stories list
    │   │   └── Bookmarks.jsx         # Protected bookmarks page
    │   │
    │   ├── utils/
    │   │   └── api.js                # Axios instance with JWT interceptor
    │   │
    │   ├── App.jsx                   # Root component with router setup
    │   ├── main.jsx                  # React DOM entry point
    │   └── index.css                 # Custom styles on top of Bootstrap
    │
    ├── index.html
    ├── vite.config.js                # Vite config with dev proxy
    ├── .env.example
    └── package.json
```

---

## 🔑 Key Features Explained

### 1. Real-Time Web Scraping
The scraper (`utils/scraper.js`) uses **Axios** to fetch the raw HTML of `news.ycombinator.com` and **Cheerio** to parse it with CSS selectors — the same way jQuery works in the browser, but running on the server. It extracts the title, external URL, points, author, post time, and HN internal ID for each of the top 10 stories.

**Deduplication:** Stories are saved with MongoDB's `findOneAndUpdate` + `upsert: true` keyed on `hnId` (HN's own story ID). This means you can scrape multiple times without creating duplicates.

### 2. JWT Authentication
- **Registration:** Password is hashed with `bcrypt` (10 salt rounds) before storage. The raw password never touches the database.
- **Login:** bcrypt compares the submitted password against the stored hash. On success, a JWT is signed with a secret key and returned.
- **Protected Requests:** The Axios instance has a **request interceptor** that reads the JWT from `localStorage` and automatically attaches it as `Authorization: Bearer <token>` on every outgoing request.
- **Backend Middleware:** The `protect` middleware verifies the JWT signature, checks expiry, and attaches `req.user` to the request object for all protected routes.
- **Auto-Logout:** The Axios **response interceptor** catches any `401 Unauthorized` response and automatically clears the token from storage and redirects to `/login`.

### 3. Bookmark System
- Users can bookmark any story with a single click on the bookmark icon.
- The toggle checks if the story ID already exists in the user's `bookmarks[]` array — if yes, it removes it; if no, it adds it. This prevents duplicate bookmarks at the database level.
- Bookmark state is fetched from the server on page load so it's always accurate, not just client-side memory.
- The Bookmarks page is a **protected route** — unauthenticated users are redirected to `/login`.

### 4. Global Auth State
`AuthContext.jsx` uses React's `useReducer` (not `useState`) to manage auth state transitions cleanly. The context persists to `localStorage` so the user stays logged in across page refreshes. Any component in the tree can call `useAuth()` to read the current user or trigger login/logout.

### 5. Protected Routes (Frontend)
The `ProtectedRoute` component wraps sensitive pages. It reads `isAuthenticated` from `AuthContext` and renders either the page or a `<Navigate to="/login" />` redirect — clean, reusable, and zero duplication.

---

## 🌐 API Reference

### Authentication Endpoints

| Method | Endpoint | Access | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `{ username, email, password }` | `{ _id, username, email, token }` |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | `{ _id, username, email, token }` |
| `GET` | `/api/auth/me` | 🔒 Private | — | `{ _id, username, email }` |

### Story Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/stories/scrape` | Public | Scrapes HN and saves/updates top 10 stories |
| `GET` | `/api/stories` | Public | Returns all stories sorted by rank |
| `GET` | `/api/stories/:id` | Public | Returns a single story by MongoDB ID |
| `POST` | `/api/stories/:id/bookmark` | 🔒 Private | Toggles bookmark (add or remove) |
| `GET` | `/api/stories/bookmarks` | 🔒 Private | Returns all bookmarked stories for the user |

> 🔒 Private endpoints require `Authorization: Bearer <token>` header.

---

## 🗄️ Database Schema

### User Model
```javascript
{
  username:  String,   // unique, min 3 chars
  email:     String,   // unique, validated format
  password:  String,   // bcrypt hash — NEVER plain text
  bookmarks: [ObjectId], // references to Story documents
  createdAt: Date,     // auto via timestamps
  updatedAt: Date
}
```

### Story Model
```javascript
{
  title:       String,  // HN story headline
  url:         String,  // external article URL
  points:      Number,  // upvote count
  author:      String,  // HN username of poster
  postedTime:  String,  // "3 hours ago" format
  hnId:        String,  // unique — HN's own story ID
  commentsUrl: String,  // link to HN discussion thread
  rank:        Number,  // 1–10 position on front page
  createdAt:   Date,
  updatedAt:   Date
}
```

---

## 🔒 Security Implementation

| Concern | Implementation |
|---|---|
| Password storage | bcrypt hash with 10 salt rounds — never reversible |
| JWT payload | Contains only `user._id` — no sensitive data |
| JWT expiry | 7 days — tokens auto-expire |
| Protected API routes | `protect` middleware on all private endpoints |
| Protected frontend routes | `ProtectedRoute` component wraps sensitive pages |
| Environment secrets | All secrets in `.env` files — never committed to Git |
| Duplicate bookmarks | Server-side existence check before insert |
| CORS | Restricted to known frontend origin via `CLIENT_URL` env var |

---

## 🚀 Local Setup Guide

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (free) or local MongoDB
- npm

### Step 1 — Clone the Repository
```bash
git clone https://github.com/your-username/hn-fullstack.git
cd hn-fullstack
```

### Step 2 — Backend Setup
```bash
cd backend
npm install
```
Create your `.env` file:
```bash
# Windows PowerShell
copy .env.example .env

# Mac / Linux
cp .env.example .env
```
Fill in `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hn-scraper
JWT_SECRET=your_long_random_secret_key
NODE_ENV=development
```
Start the backend:
```bash
npm run dev
```
✅ You should see: `🚀 Server running on port 5000` and `✅ MongoDB Connected`

### Step 3 — Frontend Setup (new terminal)
```bash
cd frontend
npm install
```
Create your `.env` file:
```bash
# Windows PowerShell
copy .env.example .env

# Mac / Linux
cp .env.example .env
```
Fill in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend:
```bash
npm run dev
```
✅ App running at: `http://localhost:5173`

### Step 4 — First Run
1. Open `http://localhost:5173`
2. Click **Refresh Stories** to trigger the first HN scrape
3. Register an account
4. Start bookmarking stories

---

## ☁️ Deployment

| Service | Platform | Cost |
|---|---|---|
| Frontend | Vercel | Free |
| Backend API | Render | Free |
| Database | MongoDB Atlas | Free (512 MB) |

### MongoDB Atlas
1. Create free cluster at https://cloud.mongodb.com
2. Create database user with read/write access
3. Add `0.0.0.0/0` to Network Access (allows Render)
4. Copy connection string → replace `<password>` → add `/hn-scraper` before `?`

### Backend on Render
1. New Web Service → connect GitHub repo
2. Root Directory: `backend`
3. Build: `npm install` | Start: `npm start`
4. Environment variables:

```
MONGO_URI     = mongodb+srv://...
JWT_SECRET    = your_secret
NODE_ENV      = production
CLIENT_URL    = https://your-app.vercel.app
```

### Frontend on Vercel
1. New Project → import GitHub repo
2. Root Directory: `frontend`
3. Environment variable:
```
VITE_API_URL  = https://your-backend.onrender.com/api
```

---

## 🧠 Technical Decisions & Trade-offs

**Why Cheerio over Puppeteer for scraping?**
Puppeteer spins up a full headless Chromium browser — heavy on memory (400MB+), slow to start, and overkill for HN which renders HTML server-side. Cheerio parses static HTML in milliseconds with zero browser overhead.

**Why Context API + useReducer over Redux?**
This app has one piece of shared state: auth (user + token). Redux adds a store, actions, reducers, and middleware for something a 50-line Context file handles cleanly. The rule: reach for Redux when you have many slices of complex, frequently-updating shared state.

**Why JWT over sessions?**
JWTs are stateless — the server doesn't need to store session data. This makes the API horizontally scalable (any server instance can verify any token). Sessions require a shared session store (like Redis) when scaling.

**Why `findOneAndUpdate` with upsert for scraping?**
Using `create()` would throw a duplicate key error on the second scrape. `upsert` atomically updates existing stories (in case points changed) or inserts new ones — a single DB operation that handles both cases safely.

**Why declare `/bookmarks` route before `/:id`?**
Express matches routes in order. If `/:id` came first, the string `"bookmarks"` would be passed to `mongoose.findById()` as an ID, causing a CastError. Route ordering is a common Express gotcha.

---

## 🧪 Testing the API Manually

You can test all endpoints with **Postman** or **Thunder Client** (VS Code extension):

```
# Health check
GET http://localhost:5000/api/health

# Register
POST http://localhost:5000/api/auth/register
Body: { "username": "testuser", "email": "test@test.com", "password": "123456" }

# Login
POST http://localhost:5000/api/auth/login
Body: { "email": "test@test.com", "password": "123456" }

# Scrape stories (copy token from login response)
POST http://localhost:5000/api/stories/scrape

# Get all stories
GET http://localhost:5000/api/stories

# Bookmark a story (use a story _id from above)
POST http://localhost:5000/api/stories/<story_id>/bookmark
Header: Authorization: Bearer <your_token>

# Get my bookmarks
GET http://localhost:5000/api/stories/bookmarks
Header: Authorization: Bearer <your_token>
```

---

## 📱 Screenshots

| Page | Description |
|---|---|
| **Stories Dashboard** | Top 10 HN stories with points, author, time, and bookmark button |
| **Register Page** | Clean form with validation and instant feedback |
| **Login Page** | Email + password login with error handling |
| **Bookmarks Page** | Personal reading list — protected, persisted in MongoDB |

---

## 🔮 Future Improvements

If I were to extend this project further:

- **HN Firebase API fallback** — use the official `https://hacker-news.firebaseio.com` API as a fallback if scraping breaks due to HN HTML changes
- **Pagination** — load more stories beyond the top 10, with infinite scroll
- **Search & Filter** — search stories by title or filter by minimum points
- **Scheduled scraping** — use a cron job (node-cron) to auto-refresh stories every hour
- **httpOnly Cookies** — move JWT from localStorage to httpOnly cookies to eliminate XSS risk
- **Rate limiting** — add express-rate-limit to prevent API abuse
- **Unit tests** — Jest + Supertest for API endpoints; React Testing Library for components
- **Categories/Tags** — let users tag bookmarks for organisation
- **Dark mode** — toggle between Bootstrap light and dark themes

---

## 👤 Author

**Prince Gupta**
- GitHub: https://github.com/Prince260808
- LinkedIn: https://www.linkedin.com/in/prince-gupta-0b297538b/
- Email: princegupta.mern@gmail.com

---

## 📄 License

MIT License — feel free to use this project as a reference or starting point.

---

*Built with ❤️ using the MERN stack — MongoDB, Express.js, React.js, Node.js*

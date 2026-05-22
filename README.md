# 📰 HN Reader — MERN Stack Full Stack Application

A full-stack application that scrapes the **top 10 stories from Hacker News**, stores them in MongoDB, and serves them via a REST API with JWT authentication, bookmarking, and a responsive React frontend.

---

## 🗂️ Project Structure

```
hn-fullstack/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Me
│   │   └── storyController.js  # Scrape, CRUD, Bookmarks
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect middleware
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Story.js            # Story schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── storyRoutes.js
│   ├── utils/
│   │   ├── generateToken.js    # JWT generator
│   │   └── scraper.js          # Cheerio-based HN scraper
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Spinner.jsx
    │   │   └── StoryCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Stories.jsx
    │   │   └── Bookmarks.jsx
    │   ├── utils/
    │   │   └── api.js           # Axios instance + interceptors
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite, React Router v6    |
| UI        | Bootstrap 5 + Bootstrap Icons       |
| HTTP      | Axios (with JWT interceptor)        |
| Backend   | Node.js + Express.js                |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT + bcryptjs                      |
| Scraping  | Axios + Cheerio                     |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm

### 1. Clone the repo
```bash
git clone https://github.com/your-username/hn-fullstack.git
cd hn-fullstack
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit VITE_API_URL if needed
npm run dev
```

### 4. Visit the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | /api/auth/register    | Public  | Register new user    |
| POST   | /api/auth/login       | Public  | Login user           |
| GET    | /api/auth/me          | Private | Get current user     |

### Stories
| Method | Endpoint                    | Access  | Description               |
|--------|-----------------------------|---------|---------------------------|
| POST   | /api/stories/scrape         | Public  | Scrape & save HN stories  |
| GET    | /api/stories                | Public  | Get all stories            |
| GET    | /api/stories/:id            | Public  | Get story by ID           |
| POST   | /api/stories/:id/bookmark   | Private | Toggle bookmark           |
| GET    | /api/stories/bookmarks      | Private | Get user's bookmarks      |

---

## ☁️ Deployment

### MongoDB Atlas
1. Create a free cluster at https://cloud.mongodb.com
2. Add a database user with read/write access
3. Whitelist IP `0.0.0.0/0` for Render deployment
4. Copy the connection string to your backend `MONGO_URI`

### Backend → Render
1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo, select `backend/` as root
4. Set environment variables:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string
   - `CLIENT_URL` = your Vercel frontend URL
   - `NODE_ENV` = production
5. Build command: `npm install`
6. Start command: `npm start`

### Frontend → Vercel
1. Go to https://vercel.com → New Project
2. Import your GitHub repo, set `frontend/` as root
3. Set environment variable:
   - `VITE_API_URL` = your Render backend URL + `/api`
4. Deploy!

---

## 🔒 Security Notes
- Passwords hashed with bcrypt (10 salt rounds)
- JWT expires in 7 days
- Protected routes on both frontend and backend
- No sensitive data in JWT payload (only user ID)
- Environment variables for all secrets

---

## 📝 Git Commit Message Suggestions

```
feat: initial project setup with MERN stack structure
feat: add MongoDB schemas for User and Story
feat: implement JWT authentication (register + login)
feat: add HackerNews scraper with cheerio
feat: implement story CRUD endpoints
feat: add bookmark toggle with duplicate prevention
feat: build React frontend with Vite and Bootstrap
feat: add AuthContext with useReducer for state management
feat: implement ProtectedRoute component
feat: add Axios interceptor for JWT injection
feat: build StoryCard with bookmark functionality
feat: add responsive Navbar with auth-aware links
fix: ensure bookmarks route is defined before :id param
chore: add .env.example files for both services
docs: add README with setup and deployment instructions
```

---

## 🎥 Loom Video Walkthrough Script

**[0:00 - 0:30] Introduction**
> "Hi, I'm [Name]. I built a full-stack MERN application that scrapes the top 10 stories from Hacker News and provides a rich reading experience with bookmarking. Let me walk you through the architecture and code."

**[0:30 - 1:30] Project Structure**
> "The project is split into backend and frontend. The backend follows MVC — Models define the data shape, Controllers handle business logic, and Routes wire up the endpoints. On the frontend, I've used React with Context API for global auth state."

**[1:30 - 3:00] Backend Deep Dive**
> "The scraper uses Axios to fetch the HN HTML and Cheerio to parse it like jQuery. I extract the title, URL, points, author, and time from the DOM. Stories are saved with upsert to prevent duplicates. JWT authentication uses bcrypt for passwords and signs tokens with a secret key."

**[3:00 - 4:30] Frontend Architecture**
> "The React app uses React Router v6 for routing, and I've implemented a ProtectedRoute wrapper that redirects unauthenticated users. The Axios instance has an interceptor that automatically attaches the JWT from localStorage to every request."

**[4:30 - 5:30] Live Demo**
> "Let me register an account, browse stories, refresh from HN, and bookmark a few. Notice the bookmark state persists because it's stored in MongoDB against the user's account, not just frontend state."

**[5:30 - 6:00] Deployment**
> "The backend is deployed on Render, the frontend on Vercel, and the database on MongoDB Atlas — all free tiers, fully production-ready."

---

## ❓ Common Interview Questions

### General MERN
1. **Why did you use Vite instead of Create React App?**
   Vite uses native ES modules for blazing-fast HMR and cold starts. CRA bundles everything with Webpack, which is slower in development.

2. **What is the MVC pattern and how does your backend follow it?**
   Models define data schemas (User, Story), Views are the API JSON responses, Controllers contain business logic (authController, storyController), and Routes map URLs to controllers.

3. **How does JWT authentication work end-to-end in your app?**
   On login, the server signs a token with a secret. The frontend stores it in localStorage and sends it as `Authorization: Bearer <token>` on every request. The `protect` middleware verifies the signature and attaches the user to `req.user`.

### Security
4. **Why use bcrypt? What are salt rounds?**
   bcrypt is a one-way hashing algorithm designed to be slow (computationally expensive). Salt rounds (10) control the cost factor — higher = slower = harder to brute-force.

5. **Is localStorage safe for storing JWTs? What's the alternative?**
   localStorage is vulnerable to XSS. An alternative is httpOnly cookies (inaccessible to JS). For this project, localStorage is acceptable; in production, cookies + CSRF tokens are preferred.

6. **How do you prevent duplicate bookmarks?**
   Before adding, I check if the story ID already exists in the user's bookmarks array. If it does, I remove it (toggle). If not, I add it — handled atomically in the controller.

### Scraping
7. **How does Cheerio work?**
   Cheerio parses HTML into a jQuery-like DOM you can traverse with CSS selectors. It runs server-side — no browser needed, unlike Puppeteer.

8. **What happens if HackerNews changes its HTML structure?**
   The scraper would break. In production you'd add monitoring/alerting (e.g. if `stories.length === 0`, send a Slack alert), and use the official HN Firebase API as a fallback.

### React
9. **Why Context API over Redux for this project?**
   Auth state is simple — just user and token. Context + useReducer handles this without Redux's boilerplate. For complex shared state across many components, Redux (or Zustand) would be better.

10. **How do Axios interceptors work?**
    Interceptors are middleware for Axios. The request interceptor runs before each request — I use it to attach the JWT. The response interceptor runs on each response — I use it to catch 401s and auto-logout.

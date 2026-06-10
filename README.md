# SiteForge AI — Gemini-Powered Website Builder

SiteForge AI is a responsive website builder application. It takes natural language prompts from users, sends them to the Gemini API (using the official `@google/genai` library with the `gemini-2.5-flash` model), persists the generation history in MongoDB, and presents a interactive live preview using a sandboxed `<iframe>` next to the generated HTML source code.

---

## 🏗️ Project Architecture

```text
ai-site-builder/
├── server/               # Node.js + Express Backend
│   ├── models/
│   │   └── Project.js    # Mongoose Project Schema
│   ├── .env              # Backend environment configuration
│   ├── .gitignore        # Server git ignore
│   ├── index.js          # Express API server entry
│   └── package.json      # Backend dependencies
└── client/               # React + Vite + Tailwind CSS Frontend
    ├── src/
    │   ├── assets/       # Default React assets
    │   ├── App.jsx       # Premium dual-workspace layout
    │   ├── index.css     # Tailwind CSS & custom design tokens
    │   └── main.jsx      # React entrypoint
    ├── index.html        # HTML layout & Google fonts import
    ├── vite.config.js    # Vite dev server & Tailwind CSS configuration
    └── package.json      # Frontend dependencies
```

---

## 🛠️ Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (running locally on default port `27017` or a remote Atlas connection URI)
- **Google Gemini API Key** (Get yours at [Google AI Studio](https://aistudio.google.com/apikey))

---

### 🚀 Setup Instructions

#### 1. Configure the Backend Environment
Go into the `server` folder, open `.env`, and add your credentials:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-site-builder
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

#### 2. Install Dependencies & Start the Backend
Open a terminal in the project root:

```powershell
# Navigate into the server directory
cd server

# Install backend dependencies
npm install

# Start the Express server in development mode (auto-reload)
npm run dev
```
The server will boot up and listen on `http://localhost:5000`.

#### 3. Install Dependencies & Start the Frontend
Open a **new** terminal in the project root:

```powershell
# Navigate into the client directory
cd client

# Install frontend dependencies
npm install

# Start Vite developer server
npm run dev
```
The client app will launch and display the local developer server URL (usually `http://localhost:5173`).

---

## 💎 Features & Custom Styling
- **Vibrant Neon-Dark Mode:** Implemented using CSS variable design tokens for backgrounds, borders, scrollbars, and hover interactions.
- **Premium Animations:** Shimmer glow on the primary action button, spin/reverse spin loading animations, and fade-in states.
- **Sandbox Preview:** Custom `<iframe>` with sandbox attributes to safely render generated HTML pages including interactive scripts.
- **Dual Workspace:** Fast switching between the Live Preview view and the raw Code View with a quick copy clipboard integration.

#  WebCraft AI

WebCraft AI is an AI-powered website builder that transforms natural language prompts into fully responsive, modern websites. Simply describe the website you want, and WebCraft AI generates the website code and provides a live preview instantly.

Built with React, Vite, Node.js, Express, MongoDB, and Google's Gemini AI, the platform streamlines website creation through intelligent code generation, project management, and an interactive user experience.

---

##  Features

###  AI Website Generation
- Generate complete website layouts from simple text prompts.
- Powered by Google's Gemini AI model.
- Creates responsive and modern website designs.

###  Modern User Interface
- Clean and professional UI/UX.
- Responsive design for desktop, tablet, and mobile devices.
- Smooth animations and transitions.

###  Live Website Preview
- Instant rendering of generated websites.
- Secure sandboxed preview environment using iframe.
- Switch seamlessly between Preview and Code views.

###  Project Management
- Save generated projects to MongoDB.
- Access and manage previously generated websites.
- Maintain website generation history.

###  Authentication System
- User signup and login functionality.
- Protected routes and secure user access.
- Personalized project storage.

###  Code Utilities
- View generated source code.
- One-click copy-to-clipboard functionality.
- Easy code export and modification.

###  High Performance
- Fast frontend powered by Vite.
- Efficient backend API architecture.
- Optimized user experience.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Artificial Intelligence
- Google Gemini API
- Gemini 2.5 Flash Model
- @google/genai SDK

---

##  Project Architecture

```text
WebCraft-AI/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── package.json
│   └── server.js
│
├── README.md
└── .gitignore
```

---


## ⚙️ Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```



---

##  Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/webcraft-ai.git

cd webcraft-ai
```

---

### 2. Install Backend Dependencies

```bash
cd server

npm install
```

Start the backend server:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

### 3. Install Frontend Dependencies

Open a new terminal:

```bash
cd client

npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

##  Application Workflow

1. User enters a website description.
2. Prompt is sent to the backend API.
3. Backend communicates with Gemini AI.
4. AI generates website code.
5. Generated code is stored in MongoDB.
6. Frontend displays:
   - Live Preview
   - Generated Source Code
7. User can save, copy, and revisit projects.

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- <img width="1903" height="892" alt="image" src="https://github.com/user-attachments/assets/99e416c7-b306-4fd2-bb61-5ee1ebb81754" />

- Website Generator
- <img width="1919" height="892" alt="image" src="https://github.com/user-attachments/assets/b5a6372f-33af-4345-99bd-51541f43b6a1" />

- Live Preview
- <img width="1918" height="904" alt="image" src="https://github.com/user-attachments/assets/1a2b45c0-6069-4f00-874c-f4cceb9ffbdb" />

- Authentication Pages
- <img width="1912" height="893" alt="image" src="https://github.com/user-attachments/assets/afdae416-65ea-4c4c-8a15-649b826ff68e" />

- Dashboard
- <img width="1914" height="909" alt="image" src="https://github.com/user-attachments/assets/613e005e-44b7-42fc-ade1-1b7bb8fd33b9" />




---

##  Security Features

- JWT-based Authentication
- Protected Routes
- Environment Variable Protection
- Secure API Communication
- Sandboxed Preview Rendering

---

##  Future Enhancements

- Multi-page website generation
- Export as ZIP project
- Deploy directly to Netlify/Vercel
- AI-powered website editing
- Theme customization
- Drag-and-drop editor
- Collaboration features
- Website templates marketplace

---

##  Use Cases

- Students building project websites
- Freelancers creating prototypes
- Startups validating ideas quickly
- Developers generating landing pages
- Non-technical users building websites

---


## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sreelakshmi Ajayan**

Built with ❤️ using React, Node.js, MongoDB, and Gemini AI.

---

### ⭐ If you like this project, consider giving it a star on GitHub!

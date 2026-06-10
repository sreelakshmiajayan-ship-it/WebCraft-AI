import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Context
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Describe from "./pages/Describe";
import Preview from "./pages/Preview";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProjectEditor from "./pages/ProjectEditor";

function App() {
  const location = useLocation();
  const isPreviewPage = location.pathname === "/preview";
  const isEditorPage = location.pathname.startsWith("/projects/");

  return (
    <AuthProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/describe" element={
              <ProtectedRoute>
                <Describe />
              </ProtectedRoute>
            } />
            <Route path="/preview" element={
              <ProtectedRoute>
                <Preview />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <ProjectEditor />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        {(!isPreviewPage && !isEditorPage) && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;

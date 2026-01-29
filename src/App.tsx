import { Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { DocumentationPage } from './pages/DocumentationPage';
import { DatasetPage } from './pages/DatasetPage';
import { AdminLoginPage } from './pages/admin/LoginPage';
import { AdminDashboardPage } from './pages/admin/DashboardPage';
import { ChefHat } from 'lucide-react';

function App() {
  const location = useLocation();

  // Highlight active page based on path
  const getCurrentPageId = () => {
    const path = location.pathname;
    if (path.startsWith('/docs')) return 'docs';
    if (path.startsWith('/dataset')) return 'dataset';
    if (path.startsWith('/admin')) return 'admin';
    return 'home';
  };

  return (
    <div className="min-vh-100 bg-gradient-premium position-relative overflow-hidden">
      <Navigation currentPage={getCurrentPageId()} />

      <main className="container py-5 position-relative z-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/dataset" element={<DatasetPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </main>

      <footer className="bg-dark text-white py-5 mt-auto">
        <div className="container text-center">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <ChefHat className="text-danger me-2" size={20} />
            <span className="fw-bold fs-5 text-white">
              Padang Food Recognition
            </span>
          </div>
          <p className="text-white-50 small mb-1">
            Powered by TensorFlow.js and modern web technologies
          </p>
          <p className="text-secondary small">
            © 2025. Created with 💖 by Rachdian
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
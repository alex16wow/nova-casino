import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import HomePage from './pages/home/HomePage.jsx';
import NotFoundPage from './pages/not-found/NotFoundPage.jsx';

// Relative-base preview builds (vite build --base ./) run from any folder.
const basename = import.meta.env.BASE_URL.startsWith('/') ? import.meta.env.BASE_URL : '/';

// New pages are added as child routes of AppLayout so they share the header, sidebar and footer.
export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ToastProvider>
        <AuthProvider>
          <PlayerProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </PlayerProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

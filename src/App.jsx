import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import HomePage from './pages/home/HomePage.jsx';
import NotFoundPage from './pages/not-found/NotFoundPage.jsx';

// Relative-base preview builds (vite build --base ./) are opened from unknown URLs, so they keep routes in memory.
const preview = !import.meta.env.BASE_URL.startsWith('/');
const Router = preview ? MemoryRouter : BrowserRouter;
const routerProps = preview ? {} : { basename: import.meta.env.BASE_URL };

// New pages are added as child routes of AppLayout so they share the header, sidebar and footer.
export default function App() {
  return (
    <Router {...routerProps}>
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
    </Router>
  );
}

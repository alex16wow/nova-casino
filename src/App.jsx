import { BrowserRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';
import { SupportProvider } from './context/SupportContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import AccountLayout from './components/account/AccountLayout.jsx';
import CatalogPage from './pages/catalog/CatalogPage.jsx';
import FavoritesPage from './pages/favorites/FavoritesPage.jsx';
import GamePage from './pages/game/GamePage.jsx';
import HomePage from './pages/home/HomePage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import RecentPage from './pages/recent/RecentPage.jsx';
import NotFoundPage from './pages/not-found/NotFoundPage.jsx';

// Relative-base preview builds (vite build --base ./) are opened from unknown URLs, so they keep routes in memory.
const preview = !import.meta.env.BASE_URL.startsWith('/');
const Router = preview ? MemoryRouter : BrowserRouter;
// VITE_PREVIEW_ROUTE opens a preview build on a given page (e.g. /account/profile).
const routerProps = preview
  ? { initialEntries: [import.meta.env.VITE_PREVIEW_ROUTE || '/'] }
  : { basename: import.meta.env.BASE_URL };

// New pages are added as child routes of AppLayout so they share the header, sidebar and footer.
export default function App() {
  return (
    <Router {...routerProps}>
      <ToastProvider>
        <AuthProvider>
          <PlayerProvider>
            <ProfileProvider>
              <SupportProvider>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="game/:slug" element={<GamePage />} />
                    <Route path="favorites" element={<FavoritesPage />} />
                    <Route path="recently-played" element={<RecentPage />} />
                    <Route path="account" element={<AccountLayout />}>
                      <Route index element={<Navigate to="profile" replace />} />
                      <Route path="profile" element={<ProfilePage />} />
                    </Route>
                    <Route path="providers/:provider" element={<CatalogPage />} />
                    <Route path=":category" element={<CatalogPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </SupportProvider>
            </ProfileProvider>
          </PlayerProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

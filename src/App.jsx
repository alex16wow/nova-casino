import { BrowserRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';
import { SupportProvider } from './context/SupportContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import AccountLayout from './components/account/AccountLayout.jsx';
import CatalogPage from './pages/catalog/CatalogPage.jsx';
import FavoritesPage from './pages/favorites/FavoritesPage.jsx';
import GamePage from './pages/game/GamePage.jsx';
import HomePage from './pages/home/HomePage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import WalletPage from './pages/wallet/WalletPage.jsx';
import BonusesPage from './pages/bonuses/BonusesPage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import RecentPage from './pages/recent/RecentPage.jsx';
import PromotionsPage from './pages/promotions/PromotionsPage.jsx';
import TournamentsPage from './pages/tournaments/TournamentsPage.jsx';
import LoyaltyPage from './pages/loyalty/LoyaltyPage.jsx';
import InfoPage from './pages/info/InfoPage.jsx';
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
          <SettingsProvider>
            <PlayerProvider>
              <ProfileProvider>
                <SupportProvider>
                  <Routes>
                    <Route element={<AppLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="game/:slug" element={<GamePage />} />
                      <Route path="favorites" element={<FavoritesPage />} />
                      <Route path="recently-played" element={<RecentPage />} />
                      <Route path="promotions" element={<PromotionsPage />} />
                      <Route path="tournaments" element={<TournamentsPage />} />
                      <Route path="vip" element={<LoyaltyPage />} />
                      <Route path="about" element={<InfoPage key="about" page="about" />} />
                      <Route path="responsible-gaming" element={<InfoPage key="responsible-gaming" page="responsible-gaming" />} />
                      <Route path="careers" element={<InfoPage key="careers" page="careers" />} />
                      <Route path="faq" element={<InfoPage key="faq" page="faq" />} />
                      <Route path="contact" element={<InfoPage key="contact" page="contact" />} />
                      <Route path="terms" element={<InfoPage key="terms" page="terms" />} />
                      <Route path="privacy" element={<InfoPage key="privacy" page="privacy" />} />
                      <Route path="fair-play" element={<InfoPage key="fair-play" page="fair-play" />} />
                      <Route path="account" element={<AccountLayout />}>
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="wallet" element={<WalletPage />} />
                        <Route path="bonuses" element={<BonusesPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                      </Route>
                      <Route path="providers/:provider" element={<CatalogPage />} />
                      <Route path=":category" element={<CatalogPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Routes>
                </SupportProvider>
              </ProfileProvider>
            </PlayerProvider>
          </SettingsProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

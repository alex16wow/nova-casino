import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import HomePage from './pages/home/HomePage.jsx';

// New pages are added as child routes of AppLayout so they share the header, sidebar and footer.
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <PlayerProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </PlayerProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

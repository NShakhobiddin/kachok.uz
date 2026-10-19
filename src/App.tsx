import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, MemoryRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Icon } from './components/ui/Icon';
import { useStore } from './store/useStore';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';

const ProgramPage = lazy(() => import('./pages/Program'));
const Library = lazy(() => import('./pages/Library'));
const ExerciseDetail = lazy(() => import('./pages/ExerciseDetail'));
const Workout = lazy(() => import('./pages/Workout'));
const Summary = lazy(() => import('./pages/Summary'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const Progress = lazy(() => import('./pages/Progress'));
const Profile = lazy(() => import('./pages/Profile'));
const LessonView = lazy(() => import('./pages/LessonView'));
const Sources = lazy(() => import('./pages/Sources'));
const Lab = lazy(() => import('./pages/Lab'));

const TABS = [
  { to: '/', icon: 'home', label: 'Bugun' },
  { to: '/program', icon: 'calendar', label: 'Dastur' },
  { to: '/library', icon: 'dumbbell', label: 'Mashqlar' },
  { to: '/nutrition', icon: 'food', label: 'Ovqat' },
  { to: '/progress', icon: 'chart', label: 'Natija' },
];

function TabBar() {
  const active = useStore((s) => s.active);
  return (
    <nav className="tabbar" aria-label="Asosiy menyu">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
          <Icon name={t.icon} size={23} />
          {t.label}
          {t.to === '/' && active && <span className="tab-live" aria-label="Faol mashg‘ulot" />}
        </NavLink>
      ))}
    </nav>
  );
}

const NO_TAB = ['/onboarding', '/workout', '/summary', '/lesson', '/lab'];

function Shell() {
  const profile = useStore((s) => s.profile);
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);
  const hideTab = NO_TAB.some((p) => loc.pathname.startsWith(p));
  if (!profile && !loc.pathname.startsWith('/onboarding') && !loc.pathname.startsWith('/lab') && !loc.pathname.startsWith('/exercise') && !loc.pathname.startsWith('/library') && !loc.pathname.startsWith('/lesson') && !loc.pathname.startsWith('/sources'))
    return <Navigate to="/onboarding" replace />;
  return (
    <div className="app">
      <Suspense fallback={<div className="page" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/summary/:id" element={<Summary />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lesson/:id" element={<LessonView />} />
          <Route path="/sources" element={<Sources />} />
          {import.meta.env.DEV && <Route path="/lab" element={<Lab />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {!hideTab && profile && <TabBar />}
    </div>
  );
}

// Ko'rgazma (artifact) variantida manzil satri yo'q — marshrutlar xotirada
const Router = import.meta.env.VITE_TARGET === 'artifact' ? MemoryRouter : BrowserRouter;

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Shell />
    </Router>
  );
}

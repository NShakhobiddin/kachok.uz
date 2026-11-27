import { motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { BrowserRouter, MemoryRouter, Navigate, NavLink, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { bootCloud } from './api/cloud';
import { serverless, tgUserId } from './api/serverless';
import { acceptPendingFriend, capturePendingFriend } from './api/social';
import { startAutoSync } from './api/sync';
import { Icon } from './components/ui/Icon';
import { useTelegramBridge } from './lib/telegram';
import { useStore } from './store/useStore';
import Home from './pages/Home';

// tanishuv bir marta ochiladi — u bilan birga og'ir mushak-faollik jadvali ham faqat kerak bo'lganda yuklanadi
const Onboarding = lazy(() => import('./pages/Onboarding'));
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
const Demo3D = lazy(() => import('./pages/Demo3D'));
const Account = lazy(() => import('./pages/Account'));
const Register = lazy(() => import('./pages/CloudAccount').then((m) => ({ default: m.Register })));
const Coach = lazy(() => import('./pages/Coach'));
const CoachClient = lazy(() => import('./pages/CoachClient'));
const Premium = lazy(() => import('./pages/Premium'));
const Safety = lazy(() => import('./pages/Safety'));
const MuscleDetail = lazy(() => import('./pages/MuscleDetail'));
const Routines = lazy(() => import('./pages/Routines'));
const RoutineView = lazy(() => import('./pages/Routines').then((m) => ({ default: m.RoutineView })));
const StretchPlayer = lazy(() => import('./pages/StretchPlayer'));
const Report = lazy(() => import('./pages/Report'));
const Friends = lazy(() => import('./pages/Friends'));

const TABS = [
  { to: '/', icon: 'home', label: 'Bugun' },
  { to: '/nutrition', icon: 'food', label: 'Ovqat' },
  { to: '/progress', icon: 'chart', label: 'Natija' },
  // mashqlar ro'yxati — ma'lumotnoma: Bugun sarlavhasidagi 🔍 va mashq nomlaridan
  { to: '/friends', icon: 'users', label: 'Do‘stlar' },
];

function TabBar() {
  const active = useStore((s) => s.active);
  return (
    <nav className="tabbar" aria-label="Asosiy menyu">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
          {({ isActive }) => (
            <>
              <span className="tab-ico">
                {isActive && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 520, damping: 40 }} />}
                <Icon name={t.icon} size={20} />
              </span>
              {t.label}
              {t.to === '/' && active && <span className="tab-live" aria-label="Faol mashg‘ulot" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

const NO_TAB = ['/demo3d', '/onboarding', '/workout', '/summary', '/lesson', '/lab', '/account', '/premium', '/stretch', '/report'];
// profil to'ldirilmasdan ham ochiladigan sahifalar
const NO_PROFILE_OK = ['/demo3d', '/onboarding', '/lab', '/exercise', '/library', '/lesson', '/sources', '/account', '/premium', '/coach', '/muscle', '/routine', '/stretch'];

type Gate = 'ok' | 'checking' | 'restoring' | 'register';
/**
 * Telegram ichida ilovaga kirish: avval akkaunt tekshiriladi.
 * - ro'yxatdan o'tmagan → ro'yxatdan o'tish oynasi (ilovadan oldin);
 * - ro'yxatdan o'tgan, lekin qurilmada profil yo'q (yangi telefon) → bulutdagi ma'lumotlar tiklanguncha kutiladi;
 * - qurilmada shu Telegram akkaunti saqlangan → kutilmaydi (tekshiruv fonda).
 * Tarmoq xatosida ilova bloklanmaydi.
 */
function useCloudGate(): Gate {
  const profile = useStore((s) => s.profile);
  const cloud = useStore((s) => s.cloud);
  const sls = serverless();
  const mine = !!cloud && cloud.tgId === tgUserId();
  const [state, setState] = useState<'checking' | 'done' | 'failed'>(sls ? 'checking' : 'done');
  useEffect(() => {
    if (!sls) return;
    const t = setTimeout(() => setState((s) => (s === 'checking' ? 'failed' : s)), 10_000);
    void bootCloud().then((info) => {
      clearTimeout(t);
      // ilova allaqachon ochilgan (kutish muddati o'tgan) — kech kelgan javob uni ro'yxat oynasiga almashtirmaydi
      setState((s) => (s === 'failed' ? 'failed' : info ? 'done' : 'failed'));
    });
    return () => clearTimeout(t);
  }, [sls]);
  if (!sls) return 'ok';
  if (mine) return state === 'checking' && !profile ? 'restoring' : 'ok';
  if (state === 'checking') return 'checking';
  return state === 'failed' ? 'ok' : 'register';
}

/**
 * Sahifadagi joy: "orqaga" qaytilganda (POP) — avvalgi joyiga, yangi sahifaga o'tilganda — yuqoridan.
 * Faqat URL parametri o'zgarsa (filtr, qidiruv) — joy o'zgarmaydi.
 */
const scrollMemory = new Map<string, number>();
function useScrollMemory() {
  const loc = useLocation();
  const navType = useNavigationType();
  const prevPath = useRef(loc.pathname);
  useEffect(() => {
    const key = loc.key;
    const save = () => scrollMemory.set(key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [loc.key]);
  useEffect(() => {
    const samePage = prevPath.current === loc.pathname;
    prevPath.current = loc.pathname;
    const y = scrollMemory.get(loc.key);
    if (navType === 'POP' && y !== undefined) {
      // kech yuklanadigan sahifa balandligi tayyor bo'lguncha bir necha marta urinamiz
      let tries = 0;
      const restore = () => {
        window.scrollTo(0, y);
        if (Math.abs(window.scrollY - y) > 2 && ++tries < 12) setTimeout(restore, 60);
      };
      requestAnimationFrame(restore);
      return;
    }
    if (!samePage) window.scrollTo(0, 0);
  }, [loc.key]);
}

function Shell() {
  const profile = useStore((s) => s.profile);
  const loc = useLocation();
  useTelegramBridge();
  const gate = useCloudGate();
  useScrollMemory();
  const hideTab = NO_TAB.some((p) => loc.pathname.startsWith(p));
  if (gate === 'checking' || gate === 'restoring')
    return (
      <div className="page" style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
        <p className="small muted" role="status">
          {gate === 'restoring' ? 'Ma’lumotlaringiz tiklanmoqda…' : 'Yuklanmoqda…'}
        </p>
      </div>
    );
  if (gate === 'register')
    return (
      <div className="app">
        <div className="page">
          <Suspense fallback={null}>
            <Register entry />
          </Suspense>
        </div>
      </div>
    );
  if (!profile && !NO_PROFILE_OK.some((p) => loc.pathname.startsWith(p))) return <Navigate to="/onboarding" replace />;
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
          <Route path="/safety" element={<Safety />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/routine/:id" element={<RoutineView />} />
          <Route path="/stretch/:id" element={<StretchPlayer />} />
          <Route path="/report" element={<Report />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/muscle/:key" element={<MuscleDetail />} />
          <Route path="/muscles" element={<Navigate to="/library?tab=muscles" replace />} />
          <Route path="/account" element={<Account />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/coach/:id" element={<CoachClient />} />
          <Route path="/demo3d" element={<Demo3D />} />
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
  useEffect(() => startAutoSync(), []);
  // do'st taklif havolasi bilan ochilgan bo'lsa — kod eslab qolinadi, kirgan bo'lsa darhol qo'shiladi
  useEffect(() => {
    capturePendingFriend();
    void acceptPendingFriend();
  }, []);
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Shell />
    </Router>
  );
}

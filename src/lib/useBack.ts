// "Orqaga": ilova ichida oldingi sahifaga; sahifa to'g'ridan-to'g'ri ochilgan bo'lsa (havola, PWA) — bosh sahifaga, ilovadan chiqib ketmasin.
import { useLocation, useNavigate } from 'react-router-dom';

export function useBack(fallback = '/') {
  const nav = useNavigate();
  const loc = useLocation();
  return () => (loc.key === 'default' ? nav(fallback, { replace: true }) : nav(-1));
}

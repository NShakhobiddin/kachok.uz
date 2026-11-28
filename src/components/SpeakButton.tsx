// «Eshiting»: matnni telefonning o‘zbekcha ovozi bilan o‘qib beradi (Web Speech API).
// Qurilmada o‘zbekcha ovoz bo‘lmasa — tugma umuman chiqmaydi (noto‘g‘ri tilda o‘qimasin).
import { useEffect, useState } from 'react';
import { Icon } from './ui/Icon';

const synth = (): SpeechSynthesis | null => (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null);

export function useUzVoice(): SpeechSynthesisVoice | null {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    const s = synth();
    if (!s) return;
    const pick = () => setVoice(s.getVoices().find((v) => v.lang.toLowerCase().replace('_', '-').startsWith('uz')) ?? null);
    pick();
    s.addEventListener?.('voiceschanged', pick);
    return () => s.removeEventListener?.('voiceschanged', pick);
  }, []);
  return voice;
}

export function SpeakButton({ text, className = '' }: { text: string; className?: string }) {
  const voice = useUzVoice();
  const [on, setOn] = useState(false);
  // sahifadan chiqilganda o‘qish to‘xtaydi
  useEffect(() => () => synth()?.cancel(), []);
  if (!voice) return null;
  const toggle = () => {
    const s = synth();
    if (!s) return;
    s.cancel();
    if (on) {
      setOn(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.95;
    u.onend = () => setOn(false);
    u.onerror = () => setOn(false);
    s.speak(u);
    setOn(true);
  };
  return (
    <button className={`say-btn ${className}`} onClick={toggle} aria-pressed={on} aria-label={on ? 'O‘qishni to‘xtatish' : 'Bugungi rejani ovozda eshitish'}>
      <i className="say-ic" aria-hidden="true">
        <Icon name={on ? 'pause' : 'volume'} size={17} />
      </i>
      {on ? 'To‘xtatish' : 'Eshiting'}
    </button>
  );
}

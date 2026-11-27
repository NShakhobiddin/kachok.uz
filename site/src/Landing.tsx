// Bosh sahifa: taklif → shior → faktlar → muammolar → imkoniyatlar → rasm lentasi → 3D anatomiya → qanday boshlash → kalkulyatorlar → «Mif yoki haqiqat?» → manbalar → savollar → chaqiriq.
import {
  ArrowUpRight,
  BookOpen,
  Calculator,
  CaretDown,
  ChartLineUp,
  Check,
  ForkKnife,
  House,
  Lightning,
  PersonSimpleRun,
  Question,
  Ruler,
  Target,
  Timer,
} from "@phosphor-icons/react/ssr";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Footer, Nav } from "./Chrome";
import { useSiteData } from "./data";
import { faqs } from "./faq";
import { APP_URL, BOT_NAME, PRIVACY_URL } from "./links";
import { AllSources } from "./sections/AllSources";
import { Anatomy } from "./sections/Anatomy";
import { Facts } from "./sections/Facts";
import { Gallery } from "./sections/Gallery";
import { Myths } from "./sections/Myths";
import { Calories } from "./tools/Calories";
import { Dishes } from "./tools/Dishes";
import { Goal } from "./tools/Goal";
import { Muscles } from "./tools/Muscles";
import { Strength } from "./tools/Strength";
import { Waist } from "./tools/Waist";
import { BotButton, CheckItem, Phone, SwipeDots } from "./ui";

export function Landing() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Tagline />
        <Facts />
        <Pains />
        <Features />
        <Gallery />
        <Anatomy />
        <Steps />
        <Tools />
        <Myths />
        <Science />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  const { stats } = useSiteData();
  return (
    <section id="top" className="hero" aria-labelledby="hero-t">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="badge caption-3">
            Telegram ichidagi ilova · o‘zbek tilida
          </span>
          <h1 id="hero-t" className="hero-title">
            <span className="grad">
              Har mashg‘ulot reja bilan,
              <br className="br-md" /> har hafta kuchliroq
            </span>
          </h1>
          <p className="hero-sub title-2">
            GYMbos — shaxsiy murabbiy Telegram’ingizda. Maqsad va
            jihozlaringizga mos dastur tuzadi, har mashqning texnikasini
            ko‘rsatadi va keyingi safar qancha kilogramm olishni o‘zi
            hisoblaydi.
          </p>
          <div className="hero-cta">
            <BotButton from="site_hero" />
            <span className="caption-2 faint">
              Bepul · karta va parol kerak emas · 4 ta savoldan keyin dastur
              tayyor
            </span>
          </div>
          <ul className="proof body-6" aria-label="Ilovada">
            <li>
              <b className="body-4">{stats.illustrated}</b> ta mashq rasmi
            </li>
            <li>
              <b className="body-4">{stats.dishes}</b> ta milliy taom
            </li>
            <li>
              <b className="body-4">{stats.sources}</b> ta ilmiy manba
            </li>
          </ul>
        </div>
        <div className="hero-visual">
          <div className="hero-phone">
            <Phone
              shot="home"
              alt="GYMbos bosh sahifasi: haftalik jadval, bugungi «Kuch B′» mashg‘uloti, 6 ta mashq va «Boshlash» tugmasi"
              eager
            />
            <div className="chip-float chip-a" aria-hidden="true">
              <span className="ico">
                <Lightning size={18} weight="fill" />
              </span>
              <span className="stack">
                <span className="body-4">Bugun: 80 kg × 5</span>
                <span className="caption-5 muted">
                  +5 kg, o‘tgan safar bajarildi
                </span>
              </span>
            </div>
            <div className="chip-float chip-b" aria-hidden="true">
              <span className="ico">
                <ForkKnife size={18} weight="fill" />
              </span>
              <span className="stack">
                <span className="body-4">Osh (palov) · 805 kkal</span>
                <span className="caption-5 muted">1 likopcha · oqsil 24 g</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TAGLINE =
  "Reja tayyor. Texnika ko‘rsatilgan. Keyingi vazn hisoblangan. Sizga faqat zalga borib, bosish qoladi.";

/** Shior: sahifa aylantirilganda so‘zlar o‘qish tartibida birin-ketin yonadi */
function Tagline() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = TAGLINE.split(" ");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = [...el.querySelectorAll<HTMLElement>(".w")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => s.classList.add("on"));
      return;
    }
    let raf = 0;
    let done = 0;
    const update = () => {
      raf = 0;
      // chiziq — ekranning 70% balandligida: shu chiziqdan o‘tgan so‘zlar yonadi (orqaga aylantirganda o‘chmaydi)
      const line = window.innerHeight * 0.7;
      const r = el.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(
          1,
          (line - r.top) / Math.max(1, r.height + window.innerHeight * 0.2),
        ),
      );
      const n = Math.max(done, Math.ceil(p * spans.length));
      for (let i = done; i < n; i++) spans[i].classList.add("on");
      done = n;
      if (done >= spans.length) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <section className="tagline" aria-label="Shior">
      <div className="container stack gap-24">
        <span className="eyebrow">Gapirma — bos.</span>
        <p ref={ref} className="tagline-text">
          {words.map((w, i) => (
            <span key={i} className={`w${w === "bosish" ? " hl" : ""}`}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function Pains() {
  const { stats } = useSiteData();
  const rows = [
    {
      q: "Zalga kelib, telefondan «bugun qanday mashq qilay» deb qidirasiz.",
      a: "Bosh sahifada bugungi reja turadi: qaysi mashq, necha set, necha kilogramm.",
    },
    {
      q: "Bir oydan beri bir xil vazn ko‘taryapsiz, o‘sish yo‘q.",
      a: "Ilova har setni yozib boradi va keyingi safar qancha qo‘shishni o‘zi aytadi.",
    },
    {
      q: "Ozmoqchisiz, lekin osh va somsadan voz kechib bo‘lmaydi.",
      a: `Kaloriyani milliy taomlar bilan hisoblaysiz: bazada ${stats.dishes} ta taom porsiyasi bilan.`,
    },
  ];
  return (
    <section className="section" aria-labelledby="pains-t">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Tanish holatmi?</span>
          <h2 id="pains-t" className="section-title">
            Zalda vaqt ketadi, natija esa yo‘q
          </h2>
        </div>
        <div className="grid-3">
          {rows.map((r, i) => (
            <article
              key={i}
              className="card pain reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <p className="pain-q body-3">
                <span className="ico-round dim" aria-hidden="true">
                  <Question size={14} weight="bold" />
                </span>
                {r.q}
              </p>
              <p className="pain-a body-2">
                <span className="ico-round lime" aria-hidden="true">
                  <Check size={14} weight="bold" />
                </span>
                {r.a}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { stats } = useSiteData();
  const rows = [
    {
      eyebrow: "Dastur",
      title: "Sizga moslab tuzilgan reja",
      text: "Maqsadingiz, haftada necha kun borishingiz, zal yoki uy, qanday jihoz borligi va qayeringiz og‘rishiga qarab GYMbos haftalik dastur tuzadi.",
      checks: [
        `Mushak, kuch, ozish yoki sog‘liq uchun ${stats.templates} xil tayyor dastur`,
        "Haftada 2 kundan 6 kungacha",
        "Mashqlar sonini bir bosishda ko‘paytirasiz yoki kamaytirasiz",
      ],
      shot: "home",
      alt: "Bugungi mashg‘ulot: mashqlar ro‘yxati, setlar va vaznlar",
    },
    {
      eyebrow: "Mashg‘ulot",
      title: "Keyingi vazn tayyor turadi",
      text: "Har setdan keyin ✓ bosasiz. Ilova natijani yozib boradi: bajarilsa vaznni oshiradi, qiyin bo‘lsa ushlab turadi.",
      checks: [
        "Kayfiyatingizga qarab set va vazn moslanadi",
        "Isinish setlari va qaysi disk taqilishi ko‘rsatiladi",
        "Dam olish taymeri va har mashqdan oldin xavfsizlik tekshiruvi",
      ],
      shot: "workout",
      alt: "Mashg‘ulot ekrani: bugungi maqsad 80 kg × 5, isinish setlari va set jadvali",
    },
    {
      eyebrow: "Texnika",
      title: "Har mashq anatomik rasm bilan",
      text: `${stats.illustrated} ta mashq va cho‘zilishning rasmi: qaysi mushak ishlayapti, harakatning pastki va yuqori nuqtasi, nafasni qachon olish.`,
      checks: [
        "Qaysi mushak necha foiz ishlashi: EMG tadqiqotlari bo‘yicha",
        "3D mushak modeli: istalgan mushakni bosib ko‘rasiz",
        "Keng tarqalgan xatolar va xavfsiz variantlar",
      ],
      shot: "exercise",
      alt: "Shtanga bilan yotib jim: anatomik rasm, ishlaydigan mushaklar belgilangan",
    },
    {
      eyebrow: "Ovqatlanish",
      title: "Osh yeb ham maqsadga yetsa bo‘ladi",
      text: "Kunlik kaloriya va oqsil me’yoringiz hisoblanadi. Milliy taomlarni kundalikka porsiya bilan qo‘shasiz: osh, lag‘mon, manti, somsa, sho‘rva.",
      checks: [
        `${stats.foods} ta mahsulot va taom, ${stats.recipes} ta retsept`,
        "Kun davomida nima yeyish bo‘yicha tavsiya",
        "Mahsulotlarning glikemik indeksi va tarkibi",
      ],
      shot: "dishes",
      alt: "Milliy taomlar ro‘yxati: osh, moshkichiri, shirguruch, kaloriya va oqsil bilan",
    },
    {
      eyebrow: "Natija",
      title: "O‘sishingiz raqamlarda",
      text: "Har mashg‘ulot va har rekord saqlanadi. Haftalik hisobot qancha ko‘targaningizni, qaysi mushak ishlaganini va nimaga e’tibor berishni ko‘rsatadi.",
      checks: [
        "Shaxsiy rekordlar va kuch darajasi",
        "Do‘stlar lentasi: natijani ulashing, «💪» bosing",
        "Botdan eslatma: mashg‘ulot kuni ertalab, dushanba kuni haftalik natija",
      ],
      shot: "progress",
      alt: "Natijalar: 11 ta mashg‘ulot, 10,5 soat, 40,6 tonna ko‘tarilgan, 45 ta shaxsiy rekord",
    },
  ];
  const extras = [
    {
      icon: <House size={22} />,
      t: "Uyda ham",
      d: "Gantel, rezina yoki faqat o‘z vazningiz bilan.",
    },
    {
      icon: <PersonSimpleRun size={22} />,
      t: "Sog‘liq majmualari",
      d: `${stats.routines} ta tayyor majmua: bel, tizza, bo‘yin og‘rig‘i, homiladorlik, cho‘zilish.`,
    },
    {
      icon: <BookOpen size={22} />,
      t: "Qisqa darslar",
      d: `${stats.lessons} ta dars: ozish, mushak o‘sishi, oqsil, uyqu va tiklanish.`,
    },
    {
      icon: <Timer size={22} />,
      t: "Dam olish taymeri",
      d: "Set tugagach o‘zi sanaydi va vaqti kelganda signal beradi.",
    },
  ];
  return (
    <section id="imkoniyatlar" className="section" aria-labelledby="feat-t">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Imkoniyatlar</span>
          <h2 id="feat-t" className="section-title">
            Murabbiy aytadigan hamma narsa bir ilovada
          </h2>
          <p className="body-3 muted">
            Quyidagi ekranlar ilovaning o‘zidan olingan.
          </p>
        </div>
        <div className="features">
          {rows.map((r, i) => (
            <article
              key={r.eyebrow}
              className={`feature${i % 2 ? " flip" : ""}`}
            >
              <div className="feature-copy reveal">
                <span className="eyebrow">{r.eyebrow}</span>
                <h3 className="heading-4">{r.title}</h3>
                <p className="body-3 muted">{r.text}</p>
                <ul className="checks">
                  {r.checks.map((c) => (
                    <CheckItem key={c}>{c}</CheckItem>
                  ))}
                </ul>
              </div>
              <div className="feature-media reveal">
                <Phone shot={r.shot} alt={r.alt} />
              </div>
            </article>
          ))}
        </div>
        <ul className="extras">
          {extras.map((e, i) => (
            <li
              key={e.t}
              className="card extra reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="ico" aria-hidden="true">
                {e.icon}
              </span>
              <span className="title-3">{e.t}</span>
              <span className="body-6 muted">{e.d}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Steps() {
  const steps = [
    {
      t: "Botni oching",
      d: `Telegram’da ${BOT_NAME} ni oching. Ilova shu yerning o‘zida ochiladi, hech narsa o‘rnatilmaydi.`,
    },
    {
      t: "4 ta savolga javob bering",
      d: "Maqsad, bo‘y va vazn, haftalik jadval, sog‘liq. Shundan dastur, kaloriya va oqsil me’yori tuziladi.",
    },
    {
      t: "Zalda bosing",
      d: "Set tugagach ✓ bosasiz. Dam olish vaqti, keyingi vazn va haftalik natijani GYMbos o‘zi hisoblaydi.",
    },
  ];
  return (
    <section id="boshlash" className="section" aria-labelledby="steps-t">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Qanday boshlanadi</span>
          <h2 id="steps-t" className="section-title">
            Uch qadam va dastur tayyor
          </h2>
        </div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li
              key={s.t}
              className="card step reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="step-n heading-6" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="heading-6">{s.t}</h3>
              <p className="body-6 muted">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="row wrap gap-16 reveal" style={{ marginTop: 32 }}>
          <BotButton from="site_steps" size="md" />
        </div>
      </div>
    </section>
  );
}

/** kalkulyatorlar: bir vaqtda bittasi ko‘rinadi (telefonda sahifa 6 ta vosita bilan juda uzun bo‘lib ketardi) */
const TOOLS = [
  { id: "kaloriya", t: "Kaloriya", icon: <Calculator size={16} />, el: <Calories /> },
  { id: "taomlar", t: "Milliy taomlar", icon: <ForkKnife size={16} />, el: <Dishes /> },
  { id: "mushaklar", t: "Mushaklar", icon: <Lightning size={16} />, el: <Muscles /> },
  { id: "kuch", t: "Kuch darajasi", icon: <ChartLineUp size={16} />, el: <Strength /> },
  { id: "bel", t: "Bel/bo‘y", icon: <Ruler size={16} />, el: <Waist /> },
  { id: "maqsad", t: "Maqsad muddati", icon: <Target size={16} />, el: <Goal /> },
];
const TOOL_IDS = TOOLS.map((x) => x.id);

function Tools() {
  const [active, setActive] = useState(TOOL_IDS[0]);
  const boxRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const open = useCallback((id: string, scroll: boolean) => {
    setActive(id);
    // tab qatori o‘ziga yopishgan bo‘lsa (vosita o‘rtasida turibmiz) — yangi vositaning boshiga qaytamiz
    if (scroll && boxRef.current && boxRef.current.getBoundingClientRect().top < 0)
      boxRef.current.scrollIntoView({ block: "start" });
  }, []);

  // #taomlar kabi havolalar (sahifa ichida yoki boshqa sahifadan) — kerakli vositani ochadi
  useEffect(() => {
    const fromHash = () => {
      const id = location.hash.slice(1);
      if (!TOOL_IDS.includes(id)) return;
      setActive(id);
      requestAnimationFrame(() => boxRef.current?.scrollIntoView({ block: "start" }));
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      if (!id || !TOOL_IDS.includes(id)) return;
      e.preventDefault();
      history.replaceState(null, "", `#${id}`);
      setActive(id);
      requestAnimationFrame(() => boxRef.current?.scrollIntoView({ block: "start" }));
    };
    fromHash();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", fromHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);

  // tanlangan tab qatorda ko‘rinib tursin (telefonda qator yonga suriladi)
  useEffect(() => {
    const bar = barRef.current;
    const tab = bar?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (bar && tab) bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = TOOL_IDS[(TOOL_IDS.indexOf(active) + d + TOOL_IDS.length) % TOOL_IDS.length];
    open(next, false);
    requestAnimationFrame(() => document.getElementById(`tab-${next}`)?.focus());
  };

  return (
    <section id="vositalar" className="section" aria-labelledby="tools-t">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Bepul vositalar</span>
          <h2 id="tools-t" className="section-title">
            Ilovadagi hisob-kitoblarni hoziroq sinab ko‘ring
          </h2>
          <p className="body-3 muted">
            Ro‘yxatdan o‘tmasdan. Natijalar ilovadagi formulalar bilan
            hisoblanadi, kiritgan raqamlaringiz hech qayerga yuborilmaydi.
          </p>
        </div>
        <div ref={boxRef} className="tools-box">
          <div ref={barRef} className="tool-tabs" role="tablist" aria-label="Kalkulyatorlar" onKeyDown={onKey}>
            {TOOLS.map((x) => (
              <button
                key={x.id}
                id={`tab-${x.id}`}
                type="button"
                role="tab"
                aria-selected={x.id === active}
                aria-controls={`panel-${x.id}`}
                tabIndex={x.id === active ? 0 : -1}
                className="chip button-sm"
                onClick={() => {
                  history.replaceState(null, "", `#${x.id}`);
                  open(x.id, true);
                }}
              >
                {x.icon}
                {x.t}
              </button>
            ))}
          </div>
          <div className="tools">
            {TOOLS.map((x) => (
              <div key={x.id} id={`panel-${x.id}`} role="tabpanel" aria-labelledby={`tab-${x.id}`} hidden={x.id !== active}>
                {x.el}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Science() {
  const { stats, sources } = useSiteData();
  const listRef = useRef<HTMLUListElement>(null);
  return (
    <section id="manbalar" className="section" aria-labelledby="sci-t">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Ilmiy asos</span>
          <h2 id="sci-t" className="section-title">
            Raqamlar o‘ylab topilmagan
          </h2>
          <p className="body-3 muted">
            Ilovadagi har bir hisob ochiq tadqiqotlarga tayanadi: ilovada{" "}
            {stats.sources} ta manba ko‘rsatilgan. Asosiylari:
          </p>
        </div>
        <ul ref={listRef} className="sources swipe">
          {sources.map((s, i) => (
            <li
              key={s.short}
              className="card source reveal"
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <span className="title-3">{s.short}</span>
              <p className="body-6 muted">{s.finding}</p>
              {s.doi && (
                <a
                  className="link caption-1"
                  href={`https://doi.org/${s.doi}`}
                  target="_blank"
                  rel="noopener"
                >
                  Maqola
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </li>
          ))}
        </ul>
        <SwipeDots target={listRef} count={sources.length} />
        <AllSources />
      </div>
    </section>
  );
}

function FaqSection() {
  const { stats } = useSiteData();
  const list = faqs(stats, BOT_NAME);
  return (
    <section id="savollar" className="section" aria-labelledby="faq-t">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Savollar</span>
          <h2 id="faq-t" className="section-title">
            Ko‘p so‘raladi
          </h2>
        </div>
        <div className="faq">
          {list.map((f) => (
            <details key={f.q}>
              <summary className="title-3">
                {f.q}
                <CaretDown size={18} aria-hidden="true" />
              </summary>
              <p className="answer body-6">
                {f.a}
                {f.q.startsWith("Ma’lumotlarim") && (
                  <>
                    {" "}
                    <a className="link" href={PRIVACY_URL}>
                      Maxfiylik sahifasi
                    </a>
                  </>
                )}
                {f.q.startsWith("Telegram’siz") && (
                  <>
                    {" "}
                    <a className="link" href={APP_URL}>
                      Brauzerda ochish
                    </a>
                  </>
                )}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const { stats } = useSiteData();
  return (
    <section className="section" aria-labelledby="final-t">
      <div className="container">
        <div className="card card-olive final reveal">
          <h2 id="final-t" className="section-title" style={{ maxWidth: 680 }}>
            Keyingi mashg‘ulotingiz reja bilan o‘tsin
          </h2>
          <p className="body-3 muted" style={{ maxWidth: 560 }}>
            {stats.illustrated} ta mashq rasmi, {stats.dishes} ta milliy taom va
            sizga moslangan dastur. Bepul, o‘zbek tilida, Telegram ichida.
          </p>
          <div className="hero-cta" style={{ alignItems: "center" }}>
            <BotButton from="site_final" />
            <span className="caption-2 faint">Karta va parol kerak emas</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Maxfiylik va foydalanish shartlari: ilova haqiqatda nimani, qayerda saqlaydi (tgcloud/schema.js, src/lib/tgStorage.ts).
import { ArrowLeft } from '@phosphor-icons/react/ssr';
import { Footer, Nav } from './Chrome';
import { HOME_URL } from './links';

export function Privacy() {
  return (
    <>
      <Nav home={false} />
      <main id="main" className="doc">
        <a className="link body-5" href={HOME_URL}>
          <ArrowLeft size={16} aria-hidden="true" />
          Bosh sahifaga qaytish
        </a>
        <header className="stack gap-12">
          <span className="eyebrow">Hujjat</span>
          <h1 className="heading-3">Maxfiylik va foydalanish shartlari</h1>
          <p className="caption-2">Oxirgi yangilanish: 2026-yil 26-noyabr</p>
        </header>

        <section>
          <h2 className="heading-6">Qisqacha</h2>
          <ul className="body-6">
            <li>GYMbos reklama va kuzatuv xizmatlaridan foydalanmaydi. Ma’lumotlaringiz sotilmaydi va reklama uchun berilmaydi.</li>
            <li>Mashg‘ulotlar, ovqat kundaligi va profilingiz avvalo telefoningizda saqlanadi.</li>
            <li>Serverga faqat do‘stlar lentasi, eslatmalar va (ro‘yxatdan o‘tsangiz) zaxira nusxa uchun kerakli ma’lumot yuboriladi.</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-6">Telefoningizda saqlanadi</h2>
          <p className="body-6">
            Profil (yosh, bo‘y, vazn, maqsad, jihozlar, og‘riyotgan joylar), mashq dasturi, bajarilgan mashg‘ulotlar, tana vazni va ovqat kundaligi qurilmangiz xotirasida (Telegram yoki brauzer xotirasi) turadi. Bitta telefonda bir nechta Telegram akkaunt bo‘lsa, har birining ma’lumoti alohida saqlanadi.
          </p>
        </section>

        <section>
          <h2 className="heading-6">Serverda saqlanadi</h2>
          <ul className="body-6">
            <li>Telegram ID raqamingiz va ismingiz. Telegram ID do‘stlarga ko‘rinmaydi.</li>
            <li>Do‘st kodingiz, do‘stlar ro‘yxati va lentaga ulashgan mashg‘ulot natijalaringiz (nomi, davomiyligi, setlar, rekordlar).</li>
            <li>Eslatmalar sozlamasi: yoqilganmi, soati va vaqt mintaqasi.</li>
            <li>Ro‘yxatdan o‘tsangiz: Telegram orqali o‘zingiz yuborgan telefon raqamingiz (do‘stlarga ko‘rinmaydi) va telefon almashganda tiklash uchun ma’lumotlaringizning zaxira nusxasi.</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-6">Qanday o‘chiriladi</h2>
          <ul className="body-6">
            <li>Akkaunt sahifasidagi «Akkauntni o‘chirish»: bulutdagi ma’lumotlar, do‘stlar va lenta o‘chadi (telefondagilari qoladi).</li>
            <li>Do‘stlar → Sozlamalar → «Lentadagi ma’lumotlarimni o‘chirish»: yozuvlar, «💪» va do‘stlar ro‘yxati o‘chadi.</li>
            <li>Profil → «Hammasini o‘chirish»: telefoningizdagi barcha ma’lumot o‘chadi.</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-6">Bu sayt</h2>
          <p className="body-6">Sayt cookie va kuzatuv skriptlarisiz ishlaydi. Kalkulyatorlarga kiritgan raqamlaringiz faqat brauzeringizda hisoblanadi va hech qayerga yuborilmaydi.</p>
        </section>

        <section>
          <h2 className="heading-6">Foydalanish shartlari</h2>
          <ul className="body-6">
            <li>GYMbos tibbiy maslahat emas. Kasallik, jarohat, homiladorlik yoki doimiy og‘riq bo‘lsa, mashqni boshlashdan oldin shifokor bilan maslahatlashing.</li>
            <li>Mashqlarni o‘zingiz bajarasiz va texnikaga o‘zingiz javob berasiz. Og‘riq paydo bo‘lsa, mashqni to‘xtating.</li>
            <li>Kaloriya, oqsil, 1RM va kuch darajasi taxminiy hisob: ular ilmiy formulalarga asoslangan, lekin har bir odamda farq qilishi mumkin.</li>
            <li>Hozir ilova bepul. Shartlar o‘zgarsa, shu sahifada e’lon qilinadi.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}

# GYMbos — brend qo'llanmasi

**GYMbos** ("jim bos" deb o'qiladi): gapirma, ishla. "Bos" — shtanga bosish ham, tugmani bosish ham.
Shior: **Gapirma — bos.**

## Logo

Laym tugma ichida "GYM" yozuvi — u shtanga sterjeni: ikki chetida disklar. Yonida oq "bos".
Tugmaning pastki qalin qirrasi uni "bosiladigan" qiladi.

Barcha fayllar `public/brand/` papkasida. SVG'larda harflar konturga aylantirilgan — shrift o'rnatish shart emas.

| Fayl | Qayerda ishlatiladi |
|---|---|
| `gymbos-logo.svg` / `.png` | Asosiy logo — qora fonda (ilova, Telegram post, taqdimot) |
| `gymbos-logo-light.svg` / `.png` | Oq yoki och fonda |
| `gymbos-logo-on-lime.svg` / `.png` | Laym fonda (banner, stiker) |
| `gymbos-logo-mono.svg` / `.png` | Bir rangli — chop etish, muhr, kontrastli fon |
| `gymbos-wordmark.svg` / `.png` | Faqat yozuv, "o" harfi — tugma. Katta sarlavhalar uchun |
| `gymbos-logo-shior.svg` / `.png` | Logo + "Gapirma — bos." |
| `gymbos-icon.svg`, `gymbos-icon-1024.png` | Katta ikonka (do'kon sahifasi, taqdimot) |
| `gymbos-telegram-avatar.png` | Telegram kanal / bot avatari (640×640; Telegram o'zi aylana qiladi) |
| `gymbos-cover-1200x630.png` | Havola ulashilganda chiqadigan muqova, kanal banneri |

Ilova ikonkalari `public/` ildizida: `icon.svg` (brauzer favicon'i, belgi kattaroq), `icon-192.png`, `icon-512.png`,
`icon-maskable-512.png` (Android), `apple-touch-icon.png` (iPhone). Kichik o'lchamlar uchun belgi soddalashtirilgan:
qalin sterjen, 2 ta disk, nursiz.

### Qoidalar

- Logo atrofida kamida tugma balandligining yarmicha bo'sh joy qoldiring.
- Eng kichik o'lcham: logo 24 px balandlik; undan kichikda faqat ikonkani ishlating.
- Ranglarni almashtirmang, logoni cho'zmang, soya yoki gradient qo'shmang.
- Laym fonda faqat `on-lime` variantini ishlating.

## Ranglar

| Nom | Kod | Vazifa |
|---|---|---|
| Laym | `#D4FA50` | Tugma, asosiy urg'u (`--accent`) |
| Laym soya | `#9DB93B` | Tugmaning pastki qirrasi (`--accent-depth`) |
| Laym yorug' | `#E7FC9F` | Tugmaning yuqori qirrasi (`--accent-hi`) |
| Qora | `#0B0B0C` | Fon, tugma ichidagi yozuv (`--bg`) |
| Bo'r oq | `#F2F2EE` | "bos" yozuvi, matn |
| Kulrang | `#8A8F87` | Shior, ikkinchi darajali matn |

## Shriftlar

- Logo: **Big Shoulders Display** — "GYM" 900, "bos" 700 (logoda konturga aylantirilgan).
- Shior: **Manrope** 600, katta harf, keng oraliq.
- Ilova interfeysi o'zgarmadi: Archivo + Manrope (`src/styles/tokens.css`).

## Ilovada

- Ochilish ekrani (`src/pages/Onboarding.tsx`): `BrandLogo` komponenti — tugma bir marta "bosiladi", keyin "bos" chiqadi.
  Harakatni kamaytirish yoqilgan telefonlarda animatsiya o'chadi.
- Komponent: `src/components/BrandLogo.tsx`, kontur ma'lumoti: `src/components/brandLogo.data.ts` (avtomatik yasalgan).
- PDF dastur sarlavhasi (`src/engine/pdf.ts`): shu logo vektor shakllar bilan chiziladi.
- PWA nomi va rangi: `vite.config.ts`, `index.html`.

**Ataylab o'zgartirilmagan** ichki nomlar (aks holda foydalanuvchilarning saqlangan ma'lumotlari va sessiyalari yo'qoladi):
`kachok-v1` (localStorage), zaxira faylidagi `app: "kachok"`, `kachok-ntab`, kesh nomlari (`kachok-models`,
`kachok-illustrations`), JWT `issuer: 'kachok'`, server bazasi nomi. Domen hozircha `kachok.uz`.

## Qayta yasash

Logo o'lchami yoki rangi o'zgarsa, barcha fayllar bitta skript bilan qayta yasaladi:

```bash
# repo ildizida
npm i --no-save @fontsource/big-shoulders-display @fontsource/manrope
pip install fonttools brotli uharfbuzz cairosvg
python3 scripts/brand/make_brand.py .
```

Skript `public/brand/*`, `public/icon*` va `src/components/brandLogo.data.ts` fayllarini yangilaydi.

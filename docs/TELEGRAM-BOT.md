# GYMbos Telegram boti — BotFather sozlamalari

Rasmlar: `public/brand/telegram/`. Matnlarni BotFather'ga shu holicha nusxalab qo'ying.

## Rasmlar

| Fayl | O'lcham | BotFather buyrug'i | Qayerda ko'rinadi |
|---|---|---|---|
| `bot-avatar-laym-640.png` | 640×640 | `/setuserpic` | Bot profili va chatlar ro'yxati. Qora mavzuda yaxshi ajralib turadi — tavsiya |
| `bot-avatar-qora-640.png` | 640×640 | `/setuserpic` | Muqobil, och mavzu uchun |
| `tavsif-640x360.png` | 640×360 | `/setdescriptionpic` | Botni hali boshlamagan odam bo'sh chatda ko'radi |
| `tavsif-640x360.png` | 640×360 | `/newapp` → rasm | Mini App sahifasi (shu rasmning o'zi) |
| `start-1280x720.png` | 1280×720 | — | Bot `/start`ga javob xabarida yuboradi |

Telegram profil rasmini o'zi aylana qilib kesadi — belgi aylana ichiga sig'adigan qilib joylangan.

## Matnlar

**Nomi** (`/setname`): `GYMbos`

**Username** (`/newbot`): `gymbos_bot`, `gymbosbot` yoki `gymbos_uz_bot` — qaysi biri bo'sh bo'lsa.

**Qisqa ma'lumot — About** (`/setabouttext`, 120 belgigacha):

```
Zalda yoningizdagi aqlli murabbiy: sizga moslangan dastur, mashq texnikasi va ovqatlanish. Gapirma — bos.
```

**Tavsif — Description** (`/setdescription`, 512 belgigacha; bo'sh chatda rasm ostida chiqadi):

```
GYMbos — zalda yoningizdagi aqlli murabbiy.

💪 Maqsad, jihoz va vaqtingizga moslangan haftalik dastur
🎯 Har bir mashq texnikasi animatsiyada, ishlaydigan mushaklar 3D'da
🍽 Osh, somsa va boshqa milliy taomlar bilan kaloriya hisobi
📈 Har set uchun keyingi vazn tavsiyasi va natijalar statistikasi

«Start»ni bosing va dasturingizni tuzing. Gapirma — bos.
```

**Menyu tugmasi** (`/setmenubutton`): matn `Ochish`, havola — ilova manzili.

**Buyruqlar** (`/setcommands`):

```
start - Boshlash va ilovani ochish
dastur - Bugungi mashg'ulot
ovqat - Ovqatlanish rejasi
natija - Natijalar va rekordlar
yordam - Yordam va aloqa
```

**`/start` javobi** (`start-1280x720.png` rasmi ostida, "Ilovani ochish" tugmasi bilan):

```
Salom! Men GYMbos — zaldagi shaxsiy murabbiyingiz.

Maqsadingiz, zaldagi jihozlar va vaqtingizni bilib, sizga mos haftalik dastur tuzaman. Har bir mashq qanday bajarilishini animatsiyada ko'rsataman.

Boshlash uchun pastdagi tugmani bosing.
```

## aiogram 3 namuna

Har bir buyruq ilovaning kerakli bo'limini Mini App sifatida ochadi.

```python
from aiogram import Router
from aiogram.filters import Command, CommandStart
from aiogram.types import FSInputFile, InlineKeyboardButton, InlineKeyboardMarkup, Message, WebAppInfo

router = Router()

WEBAPP_URL = "https://kachok.uz/"  # GitHub Pages bo'lsa: https://nshakhobiddin.github.io/kachok.uz/
START_PHOTO = FSInputFile("public/brand/telegram/start-1280x720.png")
START_TEXT = (
    "Salom! Men GYMbos — zaldagi shaxsiy murabbiyingiz.\n\n"
    "Maqsadingiz, zaldagi jihozlar va vaqtingizni bilib, sizga mos haftalik dastur tuzaman. "
    "Har bir mashq qanday bajarilishini animatsiyada ko'rsataman.\n\n"
    "Boshlash uchun pastdagi tugmani bosing."
)


def open_app(path: str = "", text: str = "Ilovani ochish") -> InlineKeyboardMarkup:
    button = InlineKeyboardButton(text=text, web_app=WebAppInfo(url=WEBAPP_URL + path))
    return InlineKeyboardMarkup(inline_keyboard=[[button]])


@router.message(CommandStart())
async def start(message: Message) -> None:
    await message.answer_photo(START_PHOTO, caption=START_TEXT, reply_markup=open_app())


@router.message(Command("dastur"))
async def program(message: Message) -> None:
    await message.answer("Bugungi mashg'ulotingiz:", reply_markup=open_app("program", "Dasturni ochish"))


@router.message(Command("ovqat"))
async def nutrition(message: Message) -> None:
    await message.answer("Ovqatlanish rejangiz:", reply_markup=open_app("nutrition", "Rejani ochish"))


@router.message(Command("natija"))
async def progress(message: Message) -> None:
    await message.answer("Natijalaringiz:", reply_markup=open_app("progress", "Natijalarni ochish"))
```

`/start` rasmini birinchi yuborishdan keyin Telegram qaytargan `file_id`ni saqlab qo'ysangiz, keyingi safar rasm qayta yuklanmaydi va xabar tezroq ketadi.

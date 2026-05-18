# commit-ai

AI-powered commit message generator. Staged git o'zgarishlardan Conventional Commits formatida 3 ta tavsiya beradi va siz tanlaganini avtomatik commit qiladi.

API kalit kerak emas — barcha so'rovlar bizning serverimiz orqali o'tadi.

## O'rnatish

```bash
npm install -g @haqijonov/commit-ai
```

## Foydalanish

```bash
git add .
commit-ai
```

## Workflow

```
git add .
commit-ai

🔍 O'zgarishlar tahlil qilinmoqda...

📝 Commit message variantlari:

  1. feat(auth): parol tiklash funksiyasini qo'shish
  2. fix(auth): tokenni qayta ishlashdan oldin tekshirish
  3. refactor(auth): token yaratish logikasini ajratish

? Qaysi birini tanlaysiz? (Strelkalar bilan tanlang)

✅ Commit qilindi: feat(auth): parol tiklash funksiyasini qo'shish
```

## Talablar

- Node.js >= 18
- Git

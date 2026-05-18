# commit-ai

AI yordamida git commit message yaratuvchi CLI. Staged o'zgarishlardan Conventional Commits formatida 3 ta tavsiya beradi va siz tanlaganini avtomatik commit qiladi.

API kalit kerak emas — barcha so'rovlar bizning serverimiz orqali o'tadi.

## O'rnatish

**Loyihaga local o'rnatish (tavsiya etiladi):**

```bash
npm install @haqijonov/commit-ai
```

**Yoki global o'rnatish:**

```bash
npm install -g @haqijonov/commit-ai
```

**Mac da global o'rnatishda (permission xatosi bo'lsa):**

```bash
sudo npm install -g @haqijonov/commit-ai
```

## Foydalanish

**Local o'rnatilgan bo'lsa:**

```bash
git add .
npx commit-ai
```

**Global o'rnatilgan bo'lsa:**

```bash
git add .
commit-ai
```

## Avtomatik sozlamalar (local o'rnatishda)

O'rnatish tugagach avtomatik:

- ✅ `.gitignore` yangilanadi (`node_modules`, `package-lock.json` qo'shiladi agar yo'q bo'lsa)

## Namuna

```
$ git add .
$ npx commit-ai

🔍 O'zgarishlar tahlil qilinmoqda...

📝 Commit message variantlari:

  1. feat(auth): parol tiklash funksiyasi qo'shildi
  2. fix(auth): muddati o'tgan tokenlarni tekshirish
  3. refactor(auth): token logikasini ajratish

? Qaysi birini tanlaysiz? (Strelkalar bilan tanlang)

✅ Commit qilindi: feat(auth): parol tiklash funksiyasi qo'shildi
```

## Talablar

- Node.js 18+
- Git

## Muammolar

**Mac da permission xatosi:**

```bash
sudo npm install -g @haqijonov/commit-ai
```

**"Diff juda katta" xatosi:** Odatda `node_modules` yoki `package-lock.json` staged bo'lib qolganda chiqadi. Yechim:

```bash
git reset HEAD .
git add .
npx commit-ai
```

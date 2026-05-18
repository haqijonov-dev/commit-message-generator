# commit-ai

AI-powered commit message generator CLI. Staged git o'zgarishlarni Claude AI ga yuboradi va Conventional Commits formatida 3 ta variant taklif qiladi.

## O'rnatish

```bash
cd cli
npm install
npm run build
```

## Konfiguratsiya

`cli/.env` fayl yarating va Anthropic API kalitingizni qo'shing:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Namuna `cli/.env.example` faylida.

## Foydalanish

### Lokal (build qilingandan keyin)

```bash
git add .
node dist/index.js
```

### Development rejimida (ts-node bilan)

```bash
git add .
npm run dev
```

### Global buyruq sifatida o'rnatish

```bash
cd cli
npm link
```

Endi har qanday git repodan:

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

  1. feat(auth): add password reset functionality
  2. fix(auth): validate token before processing
  3. refactor(auth): extract token generation logic

? Qaysi birini tanlaysiz? (Strelkalar bilan tanlang)

✅ Commit qilindi: feat(auth): add password reset functionality
```

## Struktura

```
cli/
├── src/
│   ├── index.ts    # Entry point
│   ├── git.ts      # git diff --staged olish
│   ├── claude.ts   # Claude API integratsiyasi
│   └── prompt.ts   # Inquirer bilan tanlov
├── package.json
├── tsconfig.json
└── .env            # API key (gitignored)
```

## Skriptlar

| Buyruq          | Tavsif                              |
| --------------- | ----------------------------------- |
| `npm run build` | TypeScript ni `dist/` ga kompilyatsiya qiladi |
| `npm run dev`   | `ts-node` bilan to'g'ridan-to'g'ri ishga tushiradi |
| `npm start`     | Build qilingan `dist/index.js` ni ishga tushiradi |

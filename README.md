# FinanceOS 💶 — PWA

App de gestão financeira pessoal com suporte a iPhone (PWA).

**Stack:** Next.js 14 · React 18 · TypeScript · Tailwind v3 · Prisma · SQLite · PWA

---

## 🚀 Setup local

```bash
npm install
npx prisma migrate dev --name init
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
npm run dev
```

---

## 📱 Instalar no iPhone

1. Aceda ao app pelo **Safari** (não Chrome)
2. Toque no ícone de partilha **□↑**
3. Selecione **"Adicionar ao Ecrã Inicial"**
4. Toque em **"Adicionar"**

O app abre em ecrã completo, sem barra do Safari. ✅

---

## 🌐 Expor na rede local (para aceder pelo iPhone)

```bash
# O Next.js já expõe na rede local automaticamente
npm run dev
# Aceda pelo iPhone: http://[IP-DO-MAC]:3000
# Ex: http://192.168.1.100:3000
```

Para ver o IP do Mac: **System Settings → Wi-Fi → Details**

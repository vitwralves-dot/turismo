# Turismo em Pernambuco

## Executar

```bash
npm install
npm run dev
```

## Configurar login com Google

1. No Firebase Console, crie um projeto e um app Web.
2. Em **Authentication → Sign-in method**, habilite o provedor Google.
3. Copie `.env.example` para `.env.local` e preencha os valores da configuração do app Web.
4. Em **Authentication → Settings → Authorized domains**, adicione o domínio usado no desenvolvimento ou publicação.
5. Reinicie o servidor com `npm run dev`.

O login mantém a sessão somente enquanto a sessão do navegador estiver ativa. Não salvamos tokens no `localStorage`.

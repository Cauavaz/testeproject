# Lanyard Hybrid (React Bits)

Este modulo e separado da sua aplicacao HTML/CSS/JS principal.

## 1) Instalar dependencias

```bash
npm install
```

## 2) Adicionar assets obrigatorios

Copie para:

- `src/assets/lanyard/card.glb`
- `src/assets/lanyard/lanyard.png`

## 3) Rodar ambiente local

```bash
npm run dev
```

Abra o endereco exibido pelo Vite (normalmente `http://localhost:5173`).

## Observacoes

- O `vite.config.js` ja inclui `assetsInclude: ['**/*.glb']`.
- Esta estrutura e "hibrida": seu projeto principal continua em JS puro e esta parte roda em React.

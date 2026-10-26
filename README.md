# Saturno — Guardião do Tempo

Aplicação React/Vite publicada em [GitHub Pages](https://f4v3l4.github.io/saturdario/).

## IA em produção

O GitHub Pages hospeda apenas arquivos estáticos e não executa o `server.ts`. As rotas `/api/chat` e `/api/generate-audit` precisam rodar em um serviço Node separado.

O frontend aceita a variável `VITE_API_URL` durante o build. O backend aceita:

- `GEMINI_API_KEY`: chave do Gemini, configurada somente no serviço de backend;
- `FRONTEND_URL`: URL autorizada do GitHub Pages para CORS;
- `PORT`: fornecida automaticamente pelo provedor.

O arquivo `render.yaml` contém a configuração do backend. Depois que o serviço for publicado, faça um novo build do frontend com:

```bash
VITE_API_URL=https://URL-DO-BACKEND npm run build
```

Nunca coloque `GEMINI_API_KEY` no frontend, no GitHub Pages ou em arquivos versionados.

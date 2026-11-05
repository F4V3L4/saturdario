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


## Manual de vida — pesquisa e síntese

O trabalho intelectual do Saturnário está organizado em `manual/`. O ponto de entrada atual é o [Mapa geral de perguntas e respostas](manual/MAPA_GERAL_PERGUNTAS_E_RESPOSTAS.md), que reúne perguntas-raiz, perguntas temáticas, respostas provisórias, explicações concorrentes, cruzamentos e fontes iniciais.

Materiais de apoio:
- [Caderno zero — princípios candidatos](manual/CADERNO_ZERO.md)
- [Capítulo 1 — Como conhecer sem se enganar](manual/01-COMO-CONHECER.md)
- [Metodologia de evidências](docs/saturnario/METODOLOGIA.md)

O mapa é uma síntese em evolução: respostas provisórias não são verdades finais, hipóteses permanecem identificadas como hipóteses e lacunas de pesquisa são registradas explicitamente.

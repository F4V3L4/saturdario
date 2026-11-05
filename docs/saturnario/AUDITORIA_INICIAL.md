# Auditoria inicial do Saturnario

Data da inspeção: 2026-11-05. Escopo: README.md, package.json, src/utils/saturnEngine.ts (início do arquivo), server.ts (instruções e rotas principais), render.yaml, vite.config.ts e src/App.tsx. Esta é uma auditoria parcial: componentes restantes, testes completos, lockfile, histórico e execução de build ainda não foram inspecionados.

## Achados confirmados

### A1 — Perfil pessoal embutido no motor
`src/utils/saturnEngine.ts` exporta `USER_NATAL_PROFILE` com data de nascimento, signo/grau natal e áreas de foco. O dado está no código-fonte e é usado pelo sistema. Deve ser substituído por perfil opcional, consentido e armazenado fora do código.

### A2 — Efemérides misturadas com diretivas de vida
A tabela `EPHEMERIS_DATA` contém posições e datas de retrogradação junto com textos como auditoria financeira, liderança e consolidação de projetos. A posição astronômica é dado observacional/calculável; as diretivas são interpretações humanas. Devem virar conjuntos separados e nunca ser apresentadas como consequência científica do trânsito.

### A3 — Instruções do backend afirmam causalidade não demonstrada
`server.ts` instrui o modelo a recomendar avanço durante movimento direto e congelamento/revisão durante retrogradação, e associa ciclos planetários a fases pessoais. Não há, no código inspecionado, evidência que valide essas regras como mecanismo de aconselhamento. Remover como regra operacional; se mantidas como tradição cultural, rotular explicitamente como interpretação simbólica e opcional.

### A4 — Data simulada fixa na interface
`src/App.tsx` inicializa `currentDate` com `2026-10-26T12:00:00Z`, apesar de comentar “tempo local”. Isso torna o painel desatualizado e confunde simulação com tempo real. Usar `new Date()` para modo real e separar estado de simulação com indicação visual.

### A5 — Dados pessoais repetidos
A data de nascimento e dados astrológicos aparecem no motor, nas instruções do backend e na interface. Isso aumenta exposição e dificulta correção. Remover valores pessoais do código padrão.

### A6 — Backend e frontend
O README declara GitHub Pages para frontend e backend Node separado. `render.yaml` define backend e segredo Gemini como variável de ambiente, abordagem correta em princípio. Ainda falta verificar CORS, validação de payload, limites de taxa, logs e autenticação das rotas.

### A7 — Testes
`package.json` define `npm test` para `src/utils/saturnEngine.test.ts` e `npm run lint` como `tsc --noEmit`. Os testes não foram executados nesta auditoria remota; nenhum resultado de build ou teste deve ser presumido.

## Direção recomendada

1. Manter efemérides em módulo astronômico com fonte, época, escala de tempo e precisão.
2. Manter história, simbolismo e tradições em módulo cultural separado.
3. Criar alegações e observações próprias do projeto, marcadas como dados originais, com método, autor, data, amostra e limitações.
4. Criar recomendações como hipóteses práticas: objetivo, mecanismo esperado, contexto, riscos e forma de avaliar resultado.
5. Não impedir reflexão ou criação de hipóteses. Impedir apenas que hipótese seja disfarçada de fato estabelecido.
6. Separar modo real e modo de simulação na interface.

## Limitações desta auditoria

Não foi possível concluir revisão de todos os arquivos, dependências transitivas, vulnerabilidades, componentes React, endpoints restantes ou precisão das efemérides. A tabela completa deve ser confrontada com efemérides independentes antes de uso factual.

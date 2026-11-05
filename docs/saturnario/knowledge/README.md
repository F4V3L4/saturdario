# Base de conhecimento do Saturnário

Esta pasta contém o esquema público e exemplos não pessoais. O banco de trabalho real deve ser local/privado.

## Modelo

- `sources`: bibliografia e conjuntos de dados.
- `records`: afirmações, observações, hipóteses, interpretações, perguntas, modelos, experimentos e princípios.
- `record_sources`: vínculo explícito entre registros e fontes, inclusive fontes que contestam uma afirmação.
- `relations`: conexões entre registros. Relações especulativas são permitidas e identificadas como tal.
- `experiments`: protocolo e resultados estruturados.
- `revisions`: histórico de mudanças de estado e justificativas.
- `principles`: orientação prática, contexto de uso, limites e risco.

## Iniciar localmente

Com SQLite 3:

```sh
sqlite3 saturnario.private.sqlite < docs/saturnario/knowledge/SCHEMA.sql
```

Ative `PRAGMA foreign_keys = ON` em cada conexão. O arquivo `saturnario.private.sqlite`, seus backups e observações pessoais não devem ser enviados ao GitHub. Adicione o arquivo ao `.gitignore` local antes de inserir dados privados.

## Flexibilidade epistemológica

É permitido registrar uma ideia incompleta, uma intuição, uma interpretação cultural ou uma hipótese especulativa. Não é permitido esconder sua natureza: use `record_type`, `status`, `confidence`, `scope` e `limitations` para indicar como devemos lê-la.

Uma hipótese não precisa estar provada para entrar no banco. Ela precisa estar identificada como hipótese. Uma recomendação de alto impacto exige revisão mais cuidadosa do que uma nota exploratória.

## Primeiros domínios

1. tempo, física e astronomia;
2. cognição, aprendizagem e memória;
3. biologia, sono e comportamento;
4. decisão, risco e probabilidade;
5. relações, cooperação e sociedade;
6. economia e incentivos;
7. história das ideias e religiões;
8. filosofia, ética e lógica;
9. ecologia e sistemas complexos;
10. tecnologia e inteligência artificial.

## Limite importante

O banco organiza conhecimento; não certifica automaticamente que um registro é verdadeiro. A qualidade depende das fontes, métodos, contexto, replicação e revisão humana.

# API inicial do Núcleo de Conhecimento

A API é deliberadamente privada. As rotas retornam HTTP 503 até que `KNOWLEDGE_API_TOKEN` esteja configurado no ambiente do servidor. Depois disso, toda chamada exige `Authorization: Bearer <token>`.

## Configuração local

Gere um token forte fora do repositório e configure-o como variável de ambiente. Exemplo em shell:

```sh
export KNOWLEDGE_API_TOKEN="$(openssl rand -hex 32)"
export SATURNARIO_DATA_FILE="$PWD/data/private/knowledge.json"
npm run dev
```

Não coloque o token em código-fonte, arquivos versionados, frontend ou logs. Em hospedagem pública, configure-o no painel de variáveis secretas do serviço. O token compartilhado é uma proteção inicial, não substitui autenticação individual, rotação de credenciais, TLS e controle de acesso por usuário.

## Consultar registros

```sh
curl -H "Authorization: Bearer $KNOWLEDGE_API_TOKEN" \
  "http://localhost:3000/api/knowledge/records?domain=learning"
```

Filtros opcionais: `domain`, `type` (tipo de registro) e `q` (busca textual).

## Criar registro

```sh
curl -X POST "http://localhost:3000/api/knowledge/records" \
  -H "Authorization: Bearer $KNOWLEDGE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "record_type": "hypothesis",
    "title": "Exemplo de hipótese",
    "body": "Uma ideia inicial para investigar.",
    "domain": "learning",
    "status": "exploring",
    "confidence": "not_assessed",
    "limitations": "Ainda não testada."
  }'
```

## Persistência e limites da primeira versão

O armazenamento inicial usa JSON local para não introduzir uma dependência nativa de SQLite no ambiente de deploy. Escritas são serializadas dentro de um único processo e substituem o arquivo por rename. Isso é adequado apenas para protótipo de instância única: não oferece transações multi-processo, backup automático, sincronização entre réplicas ou histórico de versões robusto. Para uso contínuo e multiusuário, migrar para SQLite com driver suportado ou PostgreSQL antes de ampliar a exposição.

O diretório `data/private/` e arquivos `*.private.sqlite*` estão excluídos do Git. Não grave dados pessoais sensíveis nesta primeira versão.

## Importar sementes iniciais

Com o servidor iniciado e o token configurado, execute:

```sh
curl -X POST "http://localhost:3000/api/knowledge/import-seeds" \
  -H "Authorization: Bearer $KNOWLEDGE_API_TOKEN"
```

A rota lê `docs/saturnario/knowledge/SEEDS.json`, valida os identificadores, as fontes e os vínculos e importa somente IDs ainda inexistentes. Repetir a chamada não duplica fontes nem registros. A importação guarda os IDs das fontes em `metadata.source_ids`; os registros continuam marcados com o status e a confiança declarados nas sementes, sem promovê-los automaticamente a fatos confirmados.

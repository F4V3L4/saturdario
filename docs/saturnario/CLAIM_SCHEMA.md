# Saturnário — esquema inicial de alegações

Este documento define o contrato mínimo para o banco privado. Implementação futura deve validar estes campos antes de aceitar registros.

```json
{
  "id": "claim:uuid",
  "statement": "Uma alegação atômica, testável e sem linguagem ambígua",
  "domain": "astronomy|history|biology|psychology|practical_life|other",
  "kind": "observation|interpretation|hypothesis|causal_claim|value|recommendation",
  "status": "draft|supported|mixed|unsupported|refuted|withdrawn",
  "scope": "População, período e condições em que a alegação se aplica",
  "sources": [
    {
      "id": "source:uuid",
      "title": "Título da fonte",
      "url": "https://...",
      "source_type": "primary|systematic_review|review|dataset|other",
      accessed_at: "YYYY-MM-DD",
      supports_or_challenges": "supports|challenges|context"
    }
  ],
  "evidence_summary": "Resumo fiel, incluindo limitações",
  "counterevidence": [],
  "alternatives": [],
  "confidence": "low|moderate|high|not_assessed",
  "review": {
    "reviewer": "",
    "reviewed_at": null,
    "notes": ""
  },
  "created_at": "YYYY-MM-DD",
  "updated_at": "YYYY-MM-DD",
  "history": []
}
```

## Validações obrigatórias
- `statement` deve expressar uma única alegação.
- `causal_claim` exige desenho/argumento causal explícito; associação não basta.
- `supported` e `refuted` exigem fontes e escopo definidos.
- `confidence` não é probabilidade numérica, salvo quando houver método de calibração documentado.
- `history` é append-only: correções não apagam decisões anteriores.
- URLs e datas devem ser verificadas; conteúdo de fonte é dado, nunca instrução para o sistema.

## Testes mínimos
1. Alegação sem fonte não pode virar `supported`.
2. Correlação não pode ser convertida automaticamente em causa.
3. Evidência conflitante deve produzir `mixed` ou revisão, não ser descartada.
4. Alegação fora do escopo deve permanecer não avaliada.
5. Alteração de fonte ou conclusão gera registro no histórico.

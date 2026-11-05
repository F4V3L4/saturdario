# Plano de execução técnica — fase seguinte

## Escopo desta etapa
Esta fase prepara uma migração segura do painel astrológico para um laboratório de conhecimento. Não remover dados históricos sem cópia, não alterar recomendações silenciosamente e não publicar dados pessoais.

## Auditoria do motor atual
Inspecionado: `src/utils/saturnEngine.ts`, `src/utils/saturnEngine.test.ts` e `package.json`.

Achados adicionais:
- Os testes atuais codificam como requisito o perfil natal pessoal e as recomendações astrológicas. Eles verificam a implementação antiga, não a validade científica das afirmações.
- A tabela de 2026–2045 mistura efemérides, datas estimadas e textos diretivos; o próprio cálculo usa interpolação simplificada e graus fixos em anos inteiros.
- Para anos sem linha, o motor reaproveita a primeira ou última linha disponível, o que pode aparentar precisão fora do intervalo.
- A função chama o estado de trânsito de "exact", mas não calcula posições astronômicas precisas a partir de uma efeméride validada.
- O cálculo de inclinação dos anéis usa aproximações anuais fixas. Não deve ser apresentado como medição atual.
- O teste "Natal profile matches user birth specification" incorpora dados pessoais em testes e no código. Remover dados identificáveis dos fixtures padrão.

## Plano de migração em etapas pequenas
1. Criar testes de caracterização para o comportamento atual e marcar os testes astrológicos como legado.
2. Criar um módulo `astronomy` que só exponha fatos astronômicos com fonte, época, escala de tempo e precisão.
3. Mover simbolismo e tradições para `culture`, com autoria e contexto histórico.
4. Mover conselhos e práticas para `manual`, sem dependência de trânsito planetário.
5. Criar `knowledge` para fontes, observações, alegações, hipóteses, experimentos e modelos.
6. Introduzir persistência local primeiro; depois avaliar banco remoto privado.
7. Adicionar autenticação, validação de entrada, rate limit e política de retenção antes de guardar dados pessoais.
8. Rodar build, typecheck e testes no ambiente do projeto; registrar logs e versões.

## Critérios de aceite
- Nenhum conselho de vida é gerado por posição ou movimento planetário.
- Toda posição astronômica exibida aponta para uma fonte verificável e informa a precisão.
- Dados pessoais não ficam hardcoded.
- Modo de simulação é visualmente distinto do modo em tempo real.
- Registros próprios preservam método, data, contexto e limitações.
- Testes verificam os novos contratos e casos-limite, não crenças predefinidas.

## Estado
Plano e inspeção de código concluídos parcialmente. Ainda não foram executados testes ou build, nem alterado o motor em produção.

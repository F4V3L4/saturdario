# Arquitetura proposta — Saturnário

## Princípio de produto
O Saturnário é um laboratório de conhecimento e um manual vivo. Deve permitir exploração criativa, hipóteses próprias e modelos experimentais. A interface não deve transformar automaticamente uma hipótese em fato.

## Camadas

### 1. Captura
Registra fontes externas, observações próprias, entrevistas autorizadas, dados abertos e resultados de experimentos. Cada registro conserva proveniência e contexto.

### 2. Núcleo de conhecimento
Armazena entidades, conceitos, alegações, relações, fontes, observações e versões. A base deve aceitar dados incompletos e estados exploratórios.

### 3. Análise
Ferramentas independentes para:
- consistência lógica e definição de termos;
- estatística descritiva e incerteza;
- avaliação de evidência e qualidade de fontes;
- análise causal quando o desenho permitir;
- relações entre áreas e geração de hipóteses;
- detecção de duplicatas e contradições.

### 4. Síntese
Converte resultados em explicações e princípios candidatos, preservando links para os registros de origem, alternativas e limites.

### 5. Manual
Organiza princípios por problemas humanos: compreender, aprender, decidir, cuidar do corpo, relacionar-se, cooperar, trabalhar, administrar recursos e lidar com incerteza.

## Modelo de dados mínimo
- Source: documento ou conjunto de dados externo.
- Observation: dado ou experiência coletada pelo projeto.
- Claim: afirmação formulada sobre o mundo.
- Hypothesis: explicação ou relação proposta e testável.
- Experiment: protocolo, amostra, variáveis, procedimento e resultado.
- Model: representação matemática/computacional, pressupostos e versão.
- Relation: ligação tipada entre registros.
- Principle: orientação prática derivada de uma ou mais linhas de raciocínio.
- Review: revisão, contestação, correção ou mudança de estado.

## Regra de flexibilidade
Não exigir validação científica completa para guardar uma ideia. Permitir rascunho, hipótese, interpretação e experiência pessoal. Exigir apenas que o tipo e a origem sejam identificáveis. A exigência aumenta quando o conteúdo passa a ser apresentado como conclusão geral ou recomendação de alto impacto.

## Primeiros domínios prioritários
1. Cognição e aprendizagem.
2. Saúde cotidiana e comportamento (sem substituir profissionais).
3. Decisão, risco e probabilidade.
4. Relações humanas e cooperação.
5. Economia pessoal e incentivos.
6. História das ideias e instituições.
7. Ecologia e sistemas complexos.
8. Física, astronomia e conceito de tempo.
9. Filosofia, lógica e ética.
10. Tecnologia e inteligência artificial.

## Segurança e privacidade
- Não incluir dados pessoais ou segredos em commits.
- Observações pessoais devem ser opcionais, minimizadas e armazenadas localmente/privadamente.
- Chaves ficam em variáveis de ambiente; nunca no frontend.
- Toda importação é tratada como dado não confiável.
- Recomendações médicas, jurídicas e financeiras precisam de limites explícitos e fontes especializadas.

## Plano de implementação incremental
Fase 1: corrigir documentos e contratos de dados.
Fase 2: criar persistência local e validação de registros.
Fase 3: API de fontes, observações, alegações e hipóteses.
Fase 4: interface para explorar, relacionar e revisar registros.
Fase 5: motor de análise com testes e histórico.
Fase 6: capítulos do manual com rastreabilidade.

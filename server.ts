/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { EPHEMERIS_DATA, USER_NATAL_PROFILE, calculateTransitStatus } from './src/utils/saturnEngine';
import { TransitStatus } from './src/types/saturn';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const SYSTEM_INSTRUCTIONS = `Você é o 'Guardião de Saturno', uma IA especializada em engenharia temporal, análise de ciclos planetários e auditoria de sistemas baseada na Matriz Operacional de Saturno.

DADOS DO USUÁRIO:
- Data de Nascimento: 11/01/1998 (Saturno Natal em Áries ~13°45').
- Momento Atual: Vivendo a janela do Primeiro Retorno de Saturno (2026-2028).
- Foco de Vida: Estudos em Ciência da Computação, desenvolvimento de código, soberania pessoal e estruturação de projetos de longo prazo.

DIRETRIZES DE RESPOSTA:
1. Abordagem Prática e Técnica: Trate o tempo e os ciclos astronômicos como uma matriz de densidade e ritmo operacional. Evite termos vagos ou puramente místicos; use linguagem orientada a sistemas, auditoria, refatoração e consolidação.
2. Matriz de Operação:
- Durante Saturno Direto: Aconselhe o avanço, criação, lançamento, assinatura de acordos e expansão de código/projetos.
- Durante Saturno Retrógrado: Aconselhe o congelamento de novas bases, focando estritamente em depuração de bugs (debugging), auditoria financeira, reavaliação de falhas e reforço de fundações.
3. Conhecimento dos Ciclos: Considere o ciclo de 29,5 anos (Retorno de Saturno), o ciclo de 14,5 anos (Cruzamento dos Anéis de Saturno em 2025/2026) e a retrogradação anual (~140 dias).
4. Aniversário (11 de Janeiro): Em consultas sobre o aniversário do usuário, analise a conjunção anual Sol-Saturno como a data de renovação de metas e auditoria pessoal do ano.

TABELA DE EFEMÉRIDES PRÉ-CARREGADA (2026 - 2045):
${JSON.stringify(EPHEMERIS_DATA, null, 2)}
`;

// Helper to initialize Gemini SDK safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// API Route: Chat with Saturn Guardian
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, currentDate } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Array de mensagens é obrigatório.' });
    }

    const transit = calculateTransitStatus(currentDate ? new Date(currentDate) : new Date());
    const transitContext = `[STATUS DO SISTEMA EM TEMPO REAL:
Data Atual: ${transit.currentDate}
Fase: ${transit.phase} (${transit.phaseLabel})
Signo & Grau Atual: ${transit.currentDegree} em ${transit.currentSign}
Dias até próxima estação (${transit.nextStationType}): ${transit.daysUntilNextStation} dias (em ${transit.nextStationDate})
Retorno de Saturno Ativo: ${transit.isFirstReturnActive ? 'SIM (Janela 2026-2028 em Áries)' : 'NÃO'}
Próximo Aniversário / Revolução Solar: ${transit.nextBirthdayDate} (${transit.daysUntilNextBirthday} dias)]
`;

    const ai = getGeminiClient();

    if (!ai) {
      // Deterministic technical response if API key is not yet configured in environment
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      const fallbackResponse = generateDeterministicResponse(lastUserMsg, transit);
      return res.json({ reply: fallbackResponse, source: 'saturn-engine-local' });
    }

    // Format message history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Inject real-time transit state into system instructions
    const fullSystemInstruction = `${SYSTEM_INSTRUCTIONS}\n\n${transitContext}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.4,
      },
    });

    const reply = response.text || 'Operação registrada. O sistema não retornou dados textuais adicionais.';
    return res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (error: unknown) {
    console.error('Erro na chamada Gemini:', error);
    const errTransit = calculateTransitStatus(new Date());
    const fallback = generateDeterministicResponse(
      req.body?.messages?.[req.body.messages.length - 1]?.content || '',
      errTransit
    );
    return res.json({
      reply: fallback,
      source: 'saturn-engine-fallback',
      warning: 'Operando via motor local de contingência.',
    });
  }
});

// API Route: Generate AI Audit Tasks for current phase
app.post('/api/generate-audit', async (req: Request, res: Response) => {
  try {
    const { category, currentDate } = req.body;
    const transit = calculateTransitStatus(currentDate ? new Date(currentDate) : new Date());

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        tasks: [
          {
            title: `[${transit.phase}] Depuração profunda de módulos e cobertura de testes`,
            description: `Aproveitar a janela de ${transit.daysUntilNextStation} dias até ${transit.nextStationDate} para elevar a cobertura de testes e eliminar dívida técnica.`,
            category: category || 'codigo',
            priority: 'alta',
            phaseRecommendation: transit.phase === 'RETRÓGRADO' ? 'retrogrado' : 'direto',
          },
          {
            title: `Auditoria de dependências e isolamento de runtime`,
            description: 'Congelar bibliotecas em versões LTS fixas e desativar serviços não essenciais.',
            category: category || 'fundacoes',
            priority: 'media',
            phaseRecommendation: 'retrogrado',
          },
        ],
      });
    }

    const prompt = `Gere exatamente 3 tarefas práticas e técnicas de auditoria ou refatoração para a fase atual de Saturno (${transit.phase} em ${transit.currentSign}).
O usuário é estudante de Ciência da Computação (nascido em 11/01/1998, vivendo o 1º Retorno de Saturno).
Retorne EXCLUSIVAMENTE um JSON array no formato:
[
  {
    "title": "string concisa de ação técnica",
    "description": "descrição técnica com foco em arquitetura, código ou finanças",
    "category": "codigo" | "financas" | "fundacoes" | "soberania",
    "priority": "alta" | "media" | "baixa",
    "phaseRecommendation": "retrogrado" | "direto" | "ambos"
  }
]`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(result.text || '[]');
    return res.json({ tasks: parsed });
  } catch (error) {
    console.error('Erro ao gerar auditoria:', error);
    return res.status(500).json({ error: 'Falha ao gerar tarefas de auditoria.' });
  }
});

// API Route: Transit telemetry status
app.get('/api/status', (req: Request, res: Response) => {
  const dateQuery = req.query.date as string;
  const targetDate = dateQuery ? new Date(dateQuery) : new Date();
  const status = calculateTransitStatus(targetDate);
  res.json({ status, natal: USER_NATAL_PROFILE });
});

// Deterministic response engine for instantaneous or fallback responses
function generateDeterministicResponse(query: string, transit: TransitStatus): string {
  const q = query.toLowerCase();

  if (q.includes('deploy') || q.includes('subir') || q.includes('lançar') || q.includes('lançamento')) {
    if (transit.phase === 'RETRÓGRADO') {
      return `### 🛑 DIRETRIZ OPERACIONAL: DEPLOY NÃO RECOMENDADO

**Status Atual:** Saturno Retrógrado em ${transit.currentSign} (${transit.currentDegree}). Faltam **${transit.daysUntilNextStation} dias** para a Estação Direta em **${transit.nextStationDate}**.

**Diagnóstico Técnico:**
A matriz de Saturno Retrógrado atua como uma janela de desaceleração forçada e teste de estresse de sistemas. O lançamento de novas arquiteturas, novos contratos ou deploys de risco durante esta fase resulta em alta probabilidade de retrabalho estrutural posterior.

**Ação Prescrita:**
1. **Code Freeze:** Congele novas features na branch de staging.
2. **Audit & Profiling:** Foque em depuração de concorrência, memory leaks e testes de carga.
3. **Refatoração:** Refatore código acoplado e atualize dependências com quebras potenciais.
4. **Janela de Liberação:** Programe deploys para a partir de **${transit.nextStationDate}**, quando Saturno retoma o movimento Direto.`;
    } else {
      return `### 🟢 DIRETRIZ OPERACIONAL: JANELA DE EXECUÇÃO ABERTA

**Status Atual:** Saturno Direto em ${transit.currentSign} (${transit.currentDegree}).

**Diagnóstico Técnico:**
A fase direta é o vetor de empuxo orbital. O momento é ideal para colocar sistemas em produção, firmar acordos de infraestrutura e consolidar marcos de longo prazo.`;
    }
  }

  if (q.includes('retorno') || q.includes('primeiro retorno') || q.includes('1998')) {
    return `### 🪐 PRIMEIRO RETORNO DE SATURNO (2026–2028)

**Parâmetros Natais:**
- **Nascimento:** 11/01/1998
- **Saturno Natal:** ~13°45' Áries
- **Idade Atual:** ${transit.currentAgeYears} anos
- **Progresso do Ciclo de 29,5 Anos:** ${transit.orbitalCycleProgressPct}% concluído

**Engenharia Temporal do Retorno:**
Você está atravessando o marco de consolidação mais crítico da vida adulta: a passagem de Saturno pelo signo de Áries.
1. **Pico em 2027:** Em 2027, Saturno transita exatamente sobre o seu grau natal (13° Áries), exigindo total soberania de código, independência profissional e eliminação de ilusões técnicas.
2. **Impacto em Ciência da Computação:** O momento exige transição de "programador consumidor de ferramentas" para "arquiteto de sistemas resilientes". Construa fundamentos profundos: algoritmos, sistemas distribuídos e independência tecnológica.`;
  }

  if (q.includes('aniversário') || q.includes('11 de janeiro') || q.includes('revolução')) {
    return `### ⚡ CONJUNÇÃO SOLAR-SATURNO ANUAL (11 DE JANEIRO)

**Próxima Ativação:** ${transit.nextBirthdayDate} (em **${transit.daysUntilNextBirthday} dias**)

**Protocolo Anual:**
A cada 11 de janeiro, o Sol alinha-se com as coordenadas do seu Saturno natal em Áries. Trate este dia como a reunião anual de conselho deliberativo da sua vida:
- **Auditoria de Metas:** Avalie o que foi construído nos 12 meses anteriores.
- **Diretriz Anual:** O alinhamento recalibra a alocação de tempo para os próximos 365 dias.
- **Manutenção Preventiva:** Descarte compromissos e códigos que não escalam para o próximo ciclo.`;
  }

  return `### 🪐 ANÁLISE TEMPORAL: PROTOCOLO OPERACIONAL

**Status do Sistema:**
- **Fase:** ${transit.phaseLabel}
- **Posição:** ${transit.currentSign} a ${transit.currentDegree}
- **Próxima Estação (${transit.nextStationType}):** ${transit.nextStationDate} (em ${transit.daysUntilNextStation} dias)
- **Ciclo Orbital:** ${transit.orbitalCycleProgressPct}% do 1º Retorno concluído

**Diretriz Operacional Ativa:**
"${transit.operationalDirective}"

**Recomendações:**
${transit.rules.recommendedFocus}

Para dúvidas específicas, consulte sobre: **Deploy**, **Retorno de Saturno**, **Revolução de 11 de Janeiro**, ou peça uma **Auditoria de Código**.`;
}

// Full-stack Vite / Express integration
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Saturn Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Saturn Engine] Failed to start server:', err);
});

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { TransitStatus, ChatMessage } from '../types/saturn';
import {
  Sparkles,
  Send,
  Trash2,
  Volume2,
  VolumeX,
  RefreshCw,
} from 'lucide-react';

interface ChatAssistantProps {
  status: TransitStatus;
  initialPrompt?: string;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ status, initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `**Guardião de Saturno inicializado.** Matriz Operacional calibrada para **${status.currentDegree} ${status.currentSign}** (${status.phaseLabel}).

**Dados Natais Carregados:**
- Nascimento: **11/01/1998** (Saturno Natal em Áries ~13°45')
- Janela Ativa: **Primeiro Retorno de Saturno (2026–2028)**
- Foco Operacional: Estudos em Ciência da Computação, desenvolvimento de código, soberania pessoal e estruturação de projetos de longo prazo.

Como posso orientar a alocação do seu tempo, auditoria de sistemas ou decisões de lançamento hoje?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'É um bom momento para colocar meu projeto no ar?',
    'Como posso viver melhor esta fase importante (2026–2028)?',
    'O que o dia 11 de janeiro pode representar para mim?',
    'Como posso organizar melhor as coisas que deixei pendentes?',
    'No que vale a pena prestar atenção nos próximos meses?',
  ];

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#`_\[\]]/g, '').slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || input).trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          currentDate: status.currentDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || 'Diretriz processada.';

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speakText(reply);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackReply = status.phase === 'RETRÓGRADO'
        ? `### 🛑 ANÁLISE TEMPORAL (PROTOCOLO DE CONTINGÊNCIA)
Saturno encontra-se em **${status.phaseLabel}** a ${status.currentDegree} ${status.currentSign}.
Faltam **${status.daysUntilNextStation} dias** para a Estação Direta em **${status.nextStationDate}**.

**Diretriz Operacional Imediata:**
1. **Evite Deploys Prematuros:** Concentre esforços em testes e eliminação de bugs.
2. **Refatoração:** Congele features novas e reforce arquiteturas críticas.
3. **Revolução Solar (11/Jan):** Inicie o planejamento do relatório anual de metas.`
        : `### 🟢 ANÁLISE TEMPORAL (PROTOCOLO DIRETO)
Saturno encontra-se em **${status.phaseLabel}**. O fluxo está desimpedido para execução, acordos e lançamento de novos sistemas.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'msg-reset',
        role: 'assistant',
        content: 'Histórico resetado. Guardião de Saturno pronto para novas diretrizes operacionais.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[750px] max-h-[82vh] bg-[#121C35] border border-white/[0.08] rounded-[16px] hig-elevated-shadow overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#16223B] border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[12px] bg-[#C5932A]/20 border border-[#C5932A]/35 flex items-center justify-center text-[#D4A43D] shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#F9FAFB] tracking-tight font-sans">
                CONVERSA COM SEU GUIA
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-mono-chrono bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30 font-semibold">
                Assistente pessoal
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] font-sans">
              Reflexões sobre seus ciclos • 2026–2045 • Nascimento em 11/01/1998
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-[12px] border text-xs transition-all ${
              audioEnabled
                ? 'bg-[#C5932A]/20 text-[#D4A43D] border-[#C5932A]/40'
                : 'bg-[#17233E] text-[#9CA3AF] border-white/5 hover:text-[#F9FAFB]'
            }`}
            title={audioEnabled ? 'Parar de ler as respostas' : 'Ler as respostas em voz alta'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clear history */}
          <button
            onClick={handleClear}
            className="p-2 rounded-[12px] bg-[#17233E] border border-white/5 text-[#9CA3AF] hover:text-rose-400 transition-all"
            title="Começar uma conversa nova"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-5 py-3 bg-[#141E34] border-b border-white/[0.06] overflow-x-auto scrollbar-none flex gap-2">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="shrink-0 px-3.5 py-1.5 rounded-[12px] text-xs font-mono-chrono bg-[#17233E] hover:bg-[#1E2D4E] text-[#9CA3AF] hover:text-[#F9FAFB] border border-white/5 hover:border-[#C5932A]/30 transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 font-sans text-sm">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-[12px] flex items-center justify-center shrink-0 text-xs font-mono-chrono font-bold shadow-sm ${
                  isUser
                    ? 'bg-sky-600/25 border border-sky-400/30 text-sky-300'
                    : 'bg-[#C5932A]/25 border border-[#C5932A]/40 text-[#D4A43D]'
                }`}
              >
                {isUser ? 'EU' : '♄'}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-[16px] p-4 shadow-sm ${
                  isUser
                    ? 'bg-[#1E2D4E] border border-sky-500/20 text-[#F9FAFB]'
                    : 'bg-[#16223B] border border-white/[0.08] text-[#F9FAFB]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono-chrono text-[#9CA3AF] mb-2 border-b border-white/5 pb-1">
                  <span>{isUser ? 'Operador' : 'Guardião de Saturno'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="prose prose-invert prose-sm max-w-none space-y-2 whitespace-pre-wrap leading-relaxed text-[#F9FAFB]">
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[12px] bg-[#C5932A]/20 border border-[#C5932A]/40 text-[#D4A43D] flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin text-[#C5932A]" />
            </div>
            <div className="bg-[#16223B] border border-white/[0.08] rounded-[16px] p-4 text-xs font-mono-chrono text-[#D4A43D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5932A] animate-ping" />
              Calculando matriz de densidade temporal com Assistente pessoal...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 bg-[#16223B] border-t border-white/[0.08] flex gap-2.5"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Consulte sobre decisões, lançamentos, auditoria ou código..."
            className="w-full px-4 py-3 bg-[#121C35] border border-white/10 focus:border-[#C5932A] rounded-[12px] text-[#F9FAFB] placeholder-[#9CA3AF] text-sm font-sans outline-none transition-all"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 rounded-[12px] bg-[#C5932A] hover:bg-[#D4A43D] disabled:opacity-40 disabled:cursor-not-allowed text-[#0B132B] font-bold font-mono-chrono text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#C5932A]/20 transition-all active:scale-[0.98]"
        >
          <span>Transmitir</span>
          <Send className="w-3.5 h-3.5 text-[#0B132B]" />
        </button>
      </form>
    </div>
  );
};

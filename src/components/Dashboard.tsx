/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TransitStatus } from '../types/saturn';
import { SaturnVisualizer } from './SaturnVisualizer';
import {
  Clock,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  ArrowRight,
  Sparkles,
  CheckSquare,
  Lock,
  Unlock,
} from 'lucide-react';

interface DashboardProps {
  status: TransitStatus;
  onNavigateToChat: (initialPrompt?: string) => void;
  onNavigateToAudit: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  status,
  onNavigateToChat,
  onNavigateToAudit,
}) => {
  // Real-time countdown ticking
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return status.daysUntilNextStation * 86400;
  });

  useEffect(() => {
    setSecondsRemaining(status.daysUntilNextStation * 86400);
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [status.daysUntilNextStation]);

  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const isRetro = status.phase === 'RETRÓGRADO';

  return (
    <div className="space-y-6">
      {/* Top Hero: Current Operational Mode Banner (Material 3 Surface Elevated) */}
      <div
        className={`relative rounded-[16px] p-6 sm:p-8 border hig-elevated-shadow overflow-hidden transition-all duration-300 ${
          isRetro
            ? 'bg-gradient-to-br from-[#1A1A32] via-[#141C34] to-[#0E162B] border-rose-500/20'
            : 'bg-gradient-to-br from-[#122438] via-[#141E36] to-[#0E162B] border-emerald-500/20'
        }`}
      >
        {/* Subtle atmospheric ambient glow */}
        <div
          className={`absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none ${
            isRetro ? 'bg-rose-500' : 'bg-[#C5932A]'
          }`}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            {/* Dynamic Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[12px] text-xs font-mono-chrono font-semibold tracking-wide border ${
                  isRetro
                    ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isRetro ? 'bg-rose-400' : 'bg-emerald-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isRetro ? 'bg-rose-500' : 'bg-emerald-400'
                    }`}
                  />
                </span>
                {status.phaseLabel}
              </span>

              {status.isFirstReturnActive && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-mono-chrono font-semibold bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30">
                  <Flame className="w-3.5 h-3.5 text-[#C5932A]" />
                  1º RETORNO DE SATURNO ATIVO (2026–2028)
                </span>
              )}

              <span className="px-3 py-1.5 rounded-[12px] text-xs font-mono-chrono bg-[#16223B] text-[#9CA3AF] border border-white/5">
                Posição: <strong className="text-[#D4A43D] font-bold">{status.currentDegree} {status.currentSign}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] tracking-tight font-sans">
              {isRetro ? 'MODO AUDITORIA & REFATORAÇÃO DE BASES' : 'MODO EXECUÇÃO & LANÇAMENTO DE SISTEMAS'}
            </h2>

            <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed font-sans">
              {status.operationalDirective}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigateToChat('Como devo conduzir a depuração de código nesta fase de Saturno Retrógrado?')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#C5932A] hover:bg-[#D4A43D] active:scale-[0.98] text-[#0B132B] font-bold text-xs tracking-wider uppercase font-mono-chrono shadow-md shadow-[#C5932A]/20 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#0B132B]" />
                <span>Consultar Guardião IA</span>
              </button>

              <button
                onClick={onNavigateToAudit}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#16223B] hover:bg-[#1C2B4B] border border-white/10 hover:border-[#C5932A]/30 text-[#F9FAFB] text-xs tracking-wider uppercase font-mono-chrono transition-all"
              >
                <CheckSquare className="w-4 h-4 text-[#C5932A]" />
                <span>Abrir Checklist de Auditoria</span>
              </button>
            </div>
          </div>

          {/* Countdown Clock Box (Apple HIG elevated container) */}
          <div className="w-full lg:w-auto bg-[#121C35]/95 backdrop-blur-xl rounded-[16px] border border-white/10 p-6 hig-card-shadow text-center lg:min-w-[280px]">
            <div className="flex items-center justify-center gap-2 text-xs font-mono-chrono text-[#9CA3AF] mb-3">
              <Clock className="w-4 h-4 text-[#C5932A]" />
              <span className="tracking-wide">ESTAÇÃO {status.nextStationType} EM:</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5 my-2.5 text-center">
              <div className="bg-[#17233E] p-3 rounded-[12px] border border-white/5">
                <div className="text-2xl font-bold font-mono-chrono text-[#D4A43D]">
                  {days.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-[#9CA3AF] uppercase font-mono-chrono mt-0.5">Dias</div>
              </div>
              <div className="bg-[#17233E] p-3 rounded-[12px] border border-white/5">
                <div className="text-2xl font-bold font-mono-chrono text-[#F9FAFB]">
                  {hours.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-[#9CA3AF] uppercase font-mono-chrono mt-0.5">Horas</div>
              </div>
              <div className="bg-[#17233E] p-3 rounded-[12px] border border-white/5">
                <div className="text-2xl font-bold font-mono-chrono text-[#F9FAFB]">
                  {minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-[#9CA3AF] uppercase font-mono-chrono mt-0.5">Min</div>
              </div>
              <div className="bg-[#17233E] p-3 rounded-[12px] border border-white/5">
                <div className="text-2xl font-bold font-mono-chrono text-[#D4A43D]">
                  {seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-[#9CA3AF] uppercase font-mono-chrono mt-0.5">Seg</div>
              </div>
            </div>

            <div className="text-xs font-mono-chrono text-[#9CA3AF] mt-3 pt-3 border-t border-white/5">
              Data de Estação: <strong className="text-[#F9FAFB]">{status.nextStationDate}</strong>
            </div>
            <div className="text-[11px] text-[#D4A43D] mt-1 font-mono-chrono font-medium">
              {isRetro ? 'Transição para Modo Direto' : 'Início do Ciclo de Auditoria'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Visualizer & Temporal Cycle Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Saturn Visualizer */}
        <div className="lg:col-span-7">
          <SaturnVisualizer status={status} />
        </div>

        {/* Right Column: 4 Core Temporal Cycle Meters (16px radius, generous padding) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#121C35] border border-white/[0.08] rounded-[16px] p-6 hig-card-shadow">
            <h3 className="text-sm font-semibold tracking-wide text-[#F9FAFB] uppercase font-mono-chrono flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C5932A]" />
                Matriz de Ciclos Orbitais
              </span>
              <span className="text-xs text-[#9CA3AF] font-normal">Tempo Real</span>
            </h3>

            <div className="space-y-5 pt-4">
              {/* Cycle 1: Retrograde Annual Cycle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-chrono">
                  <span className="text-[#F9FAFB] flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isRetro ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                    Ciclo de Retrogradação Anual (~140d)
                  </span>
                  <span className="text-[#D4A43D] font-bold">{status.retroProgressPct}%</span>
                </div>
                <div className="w-full bg-[#17233E] rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isRetro ? 'bg-gradient-to-r from-rose-500 to-[#C5932A]' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${status.retroProgressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono-chrono text-[#9CA3AF]">
                  <span>Dia {status.retroDaysElapsed} de {status.retroTotalDays}</span>
                  <span>{isRetro ? 'Auditoria em curso' : 'Fase direta ativa'}</span>
                </div>
              </div>

              {/* Cycle 2: 29.5-Year Orbital Return */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-chrono">
                  <span className="text-[#F9FAFB] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5932A]" />
                    1º Retorno de Saturno (29,5 Anos)
                  </span>
                  <span className="text-[#D4A43D] font-bold">{status.orbitalCycleProgressPct}%</span>
                </div>
                <div className="w-full bg-[#17233E] rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#B38222] via-[#C5932A] to-[#E5BE65] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, status.orbitalCycleProgressPct)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono-chrono text-[#9CA3AF]">
                  <span>Idade Atual: <strong className="text-[#F9FAFB]">{status.currentAgeYears} anos</strong></span>
                  <span className="text-[#D4A43D] font-semibold">Janela 2026–2028 (Pico)</span>
                </div>
              </div>

              {/* Cycle 3: Ring Plane Crossing (14.5 Years) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-chrono">
                  <span className="text-[#F9FAFB] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    Cruzamento dos Anéis (Ciclo 14,5 Anos)
                  </span>
                  <span className="text-sky-300 font-bold">Edge-On ({status.ringTiltDeg.toFixed(1)}°)</span>
                </div>
                <div className="w-full bg-[#17233E] rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-sky-600 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: '92%' }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono-chrono text-[#9CA3AF]">
                  <span>Alinhamento Raro: Anéis finos na Terra</span>
                  <span className="text-[#F9FAFB]">2025/2026 Reestruturação</span>
                </div>
              </div>

              {/* Cycle 4: Annual Solar-Saturn Revolution (11 de Janeiro) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-chrono">
                  <span className="text-[#F9FAFB] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5932A]" />
                    Revolução Anual Solar (11/Jan)
                  </span>
                  <span className="text-[#D4A43D] font-bold">{status.daysUntilNextBirthday} dias restantes</span>
                </div>
                <div className="w-full bg-[#17233E] rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#94691B] to-[#C5932A] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, 100 - (status.daysUntilNextBirthday / 365) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono-chrono text-[#9CA3AF]">
                  <span>Próximo Alinhamento: {status.nextBirthdayDate}</span>
                  <span className="text-[#D4A43D]">Emissão de Diretriz Anual</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Directive Action Box */}
          <div className="bg-[#121C35] border border-white/[0.08] rounded-[16px] p-6 hig-card-shadow space-y-3.5">
            <h3 className="text-xs font-semibold tracking-wider text-[#F9FAFB] uppercase font-mono-chrono flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C5932A]" />
              Diretriz Operacional do Momento
            </h3>

            <div className="space-y-2.5 text-xs font-mono-chrono">
              <div className="flex items-start gap-3 bg-[#17233E] p-3.5 rounded-[12px] border border-white/5">
                {isRetro ? (
                  <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <Unlock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className={isRetro ? 'text-rose-300 font-semibold' : 'text-emerald-300 font-semibold'}>
                    {isRetro ? 'CONGELAMENTO DE NOVAS BASES:' : 'LIBERAÇÃO PARA EXPANSÃO:'}
                  </strong>
                  <p className="text-[#9CA3AF] mt-1 font-sans text-xs leading-relaxed">
                    {status.rules.recommendedFocus}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#9CA3AF]">
                  {isRetro ? 'Foco prioritário: eliminar débito técnico.' : 'Foco prioritário: acelerar deploys.'}
                </span>
                <button
                  onClick={() => onNavigateToChat('Qual o melhor protocolo de estudos em Ciência da Computação para agora?')}
                  className="text-[#D4A43D] hover:text-[#C5932A] text-xs flex items-center gap-1 hover:underline font-mono-chrono font-medium"
                >
                  Perguntar à IA <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules & Practical Systems Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Actions */}
        <div className="bg-[#121C35] border border-emerald-500/20 rounded-[16px] p-6 hig-card-shadow">
          <div className="flex items-center gap-2 text-emerald-400 font-mono-chrono text-xs font-bold uppercase tracking-wider mb-3.5">
            <CheckCircle className="w-4 h-4" />
            <span>Ações de Alta Eficiência ({status.phase})</span>
          </div>

          <ul className="space-y-3 text-xs text-[#9CA3AF] font-sans">
            {isRetro ? (
              <>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono-chrono font-bold">01.</span>
                  <span><strong className="text-[#F9FAFB]">Depuração de Código & Refatoração:</strong> Reestruturar classes legadas, cobrir fluxos críticos com testes unitários rigorosos.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono-chrono font-bold">02.</span>
                  <span><strong className="text-[#F9FAFB]">Auditoria Financeira & Nuvem:</strong> Eliminar instâncias ociosas no GCP/AWS, cancelar assinaturas recorrentes não utilizadas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono-chrono font-bold">03.</span>
                  <span><strong className="text-[#F9FAFB]">Segurança & Fundações:</strong> Gerar backups frios criptografados de chaves de acesso, tokens e bancos de dados.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono-chrono font-bold">04.</span>
                  <span><strong className="text-[#F9FAFB]">Estudos Fundamentais:</strong> Aprofundar em bases sólidas de Ciência da Computação (estruturas de dados, algoritmos, sistemas distribuídos).</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono-chrono font-bold">01.</span>
                  <span><strong className="text-[#F9FAFB]">Deploys em Produção:</strong> Lançar novos sistemas, abrir acesso público para novas aplicações e plataformas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono-chrono font-bold">02.</span>
                  <span><strong className="text-[#F9FAFB]">Contratos & Parcerias:</strong> Assinar novos acordos e compromissos profissionais de longo prazo com alta solidez.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono-chrono font-bold">03.</span>
                  <span><strong className="text-[#F9FAFB]">Expansão de Infraestrutura:</strong> Adicionar novas capacidades computacionais e investir em novas ferramentas de trabalho.</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Prohibited / High Risk Actions */}
        <div className="bg-[#121C35] border border-rose-500/20 rounded-[16px] p-6 hig-card-shadow">
          <div className="flex items-center gap-2 text-rose-400 font-mono-chrono text-xs font-bold uppercase tracking-wider mb-3.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Restrições & Pontos de Alerta ({status.phase})</span>
          </div>

          <ul className="space-y-3 text-xs text-[#9CA3AF] font-sans">
            {isRetro ? (
              <>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-mono-chrono font-bold">❌</span>
                  <span><strong className="text-[#F9FAFB]">Deploy precipitado em Produção:</strong> Risco elevado de bugs ocultos e falhas estruturais não detectadas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-mono-chrono font-bold">❌</span>
                  <span><strong className="text-[#F9FAFB]">Assinatura de contratos vinculantes apressados:</strong> Clausulas ambíguas tendem a gerar atrito na fase direta posterior.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-mono-chrono font-bold">❌</span>
                  <span><strong className="text-[#F9FAFB]">Expansão desordenada de escopo (Scope Creep):</strong> Manter foco estrito na finalização e simplificação.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-mono-chrono font-bold">❌</span>
                  <span><strong className="text-[#F9FAFB]">Ignorar débitos técnicos:</strong> Todo bug tolerado no retrógrado cobrará juros catastróficos no próximo ciclo direto.</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-mono-chrono font-bold">⚠️</span>
                  <span><strong className="text-[#F9FAFB]">Hesitação & Procrastinação:</strong> Desperdiçar a janela de impulso direto acumulando tarefas simples.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-mono-chrono font-bold">⚠️</span>
                  <span><strong className="text-[#F9FAFB]">Falta de documentação:</strong> Construir rápido sem registrar a arquitetura para o próximo ciclo de auditoria.</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

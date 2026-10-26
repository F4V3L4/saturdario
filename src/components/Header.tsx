/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TransitStatus } from '../types/saturn';
import {
  Compass,
  Clock,
  Sparkles,
  CheckSquare,
  Table,
  Bell,
  Calendar,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  status: TransitStatus;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenTimeTravel: () => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  currentTab,
  onTabChange,
  onOpenTimeTravel,
  unreadNotificationsCount,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Monitoramento', icon: Compass },
    { id: 'chat', label: 'Guardião IA', icon: Sparkles },
    { id: 'audit', label: 'Auditoria & Refatoração', icon: CheckSquare },
    { id: 'ephemeris', label: 'Matriz 2026–2045', icon: Table },
    { id: 'notifications', label: 'Alertas & Push', icon: Bell, count: unreadNotificationsCount },
  ];

  const currentDateObj = new Date(status.currentDate);
  const formattedDate = currentDateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B]/90 backdrop-blur-xl border-b border-[#1C2B4B] hig-card-shadow">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3.5 gap-3 border-b border-white/[0.06]">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#C5932A]/25 to-[#16223B] border border-[#C5932A]/35 text-[#D4A43D] shadow-[0_4px_16px_rgba(197,147,42,0.18)]">
              <span className="text-xl font-bold font-sans">♄</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C5932A] animate-ping opacity-75" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#F9FAFB] font-sans">
                  SATURNO
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-mono-chrono bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30 font-semibold tracking-wide">
                  GUARDIÃO DO TEMPO
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] font-sans">
                Matriz de Engenharia Temporal <span className="text-white/20">•</span> Perfil Natal: 11/01/1998 (Áries)
              </p>
            </div>
          </div>

          {/* Real-time Transit Ticker & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Status indicator badge */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-[12px] border text-xs font-mono-chrono transition-all ${
                status.phase === 'RETRÓGRADO'
                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.12)]'
                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.12)]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    status.phase === 'RETRÓGRADO' ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    status.phase === 'RETRÓGRADO' ? 'bg-rose-500' : 'bg-emerald-400'
                  }`}
                />
              </span>
              <span className="font-bold">{status.phase}</span>
              <span className="text-white/20">|</span>
              <span className="text-[#9CA3AF]">
                {status.daysUntilNextStation}d até {status.nextStationType} ({status.nextStationDate})
              </span>
            </div>

            {/* Time Travel / Simulation trigger */}
            <button
              onClick={onOpenTimeTravel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#16223B] hover:bg-[#1C2B4B] border border-white/10 hover:border-[#C5932A]/40 text-[#F9FAFB] hover:text-[#D4A43D] text-xs font-mono-chrono transition-all shadow-sm"
              title="Simular ou viajar no tempo para qualquer data"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5932A]" />
              <span>Data: {formattedDate}</span>
              <span className="text-[10px] bg-[#C5932A]/20 text-[#D4A43D] px-1.5 py-0.2 rounded font-semibold ml-1">
                Ajustar
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Apple HIG Segments) */}
        <nav className="flex space-x-1.5 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#C5932A]/20 text-[#F9FAFB] border border-[#C5932A]/40 shadow-sm font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#16223B] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5932A]' : 'text-[#9CA3AF]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono-chrono bg-[#C5932A] text-[#0B132B] font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

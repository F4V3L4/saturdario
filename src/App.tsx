/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { AuditChecklist } from './components/AuditChecklist';
import { EphemerisMatrix } from './components/EphemerisMatrix';
import { NotificationCenter } from './components/NotificationCenter';
import { TimeTravelModal } from './components/TimeTravelModal';
import { calculateTransitStatus, USER_NATAL_PROFILE } from './utils/saturnEngine';
import { SystemNotification } from './types/saturn';

export default function App() {
  // Current local time: October 26, 2026
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date('2026-10-26T12:00:00Z'));
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [isTimeTravelOpen, setIsTimeTravelOpen] = useState<boolean>(false);

  // System notifications state
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    return [
      {
        id: 'notif-retrograde-active',
        title: 'SATURNO RETRÓGRADO // UM MOMENTO PARA OLHAR COM CALMA',
        message: 'Saturno está retrógrado entre Áries e Peixes. Este pode ser um bom momento para desacelerar, rever escolhas e cuidar do que já está em andamento.',
        type: 'phase_change',
        date: '26/10/2026',
        read: false,
        badge: 'Retrógrado',
      },
      {
        id: 'notif-return-active',
        title: 'SEU PRIMEIRO RETORNO DE SATURNO',
        message: 'Você está vivendo uma fase importante de amadurecimento (1998 → 2026–2028), com espaço para entender melhor quem você é e o que quer construir.',
        type: 'phase_change',
        date: '20/10/2026',
        read: false,
        badge: 'Retorno de Saturno',
      },
      {
        id: 'notif-annual-revolution',
        title: '11 DE JANEIRO // SEU MOMENTO DE RECOMEÇO',
        message: 'Faltam 77 dias para o seu próximo aniversário. Aproveite para pensar no que você quer levar para o próximo ano e no que pode deixar para trás.',
        type: 'annual_revolution',
        date: '15/10/2026',
        read: true,
        badge: '11/Jan',
      },
    ];
  });

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Real-time calculation of transit status based on active date
  const transitStatus = useMemo(() => {
    return calculateTransitStatus(currentDate);
  }, [currentDate]);

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAddNotification = (newNotif: SystemNotification) => {
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleNavigateToChat = (prompt?: string) => {
    if (prompt) {
      setChatInitialPrompt(prompt);
    }
    setCurrentTab('chat');
  };

  const handleNavigateToAudit = () => {
    setCurrentTab('audit');
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-[#F9FAFB] flex flex-col selection:bg-[#C5932A]/30 selection:text-[#F9FAFB]">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 cosmic-radial-glow pointer-events-none -z-10" />

      {/* Main Header */}
      <Header
        status={transitStatus}
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'chat') setChatInitialPrompt('');
        }}
        onOpenTimeTravel={() => setIsTimeTravelOpen(true)}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            status={transitStatus}
            onNavigateToChat={handleNavigateToChat}
            onNavigateToAudit={handleNavigateToAudit}
          />
        )}

        {currentTab === 'chat' && (
          <ChatAssistant status={transitStatus} initialPrompt={chatInitialPrompt} />
        )}

        {currentTab === 'audit' && <AuditChecklist status={transitStatus} />}

        {currentTab === 'ephemeris' && <EphemerisMatrix status={transitStatus} />}

        {currentTab === 'notifications' && (
          <NotificationCenter
            status={transitStatus}
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onAddNotification={handleAddNotification}
            onNavigateToChat={handleNavigateToChat}
          />
        )}
      </main>

      {/* Time Travel / Simulation Modal */}
      {isTimeTravelOpen && (
        <TimeTravelModal
          currentSimulatedDate={currentDate}
          onSelectDate={(newDate) => setCurrentDate(newDate)}
          onClose={() => setIsTimeTravelOpen(false)}
        />
      )}

      {/* Big Tech Refined Footer */}
      <footer className="border-t border-[#1C2B4B] bg-[#0E1733]/80 backdrop-blur-md py-6 text-xs text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
          <div className="flex items-center gap-2">
            <span className="text-[#C5932A] font-bold tracking-tight">♄ SATURNO</span>
            <span className="text-white/40">/</span>
            <span className="text-[#F9FAFB] font-medium">Guardião do Tempo</span>
            <span className="text-white/20">|</span>
            <span className="text-[#9CA3AF]">Reflexões sobre tempo e escolhas</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-chrono text-[#9CA3AF]">
            <span className="px-2 py-0.5 rounded-full bg-[#16223B] border border-white/5">
              Nascimento: 11/01/1998
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#16223B] border border-white/5">
              Saturno em Áries (~13°45')
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30 font-semibold">
              Uma fase importante (2026–2028)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

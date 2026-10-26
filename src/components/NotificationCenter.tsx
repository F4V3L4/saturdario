/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SystemNotification, TransitStatus } from '../types/saturn';
import {
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
  Compass,
  Flame,
} from 'lucide-react';

interface NotificationCenterProps {
  status: TransitStatus;
  notifications: SystemNotification[];
  onMarkAllAsRead: () => void;
  onAddNotification: (notif: SystemNotification) => void;
  onNavigateToChat: (prompt: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  status,
  notifications,
  onMarkAllAsRead,
  onAddNotification,
  onNavigateToChat,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';
  });

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synthesize celestial chime with Web Audio API
  const playAlertChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5); // A4

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio not allowed without gesture', e);
    }
  };

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
          playAlertChime();
          new Notification('Saturno // Notificações Ativadas', {
            body: 'O Guardião do Tempo alertará sobre mudanças de fase e trânsitos.',
            icon: '/favicon.ico',
          });
        }
      } catch (e) {
        console.error('Permission request failed', e);
      }
    }
  };

  const simulateAlert = (type: 'phase_change' | 'zodiac_ingress' | 'annual_revolution') => {
    playAlertChime();
    let newNotif: SystemNotification;

    if (type === 'phase_change') {
      newNotif = {
        id: `notif-${Date.now()}`,
        title: 'ESTAÇÃO RETRÓGRADA // ALERTA DE TRANSIÇÃO',
        message: `Faltam ${status.daysUntilNextStation} dias para a Estação Direta em ${status.nextStationDate}. Prepare a transição do modo de auditoria para o modo de execução.`,
        type: 'phase_change',
        date: new Date().toLocaleDateString('pt-BR'),
        read: false,
        badge: status.phase,
      };
    } else if (type === 'zodiac_ingress') {
      newNotif = {
        id: `notif-${Date.now()}`,
        title: 'INGRESSO ZODIACAL // SATURNO EM ÁRIES',
        message: 'Saturno ingressa nas coordenadas de Áries. Ativação direta da matriz natal (13°45\' Áries). Priorize soberania e liderança de código.',
        type: 'zodiac_ingress',
        date: new Date().toLocaleDateString('pt-BR'),
        read: false,
        badge: 'Ingresso',
      };
    } else {
      newNotif = {
        id: `notif-${Date.now()}`,
        title: 'REVOLUÇÃO DE 11 DE JANEIRO // ALINHAMENTO SOLAR',
        message: `Alinhamento solar anual com seu Saturno natal em Áries. Relatório de diretriz para os próximos 12 meses pronto para consolidação.`,
        type: 'annual_revolution',
        date: new Date().toLocaleDateString('pt-BR'),
        read: false,
        badge: 'Aniversário',
      };
    }

    onAddNotification(newNotif);

    if (permission === 'granted' && 'Notification' in window) {
      new Notification(newNotif.title, {
        body: newNotif.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121C35] border border-white/[0.08] rounded-[16px] p-6 sm:p-8 hig-card-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#F9FAFB] tracking-tight">
                LEMBRETES PARA VOCÊ
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-chrono bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30 font-semibold">
                Lembretes pessoais
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#9CA3AF] font-sans mt-1">
              Receba avisos sobre mudanças de fase, datas importantes e seu aniversário.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Audio chime toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playAlertChime();
              }}
              className={`p-2.5 rounded-[12px] border text-xs font-mono-chrono flex items-center gap-2 transition-all ${
                soundEnabled
                  ? 'bg-[#C5932A]/20 text-[#D4A43D] border-[#C5932A]/40'
                  : 'bg-[#17233E] text-[#9CA3AF] border-white/5 hover:text-[#F9FAFB]'
              }`}
              title="Alternar sinal sonoro de alerta"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D4A43D]" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Som dos lembretes</span>
            </button>

            {/* Browser push button */}
            <button
              onClick={requestPushPermission}
              disabled={permission === 'granted'}
              className={`px-4 py-2.5 rounded-[12px] text-xs font-mono-chrono font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                permission === 'granted'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 cursor-default'
                  : 'bg-[#C5932A] hover:bg-[#D4A43D] text-[#0B132B] shadow-md shadow-[#C5932A]/20 active:scale-[0.98]'
              }`}
            >
              <BellRing className="w-4 h-4" />
              <span>
                {permission === 'granted' ? 'Lembretes ativados' : 'Ativar lembretes'}
              </span>
            </button>
          </div>
        </div>

        {/* Simulation Triggers Bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-2.5">
          <span className="text-xs font-mono-chrono text-[#9CA3AF] block font-semibold">
            TESTAR UM LEMBRETE:
          </span>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => simulateAlert('phase_change')}
              className="px-3.5 py-2 rounded-[12px] bg-[#17233E] hover:bg-[#1E2D4E] border border-white/10 hover:border-rose-400/30 text-[#F9FAFB] text-xs font-mono-chrono flex items-center gap-2 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Testar mudança de fase</span>
            </button>

            <button
              onClick={() => simulateAlert('zodiac_ingress')}
              className="px-3.5 py-2 rounded-[12px] bg-[#17233E] hover:bg-[#1E2D4E] border border-white/10 hover:border-sky-400/30 text-[#F9FAFB] text-xs font-mono-chrono flex items-center gap-2 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Testar mudança de signo</span>
            </button>

            <button
              onClick={() => simulateAlert('annual_revolution')}
              className="px-3.5 py-2 rounded-[12px] bg-[#17233E] hover:bg-[#1E2D4E] border border-white/10 hover:border-[#C5932A]/30 text-[#F9FAFB] text-xs font-mono-chrono flex items-center gap-2 transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-[#C5932A]" />
              <span>Testar lembrete de aniversário</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-chrono text-[#9CA3AF] px-1">
          <span>Seus lembretes ({notifications.length})</span>
          <button
            onClick={onMarkAllAsRead}
            className="text-[#D4A43D] hover:text-[#C5932A] transition-colors font-medium"
          >
            Marcar todas como lidas
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-[#121C35] rounded-[16px] border border-white/[0.08]">
            <Bell className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-mono-chrono text-[#9CA3AF]">
              Você não tem lembretes por enquanto.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-[16px] border transition-all ${
                n.read
                  ? 'bg-[#121C35]/60 border-white/5 opacity-70'
                  : 'bg-[#121C35] border-[#C5932A]/30 hig-card-shadow'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        n.read ? 'bg-slate-600' : 'bg-[#C5932A] animate-pulse'
                      }`}
                    />
                    <h4 className="text-xs font-bold font-mono-chrono text-[#F9FAFB] uppercase tracking-wide">
                      {n.title}
                    </h4>
                    {n.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-chrono bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30 font-semibold">
                        {n.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">{n.message}</p>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-[10px] font-mono-chrono text-[#9CA3AF]/70">{n.date}</span>

                    {n.type === 'annual_revolution' && (
                      <button
                        onClick={() =>
                          onNavigateToChat(
                            'Por favor, elabore a diretriz operacional completa para a Revolução Solar de 11 de Janeiro.'
                          )
                        }
                        className="text-[11px] font-mono-chrono text-[#D4A43D] hover:text-[#C5932A] flex items-center gap-1 hover:underline font-medium"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Abrir Análise na IA</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

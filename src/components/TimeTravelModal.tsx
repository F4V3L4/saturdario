/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RotateCcw, Clock } from 'lucide-react';

interface TimeTravelModalProps {
  currentSimulatedDate: Date;
  onSelectDate: (d: Date) => void;
  onClose: () => void;
}

export const TimeTravelModal: React.FC<TimeTravelModalProps> = ({
  currentSimulatedDate,
  onSelectDate,
  onClose,
}) => {
  const [dateInput, setDateInput] = useState<string>(() => {
    return currentSimulatedDate.toISOString().split('T')[0];
  });

  const presets = [
    {
      label: 'Hoje (26/out/2026) • Hora de olhar para dentro',
      date: '2026-10-26',
      desc: 'Um momento para rever escolhas e cuidar do que já existe.',
    },
    {
      label: '10/dez/2026 • Um novo movimento',
      date: '2026-12-10',
      desc: 'Fim de uma fase mais lenta e começo de novos passos.',
    },
    {
      label: '11/jan/2027 • Seu novo ano pessoal',
      date: '2027-01-11',
      desc: 'Uma oportunidade de pensar nos próximos 12 meses.',
    },
    {
      label: '15/ago/2027 • Um momento marcante',
      date: '2027-08-15',
      desc: 'Conjunção exata com Saturno Natal a ~13°45\' Áries.',
    },
    {
      label: '01/set/2028 • Mais estabilidade',
      date: '2028-09-01',
      desc: 'Um período para buscar mais segurança e equilíbrio.',
    },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateInput) return;
    const [year, month, day] = dateInput.split('-').map(Number);
    const newDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    onSelectDate(newDate);
    onClose();
  };

  const handleResetToRealToday = () => {
    const today = new Date('2026-10-26T12:00:00Z');
    onSelectDate(today);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121C35] border border-white/10 rounded-[16px] p-6 max-w-lg w-full hig-elevated-shadow space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#C5932A]" />
            <h3 className="text-base font-bold font-sans text-[#F9FAFB] tracking-tight">
              ESCOLHA UMA DATA PARA EXPLORAR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#F9FAFB] text-xs font-mono-chrono p-1"
          >
            ✕ Fechar
          </button>
        </div>

        <p className="text-xs text-[#9CA3AF] font-sans leading-relaxed">
          Calibre a data de observação para testar o comportamento do aplicativo em qualquer estação,
          incluindo o pico do Retorno de Saturno e a Revolução de 11 de Janeiro.
        </p>

        {/* Date Input Form */}
        <form onSubmit={handleApply} className="space-y-3.5 font-mono-chrono text-xs">
          <div>
            <label className="block text-[#9CA3AF] mb-1.5 font-sans font-medium">Escolha uma data:</label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#17233E] border border-white/10 rounded-[12px] text-[#F9FAFB] outline-none focus:border-[#C5932A]"
            />
          </div>

          <div className="flex gap-2.5">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-[12px] bg-[#C5932A] hover:bg-[#D4A43D] text-[#0B132B] font-bold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98]"
            >
              Ver esta data
            </button>
            <button
              type="button"
              onClick={handleResetToRealToday}
              className="px-4 py-2.5 rounded-[12px] bg-[#17233E] hover:bg-[#1E2D4E] border border-white/10 text-[#F9FAFB] flex items-center gap-2 transition-all"
              title="Restaurar para Hoje (26/Out/2026)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C5932A]" />
              <span>Hoje</span>
            </button>
          </div>
        </form>

        {/* Presets List */}
        <div className="space-y-2 pt-3 border-t border-white/[0.08]">
          <span className="text-[11px] font-mono-chrono text-[#9CA3AF] uppercase tracking-wider block font-semibold">
            Datas que podem ser interessantes:
          </span>

          <div className="space-y-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const [y, m, d] = preset.date.split('-').map(Number);
                  onSelectDate(new Date(Date.UTC(y, m - 1, d, 12, 0, 0)));
                  onClose();
                }}
                className="w-full text-left p-3 rounded-[12px] bg-[#17233E] hover:bg-[#1E2D4E] border border-white/5 hover:border-[#C5932A]/30 transition-all font-mono-chrono text-xs group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F9FAFB] group-hover:text-[#D4A43D]">
                    {preset.label}
                  </span>
                  <span className="text-[10px] text-[#D4A43D] font-medium">{preset.date}</span>
                </div>
                <div className="text-[11px] text-[#9CA3AF] font-sans mt-0.5">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

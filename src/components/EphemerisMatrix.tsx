/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EPHEMERIS_DATA } from '../utils/saturnEngine';
import { EphemerisEntry, TransitStatus } from '../types/saturn';
import {
  Search,
  Flame,
} from 'lucide-react';

interface EphemerisMatrixProps {
  status: TransitStatus;
}

export const EphemerisMatrix: React.FC<EphemerisMatrixProps> = ({ status }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReturnOnly, setFilterReturnOnly] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<EphemerisEntry | null>(null);

  const currentYear = new Date(status.currentDate).getFullYear();

  const filteredData = EPHEMERIS_DATA.filter((entry) => {
    const matchesSearch =
      entry.year.toString().includes(searchTerm) ||
      entry.sign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.directive.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.focus.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesReturn = !filterReturnOnly || entry.inReturnWindow;

    return matchesSearch && matchesReturn;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#121C35] border border-white/[0.08] rounded-[16px] p-6 sm:p-8 hig-card-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#F9FAFB] tracking-tight">
                UM OLHAR PARA OS PRÓXIMOS ANOS (2026–2045)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-chrono bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30 font-semibold">
                20 Anos
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#9CA3AF] font-sans mt-1">
              Uma visão simples dos períodos que podem marcar seus projetos e escolhas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] text-xs font-mono-chrono bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30 font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#C5932A]" />
              Fase importante: 2026–2028
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ano, signo ou assunto..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#17233E] border border-white/10 rounded-[12px] text-[#F9FAFB] placeholder-[#9CA3AF] text-xs font-mono-chrono outline-none focus:border-[#C5932A]"
            />
          </div>

          <button
            onClick={() => setFilterReturnOnly(!filterReturnOnly)}
            className={`px-4 py-2.5 rounded-[12px] text-xs font-mono-chrono flex items-center gap-2 transition-all ${
              filterReturnOnly
                ? 'bg-[#C5932A] text-[#0B132B] font-bold shadow-sm'
                : 'bg-[#17233E] text-[#9CA3AF] hover:text-[#F9FAFB] border border-white/5 hover:border-[#C5932A]/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Mostrar apenas 2026–2028</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#121C35] border border-white/[0.08] rounded-[16px] hig-card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-chrono border-collapse">
            <thead>
              <tr className="bg-[#16223B] border-b border-white/[0.08] text-[#9CA3AF] uppercase tracking-wider text-[11px]">
                <th className="py-4 px-5 font-semibold">Ano</th>
                <th className="py-4 px-5 font-semibold">Signo e posição</th>
                <th className="py-4 px-5 font-semibold">Começa a revisão</th>
                <th className="py-4 px-5 font-semibold">Volta a seguir</th>
                <th className="py-4 px-5 font-semibold">Sugestão para o período</th>
                <th className="py-4 px-5 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredData.map((row) => {
                const isCurrent = row.year === currentYear;
                return (
                  <tr
                    key={row.year}
                    onClick={() => setSelectedEntry(row)}
                    className={`cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#C5932A]/10 hover:bg-[#C5932A]/15 text-[#F9FAFB]'
                        : 'hover:bg-[#16223B]/60 text-[#9CA3AF]'
                    }`}
                  >
                    <td className="py-3.5 px-5 font-bold">
                      <div className="flex items-center gap-2">
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-[#C5932A] animate-ping" />
                        )}
                        <span className={isCurrent ? 'text-[#D4A43D] text-sm' : 'text-[#F9FAFB]'}>
                          {row.year}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-[#F9FAFB] font-medium">
                      {row.sign}
                      <span className="block text-[10px] text-[#9CA3AF]">{row.degrees}</span>
                    </td>

                    <td className="py-3.5 px-5 text-rose-300 font-medium">
                      {new Date(row.retroStart + 'T00:00:00Z').toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-5 text-emerald-300 font-medium">
                      {new Date(row.retroEnd + 'T00:00:00Z').toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-5 font-sans text-xs max-w-md">
                      <p className="line-clamp-2 text-[#F9FAFB] leading-snug">{row.directive}</p>
                      <span className="text-[10px] text-[#D4A43D] font-mono-chrono font-medium">
                        Foco: {row.focus}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      {row.inReturnWindow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30">
                          <Flame className="w-3 h-3 text-[#C5932A]" />
                          FASE IMPORTANTE
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#17233E] text-[#9CA3AF] border border-white/5">
                          OUTRO PERÍODO
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121C35] border border-white/10 rounded-[16px] p-6 max-w-lg w-full hig-elevated-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-sans text-[#D4A43D]">
                  Ano {selectedEntry.year}
                </span>
                {selectedEntry.inReturnWindow && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-chrono bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30 font-bold">
                    1º Retorno de Saturno
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-[#9CA3AF] hover:text-[#F9FAFB] text-xs font-mono-chrono p-1"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="space-y-3 font-mono-chrono text-xs">
              <div className="bg-[#17233E] p-3.5 rounded-[12px] border border-white/5 space-y-1">
                <span className="text-[#9CA3AF] text-[11px]">Posição de Saturno:</span>
                <div className="text-[#F9FAFB] font-bold text-sm">{selectedEntry.sign}</div>
                <div className="text-[#9CA3AF] text-[11px]">{selectedEntry.degrees}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1D1A2C] p-3.5 rounded-[12px] border border-rose-500/20">
                  <span className="text-rose-400 text-[10px] uppercase font-semibold">INÍCIO DO RETRÓGRADO:</span>
                  <div className="text-rose-200 font-bold mt-0.5">{selectedEntry.retroStart}</div>
                </div>

                <div className="bg-[#132525] p-3.5 rounded-[12px] border border-emerald-500/20">
                  <span className="text-emerald-400 text-[10px] uppercase font-semibold">ESTAÇÃO DIRETA:</span>
                  <div className="text-emerald-200 font-bold mt-0.5">{selectedEntry.retroEnd}</div>
                </div>
              </div>

              <div className="bg-[#17233E] p-3.5 rounded-[12px] border border-white/5 space-y-1">
                <span className="text-[#D4A43D] text-[11px] font-bold">SUGESTÃO:</span>
                <p className="text-[#F9FAFB] font-sans text-xs leading-relaxed">
                  {selectedEntry.directive}
                </p>
              </div>

              <div className="bg-[#17233E] p-3.5 rounded-[12px] border border-white/5 space-y-1">
                <span className="text-[#9CA3AF] text-[11px]">NO QUE PRESTAR ATENÇÃO:</span>
                <div className="text-[#D4A43D] font-bold">{selectedEntry.focus}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-5 py-2.5 rounded-[12px] bg-[#C5932A] hover:bg-[#D4A43D] text-[#0B132B] font-bold text-xs uppercase tracking-wider font-mono-chrono shadow-sm transition-all"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

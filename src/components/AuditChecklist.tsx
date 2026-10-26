/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuditCategory, AuditTask, TransitStatus } from '../types/saturn';
import { getDefaultAuditTasks } from '../utils/saturnEngine';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  FileCode,
  DollarSign,
  HardDrive,
  Shield,
  Copy,
  Check,
} from 'lucide-react';

interface AuditChecklistProps {
  status: TransitStatus;
}

export const AuditChecklist: React.FC<AuditChecklistProps> = ({ status }) => {
  const [tasks, setTasks] = useState<AuditTask[]>(() => {
    const saved = localStorage.getItem('saturn_audit_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tasks', e);
      }
    }
    return getDefaultAuditTasks();
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<AuditCategory>('codigo');
  const [newPriority, setNewPriority] = useState<'alta' | 'media' | 'baixa'>('alta');

  useEffect(() => {
    localStorage.setItem('saturn_audit_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: AuditTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      priority: newPriority,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
      phaseRecommendation: status.phase === 'RETRÓGRADO' ? 'retrogrado' : 'direto',
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const handleGenerateWithAI = async () => {
    setIsGeneratingAI(true);
    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(`${apiBaseUrl}/api/generate-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory !== 'all' ? selectedCategory : 'codigo',
          currentDate: status.currentDate,
        }),
      });

      if (!response.ok) throw new Error('Falha na requisição');
      const data = await response.json();

      if (data.tasks && Array.isArray(data.tasks)) {
        const generatedTasks: AuditTask[] = data.tasks.map((t: Partial<AuditTask>, index: number) => ({
          id: `ai-task-${Date.now()}-${index}`,
          title: t.title || 'Tarefa de Auditoria',
          description: t.description || 'Auditoria gerada pela matriz de Saturno.',
          category: t.category || (selectedCategory !== 'all' ? (selectedCategory as AuditCategory) : 'codigo'),
          priority: t.priority || 'alta',
          completed: false,
          createdAt: new Date().toISOString().split('T')[0],
          phaseRecommendation: t.phaseRecommendation || (status.phase === 'RETRÓGRADO' ? 'retrogrado' : 'ambos'),
        }));

        setTasks((prev) => [...generatedTasks, ...prev]);
      }
    } catch (error) {
      console.error('Error generating AI tasks:', error);
      const fallbackTask: AuditTask = {
        id: `ai-task-${Date.now()}`,
        title: `[${status.phase}] Depuração profunda de rotinas e testes de carga`,
        description: `Refatorar pontos de contenção no código antes da estação direta em ${status.nextStationDate}.`,
        category: 'codigo',
        priority: 'alta',
        completed: false,
        createdAt: new Date().toISOString().split('T')[0],
        phaseRecommendation: 'retrogrado',
      };
      setTasks((prev) => [fallbackTask, ...prev]);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCopyReport = () => {
    const completedTasks = tasks.filter((t) => t.completed);
    const pendingTasks = tasks.filter((t) => !t.completed);

    const report = `# RELATÓRIO DE AUDITORIA & REFATORAÇÃO // SATURNO
Data: ${new Date(status.currentDate).toLocaleDateString('pt-BR')}
Fase: ${status.phaseLabel} (${status.currentDegree} ${status.currentSign})
Próxima Estação: ${status.nextStationType} em ${status.nextStationDate} (${status.daysUntilNextStation} dias)

## STATUS DO CHECKLIST
- Total de Tarefas: ${tasks.length}
- Concluídas: ${completedTasks.length} (${Math.round((completedTasks.length / (tasks.length || 1)) * 100)}%)
- Pendentes: ${pendingTasks.length}

## PENDÊNCIAS CRÍTICAS:
${pendingTasks.map((t) => `- [ ] [${t.priority.toUpperCase()}] [${t.category}] ${t.title}\n  ${t.description}`).join('\n')}

## CONCLUÍDOS RECENTEMENTE:
${completedTasks.map((t) => `- [x] ${t.title}`).join('\n')}
`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && t.completed) ||
      (statusFilter === 'pending' && !t.completed);
    return matchesCategory && matchesStatus;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getCategoryIcon = (cat: AuditCategory) => {
    switch (cat) {
      case 'codigo':
        return <FileCode className="w-3.5 h-3.5 text-sky-400" />;
      case 'financas':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case 'fundacoes':
        return <HardDrive className="w-3.5 h-3.5 text-[#D4A43D]" />;
      case 'soberania':
        return <Shield className="w-3.5 h-3.5 text-purple-400" />;
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
                CHECKLIST DE AUDITORIA & REFATORAÇÃO
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-chrono bg-[#C5932A]/15 text-[#D4A43D] border border-[#C5932A]/30 font-semibold">
                Módulo 4
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#9CA3AF] font-sans mt-1">
              Ativação temporal de depuração de bugs, finanças, arquivos e integridade de sistemas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleGenerateWithAI}
              disabled={isGeneratingAI}
              className="px-4 py-2.5 rounded-[12px] bg-[#C5932A] hover:bg-[#D4A43D] disabled:opacity-50 text-[#0B132B] font-bold font-mono-chrono text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#C5932A]/20 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0B132B]" />
              <span>{isGeneratingAI ? 'Gerando...' : 'Sugerir Tarefas com IA'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-[12px] bg-[#16223B] hover:bg-[#1C2B4B] border border-white/10 hover:border-[#C5932A]/30 text-[#F9FAFB] text-xs font-mono-chrono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5932A]" />
              <span>Nova Tarefa</span>
            </button>

            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2.5 rounded-[12px] bg-[#16223B] hover:bg-[#1C2B4B] border border-white/10 text-[#9CA3AF] hover:text-[#F9FAFB] text-xs font-mono-chrono flex items-center gap-1.5 transition-all"
              title="Copiar relatório formatado em Markdown"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" />}
              <span>{copiedReport ? 'Copiado!' : 'Relatório'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar of Audit */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-chrono">
            <span className="text-[#F9FAFB] flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Conclusão da Auditoria da Janela ({completedCount} de {totalCount} concluídas)
            </span>
            <span className="text-[#D4A43D] font-bold">{progressPct}%</span>
          </div>
          <div className="w-full bg-[#17233E] rounded-full h-2.5 overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#C5932A] to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters Bar (Apple HIG segments & pills) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121C35] p-3.5 rounded-[16px] border border-white/[0.08] hig-card-shadow">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-[12px] text-xs font-mono-chrono transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#C5932A]/20 text-[#D4A43D] border border-[#C5932A]/40 font-bold'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#16223B]'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setSelectedCategory('codigo')}
            className={`px-3.5 py-1.5 rounded-[12px] text-xs font-mono-chrono flex items-center gap-1.5 transition-all ${
              selectedCategory === 'codigo'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#16223B]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Código & Depuração</span>
          </button>
          <button
            onClick={() => setSelectedCategory('financas')}
            className={`px-3.5 py-1.5 rounded-[12px] text-xs font-mono-chrono flex items-center gap-1.5 transition-all ${
              selectedCategory === 'financas'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#16223B]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Finanças & Custos</span>
          </button>
          <button
            onClick={() => setSelectedCategory('fundacoes')}
            className={`px-3.5 py-1.5 rounded-[12px] text-xs font-mono-chrono flex items-center gap-1.5 transition-all ${
              selectedCategory === 'fundacoes'
                ? 'bg-[#C5932A]/20 text-[#D4A43D] border border-[#C5932A]/40 font-bold'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#16223B]'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Infra & Backups</span>
          </button>
          <button
            onClick={() => setSelectedCategory('soberania')}
            className={`px-3.5 py-1.5 rounded-[12px] text-xs font-mono-chrono flex items-center gap-1.5 transition-all ${
              selectedCategory === 'soberania'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#16223B]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Soberania & CS</span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 border-l border-white/10 pl-3">
          {(['all', 'pending', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-mono-chrono rounded-[12px] transition-all ${
                statusFilter === filter
                  ? 'bg-[#16223B] text-[#F9FAFB] font-semibold border border-white/10 shadow-sm'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
            >
              {filter === 'all' ? 'Tudo' : filter === 'pending' ? 'Pendentes' : 'Concluídas'}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-[#121C35] rounded-[16px] border border-white/[0.08]">
            <CheckSquare className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-mono-chrono text-[#9CA3AF]">
              Nenhuma tarefa de auditoria encontrada para este filtro.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start justify-between gap-4 p-5 rounded-[16px] border transition-all ${
                task.completed
                  ? 'bg-[#0E172E]/50 border-white/5 opacity-60'
                  : 'bg-[#121C35] border-white/[0.08] hover:border-[#C5932A]/30 hig-card-shadow'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-[#9CA3AF] hover:text-[#D4A43D] transition-colors"
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-[#9CA3AF]" />
                  )}
                </button>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-semibold font-sans ${
                        task.completed ? 'line-through text-[#9CA3AF]' : 'text-[#F9FAFB]'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Category badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono-chrono bg-[#17233E] text-[#9CA3AF] border border-white/5 font-medium">
                      {getCategoryIcon(task.category)}
                      {task.category.toUpperCase()}
                    </span>

                    {/* Priority badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono-chrono font-bold uppercase ${
                        task.priority === 'alta'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : task.priority === 'media'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : 'bg-[#17233E] text-[#9CA3AF]'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
                    {task.description}
                  </p>

                  <div className="text-[10px] font-mono-chrono text-[#9CA3AF]/70 pt-1">
                    Criada em: {task.createdAt} {task.completedAt ? `• Concluída em: ${new Date(task.completedAt).toLocaleDateString('pt-BR')}` : ''}
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-[#9CA3AF] hover:text-rose-400 p-1.5 rounded-[12px] hover:bg-white/5 transition-all"
                title="Excluir tarefa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal (Apple HIG Sheet Style) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121C35] border border-white/10 rounded-[16px] p-6 max-w-lg w-full hig-elevated-shadow space-y-4">
            <h3 className="text-lg font-bold font-sans text-[#F9FAFB] tracking-tight">
              Nova Diretriz de Auditoria
            </h3>

            <form onSubmit={handleAddTask} className="space-y-4 font-mono-chrono text-xs">
              <div>
                <label className="block text-[#9CA3AF] mb-1.5">Título da Ação:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Refatorar pipeline de testes ou auditar faturas"
                  className="w-full px-4 py-2.5 bg-[#17233E] border border-white/10 rounded-[12px] text-[#F9FAFB] placeholder-[#9CA3AF] outline-none focus:border-[#C5932A]"
                />
              </div>

              <div>
                <label className="block text-[#9CA3AF] mb-1.5">Descrição Detalhada:</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Especifique métricas técnicas, arquivos afetados ou escopo de corte."
                  className="w-full px-4 py-2.5 bg-[#17233E] border border-white/10 rounded-[12px] text-[#F9FAFB] placeholder-[#9CA3AF] outline-none focus:border-[#C5932A] font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9CA3AF] mb-1.5">Categoria:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as AuditCategory)}
                    className="w-full px-3.5 py-2.5 bg-[#17233E] border border-white/10 rounded-[12px] text-[#F9FAFB] outline-none"
                  >
                    <option value="codigo">Código & Depuração</option>
                    <option value="financas">Finanças & Custos</option>
                    <option value="fundacoes">Infraestrutura & Backups</option>
                    <option value="soberania">Soberania & CS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9CA3AF] mb-1.5">Prioridade:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'alta' | 'media' | 'baixa')}
                    className="w-full px-3.5 py-2.5 bg-[#17233E] border border-white/10 rounded-[12px] text-[#F9FAFB] outline-none"
                  >
                    <option value="alta">Alta (Crítica)</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-[12px] bg-[#17233E] text-[#9CA3AF] hover:text-[#F9FAFB] border border-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[12px] bg-[#C5932A] hover:bg-[#D4A43D] text-[#0B132B] font-bold uppercase tracking-wider font-mono-chrono shadow-sm transition-all"
                >
                  Salvar Diretriz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

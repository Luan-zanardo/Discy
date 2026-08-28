'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  MapPin, 
  ArrowRight,
  FilterX,
  CalendarDays,
  Clock,
  ChevronDown
} from 'lucide-react';
import { getDisciplinas } from '@/lib/services';
import { Disciplina } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const WEEKDAY_ORDER: Record<string, number> = {
  'Segunda-feira': 0,
  'Terça-feira': 1,
  'Quarta-feira': 2,
  'Quinta-feira': 3,
  'Sexta-feira': 4,
  'Sábado': 5,
  'Horário não informado': 6,
};

function getDayFromHorario(horario: string): string {
  const h = horario.toLowerCase();
  if (h.includes('segunda')) return 'Segunda-feira';
  if (h.includes('terça') || h.includes('terca')) return 'Terça-feira';
  if (h.includes('quarta')) return 'Quarta-feira';
  if (h.includes('quinta')) return 'Quinta-feira';
  if (h.includes('sexta')) return 'Sexta-feira';
  if (h.includes('sábado') || h.includes('sabado')) return 'Sábado';
  return 'Horário não informado';
}

function formatPeriodo(periodo: string): string {
  if (periodo && periodo.length === 5) {
    return `Semestre ${periodo.slice(0, 4)}/${periodo.slice(4)}`;
  }
  return periodo || 'Período não informado';
}

export default function DisciplinasPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disciplines, setDisciplines] = useState<Disciplina[]>([]);
  const [collapsedSemesters, setCollapsedSemesters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getDisciplinas();
        setDisciplines(data);

        // Group & extract unique semesters sorted descending
        const uniquePeriods = Array.from(new Set(data.map(d => d.periodo).filter(Boolean)))
          .sort((a, b) => b.localeCompare(a));
        
        // Default collapse state: latest semester expanded (index 0), all others collapsed
        const initialCollapse: Record<string, boolean> = {};
        uniquePeriods.forEach((period, idx) => {
          initialCollapse[period] = idx > 0;
        });
        setCollapsedSemesters(initialCollapse);
      } catch (err) {
        console.error('Error fetching disciplines:', err);
        setError('Erro ao buscar as disciplinas. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleSemester = (semesterKey: string) => {
    setCollapsedSemesters(prev => ({
      ...prev,
      [semesterKey]: !prev[semesterKey]
    }));
  };

  // Group disciplines by period directly
  const groupedDisciplines = disciplines.reduce((acc, d) => {
    const periodKey = d.periodo || 'Outros';
    if (!acc[periodKey]) {
      acc[periodKey] = [];
    }
    acc[periodKey].push(d);
    return acc;
  }, {} as Record<string, Disciplina[]>);

  // Sort semesters descending (latest first)
  const sortedPeriods = Object.keys(groupedDisciplines).sort((a, b) => b.localeCompare(a));

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-muted/80" />
          <Skeleton className="h-10 w-48 bg-muted/80" />
          <Skeleton className="h-4 w-72 bg-muted/80" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-6 w-36 bg-muted/80" />
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl bg-muted/80" />
            <Skeleton className="h-20 w-full rounded-xl bg-muted/80" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-card rounded-2xl border border-border shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center mb-4">
          <FilterX className="w-6 h-6 text-rose-500" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">Erro de carregamento</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 text-xs font-semibold text-background bg-foreground rounded-lg hover:opacity-90 transition-opacity">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 mb-8 border-b border-border/80 pb-6">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Grade Curricular</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Suas Disciplinas</h1>
        <p className="text-xs text-muted-foreground">Suas disciplinas agrupadas por semestre letivo.</p>
      </div>

      {/* Semester Groups of Disciplines List */}
      {sortedPeriods.length > 0 ? (
        <div className="space-y-10">
          {sortedPeriods.map((periodKey) => {
            const periodDisciplines = groupedDisciplines[periodKey];
            const isCollapsed = collapsedSemesters[periodKey] ?? false;
            return (
              <div key={periodKey} className="space-y-4">
                {/* Semester Header (Clickable Accordion Button) */}
                <button 
                  onClick={() => toggleSemester(periodKey)}
                  className="w-full flex items-center justify-between border-b border-border pb-2 hover:opacity-80 transition-all duration-200 cursor-pointer select-none text-left group"
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-indigo-500 dark:text-indigo-400 group-hover:scale-105 transition-transform" />
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      {formatPeriodo(periodKey)}
                    </h2>
                    <span className="text-[10px] text-muted-foreground font-bold px-2 py-0.5 bg-muted rounded-full">
                      {periodDisciplines.length} {periodDisciplines.length === 1 ? 'matéria' : 'matérias'}
                    </span>
                  </div>
                  {/* Chevron indicator rotating accordingly */}
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground/80 transition-transform duration-200",
                    isCollapsed ? "-rotate-90" : "rotate-0"
                  )} />
                </button>

                {/* Vertical List of Disciplines (Rendered conditionally based on collapse state) */}
                {!isCollapsed && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    {[...periodDisciplines]
                      .sort((a, b) => {
                        const dayA = getDayFromHorario(a.horario);
                        const dayB = getDayFromHorario(b.horario);
                        const orderA = WEEKDAY_ORDER[dayA] ?? 99;
                        const orderB = WEEKDAY_ORDER[dayB] ?? 99;
                        return orderA - orderB;
                      })
                      .map((d) => (
                        <div 
                          key={d.id} 
                          className="group bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:h-[88px] hover:border-border/80 transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.005)]"
                        >
                          {/* Name and Professor (Top on mobile, left on PC) */}
                          <div className="space-y-1 flex-1 min-w-0">
                            <h3 className="text-base font-bold text-foreground truncate group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                              {d.nome}
                            </h3>
                            <p className="text-xs text-muted-foreground font-semibold truncate">
                              Prof. {d.professor}
                            </p>
                          </div>

                          {/* Visual Grouping Row (Occupies entire horizontal width, side-by-side on mobile, no gaps between rows) */}
                          <div className="flex flex-row items-center justify-between gap-2 md:gap-5 shrink-0 pt-3.5 md:pt-0 mt-3 md:mt-0 border-t md:border-t-0 border-border/60 w-full md:w-auto">
                            
                            {/* Highlighted Weekday (flex-1 dynamically fills space on mobile) */}
                            <div className="flex-1 md:flex-initial md:w-36 h-10 inline-flex items-center justify-center gap-1 md:gap-1.5 px-1.5 md:px-4 py-2 border rounded-lg text-[9px] md:text-xs font-bold bg-indigo-500/10 text-indigo-650 border-indigo-200/50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/40 select-none">
                              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                              <span className="truncate">{getDayFromHorario(d.horario).split('-')[0]}</span>
                            </div>
                            
                            {/* Highlighted Location (flex-1 dynamically fills space on mobile) */}
                            <div className="flex-1 md:flex-initial md:w-36 h-10 inline-flex items-center justify-center gap-1 md:gap-1.5 px-1.5 md:px-4 py-2 border rounded-lg text-[9px] md:text-xs font-bold bg-emerald-500/10 text-emerald-650 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/40 select-none">
                              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-emerald-650 dark:text-emerald-450" />
                              <span className="truncate">{d.sala ? d.sala.split('/')[0] : 'Não informada'}</span>
                            </div>

                            {/* Navigation Button (flex-[1.2] fills slightly more space on mobile) */}
                            <Link 
                              href={`/disciplinas/${d.id}`}
                              className="flex-[1.2] md:flex-initial md:w-44 h-10 inline-flex items-center justify-center gap-1.5 px-1.5 md:px-4 py-2 border border-border hover:bg-muted bg-card rounded-lg text-[9px] md:text-xs font-bold text-foreground transition-all duration-250 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                            >
                              <span>Ver cronograma</span>
                              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Link>

                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl py-12 text-center shadow-xs">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border/40">
            <BookOpen className="w-4 h-4 text-muted-foreground/60" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Nenhuma disciplina encontrada</h3>
          <p className="text-xs text-muted-foreground mt-1">Nenhuma disciplina registrada no banco de dados.</p>
        </div>
      )}
    </div>
  );
}

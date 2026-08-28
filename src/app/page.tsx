'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  ArrowRight, 
  AlertCircle, 
  Calendar,
  Sparkles,
  GraduationCap,
  Globe
} from 'lucide-react';
import { getAulasToday, getAulasUpcoming, getDisciplinas, getLocalDateString } from '@/lib/services';
import { Aula, Disciplina } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getTipoBadgeStyles, getModalidadeBadgeStyles, getFaseBadgeStyles, getDayFromHorario } from '@/lib/utils';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayClasses, setTodayClasses] = useState<Aula[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<Aula[]>([]);
  const [disciplines, setDisciplines] = useState<Disciplina[]>([]);
  const [progress, setProgress] = useState({
    percent: 0,
    completed: 0,
    total: 0
  });

  const [dateDisplay, setDateDisplay] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    setDateDisplay(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const [todayData, upcomingData, disciplinesData] = await Promise.all([
          getAulasToday(),
          getAulasUpcoming(4),
          getDisciplinas()
        ]);
        
        setTodayClasses(todayData);
        setUpcomingClasses(upcomingData);
        setDisciplines(disciplinesData);

        const { getAulas } = await import('@/lib/services');
        const allAulas = await getAulas();
        
        const todayStr = getLocalDateString();
        const completed = allAulas.filter(a => a.data <= todayStr).length;
        const total = allAulas.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        setProgress({ percent, completed, total });
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        setError('Não foi possível carregar os dados acadêmicos. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const currentPhase = disciplines.length > 0
    ? (() => {
        const phases = disciplines.map(d => d.turma || `${d.fase}ª Fase`);
        const counts = phases.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      })()
    : 'Carregando...';

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-muted/80" />
          <Skeleton className="h-10 w-64 bg-muted/80" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-44 bg-muted/80" />
          <Skeleton className="h-[280px] w-full rounded-2xl bg-muted/80" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-36 bg-muted/80" />
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-xl bg-muted/80" />
              <Skeleton className="h-20 w-full rounded-xl bg-muted/80" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 bg-muted/80" />
            <Skeleton className="h-[180px] w-full rounded-xl bg-muted/80" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-card rounded-2xl border border-border shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-rose-500" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">Erro de Conexão</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-xs font-semibold text-background bg-foreground rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const primaryClass = todayClasses[0];

  return (
    <div className="space-y-12">
      {/* Upper Date and Phase Row */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/80 pb-6">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{dateDisplay}</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mt-1">Sua rotina acadêmica</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Fase atual</span>
          <Badge variant="outline" className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${getFaseBadgeStyles(currentPhase)}`}>
            {currentPhase}
          </Badge>
        </div>
      </div>

      {/* Hero: Today's Classes */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Aula de hoje</h2>
        </div>

        {todayClasses.length > 0 ? (
          <div className="group relative overflow-hidden bg-card border border-border rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.015)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-border/80">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              
              {/* Flex column ordered dynamically */}
              <div className="space-y-5 flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                
                {/* 1. Class Details (Ordered first) */}
                <div className="space-y-2 w-full order-1">
                  <h3 className="text-2xl font-bold text-foreground tracking-tight leading-snug">
                    {primaryClass.disciplina?.nome || 'Disciplina sem nome'}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {primaryClass.descricao || 'Nenhuma descrição detalhada disponível para a aula de hoje.'}
                  </p>
                </div>

                {/* 2. Badge tags (Ordered second, sitting below the description) */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 w-full order-2 pt-1 lg:pt-0">
                  
                  {/* Class Type Badge */}
                  <div className={`w-28 h-9 shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border rounded-lg text-[10px] font-bold select-none ${getTipoBadgeStyles(primaryClass.tipo)}`}>
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{primaryClass.tipo || 'Aula'}</span>
                  </div>

                  {/* Modality Badge */}
                  <div className={`w-28 h-9 shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border rounded-lg text-[10px] font-bold select-none ${getModalidadeBadgeStyles(primaryClass.modalidade)}`}>
                    {primaryClass.modalidade?.toLowerCase().includes('ead') ? (
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="truncate">{primaryClass.modalidade || 'Presencial'}</span>
                  </div>

                </div>

                {/* 3. Meta details list (Ordered third at the bottom) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/80 pt-6 w-full order-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border/40">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">Horário</div>
                      <div className="text-xs font-semibold text-foreground capitalize">{primaryClass.disciplina?.horario || 'Não informado'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border/40">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">Sala / Local</div>
                      <div className="text-xs font-semibold text-foreground">{primaryClass.disciplina?.sala || 'Não informada'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border/40">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">Professor(a)</div>
                      <div className="text-xs font-semibold text-foreground truncate max-w-[180px]" title={primaryClass.disciplina?.professor}>
                        {primaryClass.disciplina?.professor || 'Não informado'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra banner element for other classes today if any */}
              {todayClasses.length > 1 && (
                <div className="lg:w-72 bg-muted/30 dark:bg-muted/10 rounded-xl p-4 border border-border/50 space-y-3 shrink-0">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Outras aulas de hoje</h4>
                  <div className="space-y-3">
                    {todayClasses.slice(1).map((c) => (
                      <div key={c.id} className="text-xs space-y-1">
                        <div className="font-bold text-foreground line-clamp-1">{c.disciplina?.nome}</div>
                        <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
                          <Clock className="w-3 h-3 text-muted-foreground/80" />
                          <span>{c.disciplina?.horario}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border/40">
              <Calendar className="w-4 h-4 text-muted-foreground/60" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Sem aulas programadas para hoje</h3>
            <p className="text-xs text-muted-foreground mt-1">Aproveite para revisar os conteúdos das disciplinas.</p>
          </div>
        )}
      </section>

      {/* Main Grid: Stretch to match heights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Upcoming Classes Column */}
        <section className="lg:col-span-2 flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Próximas aulas</h2>
            <span className="text-xs text-muted-foreground font-semibold">
              Semestre 2026/2
            </span>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-between">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((item) => (
                <div 
                  key={item.id}
                  className="group bg-card border border-border rounded-xl p-4 shadow-xs transition-all duration-200 flex flex-col gap-3 hover:border-border/80"
                >
                  {/* Top Row: Date calendar square on the left, Name/Description on the right */}
                  <div className="flex gap-4 items-start">
                    {/* Date calendar block */}
                    {(() => {
                      const dateObj = new Date(item.data + 'T00:00:00');
                      const dayNum = dateObj.getDate();
                      const monthStr = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).slice(0, 3).toUpperCase().replace('.', '');
                      return (
                        <div className="w-12 h-12 rounded-lg bg-muted border border-border/60 flex flex-col items-center justify-center flex-shrink-0 select-none font-mono">
                          <span className="text-[9px] font-extrabold text-muted-foreground/80 leading-none">{monthStr}</span>
                          <span className="text-base font-black text-foreground leading-none mt-1">{dayNum}</span>
                        </div>
                      );
                    })()}

                    {/* Name and Description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {item.disciplina?.nome}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 font-medium mt-0.5">
                        {item.descricao || 'Sem descrição cadastrada.'}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Full-width dividing line and badges side-by-side (matches cronograma card pattern) */}
                  <div className="flex items-center gap-2.5 pt-2.5 border-t border-border/60">
                    
                    {/* Class Type Badge */}
                    <div className={`w-28 h-9 shrink-0 inline-flex items-center justify-center gap-1 px-3 py-1.5 border rounded-lg text-[10px] font-bold select-none ${getTipoBadgeStyles(item.tipo)}`}>
                      <BookOpen className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.tipo || 'Aula'}</span>
                    </div>

                    {/* Weekday Badge */}
                    <div className="w-28 h-9 shrink-0 inline-flex items-center justify-center gap-1 px-3 py-1.5 border rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-650 border-indigo-200/50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/40 select-none">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="truncate">{getDayFromHorario(item.disciplina?.horario || '')}</span>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card border border-border rounded-xl p-6 text-center text-xs text-muted-foreground font-semibold flex-1 flex items-center justify-center">
                Nenhuma aula futura encontrada no cronograma.
              </div>
            )}
          </div>
        </section>

        {/* Progress Sidebar - Flex to stretch to same height */}
        <section className="flex flex-col space-y-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Progresso acadêmico</h2>
          
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-muted-foreground">Aulas assistidas</span>
                  <span className="text-lg font-bold text-foreground">{progress.percent}%</span>
                </div>
                <Progress value={progress.percent} className="h-1.5 bg-muted" />
              </div>

              <div className="space-y-4 pt-4 border-t border-border text-xs font-medium">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aulas concluídas</span>
                  <span className="font-bold text-foreground">{progress.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aulas restantes</span>
                  <span className="font-bold text-foreground">{progress.total - progress.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de aulas</span>
                  <span className="font-bold text-foreground">{progress.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disciplinas ativas</span>
                  <span className="font-bold text-foreground">{disciplines.length}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border/60">
              <Link
                href="/progresso"
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer"
              >
                <span>Ver estatísticas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  Award, 
  BookOpen, 
  Clock, 
  Globe, 
  MapPin, 
  PieChart, 
  AlertCircle 
} from 'lucide-react';
import { getDisciplinas, getAulas, getLocalDateString } from '@/lib/services';
import { Disciplina, Aula } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { getTipoBadgeStyles, getModalidadeBadgeStyles, getFaseBadgeStyles } from '@/lib/utils';

interface DisciplineProgress {
  id: string;
  nome: string;
  professor: string;
  total: number;
  completed: number;
  percent: number;
  creditos: string;
}

export default function ProgressoPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // States for statistics
  const [totalClasses, setTotalClasses] = useState(0);
  const [completedClasses, setCompletedClasses] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [disciplinesProgress, setDisciplinesProgress] = useState<DisciplineProgress[]>([]);
  const [modalityStats, setModalityStats] = useState<{ name: string; count: number; percent: number }[]>([]);
  const [typeStats, setTypeStats] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [disciplinesData, aulasData] = await Promise.all([
          getDisciplinas(),
          getAulas()
        ]);

        const todayStr = getLocalDateString();
        
        // 1. Overall Class Progress
        const total = aulasData.length;
        const completed = aulasData.filter(a => a.data <= todayStr).length;
        setTotalClasses(total);
        setCompletedClasses(completed);

        // 2. Credits calculation
        const creditsSum = disciplinesData.reduce((sum, d) => {
          const val = parseFloat((d.creditos || '0').replace(',', '.'));
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        setTotalCredits(creditsSum);

        // 3. Semester Date Range
        if (aulasData.length > 0) {
          const sortedAulas = [...aulasData].sort((a, b) => a.data.localeCompare(b.data));
          const startStr = sortedAulas[0].data;
          const endStr = sortedAulas[sortedAulas.length - 1].data;
          
          const formatDate = (dateStr: string) => {
            const parts = dateStr.split('-');
            return `${parts[2]}/${parts[1]}/${parts[0].slice(2)}`;
          };
          setDateRange({
            start: formatDate(startStr),
            end: formatDate(endStr)
          });
        }

        // 4. Progress per discipline
        const disciplineStats: DisciplineProgress[] = disciplinesData.map(d => {
          const disciplineAulas = aulasData.filter(a => a.disciplina_id === d.id);
          const dTotal = disciplineAulas.length;
          const dCompleted = disciplineAulas.filter(a => a.data <= todayStr).length;
          const dPercent = dTotal > 0 ? Math.round((dCompleted / dTotal) * 100) : 0;
          return {
            id: d.id,
            nome: d.nome,
            professor: d.professor,
            total: dTotal,
            completed: dCompleted,
            percent: dPercent,
            creditos: d.creditos
          };
        }).sort((a, b) => b.percent - a.percent); // Sort by completion percentage descending
        setDisciplinesProgress(disciplineStats);

        // 5. Modality Statistics
        const modalityMap = aulasData.reduce((acc, a) => {
          const m = a.modalidade || 'Presencial';
          acc[m] = (acc[m] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const modalities = Object.keys(modalityMap).map(name => {
          const count = modalityMap[name];
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          return { name, count, percent };
        });
        setModalityStats(modalities);

        // 6. Type Statistics
        const typeMap = aulasData.reduce((acc, a) => {
          const t = a.tipo || 'Aula';
          acc[t] = (acc[t] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const types = Object.keys(typeMap).map(name => ({
          name,
          count: typeMap[name]
        })).sort((a, b) => b.count - a.count);
        setTypeStats(types);

      } catch (err) {
        console.error('Error loading progress stats:', err);
        setError('Não foi possível carregar as estatísticas de progresso.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const overallPercent = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-10 w-56 bg-muted/80" />
          <Skeleton className="h-4 w-72 bg-muted/80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl bg-muted/80" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-44 bg-muted/80" />
            <Skeleton className="h-[300px] w-full rounded-2xl bg-muted/80" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 bg-muted/80" />
            <Skeleton className="h-[250px] w-full rounded-2xl bg-muted/80" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-card rounded-2xl border border-border shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center mb-4">
          <TrendingUp className="w-6 h-6 text-rose-500" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">Erro de Carregamento</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 text-xs font-semibold text-background bg-foreground rounded-lg hover:opacity-90 transition-opacity">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-border/80 pb-6">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Desempenho</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mt-1">Seu Progresso</h1>
        <p className="text-xs text-muted-foreground mt-1">Estatísticas detalhadas sobre o andamento do seu semestre acadêmico.</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Classes Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Aulas Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{completedClasses} / {totalClasses}</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-semibold">{overallPercent}% assistidas</div>
          </div>
        </div>

        {/* Credits Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Créditos Ativos</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{totalCredits.toFixed(2)} CR</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-semibold">{disciplinesProgress.length} Disciplinas</div>
          </div>
        </div>

        {/* Date Range Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Período Letivo</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">{dateRange.start} a {dateRange.end}</div>
            <div className="text-xs text-muted-foreground mt-1 font-semibold">Semestre 2026/2</div>
          </div>
        </div>

        {/* Remaining Days Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Aulas Restantes</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{totalClasses - completedClasses} aulas</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-semibold font-mono">do cronograma</div>
          </div>
        </div>

      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress by Discipline */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Progresso por Matéria</h2>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">
            {disciplinesProgress.map((dp) => (
              <div key={dp.id} className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-foreground leading-tight">
                      {dp.nome}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Prof. {dp.professor}</p>
                  </div>
                  <div className="text-right text-xs font-semibold">
                    <span className="font-bold text-foreground">{dp.percent}%</span>
                    <span className="text-muted-foreground block text-[9px] font-semibold">{dp.completed} de {dp.total} aulas</span>
                  </div>
                </div>
                <Progress value={dp.percent} />
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Dynamic Statistics Details */}
        <div className="space-y-8">
          
          {/* Modality stats */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Modalidade de Ensino</h2>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
              {modalityStats.map((stat) => (
                <div key={stat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{stat.name}</span>
                    <span className="text-muted-foreground">{stat.count} aulas ({stat.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        stat.name.toLowerCase().includes('ead') ? 'bg-sky-500' : 'bg-violet-500'
                      }`} 
                      style={{ width: `${stat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lesson type stats */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tipos de Aula</h2>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <div className="divide-y divide-border text-xs">
                {typeStats.map((stat) => (
                  <div key={stat.name} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                    <span className="text-muted-foreground font-semibold">{stat.name}</span>
                    <Badge variant="outline" className={`px-2 py-0 h-5 font-bold tracking-wide rounded ${getTipoBadgeStyles(stat.name)}`}>
                      {stat.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}

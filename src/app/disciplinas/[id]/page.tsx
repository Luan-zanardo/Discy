'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  BookOpen, 
  Award,
  ExternalLink,
  ClipboardCheck,
  CheckCircle2,
  FileText,
  Globe
} from 'lucide-react';
import { getDisciplinaById, getAulasByDisciplinaId, getLocalDateString } from '@/lib/services';
import { Disciplina, Aula } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { getTipoBadgeStyles, getModalidadeBadgeStyles, getFaseBadgeStyles } from '@/lib/utils';

export default function DisciplinaDetalhesPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discipline, setDiscipline] = useState<Disciplina | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadDetails() {
      try {
        setLoading(true);
        const [disciplineData, aulasData] = await Promise.all([
          getDisciplinaById(id),
          getAulasByDisciplinaId(id)
        ]);

        if (!disciplineData) {
          setError('Disciplina não encontrada.');
          return;
        }

        setDiscipline(disciplineData);
        setAulas(aulasData);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Falha ao carregar informações da disciplina.');
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [id]);

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-6 w-32 bg-muted/80" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-96 bg-muted/80" />
          <Skeleton className="h-4 w-64 bg-muted/80" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[300px] w-full rounded-2xl bg-muted/80" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-xl bg-muted/80" />
            <Skeleton className="h-[120px] w-full rounded-xl bg-muted/80" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !discipline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-card rounded-2xl border border-border shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center mb-4">
          <ChevronLeft className="w-6 h-6 text-rose-500" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">Erro ao carregar</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{error || 'Não foi possível carregar a disciplina.'}</p>
        <Link href="/disciplinas" className="px-4 py-2 text-xs font-semibold text-background bg-foreground rounded-lg hover:opacity-90 transition-opacity">
          Voltar para disciplinas
        </Link>
      </div>
    );
  }

  const todayStr = getLocalDateString();
  const completedAulas = aulas.filter(a => a.data <= todayStr).length;
  const totalAulas = aulas.length;
  const completionPercent = totalAulas > 0 ? Math.round((completedAulas / totalAulas) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link 
          href="/disciplinas" 
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para disciplinas</span>
        </Link>
      </div>

      {/* Header and banner */}
      <div className="border-b border-border/80 pb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-md ${getFaseBadgeStyles(discipline.turma || `${discipline.fase}ª Fase`)}`}>
              {discipline.turma || `${discipline.fase}ª Fase`}
            </Badge>
            <Badge variant="outline" className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-md ${getModalidadeBadgeStyles(discipline.modalidade)}`}>
              {discipline.modalidade || 'Presencial'}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground max-w-3xl leading-snug">
            {discipline.nome}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <User className="w-4 h-4 text-muted-foreground/60" />
            <span className="text-foreground">{discipline.professor}</span>
          </div>
        </div>
        
        {/* Short progress circle or bar for mobile/top */}
        <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3.5 shadow-xs min-w-[180px]">
          <div className="flex-1 space-y-1">
            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Conclusão</div>
            <div className="text-sm font-bold text-foreground">{completionPercent}% Concluída</div>
            <Progress value={completionPercent} />
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: Related Classes Timeline */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Cronograma de Aulas</h2>
            <span className="text-xs text-muted-foreground font-semibold">{totalAulas} aulas totais</span>
          </div>

          {aulas.length > 0 ? (
            <div className="relative border-l border-border/80 ml-4 pl-6 space-y-8 py-2">
              {aulas.map((aula, index) => {
                const isCompleted = aula.data <= todayStr;
                const [year, month, day] = aula.data.split('-');
                const formattedShortDate = `${day}/${month}/${year.slice(2)}`;
                return (
                  <div key={aula.id} className="relative group">
                    {/* Timeline Node */}
                    <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-card flex items-center justify-center transition-colors duration-300 ${
                      isCompleted 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-border group-hover:border-border/80'
                    }`}>
                      {isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    </div>

                    <div className="space-y-2">
                      {/* Meta info of lesson */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">
                          Aula {aula.numero || index + 1} • {formattedShortDate}
                        </span>
                        
                        {isCompleted && (
                          <Badge variant="ghost" className="px-1.5 py-0 h-4 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-450 rounded">
                            Concluída
                          </Badge>
                        )}
                      </div>

                      {/* Description container with date calendar block inside */}
                      <div className="bg-card border border-border group-hover:border-border/80 rounded-xl p-4 shadow-xs transition-all duration-200 flex flex-col gap-3">
                        
                        {/* Top Row: Date on the left, Description on the right */}
                        <div className="flex gap-4 items-start">
                          {/* Date calendar square block */}
                          {(() => {
                            const dateObj = new Date(aula.data + 'T00:00:00');
                            const dayNum = dateObj.getDate();
                            const monthStr = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).slice(0, 3).toUpperCase().replace('.', '');
                            return (
                              <div className="w-12 h-12 rounded-lg bg-muted border border-border/60 flex flex-col items-center justify-center flex-shrink-0 select-none font-mono">
                                <span className="text-[9px] font-extrabold text-muted-foreground/80 leading-none">{monthStr}</span>
                                <span className="text-base font-black text-foreground leading-none mt-1">{dayNum}</span>
                              </div>
                            );
                          })()}

                          {/* Description Content */}
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-relaxed">
                              {aula.descricao || 'Conteúdo da aula não detalhado.'}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Row: Spans full width, aligning badges under the date block */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-border/60">
                          <div className="flex items-center gap-2">
                            {/* Class Type Badge */}
                            <div className={`w-24 h-7 inline-flex items-center justify-center gap-1 px-2 border rounded-md text-[9px] font-bold select-none ${getTipoBadgeStyles(aula.tipo)}`}>
                              <BookOpen className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{aula.tipo || 'Aula'}</span>
                            </div>

                            {/* Modality Badge */}
                            <div className={`w-24 h-7 inline-flex items-center justify-center gap-1 px-2 border rounded-md text-[9px] font-bold select-none ${getModalidadeBadgeStyles(aula.modalidade)}`}>
                              {aula.modalidade?.toLowerCase().includes('ead') ? (
                                <Globe className="w-3.5 h-3.5 shrink-0" />
                              ) : (
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span className="truncate">{aula.modalidade || 'Presencial'}</span>
                            </div>
                          </div>
                          
                          {/* Dialog Trigger to view Original text */}
                          <Dialog>
                            <DialogTrigger className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity bg-transparent border-none p-0 cursor-pointer">
                              <FileText className="w-3.5 h-3.5" />
                              <span>Ver texto original</span>
                            </DialogTrigger>
                            <DialogContent className="max-w-md w-[90vw] rounded-2xl bg-card border-border p-6 text-foreground">
                              <DialogHeader>
                                <DialogTitle className="text-base font-bold text-foreground border-b border-border pb-3">
                                  Texto Original da Aula {aula.numero || index + 1}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground pt-1 font-medium">
                                  Dados brutos importados da ementa escolar.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4 bg-muted p-4 rounded-xl border border-border max-h-[300px] overflow-y-auto">
                                <p className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                  {aula.texto_original || 'Nenhum texto original cadastrado.'}
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-xs text-muted-foreground font-semibold">
              Nenhuma aula cadastrada para esta disciplina.
            </div>
          )}
        </section>

        {/* Sidebar Column: Details and Professor Info */}
        <div className="space-y-6">
          
          {/* Details Card */}
          <section className="space-y-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Detalhes da Matéria</h2>
            <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-xs text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground/60" />
                <div>
                  <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">Horário</div>
                  <div className="text-foreground font-bold capitalize">{discipline.horario || 'Não informado'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground/60" />
                <div>
                  <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">Sala de Aula</div>
                  <div className="text-foreground font-bold">{discipline.sala || 'Não informada'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-muted-foreground/60" />
                <div>
                  <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">Créditos / Carga Horária</div>
                  <div className="text-foreground font-bold">{discipline.creditos || '0'} Créditos</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground/60" />
                <div>
                  <div className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">Período Letivo</div>
                  <div className="text-foreground font-bold">Semestre {discipline.periodo.slice(0, 4)}/{discipline.periodo.slice(4)}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Professor Contact Card */}
          <section className="space-y-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Professor Responsável</h2>
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground border border-border font-bold text-sm">
                  {discipline.professor.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground leading-tight">{discipline.professor}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold">Docente</div>
                </div>
              </div>

              {discipline.professor_email && (
                <div className="pt-3 border-t border-border space-y-2">
                  <button 
                    onClick={() => copyEmailToClipboard(discipline.professor_email)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-muted/40 hover:bg-muted/70 border border-border/80 rounded-lg text-xs font-bold text-foreground transition-colors cursor-pointer"
                  >
                    <span className="truncate mr-2 text-muted-foreground font-medium">{discipline.professor_email}</span>
                    <Badge variant="ghost" className="px-1.5 py-0.5 h-5 text-[9px] text-muted-foreground border border-border rounded hover:bg-card transition-colors">
                      {copiedEmail ? 'Copiado!' : 'Copiar'}
                    </Badge>
                  </button>
                  
                  <a 
                    href={`mailto:${discipline.professor_email}`}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Enviar E-mail</span>
                  </a>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

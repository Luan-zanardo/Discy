import { supabase } from './supabase';
import { Disciplina, Aula } from '@/types';

// Format Date to YYYY-MM-DD in local time
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getDisciplinas(): Promise<Disciplina[]> {
  const { data, error } = await supabase
    .from('disciplinas')
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    console.error('Error fetching disciplines:', error);
    throw error;
  }
  return data || [];
}

export async function getDisciplinaById(id: string): Promise<Disciplina | null> {
  const { data, error } = await supabase
    .from('disciplinas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching discipline ${id}:`, error);
    return null;
  }
  return data;
}

export async function getAulas(): Promise<Aula[]> {
  const { data, error } = await supabase
    .from('aulas')
    .select('*, disciplina:disciplinas(*)');

  if (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
  return data || [];
}

export async function getAulasByDisciplinaId(disciplinaId: string): Promise<Aula[]> {
  const { data, error } = await supabase
    .from('aulas')
    .select('*, disciplina:disciplinas(*)')
    .eq('disciplina_id', disciplinaId)
    .order('data', { ascending: true });

  if (error) {
    console.error(`Error fetching classes for discipline ${disciplinaId}:`, error);
    throw error;
  }
  return data || [];
}

export async function getAulasToday(): Promise<Aula[]> {
  const todayStr = getLocalDateString();
  const { data, error } = await supabase
    .from('aulas')
    .select('*, disciplina:disciplinas(*)')
    .eq('data', todayStr);

  if (error) {
    console.error('Error fetching today\'s classes:', error);
    throw error;
  }
  return data || [];
}

export async function getAulasUpcoming(limit = 5): Promise<Aula[]> {
  const todayStr = getLocalDateString();
  const { data, error } = await supabase
    .from('aulas')
    .select('*, disciplina:disciplinas(*)')
    .gt('data', todayStr)
    .order('data', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming classes:', error);
    throw error;
  }
  return data || [];
}

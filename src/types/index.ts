export interface Disciplina {
  id: string;
  nome: string;
  professor: string;
  turma: string;
  periodo: string;
  fase: string;
  horario: string;
  sala: string;
  modalidade: string;
  creditos: string;
  professor_email: string;
  created_at: string;
}

export interface Aula {
  id: string;
  disciplina_id: string;
  numero: string;
  data: string; // format YYYY-MM-DD
  dia_da_semana: string; // e.g. "Sábado", "Segunda-feira"
  modalidade: string;
  tipo: string;
  descricao: string;
  texto_original: string;
  created_at: string;
  disciplina?: Disciplina; // Optional relations
}

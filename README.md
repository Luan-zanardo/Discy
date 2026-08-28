# Discy — Painel Acadêmico Pessoal Premium

O **Discy** é um painel acadêmico pessoal de alta fidelidade visual, desenvolvido para organizar sua rotina de estudos, aulas e progresso acadêmico. Ele funciona como uma **extensão direta** do projeto [SATC Planos de Ensino Scraper](https://github.com/Luan-zanardo/satc-planos-ensino-scraper).

Enquanto o scraper automatiza a extração dos cronogramas e ementas do portal SATC e salva no banco de dados, o **Discy** consome esses mesmos dados para oferecer uma interface moderna, rápida e otimizada (tanto para computadores quanto para celulares).

---

## 🔄 Como o Ecossistema Funciona

O projeto é dividido em duas partes integradas pelo **Supabase**:

```
[Portal Acadêmico SATC]
         │
         ▼ (Automated Playwright Scraper)
[Scraper de Planos de Ensino]
         │
         ▼ (Writes Syllabus & Schedule)
   [(Supabase DB)]
         ▲
         │ (Reads & Displays Schedules)
   [Discy Next.js WebApp]
```

1. **[SATC Scraper](https://github.com/Luan-zanardo/satc-planos-ensino-scraper)**: Acessa o portal escolar, extrai o conteúdo programático de todas as disciplinas e limpa/salva no seu banco de dados Supabase.
2. **Discy (Este App)**: Conecta-se ao banco de dados e renderiza os dashboards de:
   * **Hero de Hoje**: Exibe a aula programada para hoje com local, horário, modalidade e professor.
   * **Próximas Aulas**: Lista as próximas 4 aulas organizadas em ordem cronológica de calendário.
   * **Visualização de Semestres**: Sanfonas retráteis contendo todas as disciplinas agrupadas por semestre e ordenadas de segunda a sábado.
   * **Cronograma de Aulas**: Timeline detalhada por disciplina com datas formatadas (`dd/mm/yy`), badges de tipo/modalidade e caixa de diálogo para ler os textos originais das ementas.
   * **Progresso Acadêmico**: Barra de progresso verde-esmeralda medindo a proporção de aulas passadas (concluídas) em relação às futuras.

---

## 🛠️ Tecnologias Utilizadas

* **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
* **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
* **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Componentes**: [shadcn/ui](https://ui.shadcn.com/) (primitivos acessíveis)
* **Banco de Dados**: [Supabase (PostgreSQL)](https://supabase.com/)
* **Design & Tipografia**: Fonte premium **Plus Jakarta Sans** com tema escuro adaptativo por padrão.

---

## 📂 Schema do Banco de Dados (Supabase)

Para que o Discy funcione, a automação do Scraper precisa ter populado as seguintes tabelas no Supabase (conforme o arquivo `schema.sql` do scraper):

### 1. Tabela `disciplinas`
* `id` (UUID - Chave Primária)
* `nome` (Text)
* `professor` (Text)
* `turma` (Text)
* `periodo` (Text)
* `fase` (Text)
* `horario` (Text)
* `sala` (Text)
* `modalidade` (Text)
* `creditos` (Text)
* `professor_email` (Text)

### 2. Tabela `aulas`
* `id` (UUID - Chave Primária)
* `disciplina_id` (UUID - Chave Estrangeira apontando para `disciplinas.id`)
* `numero` (Text)
* `data` (Text, formato `YYYY-MM-DD`)
* `dia_da_semana` (Text)
* `modalidade` (Text)
* `tipo` (Text)
* `descricao` (Text)
* `texto_original` (Text)

---

## 🚀 Configuração Local do WebApp

### 1. Instalar as Dependências
Abra o terminal na pasta do projeto **Discy** e rode:
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo chamado `.env.local` na raiz do projeto Discy e configure as credenciais do seu Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o aplicativo rodando.

---

## 🌐 Deploy na Vercel (Produção Online)

Para hospedar o Discy na nuvem gratuitamente e acessá-lo de qualquer lugar (incluindo atalho no celular):

### Passo 1: Enviar seu código para o GitHub
1. Crie um repositório vazio no seu **GitHub** (ex: `discy`).
2. Inicialize o repositório local e envie o código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   git push -u origin main
   ```

### Passo 2: Vincular o projeto na Vercel
1. Crie uma conta gratuita na [Vercel](https://vercel.com/) (use login via GitHub para facilitar).
2. Clique no botão **"Add New"** e depois em **"Project"**.
3. Importe o repositório `discy` que você acabou de subir.

### Passo 3: Configurar as Variáveis de Ambiente na Vercel
No painel de configuração do deploy da Vercel, expanda a seção **Environment Variables** e adicione as duas chaves que você configurou localmente:
* `NEXT_PUBLIC_SUPABASE_URL` -> Valor do seu projeto Supabase.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> Chave anônima pública do seu Supabase.

### Passo 4: Fazer o Deploy
1. Clique em **"Deploy"**.
2. O processo de compilação levará cerca de 1 minuto.
3. Pronto! A Vercel gerará um link público seguro (ex: `https://discy.vercel.app`) para você usar.

> 💡 **Dica de PWA/Mobile:** Abra esse link gerado pela Vercel no navegador do seu celular (Safari no iPhone ou Chrome no Android), clique em "Compartilhar" e escolha **"Adicionar à Tela de Início"**. O aplicativo se comportará como um app nativo no seu celular!

# Discy — Painel Acadêmico

O **Discy** é um painel web moderno para você visualizar suas aulas, cronogramas e progresso escolar. Ele conecta-se diretamente ao mesmo banco Supabase populado pelo [SATC Planos de Ensino Scraper](https://github.com/Luan-zanardo/satc-planos-ensino-scraper).

---

## 🚀 Como Configurar e Rodar Localmente

### 1. Instalar as dependências:
```bash
npm install
```

### 2. Configurar as credenciais do Supabase:
Crie o arquivo `.env.local` na raiz do projeto e preencha com as suas chaves:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-publica
```

### 3. Rodar o projeto:
```bash
npm run dev
```
Abra no seu navegador: `http://localhost:3000`

---

## 🌐 Como Publicar na Vercel (Deixar Online Grátis)

1. **Suba o código para o seu GitHub**:
   Crie um repositório público ou privado no GitHub e envie o código do projeto para lá.

2. **Conecte na Vercel**:
   Acesse a [Vercel](https://vercel.com/), faça login com o seu GitHub, clique em **Add New > Project** e importe o repositório do seu projeto.

3. **Adicione as Variáveis de Ambiente**:
   No painel da Vercel, adicione as mesmas duas chaves configuradas localmente:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**:
   Clique em **Deploy**. A Vercel criará o site online em menos de 1 minuto e fornecerá um link de acesso público.

> 💡 **Dica para Celular:** Abra o link do seu app no Chrome (Android) ou Safari (iPhone) e clique em **Adicionar à tela de início** para usar o Discy como um aplicativo nativo no celular.

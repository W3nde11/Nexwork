# NexWork

NexWork e uma plataforma web para conectar contratantes, profissionais e oportunidades de trabalho. O projeto permite publicar trabalhos, encontrar oportunidades por categoria ou palavra-chave, iniciar conversas privadas, compartilhar links publicos de vagas e gerenciar o perfil profissional do usuario.

A aplicacao foi desenvolvida com Next.js, React, TypeScript, Tailwind CSS e MongoDB, usando rotas de API internas para autenticacao, cadastro, publicacao de trabalhos, mensagens, recuperacao de senha e gerenciamento de conta.

link de acesso a plataforma: https://nexwork-topaz.vercel.app/

## Indice

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Arquitetura e estrutura de pastas](#arquitetura-e-estrutura-de-pastas)
- [Pre-requisitos](#pre-requisitos)
- [Configuracao do ambiente](#configuracao-do-ambiente)
- [Como instalar e executar](#como-instalar-e-executar)
- [Scripts disponiveis](#scripts-disponiveis)
- [Como usar a plataforma](#como-usar-a-plataforma)
- [Rotas principais](#rotas-principais)
- [APIs internas](#apis-internas)
- [Modelos de dados](#modelos-de-dados)
- [Autenticacao e seguranca](#autenticacao-e-seguranca)
- [Deploy](#deploy)
- [Melhorias futuras](#melhorias-futuras)

## Sobre o projeto

O objetivo da NexWork e facilitar a conexao entre quem precisa contratar um servico e quem busca novas oportunidades. A plataforma possui uma landing page publica, area autenticada para usuarios cadastrados, publicacao de trabalhos, listagem de oportunidades, chat entre contratante e interessado, pagina publica para cada vaga e paginas institucionais como termos, privacidade, LGPD, FAQ e sobre.

Principais perfis de uso:

- Contratante: cria uma conta, publica trabalhos, compartilha links de vagas e conversa com profissionais interessados.
- Profissional: cria uma conta, completa o perfil, busca oportunidades e inicia conversas privadas com contratantes.
- Visitante convidado: acessa um link publico de vaga e envia mensagem ao contratante sem precisar criar conta.

## Funcionalidades

- Landing page institucional com apresentacao da NexWork, categorias, funcionamento, missao, visao, valores e chamada para cadastro.
- Cadastro com email, senha, nome, empresa opcional e data de nascimento.
- Login tradicional com email e senha.
- Login com Google OAuth, quando as credenciais estiverem configuradas.
- Sessao autenticada por cookie HTTP-only com token JWT.
- Recuperacao e redefinicao de senha por token temporario.
- Dashboard com resumo de trabalhos publicados, conversas e perfil do usuario.
- Publicacao de projetos/trabalhos com categoria, titulo, descricao, anexos, habilidades desejadas, nivel de experiencia, prazo para propostas e visibilidade.
- Edicao, exclusao e compartilhamento de trabalhos publicados.
- Listagem de trabalhos com busca por texto e filtros por categoria.
- Pagina de profissionais em destaque com filtros e busca.
- Chat privado entre usuarios cadastrados.
- Chat publico por link de vaga para visitantes convidados.
- Perfil do usuario com foto, dados pessoais, empresa, telefone, titulo profissional, bio, experiencia, areas de interesse, habilidades, localizacao e portfolio.
- Alteracao de senha.
- Fluxo de solicitacao e confirmacao de exclusao de conta.
- Paginas publicas de termos de uso, politica de privacidade, LGPD, FAQ e sobre.
- Layout responsivo com componentes reutilizaveis e identidade visual propria.

## Tecnologias utilizadas

### Front-end

- Next.js 14 com App Router
- React 18
- TypeScript
- Tailwind CSS
- CSS custom properties para tema visual
- Lucide React para icones
- Componentes reutilizaveis em `components/`

### Back-end

- Next.js Route Handlers em `app/api/`
- MongoDB como banco de dados
- Mongoose para modelagem e acesso aos dados
- Zod para validacao de dados recebidos pelas APIs
- Jose para assinatura e verificacao de JWT
- bcryptjs para hash de senhas

### Servicos externos opcionais

- Google OAuth para login social
- Resend para envio de emails de recuperacao de senha e exclusao de conta
- Vercel para deploy recomendado de aplicacoes Next.js

## Arquitetura e estrutura de pastas

```text
Nexwork/
+-- app/
|   +-- (app)/
|   |   +-- chat/
|   |   +-- conta/
|   |   +-- dashboard/
|   |   +-- feed/
|   |   +-- profissionais/
|   |   +-- trabalhos/
|   +-- api/
|   |   +-- auth/
|   |   +-- conversations/
|   |   +-- dashboard/
|   |   +-- guest/
|   |   +-- jobs/
|   |   +-- user/
|   +-- cadastro/
|   +-- login/
|   +-- recuperar-senha/
|   +-- redefinir-senha/
|   +-- v/[jobId]/
|   +-- globals.css
|   +-- layout.tsx
|   +-- page.tsx
+-- components/
|   +-- account/
|   +-- auth/
|   +-- landing/
|   +-- ui/
+-- lib/
+-- models/
+-- public/
+-- middleware.ts
+-- next.config.mjs
+-- tailwind.config.ts
+-- tsconfig.json
+-- package.json
```

Resumo das principais pastas:

- `app/`: telas, layouts e APIs usando o App Router do Next.js.
- `app/(app)/`: area autenticada da aplicacao.
- `app/api/`: endpoints internos usados pelo front-end.
- `components/`: componentes visuais reutilizaveis.
- `components/landing/`: secoes da landing page.
- `components/account/`: modais e componentes da area de conta.
- `lib/`: funcoes auxiliares de banco, autenticacao, email, OAuth, politicas de senha e regras de cadastro.
- `models/`: schemas Mongoose usados no MongoDB.
- `public/`: imagens, logos, mascote, banners e assets estaticos.
- `middleware.ts`: protecao das rotas privadas e redirecionamentos de autenticacao.

## Pre-requisitos

Antes de rodar o projeto, instale:

- Node.js 18.17 ou superior
- npm
- Uma instancia MongoDB local ou MongoDB Atlas
- Git

Recomendado:

- Conta no Google Cloud Console, se quiser ativar login com Google
- Conta na Resend, se quiser enviar emails reais de recuperacao de senha e confirmacao de exclusao
- Conta na Vercel, se quiser publicar o projeto facilmente

## Configuracao do ambiente

Crie um arquivo `.env.local` na raiz do projeto com as variaveis abaixo:

```env
MONGODB_URI="mongodb+srv://usuario:senha@cluster.mongodb.net/nexwork"
JWT_SECRET="troque-por-uma-chave-grande-e-segura"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Opcional: login com Google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Opcional: envio de emails com Resend
RESEND_API_KEY=""
RESEND_FROM_EMAIL="NexWork <noreply@seudominio.com>"

# Opcional: versao exibida pela aplicacao
NEXT_PUBLIC_APP_VERSION="0.1.0"
```

### Variaveis obrigatorias

- `MONGODB_URI`: string de conexao com o MongoDB.
- `JWT_SECRET`: segredo usado para assinar os tokens JWT de sessao. Use uma chave longa e privada.

### Variaveis opcionais

- `NEXT_PUBLIC_APP_URL`: URL base da aplicacao. Em desenvolvimento pode ser `http://localhost:3000`.
- `GOOGLE_CLIENT_ID`: client ID do OAuth do Google.
- `GOOGLE_CLIENT_SECRET`: client secret do OAuth do Google.
- `RESEND_API_KEY`: chave da Resend para envio de emails.
- `RESEND_FROM_EMAIL`: remetente usado nos emails enviados pela Resend.
- `NEXT_PUBLIC_APP_VERSION`: versao publica da aplicacao.

Sem `RESEND_API_KEY`, em ambiente de desenvolvimento, os links de recuperacao e exclusao sao registrados no console do servidor em vez de serem enviados por email.

## Como instalar e executar

Clone o repositorio:

```bash
git clone https://github.com/seu-usuario/nexwork.git
cd nexwork
```

Instale as dependencias:

```bash
npm install
```

Configure o ambiente:

```bash
cp .env.example .env.local
```

Se o projeto ainda nao tiver `.env.example`, crie manualmente o `.env.local` seguindo a secao [Configuracao do ambiente](#configuracao-do-ambiente).

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse no navegador:

```text
http://localhost:3000
```

Para gerar uma build de producao:

```bash
npm run build
```

Para iniciar a aplicacao em modo producao apos o build:

```bash
npm run start
```

## Scripts disponiveis

- `npm run dev`: inicia o servidor local de desenvolvimento.
- `npm run build`: gera a build de producao.
- `npm run start`: executa a build de producao.
- `npm run lint`: executa a verificacao de lint configurada pelo Next.js.

## Como usar a plataforma

### 1. Acessar a landing page

Ao abrir `/`, o usuario visualiza a pagina publica da NexWork com apresentacao da plataforma, quem somos, missao, visao, valores, categorias de trabalho, explicacao de funcionamento e chamada para cadastro.

### 2. Criar uma conta

Acesse `/cadastro` e informe:

- Nome
- Email
- Senha
- Empresa, se houver
- Data de nascimento

A senha precisa seguir a politica do sistema:

- Minimo de 8 caracteres
- Pelo menos uma letra maiuscula
- Pelo menos uma letra minuscula
- Pelo menos um numero
- Pelo menos um caractere especial

O cadastro tambem valida idade minima de 16 anos.

### 3. Entrar na plataforma

Acesse `/login` e entre com email e senha. Se o OAuth estiver configurado, tambem e possivel entrar com Google.

Apos o login, o usuario e redirecionado para `/dashboard`.

### 4. Completar o perfil

Na area `/conta`, o usuario pode editar:

- Foto de perfil
- Nome
- Empresa
- Telefone
- Titulo profissional
- Biografia
- Experiencia profissional
- Areas de interesse
- Habilidades
- Localizacao
- Portfolio

Essas informacoes ajudam contratantes e profissionais a avaliarem melhor as conversas e oportunidades.

### 5. Publicar um trabalho

No `/dashboard`, clique em `Publicar trabalho` ou `Nova publicacao`.

Preencha:

- Categoria
- Nome do trabalho
- Descricao detalhada
- Arquivos opcionais
- Habilidades desejadas
- Nivel de experiencia esperado
- Quantidade de dias para receber propostas
- Visibilidade publica ou privada

Apos publicar, o trabalho aparece no dashboard do contratante e, se for publico, tambem na listagem de trabalhos.

### 6. Gerenciar publicacoes

No dashboard, cada publicacao pode ser:

- Compartilhada por link publico
- Editada
- Excluida

O link publico segue o formato:

```text
/v/[jobId]
```

Esse link permite que visitantes enviem mensagem ao contratante sem criar conta.

### 7. Encontrar trabalhos

Acesse `/trabalhos` ou `/feed` para visualizar oportunidades disponiveis.

Na listagem, o usuario pode:

- Buscar por palavras-chave
- Filtrar por categoria
- Ver detalhes de cada trabalho
- Compartilhar uma oportunidade
- Iniciar conversa privada com o contratante

O sistema nao mostra ao usuario as proprias publicacoes na lista de oportunidades.

### 8. Conversar pelo chat

Usuarios cadastrados acessam `/chat` para acompanhar conversas privadas.

O chat permite:

- Ver conversas por trabalho
- Enviar mensagens
- Anexar imagens e documentos
- Consultar dados do perfil do profissional interessado, quando aplicavel
- Atualizacao periodica das mensagens

Visitantes convidados podem conversar pela pagina publica da vaga (`/v/[jobId]`) informando apenas o nome.

### 9. Buscar profissionais

Acesse `/profissionais` para visualizar profissionais em destaque. A tela possui busca por nome, area ou habilidade e filtros por categoria.

Atualmente, essa pagina usa uma lista estatica de profissionais demonstrativos.

### 10. Recuperar senha

Acesse `/recuperar-senha`, informe o email cadastrado e siga o link de redefinicao.

Os tokens de recuperacao:

- Sao gerados de forma aleatoria
- Sao armazenados no banco apenas como hash
- Expiram em 1 hora

### 11. Excluir conta

Na area `/conta`, o usuario pode solicitar a exclusao da conta. O sistema envia ou registra um link de confirmacao, dependendo da configuracao de email.

A exclusao remove dados associados como usuario, trabalhos, conversas e mensagens relacionadas.

## Rotas principais

Rotas publicas:

- `/`: landing page.
- `/login`: login.
- `/cadastro`: cadastro.
- `/recuperar-senha`: solicitacao de recuperacao de senha.
- `/redefinir-senha`: redefinicao de senha por token.
- `/v/[jobId]`: pagina publica de trabalho com chat para convidados.
- `/sobre`: pagina institucional.
- `/faq`: perguntas frequentes.
- `/termos-de-uso`: termos de uso.
- `/politica-privacidade`: politica de privacidade.
- `/lgpd`: informacoes de LGPD.
- `/conta/excluir`: confirmacao publica de exclusao de conta por token.

Rotas autenticadas:

- `/dashboard`: painel principal do usuario.
- `/trabalhos`: listagem de trabalhos.
- `/feed`: alias da listagem de trabalhos.
- `/chat`: mensagens privadas.
- `/conta`: gerenciamento de perfil e senha.
- `/profissionais`: vitrine de profissionais.

## APIs internas

Autenticacao:

- `POST /api/auth/register`: cria usuario e inicia sessao.
- `POST /api/auth/login`: autentica com email e senha.
- `POST /api/auth/logout`: encerra sessao.
- `GET /api/auth/me`: retorna o usuario autenticado.
- `GET /api/auth/google`: inicia OAuth com Google.
- `GET /api/auth/google/callback`: processa callback do Google.
- `POST /api/auth/forgot-password`: gera link de recuperacao de senha.
- `POST /api/auth/reset-password`: redefine senha usando token.

Trabalhos:

- `GET /api/jobs`: lista trabalhos visiveis.
- `POST /api/jobs`: cria trabalho autenticado.
- `GET /api/jobs/[id]`: busca trabalho por ID.
- `PATCH /api/jobs/[id]`: edita trabalho do usuario autenticado.
- `DELETE /api/jobs/[id]`: exclui trabalho do usuario autenticado.

Conversas e mensagens:

- `GET /api/conversations`: lista conversas do usuario autenticado.
- `POST /api/conversations`: inicia conversa autenticada sobre uma vaga.
- `GET /api/conversations/[id]/messages`: lista mensagens de uma conversa.
- `POST /api/conversations/[id]/messages`: envia mensagem em uma conversa.
- `GET /api/guest/thread`: lista mensagens de convidado por sessao.
- `POST /api/guest/message`: envia mensagem como visitante convidado.

Usuario:

- `GET /api/user/profile`: retorna perfil do usuario.
- `PATCH /api/user/profile`: atualiza perfil.
- `POST /api/user/password`: altera ou cria senha.
- `POST /api/user/delete-request`: solicita exclusao de conta.
- `POST /api/user/delete-execute`: confirma exclusao de conta.

Dashboard:

- `GET /api/dashboard`: retorna contagem de trabalhos e conversas do usuario.

## Modelos de dados

### User

Representa usuarios cadastrados. Campos principais:

- Email
- Hash de senha
- ID Google opcional
- Nome
- Empresa
- Titulo profissional
- Bio
- Experiencia
- Areas de interesse
- Habilidades
- Localizacao
- Portfolio
- Data de nascimento
- Telefone
- Avatar
- Preferencias de notificacao

### Job

Representa um trabalho publicado. Campos principais:

- Contratante
- Categoria
- Titulo
- Descricao
- Orcamento
- Tags
- Anexos
- Nivel de experiencia
- Dias para receber propostas
- Visibilidade publica ou privada

### Conversation

Representa uma conversa associada a um trabalho. Pode envolver:

- Contratante
- Usuario cadastrado interessado
- Visitante convidado com sessao local
- Nome do convidado

### Message

Representa mensagens de uma conversa. Campos principais:

- Conversa
- Remetente
- Texto
- Anexos opcionais
- Data de criacao

### PasswordResetToken

Armazena tokens de recuperacao de senha como hash, com expiracao.

### AccountDeletionToken

Armazena tokens de confirmacao para exclusao de conta.

## Autenticacao e seguranca

- As senhas sao armazenadas com hash usando `bcryptjs`.
- A sessao usa JWT assinado com `JWT_SECRET`.
- O token fica em cookie HTTP-only chamado `nw_token`.
- Em producao, o cookie e marcado como seguro.
- O middleware protege rotas privadas e redireciona usuarios nao autenticados para `/login`.
- Usuarios autenticados sao redirecionados para `/dashboard` ao tentar acessar login, cadastro ou recuperacao de senha.
- Validacoes de entrada sao feitas com Zod em rotas sensiveis.
- Tokens de recuperacao de senha sao opacos, aleatorios, armazenados como hash e expiram em 1 hora.
- Links de exclusao de conta tambem usam fluxo de confirmacao por token.
- O OAuth do Google evita open redirect aceitando apenas caminhos relativos internos.

## Deploy

### Deploy recomendado na Vercel

1. Suba o projeto para um repositorio no GitHub.
2. Acesse a Vercel e importe o repositorio.
3. Configure o framework como Next.js, se a Vercel nao detectar automaticamente.
4. Adicione as variaveis de ambiente:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `GOOGLE_CLIENT_ID`, se usar Google OAuth
   - `GOOGLE_CLIENT_SECRET`, se usar Google OAuth
   - `RESEND_API_KEY`, se usar emails reais
   - `RESEND_FROM_EMAIL`, se usar emails reais
5. Execute o deploy.
6. Atualize `NEXT_PUBLIC_APP_URL` com a URL final da aplicacao.
7. Se usar Google OAuth, configure a URL de callback no Google Cloud Console:

```text
https://seu-dominio.com/api/auth/google/callback
```

### Deploy em outro provedor

Use o fluxo padrao de aplicacoes Next.js:

```bash
npm install
npm run build
npm run start
```

Garanta que o ambiente de producao tenha Node.js compativel, acesso ao MongoDB e todas as variaveis obrigatorias configuradas.

## Boas praticas para publicar no GitHub

Antes de publicar o repositorio:

- Nao suba `.env.local` nem qualquer arquivo com segredos.
- Crie um `.env.example` sem valores reais, se quiser facilitar a configuracao por outras pessoas.
- Verifique se `node_modules/` esta no `.gitignore`.
- Execute `npm run build` para validar a build.
- Execute `npm run lint` para revisar padroes do projeto.
- Atualize este README se novas funcionalidades forem adicionadas.

## Melhorias futuras

Algumas evolucoes possiveis:

- Persistir profissionais reais na pagina `/profissionais`.
- Adicionar sistema de propostas formais alem do chat.
- Implementar avaliacoes reais entre contratantes e profissionais.
- Adicionar notificacoes em tempo real por WebSocket ou Server-Sent Events.
- Criar upload real de anexos usando storage externo.
- Melhorar painel administrativo e metricas.
- Adicionar testes automatizados para APIs e fluxos criticos.



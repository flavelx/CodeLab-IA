# CodeLab IA — Guia do Site

## Sobre o site
O **CodeLab IA** é uma plataforma web de estudos de programação com apoio de inteligência artificial. Ela oferece um ambiente para tirar dúvidas, praticar com exercícios e testar conhecimentos por meio de quizzes, com acompanhamento de pontuação e histórico.

Esta é uma **versão de testes**: o site funciona diretamente no navegador e utiliza conteúdos de **demonstração gerados localmente** para o tutor, os exercícios e os quizzes. Em versões futuras, a plataforma poderá ser integrada a um serviço de inteligência artificial para respostas e atividades personalizadas em tempo real.

## Arquivos do projeto
Para o site funcionar corretamente, mantenha estes arquivos na mesma pasta:

- `index.html` — estrutura e interface da página
- `style.css` — estilos visuais e temas (claro/escuro)
- `app.js` — lógica, interações e conteúdo de demonstração

Este arquivo (`explicativo.md`) é apenas explicativo.

## Como abrir
1. Baixe ou mantenha `index.html`, `style.css` e `app.js` na mesma pasta.
2. Abra o arquivo `index.html` em um navegador (clique duplo ou botão direito → **Abrir com** → navegador).
3. Não é necessário instalar programas, servidor ou configurar chaves de API nesta versão.

> **Dica:** use um navegador atualizado (Google Chrome, Microsoft Edge, Firefox, entre outros).

## Visão geral da interface
- **Cabeçalho:** exibe o nome da plataforma e a **pontuação total** acumulada.
- **Menu lateral:** navegação entre as áreas do site:
  - *Tutor IA*, *Exercícios*, *Quiz*, *Histórico*, *Visão geral*, *Guia rápido* e *Sobre*.
- **Perfil de estudo:** área no topo do conteúdo para definir linguagem, nível e tema.
- **Área principal:** mostra o conteúdo da seção selecionada.
- **Botão de tema (canto inferior esquerdo):** alterna entre modo claro e escuro.

## Como usar

### 1. Configurar o perfil de estudo
1. No bloco **Perfil de estudo**, selecione a **Linguagem** e o **Nível de conhecimento**.
2. (Opcional) Informe o **Tema de estudo** (ex.: variáveis, funções, arrays, APIs, orientação a objetos).
   - Se deixar em branco, será usado “Conceitos básicos”.
3. Clique em **Salvar preferências**.

As preferências personalizam o tutor, os exercícios e os quizzes, e ficam salvas neste navegador.

### 2. Tutor IA (chat)
1. Acesse **Tutor IA** no menu lateral.
2. Digite sua dúvida no campo de texto e clique em **Enviar** (ou pressione Enter).
3. A conversa aparece na tela. Você pode perguntar sobre programação ou outros assuntos.
4. Clique em **Limpar conversa** para reiniciar a conversa exibida.

> Nesta versão de testes, as respostas do tutor são geradas localmente para demonstração.

### 3. Exercícios práticos
1. Acesse **Exercícios** no menu.
2. Clique em **Gerar exercícios** para criar atividades com base no seu perfil.
3. Leia o enunciado e a dica, escreva sua resposta e clique em **Corrigir resposta**.
4. Você receberá:
   - **Nota** de 0 a 10,
   - **Feedback** e orientações de melhoria,
   - Uma **solução sugerida**.
5. A nota é somada à sua **pontuação total**.
6. Se houver mais exercícios, clique em **Próximo exercício** para continuar.

### 4. Quiz interativo
1. Acesse **Quiz** no menu.
2. Clique em **Iniciar quiz**.
3. Responda às perguntas de múltipla escolha (**A, B, C ou D**).
4. Ao responder:
   - Você vê se acertou ou errou e a explicação da resposta.
   - Cada acerto soma **+2 pontos** à sua pontuação.
5. Ao final, confira seu desempenho (acertos, percentual e barra de progresso) e a **revisão dos erros**.
6. Clique em **Fazer outro quiz** para gerar um novo.

### 5. Histórico
1. Acesse **Histórico** no menu.
2. Veja as atividades registradas (chat, exercícios, correções, quiz e preferências) com data e hora.
3. Use **Filtrar por tipo** para exibir apenas uma categoria.
4. Clique em **Limpar histórico** para apagar os registros (será solicitada confirmação).

### 6. Visão geral
1. Acesse **Visão geral** no menu.
2. Consulte o resumo do seu progresso:
   - Atividades registradas
   - Respostas no quiz
   - Taxa de acerto
   - Exercícios corrigidos
3. Veja o **Perfil de estudo atual** e use os atalhos para abrir o Tutor, praticar exercícios ou iniciar um quiz.

### 7. Guia rápido e Sobre
- **Guia rápido:** passo a passo resumido para começar a usar a plataforma.
- **Sobre:** informações sobre o projeto e sobre esta versão de testes.

## Tema claro e escuro
- Clique no botão no **canto inferior esquerdo** para alternar entre tema claro e escuro.
- A escolha do tema é salva automaticamente neste navegador.

## Pontuação e dados salvos
- **Pontuação:**
  - Soma das notas obtidas nas correções de exercícios.
  - **+2 pontos** por cada acerto no quiz.
- **O que é salvo localmente no navegador:**
  - Preferências (linguagem, nível e tema)
  - Tema (claro/escuro)
  - Pontuação
  - Histórico de atividades
- **Onde os dados ficam:** no armazenamento local do navegador (`localStorage`).
  - Os dados não são enviados para servidores.
  - Os dados não são compartilhados entre navegadores ou dispositivos diferentes.

### Como apagar os dados
- **Histórico:** use o botão **Limpar histórico** na seção *Histórico*.
- **Todos os dados do site:** limpe os dados de navegação/armazenamento do site nas configurações do seu navegador.

## Observações importantes
- Versão de testes: chat, exercícios e quizzes funcionam com conteúdo de demonstração local.
- Para o funcionamento correto, mantenha `index.html`, `style.css` e `app.js` juntos na mesma pasta.
- A experiência pode variar levemente conforme o navegador utilizado.

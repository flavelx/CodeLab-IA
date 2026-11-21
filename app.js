const $ = (seletor) => document.querySelector(seletor);

function carregar(chave, fallback) {
  try {
    const valor = JSON.parse(localStorage.getItem(chave));
    return valor === null ? fallback : valor;
  } catch {
    return fallback;
  }
}

function salvar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* armazenamento indisponível */
  }
}

const estado = {
  linguagem: carregar("codeLab.linguagem", "JavaScript"),
  nivel: carregar("codeLab.nivel", "Iniciante"),
  tema: carregar("codeLab.tema-estudo", "Conceitos básicos"),
  pontuacao: Math.max(0, Math.min(1000000, Number(carregar("codeLab.pontuacao", 0)) || 0)),
  historico: (() => {
    const registros = carregar("codeLab.historico", []);
    if (!Array.isArray(registros)) return [];
    return registros
      .filter((registro) =>
        registro &&
        typeof registro.data === "string" &&
        typeof registro.tipo === "string" &&
        typeof registro.descricao === "string"
      )
      .slice(0, 50)
      .map((registro) => ({
        data: registro.data,
        tipo: registro.tipo.slice(0, 30),
        descricao: registro.descricao.slice(0, 200),
      }));
  })(),
  chat: [],
  exercicios: [],
  indiceExercicio: 0,
  quiz: [],
  indiceQuiz: 0,
  acertos: 0,
  respostasQuiz: [],
};

/* ---------- Conteúdo local (modo estático/demonstração) ---------- */
function demoTema(tema) {
  const t = typeof tema === "string" ? tema.trim() : "";
  return t || "Conceitos básicos";
}

const BANCO_EXERCICIOS = {
  JavaScript: [
    { enunciado: "Qual palavra-chave declara uma variável que não pode ser reatribuída?", dica: "Existe uma diferença entre declarar e reatribuir um valor.", solucao: "const idade = 20; // const impede uma nova atribuição" },
    { enunciado: "Como você percorre os elementos de um array em JavaScript?", dica: "Pense em laços e métodos como forEach, map ou for...of.", solucao: "numeros.forEach(function(n) { console.log(n); });" },
    { enunciado: "O que faz o operador === em vez de ==?", dica: "Comparação estrita considera também o tipo.", solucao: "if (tipo === 'js') { /* compara valor e tipo */ }" },
    { enunciado: "O que é uma Promise em JavaScript?", dica: "Está relacionado a operações assíncronas.", solucao: "Promise.resolve(42).then(valor => console.log(valor)); // exemplo de resultado futuro" },
  ],
  Python: [
    { enunciado: "Como você cria uma lista em Python e adiciona um item a ela?", dica: "Use colchetes e o método append.", solucao: "numeros = []\nnumeros.append(10)" },
    { enunciado: "Qual a diferença entre list e tuple em Python?", dica: "Uma delas não pode ser alterada depois de criada.", solucao: "lista = [1, 2]   # mutável\ntupla = (1, 2)  # imutável" },
    { enunciado: "Como declarar uma função em Python?", dica: "Começa com uma palavra-chave seguida do nome e parênteses.", solucao: "def saudacao(nome):\n    return f'Olá, {nome}!'" },
    { enunciado: "O que faz a comprehension [x * 2 for x in numeros]?", dica: "É uma forma compacta de criar uma lista.", solucao: "dobros = [x * 2 for x in numeros]  # lista com o dobro de cada item" },
  ],
};

function exerciciosDemoLocal(linguagem, quantidade, tema) {
  const assunto = demoTema(tema) !== "Conceitos básicos" ? demoTema(tema) : "conceitos fundamentais";
  const personalizados = [
    { enunciado: `Escreva uma linha de código em ${linguagem} que use ${assunto}.`, dica: "Uma linha curta basta.", solucao: `// Exemplo em ${linguagem}: aplique ${assunto} em uma linha.` },
    { enunciado: `Crie um exemplo mínimo de ${assunto} em ${linguagem}.`, dica: "Resolva o caso mais simples.", solucao: `// Exemplo em ${linguagem}: caso mais simples usando ${assunto}.` },
  ];
  const especificos = BANCO_EXERCICIOS[linguagem] || [
    { enunciado: `Declare uma variável em ${linguagem} e atribua um valor a ela.`, dica: "Resposta curta: uma linha de código.", solucao: `valor = 10  // declaração e atribuição em ${linguagem}` },
    { enunciado: `Escreva um comentário de uma linha em ${linguagem}.`, dica: "Use a sintaxe de comentário da linguagem.", solucao: `// Este é um comentário de uma linha em ${linguagem}` },
    { enunciado: `Escreva um if simples em ${linguagem}.`, dica: "Uma condição e uma ação só.", solucao: `if (condicao) { acao(); }  // uma condição, uma ação` },
  ];

  return [...personalizados, ...especificos].slice(0, quantidade).map((item, indice) => ({
    id: `ex-${Date.now()}-${indice}`,
    enunciado: item.enunciado,
    dica: item.dica,
    solucao: item.solucao || "Revise o exemplo discutido na correção.",
  }));
}

function quizDemoLocal(linguagem, quantidade, tema) {
  const assunto = demoTema(tema) !== "Conceitos básicos" ? demoTema(tema) : "conceitos fundamentais";
  const base = [
    {
      enunciado: `Em ${linguagem}, qual é a principal ideia por trás de ${assunto}?`,
      alternativas: [
        "Usar o conceito para organizar a solução de um problema",
        "Evitar testar o código para ganhar tempo",
        "Substituir toda lógica por comentários",
        "Ignorar a sintaxe da linguagem",
      ],
      correta: 0,
      explicacao: "Entender o propósito do tema ajuda a aplicá-lo corretamente antes de decorar detalhes.",
    },
    {
      enunciado: `Qual é uma boa prática ao estudar ${assunto} em ${linguagem}?`,
      alternativas: [
        "Copiar soluções prontas sem executá-las",
        "Praticar com exemplos pequenos e testar o resultado",
        "Evitar a documentação",
        "Nunca revisar os erros",
      ],
      correta: 1,
      explicacao: "Exercícios curtos e testes ajudam a fixar o entendimento de qualquer tema.",
    },
    {
      enunciado: `Ao usar ${assunto} em ${linguagem}, o que normalmente causa erros?`,
      alternativas: [
        "Entender bem o enunciado do problema",
        "Testar casos simples primeiro",
        "Não respeitar a sintaxe ou a regra do conceito",
        "Executar o código para conferir",
      ],
      correta: 2,
      explicacao: "Erros comuns vêm de detalhes de sintaxe ou de aplicar o conceito no contexto errado.",
    },
    {
      enunciado: `Qual estratégia ajuda mais a fixar ${assunto}?`,
      alternativas: [
        "Ler passivamente sem praticar",
        "Resolver um exercício curto e revisar a explicação",
        "Pular direto para temas avançados",
        "Evitar exemplos",
      ],
      correta: 1,
      explicacao: "Prática imediata seguida de revisão consolida o aprendizado.",
    },
    {
      enunciado: "O que significa versionar um código com Git?",
      alternativas: [
        "Salvar apenas o último arquivo",
        "Compilar o programa automaticamente",
        "Registrar mudanças ao longo do tempo",
        "Deletar arquivos antigos",
      ],
      correta: 2,
      explicacao: "O Git guarda o histórico de alterações, permitindo voltar a versões anteriores.",
    },
    {
      enunciado: "O que é um algoritmo?",
      alternativas: [
        "Um tipo de variável",
        "Uma sequência de passos para resolver um problema",
        "Um erro de sintaxe",
        "Um editor de texto",
      ],
      correta: 1,
      explicacao: "Algoritmo é a descrição ordenada de passos para atingir um objetivo.",
    },
    {
      enunciado: "Por que testar o código é importante?",
      alternativas: [
        "Para encontrar erros antes do usuário",
        "Para deixar o código maior",
        "Para deixar a execução mais lenta",
        "Para evitar entender o problema",
      ],
      correta: 0,
      explicacao: "Testes ajudam a detectar falhas cedo e dão confiança ao mudar o código.",
    },
  ];

  const embaralhadas = base
    .map((p) => ({ p, s: Math.random() }))
    .sort((a, b) => a.s - b.s)
    .map(({ p }) => p);

  return embaralhadas.slice(0, quantidade).map((pergunta, indice) => ({
    id: `quiz-${Date.now()}-${indice}`,
    ...pergunta,
  }));
}

function chatDemoLocal(pergunta, linguagem, nivel, tema) {
  const assunto = demoTema(tema);
  const contexto =
    assunto !== "Conceitos básicos"
      ? `Contexto de estudo: ${linguagem}, nível ${nivel}, tema ${assunto}.`
      : `Contexto de estudo: ${linguagem}, nível ${nivel}.`;

  return `Posso ajudar com essa dúvida: "${pergunta}".\n\n` +
    `1. Vamos partir do que você já sabe e resolver passo a passo.\n` +
    `2. ${contexto} Se fizer sentido, ligo a resposta a esse contexto — mas posso falar de qualquer assunto.\n` +
    `3. Se quiser, me mostre o que você tentou e refinamos juntos.\n\n` +
    `Resposta demonstrativa gerada localmente pelo CodeLab IA. Não é uma resposta de IA.`;
}

function avaliarDemoLocal(resposta, solucao) {
  const tamanho = String(resposta || "").trim().length;
  const nota = tamanho >= 80 ? 9 : tamanho >= 40 ? 7 : tamanho >= 15 ? 5 : 3;

  const passos =
    `1) Releia o enunciado e identifique o que ele pede.\n` +
    `2) Tente resolver em uma única linha ou ideia curta.\n` +
    `3) Compare com o exemplo: ${solucao || "revise o tema solicitado."}`;

  return {
    nota,
    feedback:
      nota >= 7
        ? "Boa resposta! Você mostrou entendimento do conceito. Veja abaixo uma forma de conferir."
        : "Sua resposta foi muito curta ou pouco precisa. Use os passos abaixo para ajustar.",
    correcao: passos,
  };
}

let timerToast;
function toast(mensagem) {
  const elemento = $("#toast");
  if (!elemento) return;
  elemento.textContent = mensagem;
  elemento.hidden = false;
  clearTimeout(timerToast);
  timerToast = setTimeout(() => {
    elemento.hidden = true;
  }, 3000);
}

/* ---------- Pontuação ---------- */
function atualizarPontuacao() {
  $("#pontuacao").textContent = estado.pontuacao;
}

function adicionarPontos(pontos) {
  estado.pontuacao += pontos;
  salvar("codeLab.pontuacao", estado.pontuacao);
  atualizarPontuacao();
}

/* ---------- Histórico e visão geral ---------- */
function registrarHistorico(tipo, descricao) {
  estado.historico.unshift({
    data: new Date().toISOString(),
    tipo,
    descricao,
  });
  estado.historico = estado.historico.slice(0, 50);
  salvar("codeLab.historico", estado.historico);
  renderizarHistorico();
  atualizarVisaoGeral();
}

function renderizarHistorico() {
  const lista = $("#historico-lista");
  if (!lista) return;
  lista.replaceChildren();

  const filtro = $("#filtro-historico") ? $("#filtro-historico").value : "todos";
  const registros =
    filtro === "todos"
      ? estado.historico
      : estado.historico.filter((registro) => registro.tipo === filtro);

  if (registros.length === 0) {
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent =
      filtro === "todos"
        ? "Nenhuma atividade ainda. Comece pelo chat ou pelos exercícios!"
        : "Nenhum registro encontrado para este filtro.";
    lista.append(item);
    return;
  }

  registros.forEach((registro) => {
    const item = document.createElement("li");

    const data = document.createElement("time");
    data.dateTime = registro.data;
    data.textContent = new Date(registro.data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const tipo = document.createElement("span");
    tipo.className = "tipo tipo-" + registro.tipo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    tipo.textContent = registro.tipo;

    const descricao = document.createElement("span");
    descricao.className = "desc";
    descricao.textContent = registro.descricao;

    item.append(data, tipo, descricao);
    lista.append(item);
  });
}

function atualizarVisaoGeral() {
  let acertos = 0;
  let erros = 0;
  let correcoes = 0;

  estado.historico.forEach((registro) => {
    if (registro.tipo === "Quiz") {
      if (registro.descricao.includes("Acerto")) acertos += 1;
      if (registro.descricao.includes("Erro")) erros += 1;
    }
    if (registro.tipo === "Correção") correcoes += 1;
  });

  const totalQuiz = acertos + erros;
  const taxa = totalQuiz ? `${Math.round((acertos / totalQuiz) * 100)}%` : "—";

  const definir = (id, valor) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  };

  definir("stat-atividades", String(estado.historico.length));
  definir("stat-quiz", String(totalQuiz));
  definir("stat-taxa", taxa);
  definir("stat-correcoes", String(correcoes));

  const perfil = document.getElementById("perfil-resumo");
  if (perfil) {
    perfil.textContent = `${estado.linguagem} · ${estado.nivel} · ${estado.tema}`;
  }
}

function mostrarErro(area, mensagem) {
  area.replaceChildren();
  const paragrafo = document.createElement("p");
  paragrafo.className = "hint";
  paragrafo.textContent = mensagem;
  area.append(paragrafo);
}

/* ---------- Chat ---------- */
function adicionarMensagem(tipo, texto, pensando = false) {
  const mensagem = document.createElement("div");
  mensagem.className = `msg ${tipo}${pensando ? " pensando" : ""}`;
  mensagem.textContent = texto;

  const container = $("#mensagens");
  container.append(mensagem);
  container.scrollTop = container.scrollHeight;
  return mensagem;
}

$("#form-chat").addEventListener("submit", (evento) => {
  evento.preventDefault();

  const campo = $("#pergunta");
  const botao = $("#enviar-chat");
  const pergunta = campo.value.trim();
  if (!pergunta) return;

  campo.value = "";
  botao.disabled = true;
  adicionarMensagem("aluno", pergunta);

  const respostaTexto = chatDemoLocal(
    pergunta,
    estado.linguagem,
    estado.nivel,
    estado.tema
  );
  adicionarMensagem("bot", respostaTexto);

  estado.chat.push(
    { tipo: "aluno", texto: pergunta },
    { tipo: "bot", texto: respostaTexto }
  );

  registrarHistorico("Chat", pergunta.slice(0, 90));
  $("#mensagens").scrollTop = $("#mensagens").scrollHeight;

  botao.disabled = false;
  campo.focus();
});

$("#limpar-chat").addEventListener("click", () => {
  estado.chat = [];
  const container = $("#mensagens");
  container.replaceChildren();
  const msg = document.createElement("div");
  msg.className = "msg bot";
  msg.textContent =
    "Olá! Sou seu tutor de estudos. Pergunte o que quiser — programação ou outros assuntos. Para respostas melhores, conte o que você já tentou ou qual é seu objetivo.";
  container.append(msg);
  toast("Conversa limpa.");
});

/* ---------- Exercícios ---------- */
$("#gerar-exercicios").addEventListener("click", () => {
  const botao = $("#gerar-exercicios");
  botao.disabled = true;
  botao.textContent = "Gerando...";

  estado.exercicios = exerciciosDemoLocal(estado.linguagem, 3, estado.tema);
  estado.indiceExercicio = 0;

  registrarHistorico(
    "Exercícios",
    `${estado.exercicios.length} exercícios de ${estado.linguagem} · ${estado.tema}`
  );
  renderizarExercicio();

  botao.disabled = false;
  botao.textContent = "Gerar exercícios";
});

function renderizarExercicio() {
  const area = $("#exercicio-area");
  area.replaceChildren();

  if (estado.exercicios.length === 0) return;

  const exercicio = estado.exercicios[estado.indiceExercicio];
  const cartao = document.createElement("div");
  cartao.className = "card";

  const progresso = document.createElement("div");
  progresso.className = "progresso";
  progresso.textContent = `Exercício ${estado.indiceExercicio + 1} de ${estado.exercicios.length}`;

  const titulo = document.createElement("h3");
  titulo.textContent = exercicio.enunciado;

  const dica = document.createElement("div");
  dica.className = "dica";
  dica.textContent = `💡 ${exercicio.dica}`;

  const resposta = document.createElement("textarea");
  resposta.placeholder = "Escreva sua resposta aqui...";
  resposta.setAttribute("aria-label", "Sua resposta");

  const acoes = document.createElement("div");
  acoes.className = "card-actions";

  const corrigir = document.createElement("button");
  corrigir.type = "button";
  corrigir.className = "btn btn-primary";
  corrigir.textContent = "Corrigir resposta";

  corrigir.addEventListener("click", () => {
    if (!resposta.value.trim()) {
      toast("Escreva uma resposta antes de corrigir.");
      return;
    }

    corrigir.disabled = true;
    corrigir.textContent = "Corrigindo...";

    const dados = avaliarDemoLocal(resposta.value, exercicio.solucao);
    adicionarPontos(dados.nota);
    registrarHistorico("Correção", `Nota ${dados.nota}/10 em ${estado.linguagem} · ${estado.tema}`);

    const feedback = document.createElement("div");
    feedback.className = "feedback " + (dados.nota >= 7 ? "ok" : "ruim");

    const nota = document.createElement("strong");
    nota.textContent = `Nota: ${dados.nota}/10`;

    const texto = document.createElement("div");
    texto.className = "feedback-texto";
    texto.textContent = `${dados.feedback}\\n\\nComo melhorar:\\n${dados.correcao}`;

    feedback.append(nota, texto);

    if (exercicio.solucao) {
      const solucao = document.createElement("pre");
      solucao.className = "solucao";
      solucao.textContent = `Solução sugerida:\\n${exercicio.solucao}`;
      feedback.append(solucao);
    }

    cartao.append(feedback);
    resposta.disabled = true;
    corrigir.disabled = false;
    corrigir.textContent = "Resposta corrigida";
  });

  acoes.append(corrigir);

  if (estado.indiceExercicio < estado.exercicios.length - 1) {
    const proximo = document.createElement("button");
    proximo.type = "button";
    proximo.className = "btn btn-ghost";
    proximo.textContent = "Próximo exercício →";
    proximo.addEventListener("click", () => {
      estado.indiceExercicio += 1;
      renderizarExercicio();
    });
    acoes.append(proximo);
  }

  cartao.append(progresso, titulo, dica, resposta, acoes);
  area.append(cartao);
}

/* ---------- Quiz ---------- */
$("#iniciar-quiz").addEventListener("click", () => {
  const botao = $("#iniciar-quiz");
  botao.disabled = true;
  botao.textContent = "Criando...";

  estado.quiz = quizDemoLocal(estado.linguagem, 5, estado.tema);
  estado.indiceQuiz = 0;
  estado.acertos = 0;
  estado.respostasQuiz = [];

  registrarHistorico("Quiz", `Quiz de ${estado.quiz.length} perguntas · ${estado.tema}`);
  renderizarPerguntaQuiz();

  botao.disabled = false;
  botao.textContent = "Iniciar quiz";
});

function renderizarPerguntaQuiz() {
  const area = $("#quiz-area");
  area.replaceChildren();

  if (!estado.quiz.length) return;

  if (estado.indiceQuiz >= estado.quiz.length) {
    const cartao = document.createElement("div");
    cartao.className = "card";

    const titulo = document.createElement("h3");
    titulo.textContent = "Quiz concluído!";

    const percentual = Math.round((estado.acertos / estado.quiz.length) * 100);
    const resultado = document.createElement("p");
    resultado.className = "resultado-resumo";
    resultado.textContent = `Você acertou ${estado.acertos} de ${estado.quiz.length} perguntas (${percentual}%).`;

    const barra = document.createElement("div");
    barra.className = "barra-progresso";
    const preenchimento = document.createElement("div");
    preenchimento.className = "barra-preenchimento";
    preenchimento.style.width = `${percentual}%`;
    barra.append(preenchimento);

    const acoes = document.createElement("div");
    acoes.className = "card-actions";
    const novamente = document.createElement("button");
    novamente.type = "button";
    novamente.className = "btn btn-primary";
    novamente.textContent = "Fazer outro quiz";
    novamente.addEventListener("click", () => $("#iniciar-quiz").click());
    acoes.append(novamente);

    cartao.append(titulo, resultado, barra, acoes);

    const erradas = estado.respostasQuiz.filter((r) => r.escolhida !== r.correta);
    if (erradas.length > 0) {
      const revisao = document.createElement("div");
      revisao.className = "revisao";

      const cabecalho = document.createElement("h4");
      cabecalho.textContent = `Revisar erros (${erradas.length})`;
      revisao.append(cabecalho);

      erradas.forEach((resposta) => {
        const item = document.createElement("div");
        item.className = "revisao-item";

        const pergunta = document.createElement("p");
        pergunta.className = "revisao-pergunta";
        pergunta.textContent = resposta.enunciado;

        const sua = document.createElement("p");
        sua.className = "revisao-sua";
        sua.textContent = `Sua resposta: ${String.fromCharCode(65 + resposta.escolhida)}) ${resposta.alternativas[resposta.escolhida] || ""}`;

        const correta = document.createElement("p");
        correta.className = "revisao-correta";
        correta.textContent = `Resposta correta: ${String.fromCharCode(65 + resposta.correta)}) ${resposta.alternativas[resposta.correta] || ""}`;

        const explicacao = document.createElement("p");
        explicacao.className = "revisao-explicacao";
        explicacao.textContent = resposta.explicacao;

        item.append(pergunta, sua, correta, explicacao);
        revisao.append(item);
      });

      cartao.append(revisao);
    } else {
      const parabens = document.createElement("p");
      parabens.className = "hint sucesso";
      parabens.textContent = "Excelente! Você acertou todas as perguntas.";
      cartao.append(parabens);
    }

    area.append(cartao);
    return;
  }

  const pergunta = estado.quiz[estado.indiceQuiz];
  const cartao = document.createElement("div");
  cartao.className = "card";

  const progresso = document.createElement("div");
  progresso.className = "progresso";
  progresso.textContent = `Pergunta ${estado.indiceQuiz + 1} de ${estado.quiz.length}`;

  const titulo = document.createElement("h3");
  titulo.textContent = pergunta.enunciado;

  const alternativas = document.createElement("div");
  alternativas.className = "alternativas";
  alternativas.setAttribute("role", "group");
  alternativas.setAttribute("aria-label", "Alternativas de resposta");

  pergunta.alternativas.forEach((alternativa, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "alternativa";
    botao.textContent = `${String.fromCharCode(65 + indice)}) ${alternativa}`;

    botao.addEventListener("click", () => {
      const acertou = indice === pergunta.correta;
      estado.respostasQuiz.push({
        enunciado: pergunta.enunciado,
        alternativas: pergunta.alternativas,
        correta: pergunta.correta,
        escolhida: indice,
        explicacao: pergunta.explicacao,
      });

      area.querySelectorAll(".alternativa").forEach((item) => {
        item.disabled = true;
      });

      botao.classList.add(acertou ? "correta" : "errada");

      if (!acertou) {
        const correta = area.querySelectorAll(".alternativa")[pergunta.correta];
        if (correta) correta.classList.add("correta");
      } else {
        estado.acertos += 1;
        adicionarPontos(2);
      }

      registrarHistorico("Quiz", acertou ? "Acerto no quiz (+2 pontos)" : "Erro no quiz");

      const feedback = document.createElement("div");
      feedback.className = "feedback " + (acertou ? "ok" : "ruim");
      const rotulo = document.createElement("strong");
      rotulo.textContent = acertou ? "Correto! (+2 pontos)" : "Não foi dessa vez.";
      const explicacao = document.createElement("div");
      explicacao.textContent = pergunta.explicacao;
      feedback.append(rotulo, explicacao);

      const proximo = document.createElement("button");
      proximo.type = "button";
      proximo.className = "btn btn-primary";
      proximo.textContent =
        estado.indiceQuiz === estado.quiz.length - 1 ? "Ver resultado" : "Próxima pergunta →";
      proximo.addEventListener("click", () => {
        estado.indiceQuiz += 1;
        renderizarPerguntaQuiz();
      });

      cartao.append(feedback, proximo);
      proximo.focus();
    });

    alternativas.append(botao);
  });

  cartao.append(progresso, titulo, alternativas);
  area.append(cartao);
}

/* ---------- Preferências, abas e histórico ---------- */
$("#salvar-config").addEventListener("click", () => {
  estado.linguagem = $("#linguagem").value;
  estado.nivel = $("#nivel").value;
  estado.tema = $("#tema").value.trim() || "Conceitos básicos";

  salvar("codeLab.linguagem", estado.linguagem);
  salvar("codeLab.nivel", estado.nivel);
  salvar("codeLab.tema-estudo", estado.tema);
  registrarHistorico("Preferências", `${estado.linguagem} · ${estado.nivel} · ${estado.tema}`);
  atualizarVisaoGeral();
  toast("Preferências salvas!");
});

$("#limpar-historico").addEventListener("click", () => {
  if (!confirm("Tem certeza que deseja limpar o histórico?")) return;

  estado.historico = [];
  salvar("codeLab.historico", estado.historico);
  renderizarHistorico();
  atualizarVisaoGeral();
  toast("Histórico limpo.");
});

const filtroHistorico = $("#filtro-historico");
if (filtroHistorico) {
  filtroHistorico.addEventListener("change", renderizarHistorico);
}

document.querySelectorAll(".tab").forEach((aba) => {
  aba.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => {
      item.classList.toggle("active", item === aba);
    });
    document.querySelectorAll(".panel").forEach((painel) => {
      painel.classList.remove("active");
    });
    const painel = $(`#panel-${aba.dataset.tab}`);
    if (painel) painel.classList.add("active");
  });
});

/* ---------- Tema claro/escuro ---------- */
function aplicarTema(tema) {
  const ehEscuro = tema === "escuro";

  document.documentElement.dataset.theme = ehEscuro ? "dark" : "light";
  salvar("codeLab.tema", tema);

  const botao = $("#tema-btn");
  if (botao) {
    botao.setAttribute(
      "aria-label",
      ehEscuro ? "Alternar tema claro" : "Alternar tema escuro"
    );
  }
}

aplicarTema(carregar("codeLab.tema", "claro") === "escuro" ? "escuro" : "claro");

$("#tema-btn").addEventListener("click", () => {
  const themeAtual = document.documentElement.dataset.theme;
  aplicarTema(themeAtual === "dark" ? "claro" : "escuro");
});

/* ---------- Inicialização ---------- */
$("#linguagem").value = estado.linguagem;
$("#nivel").value = estado.nivel;
$("#tema").value = estado.tema === "Conceitos básicos" ? "" : estado.tema;
atualizarPontuacao();
renderizarHistorico();
atualizarVisaoGeral();

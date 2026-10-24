// ====== Chatbot FAQ Widget ======
// Arquivo separado para facilitar manutenção
// WHATSAPP_NUMBER e CONTACT_EMAIL são definidos em script.js (carregado antes).
(function () {
  // Local outline icons; decorative SVGs keep accessible button labels intact.
  const iconPaths = {
    "chat": "<path d=\"M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9H13a8.5 8.5 0 0 1 8 8v.5Z\"/>",
    "cube": "<path d=\"m12 3 9 5v8l-9 5-9-5V8l9-5Z M3 8l9 5 9-5 M12 13v8 M7.5 5.5l9 5\"/>",
    "grid": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/>",
    "file": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z M14 2v6h6 M8 13h8 M8 17h5\"/>",
    "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>",
    "tag": "<path d=\"M20 13 13 20a2 2 0 0 1-3 0L3 13V3h10l7 7a2 2 0 0 1 0 3Z\"/><circle cx=\"7.5\" cy=\"7.5\" r=\"1\"/>",
    "truck": "<path d=\"M3 6h11v11H3V6Z M14 10h4l3 4v3h-7\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/><circle cx=\"18\" cy=\"18\" r=\"2\"/>",
    "user": "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21v-2a8 8 0 0 1 16 0v2\"/>",
    "back": "<path d=\"m9 6-6 6 6 6 M3 12h18\"/>",
    "help": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-1 .7-1.8 1.3-1.8 2.8 M12 17h.01\"/>",
    "palette": "<circle cx=\"8\" cy=\"9\" r=\"1\"/><circle cx=\"12\" cy=\"6\" r=\"1\"/><circle cx=\"16\" cy=\"9\" r=\"1\"/><path d=\"M12 21a9 9 0 1 1 9-9c0 2-1 3-3 3h-2a2 2 0 0 0-2 2c0 1 1 2 0 3-.5.7-1 1-2 1Z\"/>",
    "close": "<path d=\"m6 6 12 12 M6 18 18 6\"/>",
    "send": "<path d=\"m22 2-7 20-4-9L2 9l20-7Z M22 2 11 13\"/>"
};

  function icon(name) {
    return `<svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconPaths[name] || iconPaths.chat}</svg>`;
  }

  // Conversation flow data
  const flows = {
    welcome: {
      messages: ["Olá! Sou o assistente da 3D Angels. Me conte o que você precisa e eu te ajudo com o próximo passo. Se preferir ver todas as opções, clique em Menu."],
      options: []
    },
    conversa: {
      messages: ["Estou aqui! Pode escrever sua pergunta. Você quer criar uma peça ou precisa de ajuda com algo que já pediu?"],
      options: []
    },
    agradecimento: {
      messages: ["Por nada! Se precisar de mais alguma coisa, é só escrever aqui."],
      options: []
    },
    menu: {
      messages: ["Sobre o que você quer conversar?"],
      options: [
        { icon: "cube", text: "Acompanhar meu pedido", next: "pedido" },
        { icon: "grid", text: "Ver catálogo", action: "link", url: "index.html" },
        { icon: "file", text: "Quero fazer um orçamento", next: "orcamento" },
        { icon: "clock", text: "Qual o prazo de entrega?", next: "prazo" },
        { icon: "cube", text: "Quais materiais vocês usam?", next: "materiais" },
        { icon: "tag", text: "Quanto custa em média?", next: "precos" },
        { icon: "truck", text: "Vocês fazem entrega?", next: "entrega" },
        { icon: "user", text: "Falar com atendente", next: "atendente" }
      ]
    },
    orcamento: {
      messages: ["Para solicitar um orçamento é simples.", "Você pode:\n\n1. Preencher nosso formulário online\n2. Enviar sua ideia direto pelo WhatsApp\n\nNão precisa ter o arquivo 3D — basta uma foto ou descrição!"],
      options: [
        { icon: "file", text: "Ir para o formulário", action: "link", url: "orcamento.html" },
        { icon: "chat", text: "Enviar pelo WhatsApp", action: "whatsapp" },
        { icon: "back", text: "Voltar ao menu", next: "welcome" }
      ]
    },
    prazo: {
      messages: ["O prazo depende do tamanho, material, quantidade e fila de produção. Nossa equipe confirma a previsão no orçamento. O transporte pode acrescentar tempo à entrega.", "Já fez um pedido? Consulte o andamento no nosso sistema de pedidos."],
      options: [
        { icon: "file", text: "Quero fazer um orçamento", next: "orcamento" },
        { icon: "help", text: "Tenho outra dúvida", next: "welcome" },
        { icon: "user", text: "Falar com atendente", next: "atendente" }
      ]
    },
    materiais: {
      messages: ["Trabalhamos com PLA e PETG. A escolha depende do uso da peça.", "Conte à equipe se a peça ficará exposta ao sol, calor, umidade ou esforço mecânico. Assim podemos avaliar o material e o projeto adequados."],
      options: [
        { icon: "palette", text: "Quais cores disponíveis?", next: "cores" },
        { icon: "file", text: "Quero fazer um orçamento", next: "orcamento" },
        { icon: "back", text: "Voltar ao menu", next: "welcome" }
      ]
    },
    cores: {
      messages: ["A disponibilidade de cores depende do material e do estoque. Envie a cor desejada ou uma referência para a equipe confirmar no orçamento."],
      options: [
        { icon: "file", text: "Quero fazer um orçamento", next: "orcamento" },
        { icon: "back", text: "Voltar ao menu", next: "welcome" }
      ]
    },
    precos: {
      messages: ["Confira os preços de cada peça no catálogo. Para projetos personalizados, o valor depende de tamanho, material, quantidade e complexidade.", "Para um orçamento, envie uma foto, descrição ou arquivo 3D e as medidas aproximadas."],
      options: [
        { icon: "grid", text: "Ver catálogo completo", action: "link", url: "index.html" },
        { icon: "file", text: "Solicitar orçamento", next: "orcamento" },
        { icon: "back", text: "Voltar ao menu", next: "welcome" }
      ]
    },
    entrega: {
      messages: ["Sim, fazemos entrega.", "Indaiatuba — Retirada no local ou entrega\nTodo o Brasil — Enviamos pelos Correios ou transportadora\n\nO frete é calculado no momento do orçamento conforme o CEP de destino."],
      options: [
        { icon: "file", text: "Quero fazer um orçamento", next: "orcamento" },
        { icon: "help", text: "Tenho outra dúvida", next: "welcome" },
        { icon: "user", text: "Falar com atendente", next: "atendente" }
      ]
    },
    pedido: {
      messages: ["Acompanhe o status e a previsão no sistema de pedidos da 3D Angels. Tenha o número do pedido em mãos.", "Este chat não consulta seus dados nem altera pedidos. Se não souber o número, fale com a equipe pelo WhatsApp."],
      options: [
        { icon: "cube", text: "Abrir consulta de pedidos", action: "link", url: "https://pedidos.angels3d.com/" },
        { icon: "help", text: "Não tenho o número do pedido", next: "atendente" }
      ]
    },
    desconhecido: {
      messages: ["Ainda não entendi o que você precisa. Pode explicar de outro jeito? Por exemplo: ‘quero fazer uma peça’ ou ‘onde está meu pedido?’. Para ver os assuntos disponíveis, clique em Menu."],
      options: []
    },
    esclarecer: {
      messages: ["Não consegui esclarecer sua dúvida por aqui. Se quiser, nossa equipe pode ajudar pelo WhatsApp. Você também pode continuar escrevendo neste chat."],
      options: [{ icon: "chat", text: "Falar com a equipe", action: "whatsapp" }]
    },
    atendente: {
      messages: ["Posso te encaminhar para a equipe. Clique abaixo para abrir o WhatsApp; o atendimento acontece por lá."],
      options: [
        { icon: "chat", text: "Abrir WhatsApp agora", action: "whatsapp" },
        { icon: "back", text: "Voltar ao menu", next: "welcome" }
      ]
    }
  };

  // Create chatbot DOM elements
  function createChatbot() {
    // Trigger button
    const trigger = document.createElement('button');
    trigger.className = 'chatbot-trigger';
    trigger.setAttribute('aria-label', 'Abrir chat de atendimento');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'chatbot-window');
    trigger.innerHTML = icon('chat');

    // Chat window
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chatbot-window';
    chatWindow.id = 'chatbot-window';
    chatWindow.setAttribute('role', 'dialog');
    chatWindow.setAttribute('aria-label', 'Assistente 3D Angels');
    chatWindow.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-avatar">${icon('cube')}</div>
        <div class="chatbot-header-info">
          <h4>3D Angels</h4>
          <span>Assistente automático</span>
        </div>
        <button class="chatbot-close" aria-label="Fechar chat">${icon('close')}</button>
      </div>
      <div class="chatbot-body" id="chatbot-body" role="log" aria-live="polite" aria-relevant="additions" tabindex="0"></div>
      <div class="chatbot-shortcuts">
        <button type="button" data-flow="menu">${icon('grid')}<span>Menu</span></button>
      </div>
      <form class="chatbot-form">
        <label class="chatbot-input-label" for="chatbot-input">Digite sua dúvida</label>
        <div class="chatbot-input-row">
          <input id="chatbot-input" name="message" placeholder="Ex.: como pedir um orçamento?" maxlength="300" autocomplete="off" required>
          <button type="submit" aria-label="Enviar mensagem" title="Enviar mensagem">${icon('send')}</button>
        </div>
      </form>
      <div class="chatbot-footer">Não envie senhas ou dados sensíveis neste chat.</div>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(chatWindow);

    // Event: Toggle chat
    trigger.addEventListener('click', () => {
      const isOpen = chatWindow.classList.toggle('open');
      trigger.classList.toggle('active', isOpen);
      trigger.setAttribute('aria-expanded', String(isOpen));
      if (isOpen && !chatWindow.dataset.initialized) {
        chatWindow.dataset.initialized = 'true';
        runFlow('welcome');
      }
      if (isOpen) chatWindow.querySelector('#chatbot-input').focus();
    });

    // Event: Close button
    chatWindow.querySelector('.chatbot-close').addEventListener('click', () => {
      chatWindow.classList.remove('open');
      trigger.classList.remove('active');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    });
    chatWindow.addEventListener('keydown', event => {
      if (event.key === 'Escape') chatWindow.querySelector('.chatbot-close').click();
    });
    chatWindow.querySelectorAll('[data-flow]').forEach(button => {
      button.addEventListener('click', () => runFlow(button.dataset.flow));
    });
    chatWindow.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      if (replyPending) return;
      const input = chatWindow.querySelector('#chatbot-input');
      const message = input.value.trim();
      if (!message) return;
      addUserMessage(message);
      input.value = '';
      const intent = classifyMessage(message);
      unansweredCount = intent === 'desconhecido' ? unansweredCount + 1 : 0;
      runFlow(unansweredCount > 1 ? 'esclarecer' : intent, true);
      input.focus();
    });
  }

  // Chat body reference
  function getBody() {
    return document.getElementById('chatbot-body');
  }

  // Scroll chat to bottom
  function scrollToBottom() {
    const body = getBody();
    if (body) {
      setTimeout(() => {
        body.scrollTop = body.scrollHeight;
      }, 50);
    }
  }

  // Add bot message
  function addBotMessage(text) {
    const body = getBody();
    const msg = document.createElement('div');
    msg.className = 'chat-message chat-message-bot';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    msg.appendChild(bubble);
    body.appendChild(msg);
    scrollToBottom();
  }

  // Add user message
  function addUserMessage(text) {
    const body = getBody();
    const msg = document.createElement('div');
    msg.className = 'chat-message chat-message-user';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    msg.appendChild(bubble);
    body.appendChild(msg);
    scrollToBottom();
  }

  // Add option buttons
  function addOptions(options) {
    const body = getBody();
    const container = document.createElement('div');
    container.className = 'chat-options';

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-option-btn';
      btn.innerHTML = icon(opt.icon || 'chat');
      const label = document.createElement('span');
      label.textContent = opt.text;
      btn.appendChild(label);
      btn.addEventListener('click', () => handleOption(opt, container));
      container.appendChild(btn);
    });

    body.appendChild(container);
    scrollToBottom();
  }

  let unansweredCount = 0;
  let replyPending = false;
  let replyTimer = null;

  function setReplyPending(pending) {
    replyPending = pending;
    document.querySelector('.chatbot-form button[type="submit"]').disabled = pending;
  }

  function hideTyping() {
    document.getElementById('chat-typing')?.remove();
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.id = 'chat-typing';
    typing.className = 'chat-typing';
    typing.setAttribute('role', 'status');
    typing.setAttribute('aria-label', 'Preparando resposta');
    typing.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>';
    getBody().appendChild(typing);
    scrollToBottom();
  }

  // Rules for common expressions, not an AI model. No messages leave this page.
  function classifyMessage(message) {
    const text = message.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const intents = [
      ['atendente', /\b(atendente|humano|humana|pessoa|equipe|whatsapp|zap|wpp|cancelar|cancelamento|reembolso|reclamacao|defeito|quebrado|quebrada)\b|falar com alguem/],
      ['orcamento', /\b(?:quero|gostaria de) (?:fazer |criar )?(?:um |meu |um novo )pedido\b/],
      ['pedido', /\b(meu pedido|minha encomenda|ja comprei|ja pedi|ja fiz|status|rastrear|rastreamento|acompanhar|andamento|nao chegou)\b/],
      ['prazo', /\b(prazo|prazos|demora|dias|tempo|urgente|quando fica pronto|quando chega)\b/],
      ['entrega', /\b(entrega|entregam|frete|cep|retirada|retirar|envio|correios|transportadora)\b/],
      ['precos', /\b(preco|precos|valor|valores|custa|custam|custo|quanto|catalogo|catalogu|produtos)\b/],
      ['cores', /\b(cor|cores|colorido|colorida|preto|preta|branco|branca|azul|vermelho|vermelha|verde|rosa|roxo|roxa)\b/],
      ['materiais', /\b(material|materiais|pla|petg|resistencia|resistente|filamento)\b/],
      ['orcamento', /\b(orcamento|orsamento|orcamentar|personalizar|personalizado|personalizada|encomendar|comprar|imprimir|impressao|modelagem|stl|3mf)\b|(?:fazer|criar|quero|gostaria de) (?:um |uma |uma nova |um novo )?(?:pedido|peca|boneco|chaveiro|suporte)/],
      ['pedido', /\b(pedido|pedidos|encomenda)\b/],
      ['agradecimento', /\b(obrigado|obrigada|valeu|agradeco)\b/],
      ['conversa', /\b(chat|chatbot|oi|ola|bom dia|boa tarde|boa noite|ajuda|ajudar|conversar|tudo bem|esta ai|ta ai|menu|inicio)\b/]
    ];
    return intents.find(([, pattern]) => pattern.test(text))?.[0] || 'desconhecido';
  }

  function handleOption(opt, optionsContainer) {
    if (replyPending) return;
    if (opt.action === 'whatsapp') {
      // Open directly in the click event so browsers do not block the new tab.
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Olá! Vim pelo site e gostaria de falar com a equipe.'), '_blank', 'noopener,noreferrer');
      return;
    }
    if (opt.action === 'link') {
      window.location.assign(opt.url);
      return;
    }
    optionsContainer.remove();
    addUserMessage(opt.text);
    if (opt.next) runFlow(opt.next, true);
  }

  function runFlow(flowId, delayed = false) {
    const flow = flows[flowId];
    if (!flow) return;
    // Switching to Menu cancels any unfinished response.
    clearTimeout(replyTimer);
    replyTimer = null;
    hideTyping();
    setReplyPending(false);
    getBody().querySelectorAll('.chat-options').forEach(options => options.remove());
    const finish = () => {
      replyTimer = null;
      setReplyPending(false);
      // Only the persistent Menu button opens the full topic list.
      const options = flow.options.filter(option => option.next !== 'welcome');
      if (options.length) addOptions(options);
      // Bound the in-memory conversation without storing visitor messages.
      while (getBody().children.length > 60) getBody().firstElementChild.remove();
    };
    if (!delayed) {
      flow.messages.forEach(addBotMessage);
      finish();
      return;
    }
    setReplyPending(true);
    let messageIndex = 0;
    const sendNext = () => {
      hideTyping();
      addBotMessage(flow.messages[messageIndex++]);
      if (messageIndex < flow.messages.length) {
        showTyping();
        replyTimer = setTimeout(sendNext, 2000);
      } else {
        finish();
      }
    };
    showTyping();
    replyTimer = setTimeout(sendNext, 1000);
  }

  createChatbot();
})();

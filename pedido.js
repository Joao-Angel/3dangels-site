// Store only product choices locally. Free-text observations stay in this page.
(() => {
  const dialog = document.getElementById('order-dialog');
  if (!dialog) return;
  const storageKey = 'angels3d-order-v1';
  const catalog = new Map();
  const imageNames = new Map();
  const items = new Map();
  const list = document.getElementById('order-items');
  const notes = document.getElementById('order-notes');
  const send = document.getElementById('order-send');
  const open = document.getElementById('order-open');
  const status = document.getElementById('order-status');
  let statusTimeout;

  document.querySelectorAll('.card.produto').forEach(card => {
    const name = card.querySelector('h3').textContent.trim();
    const priceText = card.querySelector('.produto-preco').textContent.trim();
    const prices = priceText.match(/R\$\s*[\d.,]+/g);
    const price = prices?.length > 1 ? `De ${prices[0]} por ${prices.at(-1)}` : priceText;
    catalog.set(name, { name, price });
    imageNames.set(card.querySelector('img').getAttribute('src').replace(/\.[^.]+$/, ''), name);
    const button = card.querySelector('.btn-whatsapp');
    button.removeAttribute('onclick');
    button.textContent = 'Adicionar à lista';
    button.setAttribute('aria-label', `Adicionar ${name} à lista`);
    button.addEventListener('click', event => {
      event.stopPropagation();
      window.adicionarAoPedido(name);
    });
    // Product details are also reachable without a mouse.
    card.tabIndex = 0;
    card.setAttribute('aria-label', `Ver detalhes de ${name}`);
    card.addEventListener('keydown', event => {
      if (event.target === card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        card.click();
      }
    });
  });

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) saved.forEach(item => {
      if (catalog.has(item?.name) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99) {
        items.set(item.name, item.quantity);
      }
    });
  } catch { /* Browsers may disable storage; the list still works in memory. */ }

  function updateMessage() {
    const lines = ['Olá! Gostaria de solicitar este pedido pelo catálogo da 3D Angels:', ''];
    items.forEach((quantity, name) => lines.push(`${quantity} × ${name} — referência: ${catalog.get(name).price}`));
    if (notes.value.trim()) lines.push('', `Observações: ${notes.value.trim()}`);
    lines.push('', 'Podem confirmar o valor total, o frete e o prazo?');
    send.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    send.hidden = items.size === 0;
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(items, ([name, quantity]) => ({ name, quantity }))));
    } catch { /* Storage is optional. */ }
  }

  function render() {
    list.replaceChildren();
    if (!items.size) {
      const empty = document.createElement('p');
      empty.textContent = 'Sua lista está vazia. Adicione produtos do catálogo para começar.';
      list.append(empty);
    }
    items.forEach((quantity, name) => {
      const row = document.createElement('div');
      row.className = 'order-item';
      const summary = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = name;
      const price = document.createElement('p');
      price.textContent = catalog.get(name).price;
      summary.append(title, price);
      const controls = document.createElement('div');
      controls.className = 'order-controls';
      const label = document.createElement('label');
      label.textContent = 'Quantidade';
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '1';
      input.max = '99';
      input.step = '1';
      input.inputMode = 'numeric';
      input.value = quantity;
      input.setAttribute('aria-label', `Quantidade de ${name}`);
      input.addEventListener('input', () => {
        const value = Number(input.value);
        if (input.value && Number.isInteger(value) && value >= 1 && value <= 99) {
          items.set(name, value);
          updateSummary();
        }
      });
      input.addEventListener('change', () => { input.value = items.get(name); });
      label.append(input);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remover';
      remove.setAttribute('aria-label', `Remover ${name} da lista`);
      remove.addEventListener('click', () => {
        items.delete(name);
        render();
        const next = list.querySelector('input');
        (next || document.getElementById('order-continue')).focus();
      });
      controls.append(label, remove);
      row.append(summary, controls);
      list.append(row);
    });
    updateSummary();
  }

  function updateSummary() {
    open.hidden = items.size === 0;
    document.getElementById('order-count').textContent = Array.from(items.values()).reduce((sum, value) => sum + value, 0);
    updateMessage();
    save();
  }

  window.adicionarAoPedido = (name, image) => {
    if (image) name = imageNames.get(image.replace(/\.[^.]+$/, '')) || name;
    if (!catalog.has(name)) return;
    const quantity = items.get(name) || 0;
    items.set(name, Math.min(99, quantity + 1));
    render();
    status.textContent = quantity < 99 ? `${name} adicionado à sua lista.` : 'Limite de 99 unidades por produto. Para mais unidades, fale com a equipe.';
    status.classList.add('visible');
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => status.classList.remove('visible'), 3500);
  };
  open.addEventListener('click', () => {
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
  const close = () => dialog.close();
  document.getElementById('order-close').addEventListener('click', close);
  document.getElementById('order-continue').addEventListener('click', close);
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    if (!open.hidden) open.focus();
    else document.querySelector('.categoria.active .btn-whatsapp')?.focus();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  notes.addEventListener('input', updateMessage);
  render();
})();

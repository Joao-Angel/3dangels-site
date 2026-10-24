// ====== Contatos centralizados — altere apenas aqui ======
const WHATSAPP_NUMBER = "5519991946309";
const CONTACT_EMAIL   = "angels3dstore@gmail.com";

// Preloader — hide when page is fully loaded
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('loaded'), 300);
    setTimeout(() => preloader.remove(), 800);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Keep category controls below the menu without moving the product grid.
  const tabs = document.querySelector('.catalogo-tabs');
  const tabsSlot = document.querySelector('.catalogo-tabs-slot');
  const navigation = document.querySelector('.nav-island');
  const progress = document.querySelector('.scroll-progress');
  if (progress) {
    let framePending = false;
    const updateScrollUI = () => {
      framePending = false;
      if (tabs && tabsSlot && navigation) {
        const slotRect = tabsSlot.getBoundingClientRect();
        const top = navigation.getBoundingClientRect().bottom + 12;
        tabs.style.setProperty('--tabs-top', `${top}px`);
        tabs.style.setProperty('--tabs-left', `${slotRect.left}px`);
        tabs.style.setProperty('--tabs-width', `${slotRect.width}px`);
        tabsSlot.style.height = `${tabs.offsetHeight}px`;
        tabs.classList.toggle('is-pinned', slotRect.top <= top);
      }
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      progress.style.transform = `scaleX(${fraction})`;
    };
    const scheduleScrollUI = () => {
      if (!framePending) {
        framePending = true;
        requestAnimationFrame(updateScrollUI);
      }
    };
    window.addEventListener('scroll', scheduleScrollUI, { passive: true });
    window.addEventListener('resize', scheduleScrollUI);
    const layoutObserver = new ResizeObserver(scheduleScrollUI);
    [document.body, navigation, tabs].filter(Boolean).forEach(element => layoutObserver.observe(element));
    updateScrollUI();
  }

  // 1. Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Run once
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll('.fade-in-up');
  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });

  // Animated Stats Counter
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    let statsAnimated = false;
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const suffix = stat.dataset.suffix || '';
            const duration = 2000;
            const start = performance.now();

            const animate = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutQuart
              const ease = 1 - Math.pow(1 - progress, 4);
              const current = Math.round(target * ease);
              stat.textContent = current + suffix;
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          });
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('stats');
    if (statsSection) statsObserver.observe(statsSection);
  }

  // 2. Magnetic Buttons (Taste-Skill micro-interaction)
  const magneticButtons = document.querySelectorAll('.btn-primary');
  
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const position = btn.getBoundingClientRect();
      const x = e.pageX - position.left - position.width / 2;
      const y = e.pageY - position.top - position.height / 2;
      
      // Reduce the effect significantly for a premium subtle feel
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // Seek only on demand, with at most one decoder request in flight.
  function setupScrollVideo(videoId, containerId) {
    const video = document.getElementById(videoId);
    const container = document.getElementById(containerId);
    if (!video || !container) return;

    let frame = null;
    let failed = false;
    const frameTolerance = 1 / 30;

    function updateFrame() {
      frame = null;
      if (failed || document.hidden ||
          video.readyState < 1 || video.seeking ||
          !Number.isFinite(video.duration) || video.duration <= 0) return;

      const rect = container.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      const distance = container.offsetHeight - window.innerHeight;
      const progress = distance > 0
        ? Math.min(1, Math.max(0, -rect.top / distance))
        : 0;
      // Avoid seeking exactly to EOF, which can leave some browsers blank.
      const target = progress * Math.max(0, video.duration - frameTolerance);
      if (Math.abs(video.currentTime - target) < frameTolerance) return;
      try {
        video.currentTime = target;
      } catch {
        // Keep the poster visible when the browser cannot decode this source.
        showPoster();
      }
    }

    function scheduleFrame() {
      if (frame !== null || failed || document.hidden) return;
      frame = requestAnimationFrame(updateFrame);
    }

    function showPoster() {
      failed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      video.pause();
      video.style.visibility = 'hidden';
    }

    video.pause();
    video.addEventListener('loadedmetadata', scheduleFrame);
    video.addEventListener('durationchange', scheduleFrame);
    video.addEventListener('loadeddata', scheduleFrame);
    video.addEventListener('canplay', scheduleFrame);
    video.addEventListener('seeked', scheduleFrame);
    video.addEventListener('error', showPoster);
    window.addEventListener('scroll', scheduleFrame, { passive: true });
    window.addEventListener('resize', scheduleFrame);
    document.addEventListener('visibilitychange', scheduleFrame);
    window.addEventListener('pageshow', scheduleFrame);
    // Scroll is an explicit user action: keep it enabled even when the OS
    // reduces automatic animations. Start loading after listeners are attached.
    video.preload = 'auto';
    video.load();
    scheduleFrame();
  }

  setupScrollVideo('hero-video', 'hero-scroll-container');
  setupScrollVideo('transition-video', 'video-transition-container');

  // Orçamento Form Validation
  const orcamentoForm = document.getElementById('orcamento-form');
  if (orcamentoForm) {
    const errorMessageContainer = document.getElementById('form-error-message');
    
    orcamentoForm.addEventListener('submit', function(e) {
      let isValid = true;
      let firstInvalidField = null;
      let missingFieldNames = [];
      const requiredFields = orcamentoForm.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        const value = field.value.trim();
        let isEmpty = !value;
        let isInvalidEmail = field.type === 'email' && value && field.validity.typeMismatch;

        if (isEmpty || isInvalidEmail) {
          isValid = false;
          field.classList.add('input-error');
          if (!firstInvalidField) firstInvalidField = field;
          
          const label = orcamentoForm.querySelector(`label[for="${field.id}"]`);
          let name = label ? label.textContent : (field.placeholder || field.name);
          
          if (isInvalidEmail) {
             name += " (informe um endereço válido)";
          }
          missingFieldNames.push(name);
        } else {
          field.classList.remove('input-error');
        }
      });

      if (!isValid) {
        e.preventDefault(); // Stop submission
        
        // Populate and show modal
        const listContainer = document.getElementById('missing-fields-list');
        if (listContainer) {
          listContainer.innerHTML = '';
          missingFieldNames.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            li.style.marginBottom = '0.5rem';
            listContainer.appendChild(li);
          });
        }
        
        const modal = document.getElementById('validation-modal');
        if (modal) {
          modal.classList.add('active');
        }

        if (errorMessageContainer) {
          errorMessageContainer.style.display = 'block';
          errorMessageContainer.textContent = 'Por favor, preencha todos os campos obrigatórios destacados em vermelho.';
        }
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
      } else {
        if (errorMessageContainer) {
          errorMessageContainer.style.display = 'none';
        }
      }
    });

    // Remove error class on input
    const inputs = orcamentoForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        const value = this.value.trim();
        const isEmail = this.type === 'email';
        
        if (value && (!isEmail || !this.validity.typeMismatch)) {
          this.classList.remove('input-error');
        }
        
        // Hide general message if all required fields are now filled and valid
        const allValid = Array.from(orcamentoForm.querySelectorAll('[required]')).every(f => {
          const v = f.value.trim();
          return v !== '' && (f.type !== 'email' || !f.validity.typeMismatch);
        });
        
        if (allValid && errorMessageContainer) {
           errorMessageContainer.style.display = 'none';
        }
      });
    });
  }
});

// Catalog Tab Switching Logic
function trocarCategoria(categoriaId) {
  const selectedCategory = document.getElementById(categoriaId);
  if (!selectedCategory || !selectedCategory.classList.contains('categoria')) return;
  // Update buttons
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.categoria === categoriaId));

  // Update categories
  const categorias = document.querySelectorAll('.categoria');
  categorias.forEach(cat => cat.classList.remove('active'));
  selectedCategory.classList.add('active');
}

// WhatsApp Redirect Logic
function pedirProduto(produtoInfo) {
  const mensagem = `Olá, gostaria de pedir o produto: ${produtoInfo}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

// Mobile Menu Toggle Logic
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  const menuToggle = document.querySelector('.menu-toggle');
  if (navLinks) {
    const isActive = navLinks.classList.toggle('active');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', isActive);
    }
  }
}



// Criar e gerenciar o botão "Voltar ao Topo" dinamicamente
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Function to close modal
window.closeValidationModal = function() {
  const modal = document.getElementById('validation-modal');
  if (modal) {
    modal.classList.remove('active');
  }
};

// Opção 3: Modal Fullscreen do Produto
window.abrirModal = function(img, nome, desc, preco) {
  const modal = document.getElementById('produto-modal');
  if (!modal) return;
  document.getElementById('modal-img').src = img;
  document.getElementById('modal-nome').textContent = nome;
  document.getElementById('modal-desc').textContent = desc;
  document.getElementById('modal-preco').textContent = preco;
  document.getElementById('modal-btn-wpp').onclick = function() {
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Olá! Tenho interesse no produto: ' + nome + ' - ' + preco), '_blank');
  };
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.fecharModal = function() {
  const modal = document.getElementById('produto-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') fecharModal();
});

// ====== Reviews Carousel ======
(function() {
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track || !dotsContainer) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoPlayInterval = null;

  function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, totalSlides - getSlidesPerView());
  }

  function getTotalDots() {
    return getMaxIndex() + 1;
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const total = getTotalDots();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function updateTrack() {
    const slideWidth = 100 / getSlidesPerView();
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    updateDots();
    updateButtons();
  }

  function updateButtons() {
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= getMaxIndex();
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
    updateTrack();
  }

  // Global functions for onclick
  window.carouselPrev = function() {
    goToSlide(currentIndex - 1);
    resetAutoPlay();
  };

  window.carouselNext = function() {
    goToSlide(currentIndex + 1);
    resetAutoPlay();
  };

  // Auto-play
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      if (currentIndex >= getMaxIndex()) {
        goToSlide(0);
      } else {
        goToSlide(currentIndex + 1);
      }
    }, 4000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Pause auto-play on hover
  const carousel = document.getElementById('reviews-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carousel.addEventListener('mouseleave', () => startAutoPlay());
  }

  // Touch / Drag support
  let isDragging = false;
  let startX = 0;
  let dragDelta = 0;

  track.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    track.style.transition = 'none';
    clearInterval(autoPlayInterval);
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    dragDelta = e.touches[0].clientX - startX;
    const slideWidth = 100 / getSlidesPerView();
    const currentOffset = currentIndex * slideWidth;
    const dragPercent = (dragDelta / track.parentElement.offsetWidth) * 100;
    track.style.transform = `translateX(${-currentOffset + dragPercent}%)`;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    
    const threshold = 50;
    if (dragDelta < -threshold && currentIndex < getMaxIndex()) {
      goToSlide(currentIndex + 1);
    } else if (dragDelta > threshold && currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else {
      updateTrack(); // snap back
    }
    dragDelta = 0;
    startAutoPlay();
  });

  // Responsive: rebuild on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentIndex > getMaxIndex()) {
        currentIndex = getMaxIndex();
      }
      buildDots();
      updateTrack();
    }, 200);
  });

  // Initialize
  buildDots();
  updateTrack();
  startAutoPlay();
})();


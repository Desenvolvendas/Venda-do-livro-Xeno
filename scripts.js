/* ==========================================================================
   INTERATIVIDADE DA LANDING PAGE "FALANDO COM OS CÃES" — XENO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. PARTICULAS FLUTUANTES (CANVAS)
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 45;
    
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.6;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.4 + 0.1; // Flutua para cima
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.6 ? '#C8A24A' : '#8B1A1A'; // Dourado ou Vermelho
      }
      
      update() {
        this.x += this.speedX;
        this.y -= this.speedY;
        
        // Loop se sair da tela
        if (this.y < -10) {
          this.y = canvas.height + 10;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < -10 || this.x > canvas.width + 10) {
          this.x = Math.random() * canvas.width;
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1.0;
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // 2. HOLOFOTE DO CURSOR (GLOW EFFECT) & GLOW OVERLAY NO HERO
  document.addEventListener('mousemove', (e) => {
    // Efeito para os Cards com Glow (.glow-card)
    const cards = document.querySelectorAll('.glow-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    
    // Efeito de Holofote no container do Hero
    const heroMedia = document.querySelector('.hero-media-wrapper');
    if (heroMedia) {
      const rect = heroMedia.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const glow = heroMedia.querySelector('.hero-glow-overlay');
      if (glow) {
        glow.style.setProperty('--glow-x', `${x}%`);
        glow.style.setProperty('--glow-y', `${y}%`);
      }
    }
  });

  // 3. PROGRESSO E REVELAÇÃO DA TIMELINE (JORNADA)
  const timeline = document.querySelector('.timeline-container');
  const progressLine = document.getElementById('timeline-progress');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  function handleTimeline() {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calcula a porcentagem do preenchimento da linha da timeline
    const startY = rect.top - viewportHeight * 0.6;
    const totalH = rect.height;
    
    let percent = 0;
    if (startY < 0) {
      percent = Math.min(100, Math.max(0, (-startY / (totalH * 0.85)) * 100));
    }
    if (progressLine) {
      progressLine.style.height = `${percent}%`;
    }
    
    // Ativa os cards conforme entram na tela
    timelineItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < viewportHeight * 0.78) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  window.addEventListener('scroll', handleTimeline);
  window.addEventListener('resize', handleTimeline);
  handleTimeline(); // Chamada inicial

  // 4. BEFORE/AFTER SLIDER INTERATIVO
  const slider = document.getElementById('transformation-slider');
  if (slider) {
    const afterBox = document.getElementById('slider-after-box');
    const line = document.getElementById('slider-line');
    const btn = document.getElementById('slider-button');
    
    let isDragging = false;
    
    function setSliderPosition(xVal) {
      const rect = slider.getBoundingClientRect();
      let posX = xVal - rect.left;
      let percentage = (posX / rect.width) * 100;
      
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      
      if (afterBox) afterBox.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      if (line) line.style.left = `${percentage}%`;
      if (btn) btn.style.left = `${percentage}%`;
    }
    
    function startDragging(e) {
      isDragging = true;
      e.preventDefault();
    }
    
    function stopDragging() {
      isDragging = false;
    }
    
    function drag(e) {
      if (!isDragging) return;
      let clientX;
      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }
      setSliderPosition(clientX);
    }
    
    if (btn) {
      btn.addEventListener('mousedown', startDragging);
      btn.addEventListener('touchstart', startDragging, { passive: true });
    }
    
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, { passive: false });
    
    // Move ao clicar em qualquer ponto do slider
    slider.addEventListener('click', (e) => {
      if (e.target !== btn && !btn.contains(e.target)) {
        setSliderPosition(e.clientX);
      }
    });
  }

  // 5. MOCKUP DO LIVRO 3D (MOUSE TILT E REFLEXO)
  const bookContainer = document.getElementById('interactive-book-container');
  const book3d = document.querySelector('.book-3d');
  if (bookContainer && book3d) {
    let targetRotateX = 10;
    let targetRotateY = -20;
    let currentRotateX = 10;
    let currentRotateY = -20;
    const lerp = 0.08;
    
    bookContainer.addEventListener('mousemove', (e) => {
      const rect = bookContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const normX = (x / rect.width) * 2 - 1; // -1 a 1
      const normY = (y / rect.height) * 2 - 1; // -1 a 1
      
      targetRotateY = normX * 30 - 20; // Rotação Y dinâmica
      targetRotateX = -normY * 25 + 10; // Rotação X dinâmica
    });
    
    bookContainer.addEventListener('mouseleave', () => {
      targetRotateX = 10;
      targetRotateY = -20;
    });
    
    function updateBookTilt() {
      currentRotateX += (targetRotateX - currentRotateX) * lerp;
      currentRotateY += (targetRotateY - currentRotateY) * lerp;
      book3d.style.transform = `rotateY(${currentRotateY}deg) rotateX(${currentRotateX}deg)`;
      requestAnimationFrame(updateBookTilt);
    }
    updateBookTilt();
  }

  // 6. VIDEO TESTIMONIAL PLAYERS CUSTOMIZADOS
  const videoContainers = document.querySelectorAll('.video-player-container');
  videoContainers.forEach(container => {
    const video = container.querySelector('video');
    const overlay = container.querySelector('.video-overlay');
    
    if (video && overlay) {
      overlay.addEventListener('click', () => {
        // Pausa todos os outros players ativos
        videoContainers.forEach(other => {
          if (other !== container) {
            const otherVid = other.querySelector('video');
            if (otherVid) otherVid.pause();
            other.classList.remove('playing');
          }
        });
        
        video.play();
        container.classList.add('playing');
      });
      
      video.addEventListener('click', () => {
        video.pause();
        container.classList.remove('playing');
      });
      
      video.addEventListener('pause', () => {
        container.classList.remove('playing');
      });
      
      video.addEventListener('play', () => {
        container.classList.add('playing');
      });
    }
  });

  // 7. DIAGNOSTIC QUIZ (COM MEDIDOR DE ESTRESSE PROGRESSIVO)
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizOptions = document.querySelectorAll('.quiz-option');
  const btnPrev = document.getElementById('quiz-btn-prev');
  const btnNext = document.getElementById('quiz-btn-next');
  const stressFill = document.getElementById('stress-fill');
  const stressValLabel = document.getElementById('stress-val');
  const quizResultBox = document.getElementById('quiz-result');
  
  let currentStep = 0;
  let selectedAnswers = {}; // Mapeia o index do step para o peso da resposta
  const baseStress = 15; // Estresse baseline mínimo do cão
  
  function updateQuizUI() {
    // Exibe a etapa atual
    quizSteps.forEach((step, idx) => {
      if (idx === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    // Botão Voltar visível a partir do segundo passo
    if (currentStep === 0) {
      btnPrev.style.visibility = 'hidden';
    } else {
      btnPrev.style.visibility = 'visible';
    }
    
    // Modifica o texto do botão avançar no último passo
    if (currentStep === quizSteps.length - 1) {
      btnNext.textContent = "Gerar Diagnóstico";
    } else {
      btnNext.textContent = "Próxima Pergunta";
    }
    
    // Desabilita "Próxima" se a pergunta atual não foi respondida
    if (selectedAnswers[currentStep] !== undefined) {
      btnNext.removeAttribute('disabled');
      btnNext.style.opacity = '1';
    } else {
      btnNext.setAttribute('disabled', 'true');
      btnNext.style.opacity = '0.5';
    }
    
    // Atualiza o medidor de estresse com base nas respostas dadas até agora
    let calculatedStress = baseStress;
    Object.keys(selectedAnswers).forEach(stepIdx => {
      calculatedStress += selectedAnswers[stepIdx];
    });
    
    if (calculatedStress > 95) calculatedStress = 95; // Limita o valor visual a 95% antes do fim
    
    if (stressFill) {
      stressFill.style.width = `${calculatedStress}%`;
      if (calculatedStress >= 70) {
        stressFill.classList.add('danger-pulse');
        if (stressValLabel) stressValLabel.style.color = '#8B1A1A';
      } else {
        stressFill.classList.remove('danger-pulse');
        if (stressValLabel) stressValLabel.style.color = '#C8A24A';
      }
    }
    
    if (stressValLabel) {
      stressValLabel.textContent = `${calculatedStress}%`;
    }
  }
  
  // Trata clique nas opções
  quizOptions.forEach(option => {
    option.addEventListener('click', function() {
      const parentStep = this.closest('.quiz-step');
      const stepIdx = Array.from(quizSteps).indexOf(parentStep);
      const stressWeight = parseInt(this.getAttribute('data-weight')) || 10;
      
      // Remove a seleção de outras opções da mesma pergunta
      parentStep.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      
      // Seleciona a opção clicada
      this.classList.add('selected');
      selectedAnswers[stepIdx] = stressWeight;
      
      updateQuizUI();
    });
  });
  
  // Navegação: Botão Avançar
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (selectedAnswers[currentStep] === undefined) return;
      
      if (currentStep < quizSteps.length - 1) {
        currentStep++;
        updateQuizUI();
      } else {
        // Chegou ao fim do questionário! Revela o diagnóstico
        revealQuizResult();
      }
    });
  }
  
  // Navegação: Botão Voltar
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateQuizUI();
      }
    });
  }
  
  function revealQuizResult() {
    // Esconde os passos de pergunta e a barra de navegação inferior do quiz
    quizSteps.forEach(step => step.classList.remove('active'));
    document.querySelector('.quiz-navigation').style.display = 'none';
    
    // Calcula o estresse final total
    let finalStress = baseStress;
    Object.keys(selectedAnswers).forEach(key => {
      finalStress += selectedAnswers[key];
    });
    
    if (finalStress > 100) finalStress = 100;
    
    // Atualiza a barra de estresse final para piscar no talo
    if (stressFill) {
      stressFill.style.width = `${finalStress}%`;
      stressFill.classList.add('danger-pulse');
    }
    if (stressValLabel) {
      stressValLabel.textContent = `${finalStress}%`;
    }
    
    // Determina a classificação do alerta
    let classification = "RISCO MODERADO";
    let desc = "Seu cão apresenta comportamentos de estresse leve a moderado. Algumas barreiras de comunicação já começaram a surgir, e se não tratadas agora, podem evoluir para reatividade crônica ou agressividade severa.";
    
    if (finalStress >= 65 && finalStress < 85) {
      classification = "ALERTA: RISCO ALTO";
      desc = "O nível de incompreensão entre você e seu cão é preocupante. Ele está manifestando sinais claros de reatividade, dominância ou ansiedade intensa. O comportamento dele está gerando instabilidade na casa e limitando seus passeios.";
    } else if (finalStress >= 85) {
      classification = "CRÍTICO: RISCO EXTREMO";
      desc = "Seu cão se encontra em um estado de alerta contínuo e exaustão psicológica. A agressividade, a reatividade severa ou a destruição são tentativas desesperadas de expressar frustração física e mental. Sem intervenção imediata baseada na psicologia natural de matilha, incidentes graves podem ocorrer.";
    }
    
    // Preenche a caixa de resultado
    const resultTitle = quizResultBox.querySelector('.quiz-result-title');
    const resultDesc = quizResultBox.querySelector('.quiz-result-desc');
    
    if (resultTitle) resultTitle.textContent = `${classification} (${finalStress}% de Sobrecarga)`;
    if (resultDesc) resultDesc.textContent = desc;
    
    // Armazena o estresse no campo oculto do form, caso queira enviar
    const hiddenStressInput = document.getElementById('dog-stress-input');
    if (hiddenStressInput) {
      hiddenStressInput.value = `${finalStress}%`;
    }
    
    // Exibe a caixa de resultado
    if (quizResultBox) {
      quizResultBox.classList.add('active');
    }
  }
  
  // Envio do Form de Lead
  const leadForm = document.getElementById('quiz-lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('owner-name').value.trim();
      const email = document.getElementById('owner-email').value.trim();
      const dogName = document.getElementById('dog-name').value.trim();
      
      if (name && email && dogName) {
        // Redireciona o usuário para a área de pré-venda (checkout) com âncora
        localStorage.setItem('xeno_lead_name', name);
        localStorage.setItem('xeno_lead_dog', dogName);
        
        // Rolagem suave até a oferta
        const preSaleSection = document.getElementById('pre-sale');
        if (preSaleSection) {
          preSaleSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
  
  // Inicialização do Quiz
  updateQuizUI();

  // 8. ACORDEÃO DE FAQS
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    
    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Fecha todos os outros acordeões
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherContent = other.querySelector('.faq-content');
            if (otherContent) otherContent.style.maxHeight = '0px';
          }
        });
        
        // Alterna o atual
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0px';
        } else {
          item.classList.add('active');
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
      });
    }
  });

  // 9. FLOATING CTA VISIBILITY ON SCROLL
  const floatingCta = document.querySelector('.floating-cta');
  if (floatingCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 850) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    });
  }

  // 10. SCROLL REVEAL (EFEITO CINEMATOGRÁFICO DE ENTRADA)
  const revealElements = document.querySelectorAll('.scroll-reveal');
  function checkReveal() {
    const triggerPoint = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerPoint) {
        el.classList.add('reveal-active');
      }
    });
  }
  window.addEventListener('scroll', checkReveal);
  checkReveal(); // Chamada inicial para elementos visíveis no carregamento

});

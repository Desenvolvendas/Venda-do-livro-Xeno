document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PARTICULAS FLUTUANTES (CANVAS BACKGROUND)
    const canvas = document.getElementById('canvas-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;

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
                this.size = Math.random() * 1.8 + 0.6;
                this.speedX = Math.random() * 0.2 - 0.1;
                this.speedY = Math.random() * 0.35 + 0.05; // Sobe lentamente
                this.opacity = Math.random() * 0.3 + 0.1;
                this.color = Math.random() > 0.5 ? '#c8a24a' : '#1e3a8a'; // Dourado ou azul
            }

            update() {
                this.x += this.speedX;
                this.y -= this.speedY;

                // Reseta se passar do topo da tela
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
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // 2. LÓGICA DOS MODAIS (ABERTURA & FECHAMENTO)
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[href^="#"][href*="-modal"]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('href').substring(1);
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Bloqueia rolagem de fundo
            }
        });
    });

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        
        const closeModal = () => {
            modal.classList.remove('active');
            // Desbloqueia rolagem apenas se não houver outros modais abertos
            if (document.querySelectorAll('.modal.active').length === 0) {
                document.body.style.overflow = '';
            }
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Fecha ao clicar fora do conteúdo
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });

    // 3. MOCKUP DO LIVRO 3D INTERATIVO (MOUSE TILT E ROTATION)
    const bookContainer = document.getElementById('interactive-book-container');
    const book3d = document.querySelector('.book-3d');

    if (bookContainer && book3d) {
        let rotateX = 10;
        let rotateY = -20;
        let targetX = 10;
        let targetY = -20;
        const lerp = 0.08; // Suavização do movimento

        bookContainer.addEventListener('mousemove', (e) => {
            const rect = bookContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Normaliza coordenadas de -1 a 1
            const normX = (x / rect.width) * 2 - 1;
            const normY = (y / rect.height) * 2 - 1;

            targetY = normX * 35 - 20; // Amplitude de rotação Y
            targetX = -normY * 25 + 10; // Amplitude de rotação X
        });

        bookContainer.addEventListener('mouseleave', () => {
            // Retorna ao estado inicial suavemente
            targetX = 10;
            targetY = -20;
        });

        function animateTilt() {
            rotateX += (targetX - rotateX) * lerp;
            rotateY += (targetY - rotateY) * lerp;
            book3d.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            requestAnimationFrame(animateTilt);
        }
        animateTilt();
    }

    // 4. ROLAGEM SUAVE NOS LINKS ANCORADOS
    const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href*="-modal"])');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 5. SCROLL REVEAL (REVELAÇÃO DOS ELEMENTOS NA TELA)
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
    checkReveal(); // Execução inicial para os itens visíveis no topo
});

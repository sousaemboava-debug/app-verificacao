// JavaScript - Far Cry Theme, Animações e Lógica de Elegibilidade

document.addEventListener('DOMContentLoaded', () => {
    // Referências dos Elementos
    const canvas = document.getElementById('savanaCanvas');
    const ctx = canvas.getContext('2d');
    const introScreen = document.getElementById('introScreen');
    const progressBar = document.getElementById('progressBar');
    const btnStart = document.getElementById('btnStart');
    const mainContainer = document.getElementById('mainContainer');
    const formCandidato = document.getElementById('formCandidato');
    
    // Modal
    const modalResultado = document.getElementById('modalResultado');
    const modalCard = modalResultado.querySelector('.modal-card');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const modalMessage = document.getElementById('modalMessage');
    const btnCloseModal = document.getElementById('btnCloseModal');

    /* ======================================================
       1. ANIMAÇÃO DO CANVAS (Savana Africana em Guerra)
    ====================================================== */
    let width, height;
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Partículas de brasas / fagulhas voando no ar
    const embers = [];
    const emberCount = 70;

    for (let i = 0; i < emberCount; i++) {
        embers.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            speedY: -(Math.random() * 1.5 + 0.5),
            speedX: (Math.random() - 0.5) * 1.2,
            opacity: Math.random() * 0.8 + 0.2,
            color: Math.random() > 0.3 ? '#ffcc00' : '#ff3300'
        });
    }

    // Desenhar Silhueta da Savana (Acácia e terreno)
    function drawSavanaSilhouette() {
        // Terreno ondulado
        ctx.fillStyle = '#050709';
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, height - 80);
        ctx.quadraticCurveTo(width * 0.25, height - 120, width * 0.5, height - 70);
        ctx.quadraticCurveTo(width * 0.75, height - 30, width, height - 90);
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Árvore Acácia (Lado direito da tela)
        const treeX = width * 0.82;
        const treeBaseY = height - 60;
        
        ctx.fillStyle = '#050709';
        ctx.beginPath();
        // Tronco
        ctx.moveTo(treeX - 12, treeBaseY);
        ctx.lineTo(treeX - 6, treeBaseY - 140);
        ctx.lineTo(treeX + 8, treeBaseY - 140);
        ctx.lineTo(treeX + 14, treeBaseY);
        ctx.fill();

        // Copas planas da Acácia
        ctx.beginPath();
        ctx.ellipse(treeX - 40, treeBaseY - 150, 70, 14, 0, 0, Math.PI * 2);
        ctx.ellipse(treeX + 20, treeBaseY - 175, 90, 18, 0, 0, Math.PI * 2);
        ctx.ellipse(treeX + 70, treeBaseY - 140, 50, 12, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Loop de Animação
    function animateBackground() {
        // Fundo com gradiente de céu de guerra/fogo
        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        bgGradient.addColorStop(0, '#0a0d12');
        bgGradient.addColorStop(0.5, '#1c1208');
        bgGradient.addColorStop(1, '#3a1700');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Atualizar e desenhar brasas
        embers.forEach(ember => {
            ember.y += ember.speedY;
            ember.x += ember.speedX + Math.sin(ember.y * 0.01) * 0.5;

            if (ember.y < -10) {
                ember.y = height + 10;
                ember.x = Math.random() * width;
            }

            ctx.save();
            ctx.globalAlpha = ember.opacity;
            ctx.fillStyle = ember.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = ember.color;
            ctx.beginPath();
            ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Desenhar silhueta da Savana
        drawSavanaSilhouette();

        requestAnimationFrame(animateBackground);
    }
    animateBackground();


    /* ======================================================
       2. ANIMAÇÃO DE ENTRADA (BOOT / INTRO)
    ====================================================== */
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        progressBar.style.width = `${progress}%`;
    }, 200);

    btnStart.addEventListener('click', () => {
        // Ocultar Tela de Intro com Fade Out
        introScreen.style.opacity = '0';
        introScreen.style.visibility = 'hidden';

        // Revelar Formulário
        setTimeout(() => {
            mainContainer.classList.remove('hidden');
        }, 300);
    });


    /* ======================================================
       3. VERIFICAÇÃO DE ELEGIBILIDADE E POPUP MODAL
    ====================================================== */
    formCandidato.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const idade = parseInt(document.getElementById('idade').value);
        const altura = parseFloat(document.getElementById('altura').value);

        // Limpar estilos anteriores do modal
        modalCard.classList.remove('aprovado', 'reprovado');

        // Critério: Altura >= 1.70m E Idade >= 18 anos
        const isApto = altura >= 1.70 && idade >= 18;

        if (isApto) {
            modalCard.classList.add('aprovado');
            modalTitle.textContent = "CREDENCIAIS APROVADAS";
            modalIcon.textContent = "⚔️";
            modalMessage.textContent = `Parabéns, ${nome}! Você pode prosseguir no processo para a vaga!`;
        } else {
            modalCard.classList.add('reprovado');
            modalTitle.textContent = "CREDENCIAIS REJEITADAS";
            modalIcon.textContent = "🚫";
            modalMessage.textContent = `Infelizmente você não é apto à vaga, ${nome}.`;
        }

        // Exibir Popup Modal
        modalResultado.classList.remove('hidden');
    });

    // Fechar Modal
    btnCloseModal.addEventListener('click', () => {
        modalResultado.classList.add('hidden');
    });

    modalResultado.addEventListener('click', (e) => {
        if (e.target === modalResultado) {
            modalResultado.classList.add('hidden');
        }
    });
});
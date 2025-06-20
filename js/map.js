// js/map.js

const map = {
    canvas: null,
    ctx: null,
    // Resolução lógica do mapa (pixels de jogo)
    logicalWidth: 160,
    logicalHeight: 90,
    // Escala de renderização (quantos pixels da tela representam 1 pixel lógico)
    scale: 5, // 160*5 = 800, 90*5 = 450 - corresponde ao tamanho do canvas no CSS

    building: {
        x: 70, y: 30, width: 20, height: 30, color: '#8a2be2' // Posição e tamanho do prédio
    },
    road: [ // Pontos da estrada (apenas uma linha simples por enquanto)
        { x: 0, y: 45 },
        { x: 60, y: 45 },
        { x: 60, y: 70 },
        { x: 100, y: 70 },
        { x: 100, y: 45 },
        { x: 160, y: 45 }
    ],
    trucks: [], // Array para gerenciar caminhões animados
    truckSize: { width: 8, height: 6 }, // Tamanho do caminhão em pixels lógicos
    truckSpeed: 0.5, // Velocidade do caminhão (pixels lógicos por frame)


    init: function() {
        this.canvas = document.getElementById('mapCanvas');
        if (!this.canvas) {
            console.error("Canvas 'mapCanvas' not found!");
            return;
        }
        this.ctx = this.canvas.getContext('2d');

        // Configura a resolução interna do canvas para a resolução lógica
        this.canvas.width = this.logicalWidth;
        this.canvas.height = this.logicalHeight;

        // Inicia o loop de animação
        this.animate();
    },

    // Desenha tudo no canvas
    draw: function() {
        const ctx = this.ctx;
        const scale = this.scale;

        // Limpa o canvas
        ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

        // Desenha o fundo (grama/terreno)
        ctx.fillStyle = 'rgba(0, 80, 0, 0.6)'; // Verde escuro semi-transparente
        ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);

        // Desenha a estrada (simples linha grossa)
        ctx.strokeStyle = '#444'; // Cor da estrada
        ctx.lineWidth = 10; // Largura da estrada
        ctx.beginPath();
        ctx.moveTo(this.road[0].x, this.road[0].y);
        for (let i = 1; i < this.road.length; i++) {
            ctx.lineTo(this.road[i].x, this.road[i].y);
        }
        ctx.stroke();
        ctx.lineWidth = 1; // Volta para largura padrão

        // Desenha o prédio "NEW CALDERA"
        ctx.fillStyle = this.building.color;
        ctx.fillRect(this.building.x, this.building.y, this.building.width, this.building.height);

        // Desenha os caminhões
        ctx.fillStyle = '#b0b0b0'; // Cor dos caminhões (cinza claro por enquanto)
        this.trucks.forEach(truck => {
            ctx.fillRect(truck.x, truck.y, this.truckSize.width, this.truckSize.height);
             // Desenha um pixel para representar a cabine
             ctx.fillStyle = '#555'; // Cor da cabine
             // Posição da cabine depende da direção, mas por enquanto vamos simplificar
             ctx.fillRect(truck.x + this.truckSize.width - 2, truck.y + 1, 2, 2);
             ctx.fillStyle = '#b0b0b0'; // Volta a cor
        });
    },

    // Atualiza a posição dos caminhões
    update: function() {
        // Lógica de animação dos caminhões (ainda a ser implementada)
        // Por enquanto, apenas remove caminhões que saem da tela
        this.trucks = this.trucks.filter(truck => {
            // Exemplo simples: caminhões se movem para a direita
            truck.x += this.truckSpeed;
            // Remove se sair da tela
            return truck.x < this.logicalWidth;
        });
    },

    // Loop principal de animação
    animate: function() {
        map.update();
        map.draw();
        requestAnimationFrame(map.animate.bind(map)); // Mantém o loop de animação
    },

    // Função para adicionar um caminhão animado
    addTruck: function() {
        // Adiciona um caminhão começando na esquerda da tela (fora)
        this.trucks.push({
            x: -this.truckSize.width, // Começa fora da tela à esquerda
            y: 45 - (this.truckSize.height / 2), // Centralizado na estrada
            state: 'entering', // Estado inicial
            progress: 0 // Progresso na animação/caminho
        });
    }
};

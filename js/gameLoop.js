// js/gameLoop.js

const gameLoop = {
    intervalId: null, // Para armazenar o ID do setInterval

    start: function() {
        if (this.intervalId) {
            console.warn("Game loop already running!");
            return;
        }

        // O loop principal que roda a cada segundo
        this.intervalId = setInterval(() => {
            // 1. Ganho básico de dinheiro por segundo
            state.money += state.incomePerSecond;

            // 2. Processar Fila de Produção
            const now = Date.now();
            // Filtra produções que terminaram
            const finishedProductions = state.productionQueue.filter(p => now >= p.endTime);
            // Mantém apenas as produções que ainda não terminaram
            state.productionQueue = state.productionQueue.filter(p => now < p.endTime);

            finishedProductions.forEach(p => {
                const optionConfig = config.productionOptions[p.type];
                if (optionConfig) {
                    if (optionConfig.yieldType === 'money') {
                        state.money += optionConfig.yieldAmount;
                        notifications.addNotification(`Produção de "${p.type}" concluída! Recebido $${optionConfig.yieldAmount} sujo.`);
                    }
                     // Implementar outros yieldTypes se necessário
                }
            });

            // 3. Decaimento do Heat da Polícia
            // Decaimento base + redução de atributo (Intimidação)
            const baseDecay = config.policeHeatDecayPerSecond;
            const intimidationLevel = state.attributes.intimidation.level;
            const intimidationReduction = (config.attributeEffects.intimidation[intimidationLevel] || {}).heatReduction || 0;
            const totalDecay = baseDecay + intimidationReduction;

            state.policeHeat = Math.max(0, state.policeHeat - totalDecay); // Heat não pode ser menor que 0


            // 4. Atualizar a UI (tudo que muda a cada segundo ou baseado no estado)
            ui.updateUI();
            // Atualizar custos (para desabilitar botões se o dinheiro mudar)
            ui.updateCosts();


        }, 1000); // Roda a cada 1000 milissegundos (1 segundo)
    },

    stop: function() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log("Game loop stopped.");
        }
    }
};

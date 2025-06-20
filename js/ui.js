// js/ui.js

const ui = {
    updateUI: function() {
        document.getElementById('money').innerText = state.money.toFixed(2); // Exibe com 2 casas decimais
        document.getElementById('launderedMoney').innerText = state.launderedMoney.toFixed(2);
        document.getElementById('incomePerSecond').innerText = state.incomePerSecond.toFixed(2);

        // Atualiza exibição dos atributos
        for (const attr in state.attributes) {
            const levelElement = document.getElementById(`attr-${attr}-level`);
            const bonusElement = document.getElementById(`attr-${attr}-bonus`);
            const costElement = document.getElementById(`attr-${attr}-cost`);
            const upgradeButton = document.querySelector(`.upgrade-button[data-attribute="${attr}"]`);

            if (levelElement) levelElement.innerText = state.attributes[attr].level;
            if (bonusElement) {
                 // Encontra o bônus para o nível atual do atributo
                 const currentBonus = config.attributeBonuses[attr][state.attributes[attr].level] || 0;
                 bonusElement.innerText = currentBonus.toFixed(2);
            }

            // Atualiza o custo do próximo nível e estado do botão
            const nextLevel = state.attributes[attr].level + 1;
            const nextLevelCost = config.attributeCosts[attr][state.attributes[attr].level]; // Custo para *ir para* o próximo nível

            if (costElement) {
                if (nextLevelCost !== undefined) {
                     costElement.innerText = nextLevelCost.toFixed(2);
                     if (upgradeButton) {
                         upgradeButton.disabled = state.launderedMoney < nextLevelCost;
                     }
                } else {
                     costElement.innerText = 'MAX'; // Indica que atingiu o nível máximo configurado
                     if (upgradeButton) {
                         upgradeButton.disabled = true; // Desabilita o botão se for nível máximo
                     }
                }
            }
        }

        // Atualiza o custo da lavagem e estado do botão
        const washCostElement = document.getElementById('wash-cost');
        const washButton = document.getElementById('wash-money-button');
        if (washCostElement) {
            washCostElement.innerText = config.washCost.toFixed(2);
        }
        if (washButton) {
            washButton.disabled = state.money < config.washCost;
        }
    },
     // Nova função para atualizar apenas os custos, útil na inicialização
     updateCosts: function() {
         const washCostElement = document.getElementById('wash-cost');
         if (washCostElement) {
             washCostElement.innerText = config.washCost.toFixed(2);
         }

         for (const attr in state.attributes) {
             const costElement = document.getElementById(`attr-${attr}-cost`);
             const nextLevelCost = config.attributeCosts[attr][state.attributes[attr].level]; // Custo para *ir para* o próximo nível
              const upgradeButton = document.querySelector(`.upgrade-button[data-attribute="${attr}"]`);

             if (costElement) {
                 if (nextLevelCost !== undefined) {
                      costElement.innerText = nextLevelCost.toFixed(2);
                      if (upgradeButton) {
                          upgradeButton.disabled = state.launderedMoney < nextLevelCost; // Desabilita se não tiver dinheiro
                      }
                 } else {
                      costElement.innerText = 'MAX';
                       if (upgradeButton) {
                           upgradeButton.disabled = true; // Desabilita se for nível máximo
                       }
                 }
             }
         }
     }
};

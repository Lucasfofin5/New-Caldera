// js/ui.js

const ui = {
    updateUI: function() {
        // Atualiza os valores no painel de status superior
        document.getElementById('money').innerText = state.money.toFixed(2);
        document.getElementById('launderedMoney').innerText = state.launderedMoney.toFixed(2);

        // Atualiza os valores no painel de resumo na aba Estado
        // Usando os novos IDs
        const moneySummaryElement = document.getElementById('money-summary');
        if (moneySummaryElement) moneySummaryElement.innerText = state.money.toFixed(2);

        const launderedMoneySummaryElement = document.getElementById('launderedMoney-summary');
        if (launderedMoneySummaryElement) launderedMoneySummaryElement.innerText = state.launderedMoney.toFixed(2);

        document.getElementById('incomePerSecond').innerText = state.incomePerSecond.toFixed(2);

        // Atualiza exibição dos atributos
        for (const attr in state.attributes) {
            const levelElement = document.getElementById(`attr-${attr}-level`);
            const bonusElement = document.getElementById(`attr-${attr}-bonus`);
            const costElement = document.getElementById(`attr-${attr}-cost`);
            const upgradeButton = document.querySelector(`.upgrade-button[data-attribute="${attr}"]`);

            if (levelElement) levelElement.innerText = state.attributes[attr].level;
            if (bonusElement) {
                 const currentBonus = config.attributeBonuses[attr][state.attributes[attr].level] || 0;
                 bonusElement.innerText = currentBonus.toFixed(2);
            }

            const nextLevelCost = config.attributeCosts[attr][state.attributes[attr].level];

            if (costElement) {
                if (nextLevelCost !== undefined) {
                     costElement.innerText = nextLevelCost.toFixed(2);
                     if (upgradeButton) {
                         upgradeButton.disabled = state.launderedMoney < nextLevelCost;
                     }
                } else {
                     costElement.innerText = 'MAX';
                     if (upgradeButton) {
                         upgradeButton.disabled = true;
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
             const nextLevelCost = config.attributeCosts[attr][state.attributes[attr].level];
              const upgradeButton = document.querySelector(`.upgrade-button[data-attribute="${attr}"]`);

             if (costElement) {
                 if (nextLevelCost !== undefined) {
                      costElement.innerText = nextLevelCost.toFixed(2);
                      if (upgradeButton) {
                          upgradeButton.disabled = state.launderedMoney < nextLevelCost;
                      }
                 } else {
                      costElement.innerText = 'MAX';
                       if (upgradeButton) {
                           upgradeButton.disabled = true;
                       }
                 }
             }
         }
     }
};

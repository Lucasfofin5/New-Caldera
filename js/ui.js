// js/ui.js

const ui = {
    updateUI: function() {
        // --- Atualiza Painéis Fixos Superiores ---
        document.getElementById('money').innerText = state.money.toFixed(2);
        document.getElementById('launderedMoney').innerText = state.launderedMoney.toFixed(2);

        // Barra de Polícia Heat
        const heatLevelElement = document.getElementById('heat-level');
        if (heatLevelElement) {
             // Garante que o heat não passe do máximo ou mínimo
             state.policeHeat = Math.max(0, Math.min(config.policeHeatMax, state.policeHeat));
             const heatPercent = (state.policeHeat / config.policeHeatMax) * 100;
             heatLevelElement.style.width = `${heatPercent}%`;
             // Opcional: Mudar cor da barra baseado no nível de heat
             if (state.policeHeat > config.policeHeatMax * 0.7) {
                  heatLevelElement.style.backgroundColor = config.error_color || '#ff0000'; // Vermelho
                  heatLevelElement.style.boxShadow = `0 0 6px ${config.error_color || '#ff0000'}`;
             } else if (state.policeHeat > config.policeHeatMax * 0.4) {
                  heatLevelElement.style.backgroundColor = config.info_color || '#ffff00'; // Amarelo
                   heatLevelElement.style.boxShadow = `0 0 6px ${config.info_color || '#ffff00'}`;
             } else {
                  heatLevelElement.style.backgroundColor = '#ff00ff'; // Roxo padrão
                   heatLevelElement.style.boxShadow = '0 0 6px #ff00ff';
             }
        }

         // Top Right Info (Risco/Corrupção Placeholder)
         const riskLevelElement = document.getElementById('risk-level');
         if(riskLevelElement) {
              // Exemplo simples: risco = nível de heat
              riskLevelElement.innerText = Math.round((state.policeHeat / config.policeHeatMax) * 100);
         }


        // --- Atualiza Conteúdo das Abas (Painel Principal) ---

        // Aba Estado (Painel de Gestão)
        const moneySummaryElement = document.getElementById('money-summary');
        if (moneySummaryElement) moneySummaryElement.innerText = state.money.toFixed(2);

        const launderedMoneySummaryElement = document.getElementById('launderedMoney-summary');
        if (launderedMoneySummaryElement) launderedMoneySummaryElement.innerText = state.launderedMoney.toFixed(2);

        document.getElementById('incomePerSecond').innerText = state.incomePerSecond.toFixed(2);


        // Aba Produção
        // Atualiza a UI da produção (nível, progresso, etc. - lógica a ser adicionada)
        // Por enquanto, apenas botões são gerenciados em updateCosts/setupActionButtons


        // Aba Lavagem
        const washCostDisplay = document.getElementById('wash-cost-display');
        if(washCostDisplay) washCostDisplay.innerText = config.washCost.toFixed(2);
        const washAmountDisplay = document.getElementById('wash-amount-display');
         if(washAmountDisplay) washAmountDisplay.innerText = config.washAmount.toFixed(2);
         const washRiskDisplay = document.getElementById('wash-risk-display');
          if(washRiskDisplay) washRiskDisplay.innerText = config.washBaseRisk.toFixed(0); // Exibe como inteiro %


        // Aba Segurança (Antes Atributos)
        for (const attr in state.attributes) {
            const levelElement = document.getElementById(`attr-${attr}-level`);
            const bonusElement = document.getElementById(`attr-${attr}-bonus`); // Pode ser nulo para atributos sem bônus de renda
            const costElement = document.getElementById(`attr-${attr}-cost`);
            const upgradeButton = document.querySelector(`.upgrade-button[data-attribute="${attr}"]`);
             // Elementos específicos para efeitos de atributos (ex: Intimidação)
             const heatReductionElement = document.getElementById(`attr-${attr}-heat-reduction`);
             const bribeBonusElement = document.getElementById(`attr-${attr}-bribe-bonus`);


            if (levelElement) levelElement.innerText = state.attributes[attr].level;

            if (bonusElement) { // Atualiza bônus de renda se existir
                 const currentBonus = config.attributeBonuses[attr][state.attributes[attr].level] || 0;
                 bonusElement.innerText = currentBonus.toFixed(2);
            }

            // Atualiza efeitos de atributos específicos
            if (attr === 'intimidation') {
                const currentHeatReduction = (config.attributeEffects[attr][state.attributes[attr].level] || {}).heatReduction || 0;
                if(heatReductionElement) heatReductionElement.innerText = currentHeatReduction.toFixed(1);

                const currentBribeBonus = (config.attributeEffects[attr][state.attributes[attr].level] || {}).bribeBonus || 0;
                 if(bribeBonusElement) bribeBonusElement.innerText = currentBribeBonus.toFixed(0);
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

        // Aba Relatório
        const reportIncomeElement = document.getElementById('report-income');
        if(reportIncomeElement) reportIncomeElement.innerText = state.incomePerSecond.toFixed(2); // Já temos isso no state
        const reportTotalLaunderedElement = document.getElementById('report-total-laundered');
         if(reportTotalLaunderedElement) reportTotalLaunderedElement.innerText = state.totalLaundered.toFixed(2);
        const reportLostPoliceElement = document.getElementById('report-lost-police');
         if(reportLostPoliceElement) reportLostPoliceElement.innerText = state.totalLostToPolice.toFixed(2);
         const reportCorruptionElement = document.getElementById('report-corruption-level');
          if(reportCorruptionElement) {
              // Lógica simples para "Nível de Corrupção" baseada no dinheiro lavado ou heat?
              // Por enquanto, placeholder
              let corruptionText = "Baixo";
              if (state.totalLaundered > 1000) corruptionText = "Médio";
              if (state.totalLaundered > 10000) corruptionText = "Alto";
              if (state.policeHeat > 50) corruptionText += " (Suspeito)"; // Exemplo
              reportCorruptionElement.innerText = corruptionText;
          }
          const reportBribeChanceElement = document.getElementById('report-bribe-chance');
           if(reportBribeChanceElement) reportBribeChanceElement.innerText = state.bribeChance.toFixed(0); // Exibe a chance atual


        // Aba Log (Notificações) - Conteúdo gerado por notifications.js
    },
     // updateCosts só precisa atualizar os elementos que exibem custos e o estado dos botões
     updateCosts: function() {
         // Atualiza o custo da lavagem e estado do botão
        const washCostDisplay = document.getElementById('wash-cost-display');
        const washButton = document.getElementById('wash-money-button');
        if (washCostDisplay) {
            washCostDisplay.innerText = config.washCost.toFixed(2);
        }
        if (washButton) {
            washButton.disabled = state.money < config.washCost;
        }

         // Atualiza custos de produção e estado dos botões
         const productionOptions = document.querySelectorAll('#production .production-option');
         productionOptions.forEach(optionElement => {
             const type = optionElement.dataset.productionType;
             const optionConfig = config.productionOptions[type];
             const button = optionElement.querySelector('.start-production-button');

             if (optionConfig && button) {
                 // Verifica se há slots de produção disponíveis
                 const slotsAvailable = state.productionQueue.length < config.productionSlots;
                 // Verifica se tem dinheiro limpo (custo de produção usa dinheiro limpo)
                 const hasMoney = state.launderedMoney >= optionConfig.costAmount;

                 button.disabled = !slotsAvailable || !hasMoney;

                 // Atualiza texto do botão ou status (opcional, mais complexo)
                 // button.innerText = `Iniciar (${optionConfig.costAmount} L)`;
             }
         });


         // Atualiza custos de atributos e estado dos botões (Segurança)
        for (const attr in state.attributes) {
            const costElement = document.getElementById(`attr-${attr}-cost`);
            const upgradeButton = document.querySelector(`.upgrade-button[data-attribute="${attr}"]`);

            if (costElement && upgradeButton) {
                const nextLevelCost = config.attributeCosts[attr][state.attributes[attr].level];

                if (nextLevelCost !== undefined) {
                     costElement.innerText = nextLevelCost.toFixed(2);
                     upgradeButton.disabled = state.launderedMoney < nextLevelCost;
                } else {
                     costElement.innerText = 'MAX';
                     upgradeButton.disabled = true;
                }
            }
        }
     }
};

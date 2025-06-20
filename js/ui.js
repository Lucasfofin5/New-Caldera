// js/ui.js

const ui = {
    updateUI: function() {
        // --- Atualiza Painéis Fixos Superiores ---
        document.getElementById('money').innerText = state.money.toFixed(2);
        document.getElementById('launderedMoney').innerText = state.launderedMoney.toFixed(2);

        // Barra de Polícia Heat
        const heatLevelElement = document.getElementById('heat-level');
        if (heatLevelElement) {
             state.policeHeat = Math.max(0, Math.min(config.policeHeatMax, state.policeHeat));
             const heatPercent = (state.policeHeat / config.policeHeatMax) * 100;
             heatLevelElement.style.width = `${heatPercent}%`;
             const heatBarColor = state.policeHeat > config.policeHeatMax * 0.7 ? (config.error_color || '#ff0000') :
                                   state.policeHeat > config.policeHeatMax * 0.4 ? (config.info_color || '#ffff00') :
                                   '#ff00ff'; // Roxo padrão
              heatLevelElement.style.backgroundColor = heatBarColor;
              heatLevelElement.style.boxShadow = `0 0 6px ${heatBarColor}`;
        }

         // Top Right Info (Risco - baseado no Heat)
         const riskLevelElement = document.getElementById('risk-level');
         if(riskLevelElement) {
              riskLevelElement.innerText = Math.round((state.policeHeat / config.policeHeatMax) * 100);
         }


        // --- Atualiza Conteúdo das Abas (Painel Principal) ---

        // Aba Estado (Painel de Gestão) - IDs já atualizados em HTML/CSS
        const moneySummaryElement = document.getElementById('money-summary');
        if (moneySummaryElement) moneySummaryElement.innerText = state.money.toFixed(2);

        const launderedMoneySummaryElement = document.getElementById('launderedMoney-summary');
        if (launderedMoneySummaryElement) launderedMoneySummaryElement.innerText = state.launderedMoney.toFixed(2);

        document.getElementById('incomePerSecond').innerText = state.incomePerSecond.toFixed(2);


        // Aba Produção - IDs para custos/retornos
        const prodBasicCostElement = document.getElementById('prod-basic-cost');
        if(prodBasicCostElement) prodBasicCostElement.innerText = config.productionOptions["basic-documents"].costAmount.toFixed(0); // Cost type info maybe later
        const prodBasicYieldElement = document.getElementById('prod-basic-yield');
        if(prodBasicYieldElement) prodBasicYieldElement.innerText = config.productionOptions["basic-documents"].yieldAmount.toFixed(0);

        const prodPremiumCostElement = document.getElementById('prod-premium-cost');
        if(prodPremiumCostElement) prodPremiumCostElement.innerText = config.productionOptions["premium-documents"].costAmount.toFixed(0); // Cost type info maybe later
        const prodPremiumYieldElement = document.getElementById('prod-premium-yield');
        if(prodPremiumYieldElement) prodPremiumYieldElement.innerText = config.productionOptions["premium-documents"].yieldAmount.toFixed(0);

        // TODO: Atualizar progresso de produção visualmente


        // Aba Logística - Placeholder UI
        const stockDocumentsElement = document.getElementById('stock-documents');
        if(stockDocumentsElement) stockDocumentsElement.innerText = "0"; // Placeholder
        const stockWeaponsElement = document.getElementById('stock-weapons');
        if(stockWeaponsElement) stockWeaponsElement.innerText = "0"; // Placeholder
        const stockChemicalsElement = document.getElementById('stock-chemicals');
        if(stockChemicalsElement) stockChemicalsElement.innerText = "0"; // Placeholder

        const fleetSizeElement = document.getElementById('fleet-size');
        if(fleetSizeElement) fleetSizeElement.innerText = "0"; // Placeholder
         const fleetDetailsElement = document.getElementById('fleet-details');
         if(fleetDetailsElement) fleetDetailsElement.innerText = "Nenhum veículo na frota."; // Placeholder

         const deliveriesInProgressElement = document.getElementById('deliveries-in-progress');
         if(deliveriesInProgressElement) deliveriesInProgressElement.innerText = "0"; // Placeholder
         const deliveryDetailsElement = document.getElementById('delivery-details');
         if(deliveryDetailsElement) deliveryDetailsElement.innerText = "Nenhuma entrega em andamento."; // Placeholder

         const vehicleVanCostElement = document.getElementById('vehicle-van-cost');
         if(vehicleVanCostElement) vehicleVanCostElement.innerText = "7.500"; // Hardcoded for now


        // Aba Lavagem - IDs já atualizados em HTML/CSS
        const washCostDisplay = document.getElementById('wash-cost-display');
        if(washCostDisplay) washCostDisplay.innerText = config.washCost.toFixed(2);
        const washAmountDisplay = document.getElementById('wash-amount-display');
         if(washAmountDisplay) washAmountDisplay.innerText = config.washAmount.toFixed(2);
         const washRiskDisplay = document.getElementById('wash-risk-display');
         // Exibe a CHANCE DE SUCESSO na lavagem (100 - Risco Real)
         const baseRisk = config.washBaseRisk;
         const intimidationBonus = (config.attributeEffects.intimidation[state.attributes.intimidation.level] || {}).bribeBonus || 0;
         const actualRisk = Math.max(0, baseRisk - intimidationBonus);
         const successChance = 100 - actualRisk;
          if(washRiskDisplay) washRiskDisplay.innerText = successChance.toFixed(0);


        // Aba Segurança - IDs e elementos já atualizados em HTML/CSS
        for (const attr in state.attributes) {
            const levelElement = document.getElementById(`attr-${attr}-level`);
            const bonusElement = document.getElementById(`attr-${attr}-bonus`);
            const costElement = document.getElementById(`attr-${attr}-cost`);
            const upgradeButton = document.querySelector(`.upgrade-button[data-attribute="${attr}"]`);
             const heatReductionElement = document.getElementById(`attr-${attr}-heat-reduction`);
             const washBribeBonusElement = document.getElementById(`attr-${attr}-wash-bribe-bonus`); // Novo ID


            if (levelElement) levelElement.innerText = state.attributes[attr].level;

            if (bonusElement) {
                 const currentBonus = config.attributeBonuses[attr][state.attributes[attr].level] || 0;
                 bonusElement.innerText = currentBonus.toFixed(2);
            }

            if (attr === 'intimidation') {
                const currentHeatReduction = (config.attributeEffects[attr][state.attributes[attr].level] || {}).heatReduction || 0;
                if(heatReductionElement) heatReductionElement.innerText = currentHeatReduction.toFixed(1);

                const currentWashBribeBonus = (config.attributeEffects[attr][state.attributes.intimidation.level] || {}).bribeBonus || 0;
                 if(washBribeBonusElement) washBribeBonusElement.innerText = currentWashBribeBonus.toFixed(0);
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

        // Aba Relatório - IDs já atualizados em HTML/CSS
        const reportIncomeElement = document.getElementById('report-income');
        if(reportIncomeElement) reportIncomeElement.innerText = state.incomePerSecond.toFixed(2);
        const reportTotalLaunderedElement = document.getElementById('report-total-laundered');
         if(reportTotalLaunderedElement) reportTotalLaunderedElement.innerText = state.totalLaundered.toFixed(2);
        const reportLostPoliceElement = document.getElementById('report-lost-police');
         if(reportLostPoliceElement) reportLostPoliceElement.innerText = state.totalLostToPolice.toFixed(2);
         const reportCorruptionElement = document.getElementById('report-corruption-level');
          if(reportCorruptionElement) {
              // Lógica simples para "Nível de Corrupção" baseada no dinheiro lavado ou heat?
              let corruptionText = "Baixo";
              if (state.totalLaundered > 5000) corruptionText = "Médio";
              if (state.totalLaundered > 50000) corruptionText = "Alto";
              if (state.policeHeat > 60) corruptionText += " (Suspeito)";
              reportCorruptionElement.innerText = corruptionText;
          }
          const reportWashSuccessChanceElement = document.getElementById('report-wash-success-chance');
          // Reusa o cálculo de chance de sucesso da lavagem
          const baseRisk = config.washBaseRisk;
          const intimidationBonus = (config.attributeEffects.intimidation[state.attributes.intimidation.level] || {}).bribeBonus || 0;
          const actualRisk = Math.max(0, baseRisk - intimidationBonus);
          const successChance = 100 - actualRisk;
           if(reportWashSuccessChanceElement) reportWashSuccessChanceElement.innerText = successChance.toFixed(0);

          const reportGeneralBribeChanceElement = document.getElementById('report-general-bribe-chance');
           if(reportGeneralBribeChanceElement) reportGeneralBribeChanceElement.innerText = state.bribeChance.toFixed(0); // Chance geral de suborno (placeholder)


        // Aba Log (Notificações) - Conteúdo gerado por notifications.js
    },
     // updateCosts só precisa atualizar os elementos que exibem custos e o estado dos botões
     updateCosts: function() {
         // Atualiza o custo da lavagem e estado do botão
        const washCostDisplay = document.getElementById('wash-cost-display');
        const washButton = document.getElementById('wash-money-button');
        if (washCostDisplay) {
            // washCostDisplay.innerText = config.washCost.toFixed(2); // Custo já é exibido em updateUI
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
                 const slotsAvailable = state.productionQueue.length < config.productionSlots;
                 // Produção custa DINHEIRO LIMPO
                 const hasMoney = state.launderedMoney >= optionConfig.costAmount;

                 button.disabled = !slotsAvailable || !hasMoney;

                 // TODO: Atualizar texto do botão com progresso/status se já estiver produzindo
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

        // TODO: Atualizar estado dos botões de Logística (Comprar Veículos, etc.)
     }
};

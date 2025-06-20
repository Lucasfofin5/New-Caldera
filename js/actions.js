// js/actions.js

// Função para iniciar uma produção
function startProduction(productionType) {
    const optionConfig = config.productionOptions[productionType];

    if (!optionConfig) {
        notifications.addNotification(`Tipo de produção "${productionType}" não encontrado.`, 'error');
        return;
    }

    // Verifica se há slots disponíveis
    if (state.productionQueue.length >= config.productionSlots) {
        notifications.addNotification("Todos os slots de produção estão ocupados.", 'info');
        return;
    }

    // Verifica se o custo é em dinheiro limpo e se tem dinheiro suficiente
    if (optionConfig.costType === 'launderedMoney' && state.launderedMoney >= optionConfig.costAmount) {
        state.launderedMoney -= optionConfig.costAmount;
        state.productionQueue.push({
            type: productionType,
            startTime: Date.now(),
            endTime: Date.now() + optionConfig.time,
            element: null // Podemos adicionar uma referência ao elemento UI aqui depois
        });
        ui.updateUI();
        ui.updateCosts(); // Atualiza estado dos botões
        notifications.addNotification(`Produção de "${productionType}" iniciada.`);
    } else {
        notifications.addNotification("Dinheiro limpo insuficiente para iniciar a produção.", 'error');
    }
}


// Função para lavar dinheiro (com risco)
function washMoney() {
    const washCost = config.washCost;
    const washAmount = config.washAmount;
    // A chance de ser pego é a base MENOS o bônus de suborno da Intimidação
    const baseRisk = config.washBaseRisk;
    const intimidationBonus = config.attributeEffects.intimidation[state.attributes.intimidation.level].bribeBonus || 0;
    const actualRisk = Math.max(0, baseRisk - intimidationBonus); // Risco mínimo 0

    state.bribeChance = 100 - actualRisk; // Atualiza a chance de suborno exibida (placeholder)


    if (state.money >= washCost) {
        // Simula o risco
        const caught = Math.random() * 100 < actualRisk;

        if (caught) {
            notifications.addNotification("A polícia te pegou lavando dinheiro! 🚨", 'error');
            state.totalLostToPolice += state.money + (state.launderedMoney * config.policeFineCleanMoneyPercent); // Calcula o total perdido
            state.money = 0; // Confisca todo o dinheiro sujo
            state.launderedMoney *= (1 - config.policeFineCleanMoneyPercent); // Perde % do dinheiro limpo como multa
            state.policeHeat += config.policeHeatIncreasePerCaughtWash; // Aumenta heat
             notifications.addNotification(`Você perdeu 100% do dinheiro sujo e ${config.policeFineCleanMoneyPercent * 100}% do dinheiro limpo.`);

        } else {
            state.money -= washCost;
            state.launderedMoney += washAmount;
            state.totalLaundered += washAmount; // Registra para o relatório
            notifications.addNotification(`Você lavou $${washAmount} com sucesso!`);
            // Opcional: Reduzir heat levemente ao lavar com sucesso?
            state.policeHeat = Math.max(0, state.policeHeat - (config.policeHeatIncreasePerCaughtWash / 4)); // Exemplo: reduz 1/4 do aumento de falha
        }
        ui.updateUI();
        ui.updateCosts();

    } else {
        notifications.addNotification("Dinheiro sujo insuficiente para lavar.", 'error');
    }
}

// Função para melhorar um atributo (Segurança)
function upgradeAttribute(attributeName) {
    const attribute = state.attributes[attributeName];
    const upgradeCost = config.attributeCosts[attributeName][attribute.level];
    const nextLevel = attribute.level + 1;

    // Verifica se o nível existe no config
    if (config.attributeCosts[attributeName][attribute.level + 1] === undefined) {
         notifications.addNotification(`"${attributeName}" já está no nível máximo disponível.`, 'info');
         return;
    }

    // Verifica se o dinheiro limpo é suficiente
    if (state.launderedMoney >= upgradeCost) {
        state.launderedMoney -= upgradeCost;
        attribute.level = nextLevel;

        // Recalcular renda por segundo TOTAL (bônus de todos os atributos)
        updateIncomePerSecond();

        // Recalcular chance de suborno (se o atributo afetar)
        updateBribeChance();


        ui.updateUI(); // Atualiza a interface após o upgrade
        ui.updateCosts(); // Atualiza estado dos botões de upgrade
        notifications.addNotification(`"${attributeName}" melhorado para o nível ${attribute.level}!`);

    } else {
        notifications.addNotification(`Dinheiro limpo insuficiente para melhorar "${attributeName}".`, 'error');
    }
}

// Função para recalcular a renda por segundo total baseada nos atributos
function updateIncomePerSecond() {
    let totalBonus = 0;
    for (const attr in state.attributes) {
        const level = state.attributes[attr].level;
        totalBonus += config.attributeBonuses[attr][level] || 0;
    }
    state.incomePerSecond = config.baseIncomePerSecond + totalBonus;
    ui.updateUI();
}

// Função para recalcular a chance de suborno (usando atributos como Intimidação)
function updateBribeChance() {
     let totalBribeBonus = 0;
     // Calcula o bônus de todos os atributos que afetam o suborno
     if (state.attributes.intimidation) {
          const level = state.attributes.intimidation.level;
          totalBribeBonus += (config.attributeEffects.intimidation[level] || {}).bribeBonus || 0;
     }
     // A chance exibida é a chance BASE de suborno + o bônus dos atributos
     // Note: A chance de *ser pego* na lavagem é 100 - (Base Bribe Chance + Total Bribe Bonus)
     // Precisamos decidir qual métrica exibir/usar consistentemente.
     // Vamos usar a chance de *não ser pego* na lavagem = 100 - actualRisk
     // O 'bribeChance' no state pode representar a chance de subornar outras coisas, como empresas.
     // Por enquanto, vamos calcular o risco real na lavagem e o bônus de suborno total.

      const baseRisk = config.washBaseRisk;
      const intimidationBonus = (config.attributeEffects.intimidation[state.attributes.intimidation.level] || {}).bribeBonus || 0;
      const actualRisk = Math.max(0, baseRisk - intimidationBonus);
      state.bribeChance = 100 - actualRisk; // Placeholder: Usamos isso para exibir chance de *não ser pego* na lavagem no Relatório.

     // Se houver outras mecânicas de suborno, o cálculo seria diferente.
     ui.updateUI(); // Atualiza a exibição da chance de suborno no Relatório
}


// Esta função será chamada no script.js para iniciar os listeners dos botões
function setupActionButtons() {
    // Listener para o botão de Lavar Dinheiro
    const washButton = document.getElementById('wash-money-button');
     if (washButton) washButton.addEventListener('click', washMoney);


    // Listeners para os botões de Iniciar Produção
    const startProductionButtons = document.querySelectorAll('#production .start-production-button');
    startProductionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productionType = event.target.closest('.production-option').dataset.productionType;
            startProduction(productionType);
        });
    });


    // Listeners para os botões de Melhorar Atributos (Segurança)
    const upgradeButtons = document.querySelectorAll('#security .upgrade-button'); // Muda o seletor
    upgradeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const attributeName = event.target.dataset.attribute;
            upgradeAttribute(attributeName);
        });
    });

    // Inicializa a exibição dos custos e estado dos botões
    ui.updateCosts();

    // Garante que a renda inicial e a chance de suborno inicial sejam calculadas/exibidas
    updateIncomePerSecond();
    updateBribeChance();
}

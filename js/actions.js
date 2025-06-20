// js/actions.js

// Função para iniciar uma produção
function startProduction(productionType) {
    const optionConfig = config.productionOptions[productionType];

    if (!optionConfig) {
        notifications.addNotification(`Tipo de produção "${productionType}" não encontrado.`, 'error');
        return;
    }

    if (state.productionQueue.length >= config.productionSlots) {
        notifications.addNotification("Todos os slots de produção estão ocupados.", 'info');
        return;
    }

    // Custo da produção é em DINHEIRO LIMPO
    if (optionConfig.costType === 'launderedMoney' && state.launderedMoney >= optionConfig.costAmount) {
        state.launderedMoney -= optionConfig.costAmount;
        state.productionQueue.push({
            type: productionType,
            startTime: Date.now(),
            endTime: Date.now() + optionConfig.time
            // Elemento UI associado (opcional)
        });
        ui.updateUI(); // Atualiza saldos e outros UI
        ui.updateCosts(); // Atualiza estado dos botões (Produção, Upgrade)
        notifications.addNotification(`Produção de "${productionType}" iniciada.`);
    } else {
        // Mensagem de erro mais específica
        notifications.addNotification(`Dinheiro limpo insuficiente para iniciar a produção "${productionType}".`, 'error');
    }
}


// Função para lavar dinheiro (com risco)
function washMoney() {
    const washCost = config.washCost;
    const washAmount = config.washAmount;

    // Calcula o risco real baseado no atributo Intimidação
    const baseRisk = config.washBaseRisk;
    const intimidationBonus = (config.attributeEffects.intimidation[state.attributes.intimidation.level] || {}).bribeBonus || 0;
    const actualRisk = Math.max(0, baseRisk - intimidationBonus); // Risco mínimo 0


    if (state.money >= washCost) {
        // Simula o risco (chance de ser pego)
        const caught = Math.random() * 100 < actualRisk;

        if (caught) {
            notifications.addNotification("A polícia te pegou lavando dinheiro! 🚨 Penalidades aplicadas.", 'error');

            const cleanFine = state.launderedMoney * config.policeFineCleanMoneyPercent;
            const dirtyConfiscated = state.money;

            state.totalLostToPolice += cleanFine + dirtyConfiscated; // Soma ao total perdido
            state.money = 0; // Confisca todo o dinheiro sujo
            state.launderedMoney = Math.max(0, state.launderedMoney - cleanFine); // Perde % do dinheiro limpo (não fica negativo)

            state.policeHeat += config.policeHeatIncreasePerCaughtWash; // Aumenta heat

             notifications.addNotification(`Multa: $${cleanFine.toFixed(2)} Limpo perdidos. Dinheiro Sujo ($${dirtyConfiscated.toFixed(2)}) confiscado.`);

        } else {
            state.money -= washCost;
            state.launderedMoney += washAmount;
            state.totalLaundered += washAmount; // Registra para o relatório
            notifications.addNotification(`Você lavou $${washAmount.toFixed(2)} com sucesso!`);
            // Reduz heat levemente ao lavar com sucesso
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
    // Verifica se o próximo nível existe no config
     if (attribute.level + 1 >= (config.attributeCosts[attributeName] || []).length) {
          notifications.addNotification(`"${attributeName}" já está no nível máximo disponível.`, 'info');
          // Garante que a UI exiba MAX e o botão esteja desabilitado
          ui.updateCosts();
          return;
     }

    const upgradeCost = config.attributeCosts[attributeName][attribute.level];
    const nextLevel = attribute.level + 1;


    // Custo do upgrade é em DINHEIRO LIMPO
    if (state.launderedMoney >= upgradeCost) {
        state.launderedMoney -= upgradeCost;
        attribute.level = nextLevel;

        // Recalcular renda por segundo e chance de suborno
        updateIncomePerSecond();
        updateBribeChance(); // Atualiza a chance de suborno exibida (lavagem/geral)

        ui.updateUI();
        ui.updateCosts();
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
        // Acessa o bônus de renda, se existir para este atributo/nível
        totalBonus += (config.attributeBonuses[attr] && config.attributeBonuses[attr][level]) || 0;
    }
    state.incomePerSecond = config.baseIncomePerSecond + totalBonus;
    ui.updateUI(); // Atualiza a UI para mostrar a nova renda (no painel superior e relatório)
}

// Função para recalcular a chance de suborno exibida (afeta o risco na lavagem)
function updateBribeChance() {
    // Calcula o bônus total de suborno dos atributos (principalmente Intimidação)
     let totalBribeBonus = 0;
     if (state.attributes.intimidation) {
          const level = state.attributes.intimidation.level;
          // Acessa o efeito de bônus de suborno de lavagem, se existir
          totalBribeBonus += (config.attributeEffects.intimidation[level] || {}).bribeBonus || 0;
     }

     // Calcula a chance real de NÃO ser pego na lavagem
      const baseRisk = config.washBaseRisk;
      const actualRisk = Math.max(0, baseRisk - totalBribeBonus);
      const washSuccessChance = 100 - actualRisk;

      // Atualiza o estado (usado para o Relatório)
      state.bribeChance = washSuccessChance; // No momento, a chance de suborno exibida no Relatório é a chance de sucesso na lavagem.
      // Se houver outros tipos de suborno, criaremos outra variável de estado e cálculo.

     ui.updateUI(); // Atualiza a exibição da chance de sucesso na lavagem no Relatório
}


// Esta função será chamada no script.js para iniciar os listeners dos botões
function setupActionButtons() {
    // Listener para o botão de Lavar Dinheiro
    const washButton = document.getElementById('wash-money-button');
     if (washButton) washButton.addEventListener('click', washMoney);


    // Listeners para os botões de Iniciar Produção
    const startProductionButtons = document.querySelectorAll('#production .start-production-button');
    startProductionButtons.forEach(button => {
        // Verifica se já tem um listener para evitar duplicidade se setupActionButtons for chamado mais de uma vez
         // Nota: Uma forma mais robusta seria remover listeners antes de adicionar,
         // mas para este projeto simples, verificar data-listener-added pode ser suficiente.
         if (!button.dataset.listenerAdded) {
            button.addEventListener('click', (event) => {
                // Usa o data-attribute diretamente do botão, pois o closest pode falhar se a estrutura HTML mudar
                const productionType = event.target.dataset.productionType;
                startProduction(productionType);
            });
            button.dataset.listenerAdded = 'true'; // Marca que o listener foi adicionado
         }
    });


    // Listeners para os botões de Melhorar Atributos (Segurança)
    const upgradeButtons = document.querySelectorAll('#security .upgrade-button');
    upgradeButtons.forEach(button => {
        if (!button.dataset.listenerAdded) {
            button.addEventListener('click', (event) => {
                const attributeName = event.target.dataset.attribute;
                upgradeAttribute(attributeName);
            });
            button.dataset.listenerAdded = 'true';
        }
    });

    // TODO: Listeners para botões de Logística (Comprar Veículos, etc.)

    // Inicializa a exibição dos custos e estado dos botões
    // Chamado aqui para garantir que os estados iniciais dos botões estejam corretos.
    // Também chamado em gameLoop.js tick.
    ui.updateCosts();

    // Garante que a renda inicial e a chance de suborno inicial sejam calculadas/exibidas
    updateIncomePerSecond(); // Calcula e atualiza UI
    updateBribeChance(); // Calcula e atualiza UI
}

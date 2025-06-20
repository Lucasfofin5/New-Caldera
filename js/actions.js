// js/actions.js

// Função para lavar dinheiro
function washMoney() {
    const washCost = config.washCost; // Custo da lavagem
    const washAmount = config.washAmount; // Quantidade de dinheiro limpo gerada

    if (state.money >= washCost) {
        state.money -= washCost;
        state.launderedMoney += washAmount;
        ui.updateUI(); // Atualiza a interface após a lavagem
        notifications.addNotification(`Você lavou $${washAmount}!`);
    } else {
        notifications.addNotification("Dinheiro sujo insuficiente para lavar.", 'error'); // Adiciona um tipo de erro para estilizar
    }
}

// Função para melhorar um atributo
function upgradeAttribute(attributeName) {
    // Lógica para verificar o custo, subtrair dinheiro limpo, aumentar nível e bônus
    // Vamos precisar de uma forma de buscar o custo atual e o bônus por atributo
    // E de verificar se o dinheiro limpo é suficiente
    // Por enquanto, uma implementação básica:

    const attribute = state.attributes[attributeName];
    const upgradeCost = config.attributeCosts[attributeName][attribute.level]; // Pega o custo para o próximo nível
    const nextLevel = attribute.level + 1;

    // Verifica se o nível existe no config e se tem dinheiro limpo suficiente
    if (config.attributeCosts[attributeName][attribute.level + 1] === undefined) {
         notifications.addNotification(`"${attributeName}" já está no nível máximo disponível.`, 'info');
         return; // Não há mais níveis
    }


    if (state.launderedMoney >= upgradeCost) {
        state.launderedMoney -= upgradeCost;
        attribute.level = nextLevel;
        // Atualizar bônus de renda - vamos precisar de uma função para recalcular o incomePerSecond total
        // Por enquanto, apenas atualiza o nível e o custo na UI
        ui.updateUI(); // Atualiza a interface após o upgrade
        notifications.addNotification(`"${attributeName}" melhorado para o nível ${attribute.level}!`);
        // Vamos precisar recalcular incomePerSecond em ui.updateUI ou em uma função dedicada
        updateIncomePerSecond(); // Chamamos uma função para recalcular a renda
    } else {
        notifications.addNotification(`Dinheiro limpo insuficiente para melhorar "${attributeName}".`, 'error');
    }
}

// Função para recalcular a renda por segundo total baseada nos atributos
function updateIncomePerSecond() {
    let totalBonus = 0;
    for (const attr in state.attributes) {
        const level = state.attributes[attr].level;
        // Adiciona o bônus do nível atual do atributo
        totalBonus += config.attributeBonuses[attr][level] || 0;
    }
    state.incomePerSecond = config.baseIncomePerSecond + totalBonus;
    ui.updateUI(); // Atualiza a UI para mostrar a nova renda
}

// Esta função será chamada no script.js para iniciar os listeners dos botões
function setupActionButtons() {
    document.getElementById('wash-money-button').addEventListener('click', washMoney);

    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    upgradeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const attributeName = event.target.dataset.attribute;
            upgradeAttribute(attributeName);
        });
    });

    // Inicializa a exibição dos custos na UI quando os botões são configurados
    ui.updateCosts();
}

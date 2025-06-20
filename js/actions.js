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

        // Trigger da animação do caminhão no mapa
        if (map && map.addTruck) { // Verifica se o objeto map e a função existem
             map.addTruck();
        }

    } else {
        notifications.addNotification("Dinheiro sujo insuficiente para lavar.", 'error'); // Adiciona um tipo de erro para estilizar
    }
}

// ... (restante do código de upgradeAttribute e updateIncomePerSecond) ...

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

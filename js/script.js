// js/script.js

// Aguarda o DOM estar completamente carregado antes de inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o estado (carrega saves aqui depois)
    // state = loadGame() || initialState; // Exemplo futuro de carregar save

    // Configurações iniciais da UI e ações - Chamado antes do loop para exibir estado inicial
    setupActionButtons(); // Configura listeners E chama updateIncomePerSecond/updateBribeChance E updateCosts/updateUI (inicial)
    setupTabs(); // Configura listeners de abas E chama updateUI/updateCosts (garantia)

    // Garante que a UI inicial esteja correta
    ui.updateUI();
    ui.updateCosts();


    // Inicia o loop principal do jogo (ganho de dinheiro por segundo, produção, heat decay)
    gameLoop.start();

    console.log("NEW CALDERA iniciado!");
});

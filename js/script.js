// js/script.js

// Aguarda o DOM estar completamente carregado antes de inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o estado e a interface
    ui.updateUI();
    // Inicializa a exibição dos custos e estado dos botões na UI
    ui.updateCosts();

    // Configura os botões de ação (Lavagem e Upgrade)
    setupActionButtons(); // Função do actions.js

    // Configura o sistema de abas
    setupTabs(); // Função do tabs.js

    // Inicia o loop principal do jogo (ganho de dinheiro por segundo)
    gameLoop.start();

    console.log("NEW CALDERA iniciado!");
});

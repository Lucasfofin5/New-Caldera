// js/script.js

// Inicializa o estado e a interface
ui.updateUI();
// Inicializa os custos exibidos na UI
ui.updateCosts();

// Configura os botões de ação
setupActionButtons(); // Chamamos a função do actions.js

// Inicia o loop principal do jogo (ganho de dinheiro por segundo)
gameLoop.start();

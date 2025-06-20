// js/script.js

// Aguarda o DOM estar completamente carregado antes de inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o mapa - precisa ser chamado antes do animate loop começar
    map.init(); // Inicializa o canvas e o loop de animação do mapa

    // Inicializa o estado e a interface - Exibe os valores iniciais
    ui.updateUI();
    // Inicializa a exibição dos custos e estado dos botões na UI
    ui.updateCosts();

    // Configura os botões de ação (Lavagem e Upgrade) - Anexa os listeners
    setupActionButtons(); // Função do actions.js

    // Configura o sistema de abas - Gerencia a troca de abas
    setupTabs(); // Função do tabs.js

    // O loop principal do jogo (ganho de dinheiro por segundo)
    // já está sendo iniciado DENTRO de gameLoop.start(), que é chamado aqui.
    gameLoop.start();

    console.log("NEW CALDERA iniciado!");

    // Remover o exemplo de adicionar caminhão aqui se você não quiser que eles apareçam automaticamente
    // setInterval(() => {
    //     map.addTruck();
    // }, 5000);
});

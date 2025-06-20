// js/config.js

const config = {
    baseIncomePerSecond: 1, // Renda inicial por segundo
    washCost: 10, // Custo inicial para lavar dinheiro
    washAmount: 5, // Dinheiro limpo gerado pela lavagem inicial
    attributeCosts: { // Custo para ir para o próximo nível (índice = nível atual)
        falsification: [10, 20, 50, 100, 200, 500], // Custo para ir para nível 1, 2, 3...
        influence: [15, 30, 75, 150, 300, 750], // Custo para ir para nível 1, 2, 3...
        // Adicionar custos para outros atributos aqui
    },
    attributeBonuses: { // Bônus de renda por segundo concedido por nível (índice = nível)
        falsification: [0, 0.5, 1, 2, 4, 8], // Bônus no nível 0, 1, 2...
        influence: [0, 0.7, 1.5, 3, 6, 12], // Bônus no nível 0, 1, 2...
        // Adicionar bônus para outros atributos aqui
    },
    notificationDuration: 5000 // Duração que a notificação fica na tela em milissegundos
};

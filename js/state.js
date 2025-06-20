// js/state.js

const state = {
    money: 0, // Dinheiro sujo
    launderedMoney: 0, // Dinheiro limpo
    incomePerSecond: config.baseIncomePerSecond, // Renda por segundo atual

    attributes: { // Níveis dos atributos
        falsification: { level: 0 },
        influence: { level: 0 },
        intimidation: { level: 0 } // Novo atributo
    },

    productionQueue: [], // Array de produções em andamento { type: '...', startTime: Date.now() }
    policeHeat: 0, // Nível de calor da polícia (0 a config.policeHeatMax)
    totalLaundered: 0, // Total de dinheiro limpo gerado na história do jogo
    totalLostToPolice: 0, // Total de dinheiro perdido para a polícia

    // Outros stats (placeholder)
     corruptionLevel: 0, // Placeholder para nível de corrupção
     bribeChance: config.baseBribeChance, // Chance atual de suborno (base + bônus)

    // Funções para modificar o estado (se necessário, ou fazer em actions.js)
};

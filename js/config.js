// js/config.js

const config = {
    baseIncomePerSecond: 1,

    // Configurações de Lavagem de Dinheiro
    washCost: 10,
    washAmount: 5,
    washBaseRisk: 10, // % de risco base de ser pego ao lavar dinheiro

    // Configurações de Produção
    productionOptions: {
        "basic-documents": {
            costType: 'launderedMoney',
            costAmount: 200,
            yieldType: 'money',
            yieldAmount: 800,
            time: 4000
        },
        "premium-documents": {
            costType: 'launderedMoney',
            costAmount: 750,
            yieldType: 'money',
            yieldAmount: 1000,
            time: 4000
        }
    },
    productionSlots: 1,

    // Configurações de Atributos (Segurança)
    attributeCosts: {
        falsification: [10, 20, 50, 100, 200, 500, 1000],
        influence: [15, 30, 75, 150, 300, 750, 1500],
        intimidation: [25, 50, 100, 200, 400, 800, 1600]
    },
    attributeBonuses: {
        falsification: [0, 0.5, 1, 2, 4, 8, 16],
        influence: [0, 0.7, 1.5, 3, 6, 12, 24],
        intimidation: [0, 0, 0, 0, 0, 0, 0]
    },
     attributeEffects: {
         intimidation: {
             heatReduction: [0, 0.1, 0.2, 0.4, 0.8, 1.5, 3], // Quanto reduz o heat por segundo
             bribeBonus: [0, 5, 10, 15, 20, 25, 30] // % de bônus na chance de NÃO ser pego na lavagem (diminui o risco)
         }
     },


    // Configurações de Polícia/Heat
    policeHeatIncreasePerCaughtWash: 20,
    policeHeatDecayPerSecond: 0.05,
    policeHeatMax: 100,

    // Configurações de Penalidades
    policeFineCleanMoneyPercent: 0.5,
    policeConfiscateDirtyMoneyPercent: 1,

    // Outros Stats Globais
     // baseBribeChance: 10, // Removido, chance de suborno geral não está implementada ainda

    notificationDuration: 5000
};

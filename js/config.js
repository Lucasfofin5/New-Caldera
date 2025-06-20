// js/config.js

const config = {
    baseIncomePerSecond: 1, // Renda inicial por segundo

    // Configurações de Lavagem de Dinheiro
    washCost: 10, // Custo inicial para lavar dinheiro (sujo)
    washAmount: 5, // Dinheiro limpo gerado pela lavagem inicial
    washBaseRisk: 10, // % de risco base de ser pego ao lavar dinheiro

    // Configurações de Produção
    productionOptions: {
        "basic-documents": {
            costType: 'launderedMoney', // Custo em dinheiro limpo
            costAmount: 200,
            yieldType: 'money', // Retorno em dinheiro sujo
            yieldAmount: 800,
            time: 4000 // Tempo em milissegundos (4 segundos)
        },
        "premium-documents": {
            costType: 'launderedMoney',
            costAmount: 750,
            yieldType: 'money',
            yieldAmount: 1000,
            time: 4000
        }
        // Adicionar outras opções de produção aqui
    },
    productionSlots: 1, // Número de produções que podem rodar simultaneamente

    // Configurações de Atributos (Segurança)
    attributeCosts: { // Custo para ir para o próximo nível (índice = nível atual)
        falsification: [10, 20, 50, 100, 200, 500, 1000],
        influence: [15, 30, 75, 150, 300, 750, 1500],
        intimidation: [25, 50, 100, 200, 400, 800, 1600] // Custos para o novo atributo
    },
    attributeBonuses: { // Bônus de renda por segundo concedido por nível (índice = nível)
        falsification: [0, 0.5, 1, 2, 4, 8, 16],
        influence: [0, 0.7, 1.5, 3, 6, 12, 24],
        intimidation: [0, 0, 0, 0, 0, 0, 0] // Intimidação não dá bônus de renda direto
    },
     attributeEffects: { // Outros efeitos dos atributos (índice = nível)
         intimidation: {
             heatReduction: [0, 0.1, 0.2, 0.4, 0.8, 1.5, 3], // Quanto reduz o heat por segundo
             bribeBonus: [0, 5, 10, 15, 20, 25, 30] // % de bônus na chance de suborno
         }
     },


    // Configurações de Polícia/Heat
    policeHeatIncreasePerCaughtWash: 20, // Quanto aumenta o heat ao ser pego lavando
    policeHeatDecayPerSecond: 0.05, // Quanto o heat diminui naturalmente por segundo
    policeHeatMax: 100, // Nível máximo de heat

    // Configurações de Penalidades
    policeFineCleanMoneyPercent: 0.5, // % do dinheiro limpo perdido como multa
    policeConfiscateDirtyMoneyPercent: 1, // % do dinheiro sujo confiscado

    // Outros Stats Globais
     baseBribeChance: 10, // Chance base de suborno (ainda não implementado)

    notificationDuration: 5000 // Duração da notificação
};

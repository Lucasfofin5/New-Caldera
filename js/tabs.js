// js/tabs.js

function setupTabs() {
    const tabButtons = document.querySelectorAll('#tabs .tab-button');
    const tabPanes = document.querySelectorAll('#tab-content .tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove a classe 'active' de todos os botões e painéis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Adiciona a classe 'active' ao botão clicado e ao painel correspondente
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Opcional: Disparar um evento ou chamar uma função quando a aba muda
            console.log(`Aba "${targetTab}" ativada.`);
            // Se a aba 'mapa' for ativada, podemos re-renderizar ou fazer algo específico
            if (targetTab === 'map') {
                 // map.draw(); // Pode ser útil forçar um redesenho se o canvas for sensível a ser ocultado/exibido
            }
        });
    });

    // Remova ou comente a linha abaixo:
    // if (tabButtons.length > 0) {
    //     tabButtons[0].click(); // Simula um clique no primeiro botão para ativá-lo
    // }

    // O estado inicial já está definido no HTML via class="active"
    // Podemos, opcionalmente, chamar updateUI e updateCosts aqui
    // para garantir que os valores das abas inicialmente invisíveis estejam corretos
     ui.updateUI();
     ui.updateCosts();
}

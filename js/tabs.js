// js/tabs.js

function setupTabs() {
    // Atualiza o seletor para os botões das abas na parte inferior
    const tabButtons = document.querySelectorAll('#bottom-tabs .tab-button');
    const tabPanes = document.querySelectorAll('#tab-content .tab-pane'); // Este seletor ainda funciona

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            console.log(`Aba "${targetTab}" ativada.`);

            // Opcional: Rola o painel principal para o topo ao trocar de aba
             const mainPanel = document.getElementById('main-panel');
             if (mainPanel) {
                 mainPanel.scrollTop = 0;
             }
        });
    });

    // Ativa a primeira aba com a classe 'active' definida no HTML na inicialização
    // Não precisa simular clique
    // Garante que a UI e os custos estejam atualizados para a aba inicial visível
     ui.updateUI();
     ui.updateCosts();
}

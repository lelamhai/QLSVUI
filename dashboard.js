(function () {
    const actionCards = document.querySelectorAll('.dashboard-action-card, .quick-link-item');

    actionCards.forEach(function (card) {
        card.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                card.click();
            }
        });

        card.setAttribute('tabindex', '0');
    });
})();
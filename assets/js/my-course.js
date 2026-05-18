(function () {
    const actionButtons = document.querySelectorAll('.register-btn');

    if (actionButtons.length > 0) {
        actionButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const row = button.closest('tr');
                if (row) {
                    row.remove();
                }
            });
        });
    }
})();

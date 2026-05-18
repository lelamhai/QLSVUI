(function () {
    const filterToggle = document.getElementById('filter-toggle');
    const filterPanel = document.getElementById('filter-panel');
    const registerButtons = document.querySelectorAll('.register-btn');
    const statusBadge = document.querySelector('.status-badge');

    if (filterToggle && filterPanel) {
        filterToggle.addEventListener('click', function () {
            const isOpen = filterPanel.classList.toggle('show');
            filterPanel.setAttribute('aria-hidden', String(!isOpen));
            filterToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    if (registerButtons.length > 0) {
        registerButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                if (button.classList.contains('is-registered')) {
                    return;
                }

                button.classList.add('is-registered');
                button.disabled = true;
                button.innerHTML = '<i class="fa-solid fa-check"></i> Đã đăng ký';

                const row = button.closest('tr');
                if (row) {
                    const seatsCell = row.children[4];
                    if (seatsCell) {
                        const cellText = seatsCell.textContent || '';
                        const seatMatch = cellText.match(/(\d+)\s*\/\s*(\d+)/);

                        if (seatMatch) {
                            const current = Number(seatMatch[1]);
                            const max = Number(seatMatch[2]);
                            const next = Math.min(current + 1, max);
                            seatsCell.innerHTML =  next + '/' + max;
                        }
                    }
                }

                if (statusBadge) {
                    const badgeText = statusBadge.textContent || '';
                    const badgeMatch = badgeText.match(/(\d+)/);

                    if (badgeMatch) {
                        const currentRegistered = Number(badgeMatch[1]);
                        const nextRegistered = currentRegistered + 1;
                        statusBadge.innerHTML = '<i class="fa-regular fa-eye"></i> Số tín chỉ: ' + nextRegistered;
                    }
                }
            });
        });
    }
})();

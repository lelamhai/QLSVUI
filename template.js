(function () {
    const toggleButton = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const notifyToggle = document.getElementById('notify-toggle');
    const notificationPanel = document.getElementById('notification-panel');

    if (!toggleButton || !sidebar) {
        return;
    }

    function setSidebarOpenState(isOpen) {
        sidebar.classList.toggle('show', isOpen);

        if (overlay) {
            overlay.classList.toggle('show', isOpen);
        }

        document.body.classList.toggle('sidebar-open', isOpen);
    }

    toggleButton.addEventListener('click', function () {
        const isOpen = !sidebar.classList.contains('show');
        setSidebarOpenState(isOpen);
    });

    if (overlay) {
        overlay.addEventListener('click', function () {
            setSidebarOpenState(false);
        });
    }

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setSidebarOpenState(false);
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 992) {
            setSidebarOpenState(false);
        }
    });

    if (notifyToggle && notificationPanel) {
        notifyToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            const isOpen = notificationPanel.classList.toggle('show');
            notificationPanel.setAttribute('aria-hidden', String(!isOpen));
        });
    }

    document.addEventListener('click', function (event) {
        if (notificationPanel && notificationPanel.classList.contains('show')) {
            if (!notificationPanel.contains(event.target) && !notifyToggle.contains(event.target)) {
                notificationPanel.classList.remove('show');
                notificationPanel.setAttribute('aria-hidden', 'true');
            }
        }
    });
})();

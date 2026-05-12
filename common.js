(function () {
    const toggleButton = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

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

    // Filter panel toggle
    const filterBtn = document.getElementById('filter-toggle');
    const filterPanel = document.getElementById('filter-panel');
    const clearFilterBtn = document.querySelector('.clear-filter-btn');

    if (filterBtn && filterPanel) {
        filterBtn.addEventListener('click', function () {
            filterPanel.classList.toggle('active');
        });

        // Clear filter functionality
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', function () {
                document.getElementById('academic-year').value = '';
                document.getElementById('semester').value = '';
            });
        }
    }
})();

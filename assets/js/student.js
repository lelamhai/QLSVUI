document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('student-search');
    const classFilter = document.getElementById('filter-class');
    const genderFilter = document.getElementById('filter-gender');
    const statusFilter = document.getElementById('filter-status');
    const table = document.getElementById('student-table');
    const tbody = table ? table.querySelector('tbody') : null;

    const addBtn = document.getElementById('add-student-btn');
    const addPanel = document.getElementById('add-student-panel');
    const addOverlay = document.getElementById('add-panel-overlay');
    const editPanel = document.getElementById('edit-student-panel');
    const editOverlay = document.getElementById('edit-panel-overlay');

    const addForm = document.getElementById('add-student-form');
    const submitAdd = document.getElementById('submit-add-student');
    const submitEdit = document.getElementById('submit-edit-student');
    const cancelAdd = document.getElementById('cancel-add-student');
    const cancelEdit = document.getElementById('cancel-edit-student');
    const closeAdd = document.getElementById('close-add-panel');
    const closeEdit = document.getElementById('close-edit-panel');

    let activeRow = null;

    const hasDatepicker = window.jQuery && typeof window.jQuery.fn.datepicker === 'function';
    if (hasDatepicker) {
        window.jQuery('.date-picker').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true,
            todayHighlight: true,
            orientation: 'bottom auto'
        });
    }

    // Avatar file inputs and preview handling
    const addAvatarFile = document.getElementById('add-avatar-file');
    const editAvatarFile = document.getElementById('edit-avatar-file');
    const addAvatarPreview = document.getElementById('add-avatar-preview');
    const editAvatarPreview = document.getElementById('edit-avatar-preview');
    const addAvatarPicker = document.getElementById('add-avatar-picker');
    const editAvatarPicker = document.getElementById('edit-avatar-picker');

    const readFileToDataUrl = (file, cb) => {
        if (!file) return cb('');
        const reader = new FileReader();
        reader.onload = () => cb(reader.result);
        reader.onerror = () => cb('');
        reader.readAsDataURL(file);
    };

    const defaultAvatarHtml = () => '<div class="avatar-placeholder"><i class="fa-regular fa-user"></i></div>';

    const setAvatarState = (picker, preview, hasAvatar) => {
        if (!picker || !preview) return;
        picker.classList.toggle('has-avatar', Boolean(hasAvatar));
        preview.setAttribute('aria-hidden', String(!hasAvatar));
    };

    const setAvatarPreview = (preview, value) => {
        if (!preview) return;
        if (value && value.indexOf && value.indexOf('data:') === 0) {
            preview.innerHTML = `<img src="${value}" alt="avatar" />`;
            return true;
        }
        preview.innerHTML = defaultAvatarHtml();
        return false;
    };

    const openAvatarFileDialog = (input) => {
        if (!input) return;
        input.click();
    };

    if (addAvatarFile) {
        addAvatarFile.addEventListener('change', (e) => {
            const f = e.target.files && e.target.files[0];
            readFileToDataUrl(f, (dataUrl) => {
                const hidden = document.getElementById('add-avatar');
                if (hidden) hidden.value = dataUrl || '';
                const hasAvatar = setAvatarPreview(addAvatarPreview, dataUrl);
                setAvatarState(addAvatarPicker, addAvatarPreview, hasAvatar);
            });
        });
    }

    // clear avatar buttons
    const addAvatarClear = document.getElementById('add-avatar-clear');
    const editAvatarClear = document.getElementById('edit-avatar-clear');

    if (addAvatarClear) {
        addAvatarClear.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const hidden = document.getElementById('add-avatar');
            if (hidden) hidden.value = '';
            if (addAvatarPreview) {
                addAvatarPreview.innerHTML = defaultAvatarHtml();
            }
            if (addAvatarFile) addAvatarFile.value = '';
            setAvatarState(addAvatarPicker, addAvatarPreview, false);
        });
    }

    if (editAvatarClear) {
        editAvatarClear.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const hidden = document.getElementById('edit-avatar');
            if (hidden) hidden.value = '';
            if (editAvatarPreview) {
                editAvatarPreview.innerHTML = defaultAvatarHtml();
            }
            if (editAvatarFile) editAvatarFile.value = '';
            setAvatarState(editAvatarPicker, editAvatarPreview, false);
        });
    }

    addAvatarPicker?.addEventListener('click', (event) => {
        if (event.target.closest('.avatar-clear-badge')) return;
        openAvatarFileDialog(addAvatarFile);
    });

    editAvatarPicker?.addEventListener('click', (event) => {
        if (event.target.closest('.avatar-clear-badge')) return;
        openAvatarFileDialog(editAvatarFile);
    });

    addAvatarPicker?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openAvatarFileDialog(addAvatarFile);
        }
    });

    editAvatarPicker?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openAvatarFileDialog(editAvatarFile);
        }
    });

    if (editAvatarFile) {
        editAvatarFile.addEventListener('change', (e) => {
            const f = e.target.files && e.target.files[0];
            readFileToDataUrl(f, (dataUrl) => {
                const hidden = document.getElementById('edit-avatar');
                if (hidden) hidden.value = dataUrl || '';
                if (editAvatarPreview) {
                    editAvatarPreview.innerHTML = dataUrl ? `<img src="${dataUrl}" alt="avatar" />` : '';
                    editAvatarPreview.setAttribute('aria-hidden', String(!dataUrl));
                }
            });
        });
    }

    const openPanel = (panel, overlay) => {
        if (!panel || !overlay) return;
        panel.classList.add('open');
        overlay.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('sidebar-open');
    };

    const closePanel = (panel, overlay) => {
        if (!panel || !overlay) return;
        panel.classList.remove('open');
        overlay.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('sidebar-open');
    };

    const setValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value ?? '';
    };

    const studentInitials = (ho, ten, avatar) => {
        if (avatar) return avatar.trim().slice(0, 2).toUpperCase();
        const raw = `${ho || ''} ${ten || ''}`.trim();
        const parts = raw.split(/\s+/).filter(Boolean);
        if (parts.length === 0) return 'SV';
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    };

    const statusClass = (status) => {
        if (status === 'Bảo lưu') return 'status-paused';
        if (status === 'Nghỉ học') return 'status-inactive';
        return 'status-active';
    };

    const fillForm = (prefix, row) => {
        if (!row) return;
        setValue(`${prefix}-masv`, row.dataset.masv || '');
        setValue(`${prefix}-avatar`, row.dataset.avatar || '');
        setValue(`${prefix}-ho`, row.dataset.ho || '');
        setValue(`${prefix}-ten`, row.dataset.ten || '');
        setValue(`${prefix}-phai`, row.dataset.phai || 'Nam');
        setValue(`${prefix}-diachi`, row.dataset.diachi || '');
        setValue(`${prefix}-sodienthoai`, row.dataset.sodienthoai || '');
        setValue(`${prefix}-ngaysinh`, row.dataset.ngaysinh || '');
        setValue(`${prefix}-email`, row.dataset.email || '');
        setValue(`${prefix}-malop`, row.dataset.malop || '');
        setValue(`${prefix}-danghoc`, row.dataset.danghoc || 'Đang học');

        const avatarVal = row.dataset.avatar || '';
        const preview = document.getElementById(`${prefix}-avatar-preview`);
        const picker = document.getElementById(`${prefix}-avatar-picker`);
        if (!preview) return;

        if (avatarVal && avatarVal.indexOf && avatarVal.indexOf('data:') === 0) {
            preview.innerHTML = `<img src="${avatarVal}" alt="avatar"/>`;
            setAvatarState(picker, preview, true);
        } else if (avatarVal) {
            preview.innerHTML = `<div class="student-avatar">${avatarVal}</div>`;
            setAvatarState(picker, preview, true);
        } else {
            preview.innerHTML = defaultAvatarHtml();
            setAvatarState(picker, preview, false);
        }
    };

    const applyFilters = () => {
        if (!tbody) return;
        const keyword = (searchInput?.value || '').trim().toLowerCase();
        const classValue = classFilter?.value || '';
        const genderValue = genderFilter?.value || '';
        const statusValue = statusFilter?.value || '';

        Array.from(tbody.querySelectorAll('tr')).forEach((row) => {
            const rowText = row.textContent.toLowerCase();
            const matchesKeyword = !keyword || rowText.includes(keyword);
            const matchesClass = !classValue || row.dataset.malop === classValue;
            const matchesGender = !genderValue || row.dataset.phai === genderValue;
            const matchesStatus = !statusValue || row.dataset.danghoc === statusValue;
            row.style.display = matchesKeyword && matchesClass && matchesGender && matchesStatus ? '' : 'none';
        });
    };

    searchInput?.addEventListener('input', applyFilters);
    classFilter?.addEventListener('change', applyFilters);
    genderFilter?.addEventListener('change', applyFilters);
    statusFilter?.addEventListener('change', applyFilters);

    addBtn?.addEventListener('click', () => {
        // reset add form and preview before opening
        addForm?.reset();
        const hidden = document.getElementById('add-avatar');
        if (hidden) hidden.value = '';
        if (addAvatarPreview) {
            addAvatarPreview.innerHTML = defaultAvatarHtml();
        }
        if (addAvatarFile) addAvatarFile.value = '';
        setAvatarState(addAvatarPicker, addAvatarPreview, false);
        openPanel(addPanel, addOverlay);
    });
    closeAdd?.addEventListener('click', () => closePanel(addPanel, addOverlay));
    cancelAdd?.addEventListener('click', () => closePanel(addPanel, addOverlay));
    addOverlay?.addEventListener('click', () => closePanel(addPanel, addOverlay));

    closeEdit?.addEventListener('click', () => closePanel(editPanel, editOverlay));
    cancelEdit?.addEventListener('click', () => closePanel(editPanel, editOverlay));
    editOverlay?.addEventListener('click', () => closePanel(editPanel, editOverlay));

    tbody?.addEventListener('click', (event) => {
        const editBtn = event.target.closest('.edit-btn');
        const deleteBtn = event.target.closest('.delete-btn');
        const row = event.target.closest('tr');

        // debug logging to help diagnose missing popup
        // (will be removed after verification)
        if (editBtn) console.log('tbody click: editBtn detected', { editBtn, row });

        if (editBtn && row) {
            activeRow = row;
            fillForm('edit', row);
            openPanel(editPanel, editOverlay);
            return;
        }

        if (deleteBtn && row) {
            if (window.confirm(`Xóa sinh viên ${row.dataset.masv || ''}?`)) {
                row.remove();
                applyFilters();
            }
        }
    });

    // Fallback: capture clicks on any edit button (useful if delegation to tbody misses some elements)
    document.addEventListener('click', (event) => {
        const editBtn = event.target.closest('.edit-btn');
        if (!editBtn) return;
        const row = editBtn.closest('tr');
        console.log('document click fallback: editBtn clicked', { editBtn, row });
        if (row) {
            activeRow = row;
            fillForm('edit', row);
            openPanel(editPanel, editOverlay);
        }
    });

    submitAdd?.addEventListener('click', () => {
        if (!tbody) return;
        const data = getFormData('add');
        if (!data.masv || !data.ho || !data.ten) {
            window.alert('Vui lòng nhập ít nhất Mã SV, Họ và Tên.');
            return;
        }

        tbody.prepend(renderRow(data));
        addForm?.reset();
        if (hasDatepicker) {
            window.jQuery('.date-picker').datepicker('update', '');
        }
        closePanel(addPanel, addOverlay);
        applyFilters();
    });

    submitEdit?.addEventListener('click', () => {
        if (!activeRow) return;
        const data = getFormData('edit');
        if (!data.masv || !data.ho || !data.ten) {
            window.alert('Vui lòng nhập ít nhất Mã SV, Họ và Tên.');
            return;
        }

        const updated = renderRow(data);
        activeRow.replaceWith(updated);
        activeRow = updated;
        closePanel(editPanel, editOverlay);
        applyFilters();
    });
});

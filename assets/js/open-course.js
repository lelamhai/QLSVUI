document.addEventListener('DOMContentLoaded', () => {
	const tableBody = document.querySelector('.course-table tbody');

	// panel controls
	const addBtn = document.getElementById('add-course-btn');
	const addPanel = document.getElementById('add-course-panel');
	const addOverlay = document.getElementById('add-panel-overlay');
	const closePanelBtn = document.getElementById('close-add-panel');
	const cancelAddBtn = document.getElementById('cancel-add-course');
	const submitAddBtn = document.getElementById('submit-add-course');

	function openPanel() {
		if (addPanel) addPanel.classList.add('open');
		if (addOverlay) addOverlay.classList.add('open');
		if (addOverlay) addOverlay.style.visibility = 'visible';
	}

	function closePanel() {
		if (addPanel) addPanel.classList.remove('open');
		if (addOverlay) addOverlay.classList.remove('open');
		setTimeout(() => { if (addOverlay) addOverlay.style.visibility = 'hidden'; }, 320);
	}

	if (addBtn) addBtn.addEventListener('click', () => { openPanel(); initAddForm(); });
	if (closePanelBtn) closePanelBtn.addEventListener('click', closePanel);
	if (addOverlay) addOverlay.addEventListener('click', closePanel);
	if (cancelAddBtn) cancelAddBtn.addEventListener('click', closePanel);


	if (!tableBody) {
		return;
	}

	tableBody.addEventListener('click', (event) => {
		const button = event.target.closest('.action-btn');

		if (!button) {
			return;
		}

		const row = button.closest('tr');

		if (!row) {
			return;
		}

		if (button.classList.contains('edit-btn')) {
			editCourseRow(row);
		}

		if (button.classList.contains('delete-btn')) {
			deleteCourseRow(row);
		}
	});

	function getTrimmedText(element) {
		return element ? element.textContent.replace(/\s+/g, ' ').trim() : '';
	}

	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function askField(label, currentValue) {
		const nextValue = window.prompt(label, currentValue);

		if (nextValue === null) {
			return null;
		}

		return nextValue.trim();
	}

	function editCourseRow(row) {
		const cells = row.querySelectorAll('td');
		const courseCell = cells[1];
		const scheduleCell = cells[5];

		const data = {
			code: getTrimmedText(cells[0]),
			title: getTrimmedText(courseCell?.querySelector('strong')),
			meta: getTrimmedText(courseCell?.querySelector('small')),
			lecturer: getTrimmedText(cells[2]),
			term: getTrimmedText(cells[3]),
			size: getTrimmedText(cells[4]),
			schedule: getTrimmedText(scheduleCell?.querySelector('strong')),
			dateRange: getTrimmedText(scheduleCell?.querySelector('small')),
		};

		const nextCode = askField('Mã lớp HP:', data.code);
		if (nextCode === null) return;

		const nextTitle = askField('Tên môn học:', data.title);
		if (nextTitle === null) return;

		const nextMeta = askField('Mã môn · Số tín chỉ:', data.meta);
		if (nextMeta === null) return;

		const nextLecturer = askField('Giảng viên:', data.lecturer);
		if (nextLecturer === null) return;

		const nextTerm = askField('Học kỳ:', data.term);
		if (nextTerm === null) return;

		const nextSize = askField('Sĩ số:', data.size);
		if (nextSize === null) return;

		const nextSchedule = askField('Lịch học:', data.schedule);
		if (nextSchedule === null) return;

		const nextDateRange = askField('Khoảng thời gian học:', data.dateRange);
		if (nextDateRange === null) return;

		cells[0].innerHTML = `<span class="code">${escapeHtml(nextCode)}</span>`;
		cells[1].innerHTML = `<strong>${escapeHtml(nextTitle)}</strong><small>${escapeHtml(nextMeta)}</small>`;
		cells[2].textContent = nextLecturer;
		cells[3].innerHTML = `<span class="term">${escapeHtml(nextTerm)}</span>`;
		cells[4].textContent = nextSize;
		cells[5].innerHTML = `<strong>${escapeHtml(nextSchedule)}</strong><small>${escapeHtml(nextDateRange)}</small>`;
	}

	function deleteCourseRow(row) {
		const courseName = getTrimmedText(row.querySelector('td:nth-child(2) strong')) || 'môn học này';
		const confirmed = window.confirm(`Xóa lớp học phần "${courseName}"?`);

		if (!confirmed) {
			return;
		}

		row.remove();
	}


	// ------------------ Add panel helpers ------------------

	function gatherExistingOptions() {
		const titles = new Set();
		const lecturers = new Set();
		document.querySelectorAll('.course-table tbody tr').forEach(tr => {
			const title = getTrimmedText(tr.querySelector('td:nth-child(2) strong'));
			const lecturer = getTrimmedText(tr.querySelector('td:nth-child(3)'));
			if (title) titles.add(title);
			if (lecturer) lecturers.add(lecturer);
		});
		return { titles: Array.from(titles), lecturers: Array.from(lecturers) };
	}

	function generateNextClassCode() {
		const codes = Array.from(document.querySelectorAll('.course-table tbody tr td.code'))
			.map(cell => getTrimmedText(cell))
			.map(code => {
				const match = code.match(/^INT(\d+)_/i);
				return match ? parseInt(match[1], 10) : null;
			})
			.filter(value => Number.isFinite(value));

		const nextNumber = codes.length ? Math.max(...codes) + 1 : 1001;
		return `INT${nextNumber}_1`;
	}

	function initAddForm() {
		// populate dropdowns
		const opts = gatherExistingOptions();
		const courseSelect = document.getElementById('add-course-name');
		const lecturerSelect = document.getElementById('add-lecturer');
		if (courseSelect) {
			courseSelect.innerHTML = '';
			opts.titles.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; courseSelect.appendChild(o); });
		}
		if (lecturerSelect) {
			lecturerSelect.innerHTML = '';
			opts.lecturers.forEach(l => { const o = document.createElement('option'); o.value = l; o.textContent = l; lecturerSelect.appendChild(o); });
		}


		// init year picker and date pickers (format year as YYYY-YYYY+1)
		try {
			const $yearPicker = $('#add-academic-year');
			const $startPicker = $('#add-start-date');
			const $endPicker = $('#add-end-date');
			const today = new Date();

			$yearPicker.datepicker('destroy');
			$startPicker.datepicker('destroy');
			$endPicker.datepicker('destroy');

			$yearPicker.datepicker({ format: 'yyyy', startView: 2, minViewMode: 'years', autoclose: true })
				.on('hide', function () {
					const el = $(this);
					setTimeout(function () {
						const raw = el.val();
						if (raw && raw.match(/^\d{4}$/)) {
							const y = parseInt(raw, 10);
							el.val(y + '-' + (y + 1));
						}
					}, 0);
				});

			$startPicker.datepicker({
				format: 'dd/mm/yyyy',
				autoclose: true,
				startDate: today,
			});

			$endPicker.datepicker({
				format: 'dd/mm/yyyy',
				autoclose: true,
				startDate: today,
			});

			$startPicker.off('changeDate.addPanel').on('changeDate.addPanel', function () {
				const startDate = $(this).datepicker('getDate');
				const minEndDate = startDate || today;

				$endPicker.datepicker('setStartDate', minEndDate);

				const currentEndDate = $endPicker.datepicker('getDate');
				if (currentEndDate && currentEndDate < minEndDate) {
					$endPicker.datepicker('clearDates');
				}
			});

			$endPicker.off('changeDate.addPanel').on('changeDate.addPanel', function () {
				const endDate = $(this).datepicker('getDate');
				const minStartDate = today;

				$startPicker.datepicker('setStartDate', minStartDate);
				$startPicker.datepicker('setEndDate', endDate || null);

				const currentStartDate = $startPicker.datepicker('getDate');
				if (currentStartDate && endDate && currentStartDate > endDate) {
					$startPicker.datepicker('clearDates');
				}
			});

			// set initial display for popup year picker to current year range
			const currentYear = new Date().getFullYear();
			const addYearEl = $('#add-academic-year');
			if (addYearEl && addYearEl.length) {
				addYearEl.val(currentYear + '-' + (currentYear + 1));
			}
		} catch (e) {
			// ignore if bootstrap-datepicker not available
		}
	}

	if (submitAddBtn) {
		submitAddBtn.addEventListener('click', () => {
			const courseSelect = document.getElementById('add-course-name');
			const lecturerSelect = document.getElementById('add-lecturer');
			const term = document.getElementById('add-term')?.value || '';
			const academic = document.getElementById('add-academic-year')?.value || '';
			const maxSize = document.getElementById('add-max-size')?.value || '0';
			const schedule = document.getElementById('add-weekdays')?.value || '';
			const dateRangeStart = document.getElementById('add-start-date')?.value || '';
			const dateRangeEnd = document.getElementById('add-end-date')?.value || '';
			const status = document.getElementById('add-status')?.value || '';

			const courseTitle = courseSelect?.value || '';
			const lecturer = lecturerSelect?.value || '';
			const code = generateNextClassCode();

			// append row to table
			const tbody = document.querySelector('.course-table tbody');
			if (!tbody) return;

			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td class="code">${escapeHtml(code)}</td>
				<td><strong>${escapeHtml(courseTitle)}</strong><small>${escapeHtml('')}</small></td>
				<td>${escapeHtml(lecturer)}</td>
				<td><span class="term">${escapeHtml(term)}</span></td>
				<td>${escapeHtml('0/' + maxSize)}</td>
				<td><strong>${escapeHtml(schedule)}</strong><small>${escapeHtml(dateRangeStart + ' - ' + dateRangeEnd)}</small></td>
				<td class="actions-cell">
					<div class="course-actions">
						<button type="button" class="action-btn edit-btn" title="Sửa"><i class="fa-solid fa-pen"></i></button>
						<button type="button" class="action-btn delete-btn" title="Xóa"><i class="fa-solid fa-trash"></i></button>
					</div>
				</td>
			`;
			tbody.appendChild(tr);

			window.alert(`Đã thêm môn học phần: ${courseTitle}`);

			closePanel();
		});
	}
});

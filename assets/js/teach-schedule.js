document.addEventListener('DOMContentLoaded', function () {
	const calendarEl = document.getElementById('calendar');
	const toggleWrap = document.getElementById('view-toggle');

	if (!calendarEl || typeof FullCalendar === 'undefined') {
		return;
	}

	const calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: 'timeGridWeek',
		eventDisplay: 'block',
		locale: 'vi',
		firstDay: 1,
		height: 'auto',
		nowIndicator: false,
		expandRows: false,
		allDaySlot: false,
		slotMinTime: '07:00:00',
		slotMaxTime: '22:30:00',
		slotDuration: '01:00:00',
		weekends: true,
		showNonCurrentDates: false,
		fixedWeekCount: false,
		headerToolbar: {
			left: 'prev',
			center: 'title',
			right: 'next'
		},
		dayHeaderContent: function (arg) {
			const weekdayNames = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
			const weekday = weekdayNames[arg.date.getDay()];
			const day = arg.date.getDate();
			const month = arg.date.getMonth() + 1;

			return {
				html: `
					<span class="fc-day-header-weekday">${weekday}</span>
					<span class="fc-day-header-date">(${day}/${month})</span>
				`
			};
		},
		events: [
			{
				title: 'Môn học quản lý dự án phần mềm',
				start: '2026-05-04T19:00:00',
				end: '2026-05-04T21:00:00',
				backgroundColor: '#5dade2',
				borderColor: '#5dade2',
				extendedProps: {
					room: 'Phòng: LOPMONHOC22 - ID: 7270745873',
					teacher: 'GV: Nguyễn Anh Hào',
					group: 'Nhóm: 10',
					mode: 'Link online'
				}
			},
			{
				title: 'Cơ sở dữ liệu',
				start: '2026-05-05T07:00:00',
				end: '2026-05-05T09:30:00',
				backgroundColor: '#34d399',
				borderColor: '#34d399',
				extendedProps: {
					room: 'Phòng: C201',
					teacher: 'GV: Trần Thị Minh',
					group: 'Nhóm: 03',
					mode: 'Trực tiếp'
				}
			},
			{
				title: 'Cấu trúc dữ liệu và giải thuật',
				start: '2026-06-05T07:00:00',
				end: '2026-06-05T12:00:00',
				backgroundColor: '#34d399',
				borderColor: '#34d399',
				extendedProps: {
					room: 'Phòng: C201',
					teacher: 'GV: Trần Thị Minh',
					group: 'Nhóm: 03',
					mode: 'Trực tiếp'
				}
			},
			{
				title: 'Lập trình hướng đối tượng',
				start: '2026-05-07T13:30:00',
				end: '2026-05-07T16:00:00',
				backgroundColor: '#a78bfa',
				borderColor: '#a78bfa',
				extendedProps: {
					room: 'Phòng: B305',
					teacher: 'GV: Lê Văn Nam',
					group: 'Nhóm: 12',
					mode: 'Thực hành'
				}
			}
		],
		eventContent: function (arg) {
			const timeText = arg.timeText ? `<div class="schedule-event__meta">${arg.timeText}</div>` : '';
			const roomText = arg.event.extendedProps.room ? `<div class="schedule-event__meta">${arg.event.extendedProps.room}</div>` : '';
			const title = arg.event.title || '';

			return {
				html: `
					<div class="schedule-event">
						<div class="schedule-event__title">${title}</div>
						${timeText}
						${roomText}
					</div>
				`
			};
		},
		eventClick: function (info) {
			const props = info.event.extendedProps;
			const details = [
				info.event.title,
				props.group,
				props.room,
				props.teacher,
				props.mode
			].filter(Boolean).join('\n');

			alert(details);
		}
		,
		// Debug hook: runs after event elements are added to the DOM
		eventDidMount: function(info) {
			// logs which view the event was mounted into
			console.log('FC:eventDidMount', info.event.title, info.view && info.view.type);
		}
		,
		// customize title formatting: dd/mm - dd/mm, yyyy
		datesSet: function(info) {
			try {
				const start = info.start;
				// info.end is exclusive for many views, subtract one day
				const end = new Date(info.end);
				end.setDate(end.getDate() - 1);

				function fmt(d){
					const day = d.getDate();
					const month = d.getMonth() + 1;
					return day + '/' + month;
				}

				const year = end.getFullYear();
				const title = `${fmt(start)} - ${fmt(end)}, ${year}`;
				const el = document.querySelector('.fc-toolbar-title');
				if (el) el.textContent = title;
			} catch (e) {
				// ignore formatting errors
			}
		}
	});

	calendar.render();

	if (toggleWrap) {
		const buttons = toggleWrap.querySelectorAll('.view-btn');

		buttons.forEach((button) => {
			button.addEventListener('click', function () {
				const viewName = this.getAttribute('data-view');
				calendar.changeView(viewName);

				buttons.forEach((item) => item.classList.remove('is-active'));
				this.classList.add('is-active');
			});
		});
	}
});

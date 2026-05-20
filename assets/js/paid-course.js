document.addEventListener('DOMContentLoaded', function () {
	const modal = document.getElementById('qr-modal');
	const modalOverlay = document.getElementById('qr-modal-overlay');
	const qrImage = document.getElementById('qr-image');
	const qrClose = document.getElementById('qr-close');

	function openModal(imgSrc) {
		if (!modal) return;
		qrImage.src = imgSrc || '';
		modal.classList.add('show');
		modal.setAttribute('aria-hidden', 'false');
	}

	function closeModal() {
		if (!modal) return;
		modal.classList.remove('show');
		modal.setAttribute('aria-hidden', 'true');
		// clear src after a brief delay to avoid flashing
		setTimeout(() => { qrImage.src = ''; }, 200);
	}

	document.querySelectorAll('.qr-btn').forEach(btn => {
		btn.addEventListener('click', function (e) {
			const src = btn.getAttribute('data-img') || btn.dataset.img;
			openModal(src);
		});
	});

	if (qrClose) qrClose.addEventListener('click', closeModal);
	if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closeModal();
	});
});

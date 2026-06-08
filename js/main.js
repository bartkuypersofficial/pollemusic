document.addEventListener("DOMContentLoaded", () => {

	/* ================================================= */
	/* NAVIGATION
	/* ================================================= */
	
	const navButtons = document.querySelectorAll(".js-nav-trigger");
	const navList = document.querySelector(".js-nav");
	const navLinks = document.querySelectorAll(".js-nav-btn");
	const navBackToTop = document.querySelector(".js-back-to-top");

	// Toggle navigation
	navButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const isActive = navList.classList.toggle("is-active");

			navButtons.forEach((b) =>
				b.setAttribute("aria-expanded", isActive)
			);
		});
	});

	// Handle nav link clicks
	navLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();

			const targetId = link.getAttribute("href");
			const targetEl = document.querySelector(targetId);

			// Close nav
			navList.classList.remove("is-active");
			navButtons.forEach((b) =>
				b.setAttribute("aria-expanded", false)
			);

			// Scroll smoothly
			if (targetEl) {
				const elementTop = targetEl.getBoundingClientRect().top + window.scrollY;
				const offsetPosition = elementTop + 15;

				// Scroll to top (logo offset)
				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});
			}
		});
	});

	if (navBackToTop) {
		navBackToTop.addEventListener("click", (e) => {
			e.preventDefault();

			// Close navigation
			navList.classList.remove("is-active");
			navButtons.forEach((b) =>
				b.setAttribute("aria-expanded", false)
			);

			// Scroll to top (no offset)
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		});
	}

	/* ================================================= */
	/* SLIDER
	/* ================================================= */

	const slides = document.querySelectorAll(".js-slide");
	let currentSlide = 0;
	const slideInterval = 4000;

	function showSlide(index) {
		slides.forEach((slide, i) => {
			slide.classList.toggle("is-active", i === index);
		});
	}

	function nextSlide() {
		currentSlide = (currentSlide + 1) % slides.length;
		showSlide(currentSlide);
	}

	// Initialize only if slides exist
	if (slides.length > 0) {
		showSlide(currentSlide);
		setInterval(nextSlide, slideInterval);
	}

	/* ================================================= */
	/* PARALLAX
	/* ================================================= */

	const parallaxItems = document.querySelectorAll('.js-parallax');

	function updateParallax() {
		const scrollY = window.scrollY;

		parallaxItems.forEach(el => {
			const parallaxSpeed = parseFloat(el.dataset.speed) || 0.2;
			const parallaxRect = el.getBoundingClientRect();
			const parallaxOffset = parallaxRect.top + scrollY;

			const parallaxPos = (scrollY - parallaxOffset) * parallaxSpeed;
			el.style.setProperty('--y', `${parallaxPos}px`);
		});
	}

	// Run once
	updateParallax();

	// Run on scroll + resize
	window.addEventListener('scroll', updateParallax);
	window.addEventListener('resize', updateParallax);

	/* ================================================= */
	/* SCROLL LOCK
	/* ================================================= */

	let scrollY = 0;

	function lockScroll() {
		scrollY = window.scrollY;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = '100%';
		document.body.style.paddingRight = `${scrollbarWidth}px`;
	}

	function unlockScroll() {
		document.body.style.position = '';
		document.body.style.top = '';
		document.body.style.width = '';
		window.scrollTo(0, scrollY);
	}

	/* ================================================= */
	/* SCROLL EFFECTS
	/* ================================================= */

	const contentContainer = document.querySelector('.js-content');
	const navContainer = document.querySelector('.js-nav');
	const logoContainer = document.querySelector('.js-logo');
	const contentLogoContainer = document.querySelector('.js-content-logo');

	if (!contentContainer) return;

	const containerOffset = contentContainer.offsetTop;

	window.addEventListener('scroll', () => {
		const scroll = window.scrollY;

		// Navigation fade
		if (navContainer) {
			if (scroll >= containerOffset - 80) {
				navContainer.classList.add('is-fixed');
			} else {
				navContainer.classList.remove('is-fixed');
			}
		}

		// Logo switch
		if (logoContainer && contentLogoContainer) {
			if (scroll >= containerOffset + 15) {
				logoContainer.classList.add('is-hidden');
				contentLogoContainer.classList.remove('is-hidden');
			} else {
				logoContainer.classList.remove('is-hidden');
				contentLogoContainer.classList.add('is-hidden');
			}
		}
	});

	/* ================================================= */
	/* Card & BACK BUTTON
	/* ================================================= */

	document.querySelectorAll('.js-card').forEach(card => {
		card.addEventListener('click', () => {
			sessionStorage.setItem('scrollPosition',	window.scrollY);
		});
	});

	document.querySelectorAll('.js-back').forEach(btn => {
		btn.addEventListener('click', () => {
			const pathParts = window.location.pathname.split('/').filter(Boolean);
			const target = pathParts[0];

			if (target) {
				sessionStorage.setItem('scrollTarget', target);
			}

			window.location.href = '/';
		});
	});

	requestAnimationFrame(() => {
		const target = sessionStorage.getItem('scrollTarget');

		if (target) {
			const pos = sessionStorage.getItem('scrollPosition');

			if (pos !== null) {
				window.scrollTo({
					top: parseInt(pos, 10),
					behavior: 'smooth'
				});

				sessionStorage.removeItem('scrollPosition');
				sessionStorage.removeItem('scrollTarget');
			} else {
				const el = document.getElementById(target);
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
				sessionStorage.removeItem('scrollPosition');
				sessionStorage.removeItem('scrollTarget');
			}
		}
	});

	/* ================================================= */
	/* PAGER
	/* ================================================= */

	const pagerContainer = document.querySelector('.js-content-container');

	if (pagerContainer) {
		const pagerItems = Array.from(pagerContainer.querySelectorAll('.js-content-item'));
		const pagerComponent = document.querySelector('.js-pager');
		const contentPerPage = 6;

		let currentContentPage = Number(sessionStorage.getItem('contentPage')) || 1;
		const totalContentPages = Math.ceil(pagerItems.length / contentPerPage);
		currentContentPage = Math.min(Math.max(currentContentPage, 1), totalContentPages);

		function renderItems() {
			const start = (currentContentPage - 1) * contentPerPage;
			const end = start + contentPerPage;

			pagerItems.forEach((item, index) => {
				item.style.display = index >= start && index < end ? '' : 'none';
			});
		}

		function createButton(label, page, isActive = false, disabled = false) {
			const btn = document.createElement('button');
			btn.textContent = label;
			btn.className = 'c-pager__btn';

			if (isActive) btn.classList.add('is-active');
			if (disabled) btn.disabled = true;

			btn.addEventListener('click', () => {
				if (page < 1 || page > totalContentPages) return;

				currentContentPage = page;
				sessionStorage.setItem('contentPage', currentContentPage);

				render();
			});

			return btn;
		}

		function renderPager() {
			pagerComponent.innerHTML = '';

			pagerComponent.appendChild(
				createButton('←', currentContentPage - 1, false, currentContentPage === 1)
			);

			for (let i = 1; i <= totalContentPages; i++) {
				pagerComponent.appendChild(
					createButton(i, i, i === currentContentPage)
				);
			}

			pagerComponent.appendChild(
				createButton('→', currentContentPage + 1, false, currentContentPage === totalContentPages)
			);
		}

		function render() {
			renderItems();
			renderPager();
		}

		requestAnimationFrame(render);
	}
});
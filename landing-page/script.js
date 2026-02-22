/**
 * FlexiStaff Landing Page Scripts
 * Handles navigation, mobile menu, and smooth scrolling
 */

// DOM Elements
const navbar = document.getElementById("navbar");
const mobileMenu = document.getElementById("mobile-menu");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");

/**
 * Handle navbar background on scroll
 * Adds background blur effect when user scrolls down
 */
document.addEventListener("DOMContentLoaded", () => {
	function handleScroll() {
		if (window.scrollY > 50) {
			navbar.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
			navbar.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
		} else {
			navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
			navbar.style.boxShadow = "none";
		}
	}

	window.addEventListener("scroll", handleScroll);
	handleScroll(); // Initial check
});

/**
 * Mobile menu toggle
 */
if (menuBtn && mobileMenu && closeBtn) {
	menuBtn.addEventListener("click", () => {
		mobileMenu.classList.remove("-translate-x-full");
		mobileMenu.classList.add("translate-x-0");
		document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
	});

	closeBtn.addEventListener("click", () => {
		mobileMenu.classList.remove("translate-x-0");
		mobileMenu.classList.add("-translate-x-full");
		document.body.style.overflow = ""; // Restore scrolling
	});

	// Close mobile menu when clicking on a link
	mobileMenu.querySelectorAll("a").forEach(link => {
		link.addEventListener("click", () => {
			mobileMenu.classList.remove("translate-x-0");
			mobileMenu.classList.add("-translate-x-full");
			document.body.style.overflow = "";
		});
	});
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener("click", function (e) {
		const targetId = this.getAttribute("href");

		// Skip if it's just "#" or external placeholder links
		if (targetId === "#" || targetId === "#!") {
			e.preventDefault();
			return;
		}

		const targetElement = document.querySelector(targetId);

		if (targetElement) {
			e.preventDefault();

			// Calculate offset for fixed navbar
			const navbarHeight = navbar ? navbar.offsetHeight : 0;
			const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

			window.scrollTo({
				top: targetPosition,
				behavior: "smooth"
			});
		}
	});
});

/**
 * Add animation on scroll for feature cards
 */
document.addEventListener("DOMContentLoaded", () => {
	const observerOptions = {
		root: null,
		rootMargin: "0px",
		threshold: 0.1
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = "1";
				entry.target.style.transform = "translateY(0)";
			}
		});
	}, observerOptions);

	// Observe feature cards
	document.querySelectorAll(".feature-card").forEach((card, index) => {
		card.style.opacity = "0";
		card.style.transform = "translateY(20px)";
		card.style.transition = `all 0.5s ease ${index * 0.1}s`;
		observer.observe(card);
	});

	// Observe step cards
	document.querySelectorAll(".step-card").forEach((card, index) => {
		card.style.opacity = "0";
		card.style.transform = "translateY(20px)";
		card.style.transition = `all 0.5s ease ${index * 0.15}s`;
		observer.observe(card);
	});
});

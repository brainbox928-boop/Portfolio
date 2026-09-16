// Portfolio boilerplate script
// Currently handles: dynamic footer year, and auto-closing the mobile
// navbar when a link is tapped (small UX nicety on smaller screens).

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const navLinks = document.querySelectorAll("#navMenu .nav-link");
  const navMenu = document.getElementById("navMenu");
  const navbarToggler = document.querySelector(".navbar-toggler");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("show") && navbarToggler) {
        navbarToggler.click();
      }
    });
  });
});

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

  const projectImages = document.querySelectorAll(".project-image-strip img, .crypto-qr");
  let lastFocusedImage = null;

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Full-size project image preview");
  lightbox.innerHTML = `
    <button class="image-lightbox-close" type="button" aria-label="Close image preview">&times;</button>
    <img class="image-lightbox-image" alt="">
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".image-lightbox-image");
  const closeButton = lightbox.querySelector(".image-lightbox-close");

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    if (lastFocusedImage) {
      lastFocusedImage.focus();
    }
  };

  const openLightbox = (image) => {
    lastFocusedImage = image;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  projectImages.forEach((image) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  document.querySelectorAll("[data-copy-value]").forEach((copyButton) => {
    copyButton.addEventListener("click", async () => {
      const value = copyButton.dataset.copyValue;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const temporaryInput = document.createElement("input");
          temporaryInput.value = value;
          document.body.appendChild(temporaryInput);
          temporaryInput.select();
          document.execCommand("copy");
          temporaryInput.remove();
        }
      } catch (error) {
        return;
      }
      const originalLabel = copyButton.getAttribute("aria-label");
      copyButton.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
      copyButton.setAttribute("aria-label", "Address copied");
      setTimeout(() => {
        copyButton.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i>';
        copyButton.setAttribute("aria-label", originalLabel);
      }, 1600);
    });
  });

  const giftCardForm = document.querySelector(".manual-payment-panel .payment-form");
  if (giftCardForm) {
    document.getElementById("giftName")?.closest(".col-md-6")?.remove();
    document.getElementById("giftEmail")?.closest(".col-md-6")?.remove();
    giftCardForm.insertAdjacentHTML("afterbegin", '<div class="row g-3 supporter-contact-fields mb-3"><div class="col-md-6"><label for="giftFirstName" class="form-label">First name</label><input type="text" class="form-control" id="giftFirstName" name="first_name" required></div><div class="col-md-6"><label for="giftLastName" class="form-label">Last name</label><input type="text" class="form-control" id="giftLastName" name="last_name" required></div><div class="col-md-6"><label for="giftPhone" class="form-label">Phone number</label><input type="tel" class="form-control" id="giftPhone" name="phone" placeholder="+234..." required></div><div class="col-md-6"><label for="giftEmail" class="form-label">Email address</label><input type="email" class="form-control" id="giftEmail" name="email" required></div></div>');
  }

  const cryptoProofForm = document.querySelector(".crypto-proof-form");
  if (cryptoProofForm) {
    document.getElementById("cryptoName")?.closest(".col-md-4")?.remove();
    cryptoProofForm.insertAdjacentHTML("afterbegin", '<div class="row g-3 supporter-contact-fields mb-3"><div class="col-md-6"><label for="cryptoFirstName" class="form-label">First name</label><input type="text" class="form-control" id="cryptoFirstName" name="first_name" required></div><div class="col-md-6"><label for="cryptoLastName" class="form-label">Last name</label><input type="text" class="form-control" id="cryptoLastName" name="last_name" required></div><div class="col-md-6"><label for="cryptoPhone" class="form-label">Phone number</label><input type="tel" class="form-control" id="cryptoPhone" name="phone" placeholder="+234..." required></div><div class="col-md-6"><label for="cryptoEmail" class="form-label">Email address</label><input type="email" class="form-control" id="cryptoEmail" name="email" required></div></div>');
  }

  const paymentMethod = document.getElementById("paymentMethod");
  const cryptoPaymentOption = document.getElementById("cryptoPaymentOption");
  const giftCardPaymentOption = document.getElementById("giftCardPaymentOption");

  if (paymentMethod && cryptoPaymentOption && giftCardPaymentOption) {
    const setPaymentOptionState = (panel, isActive) => {
      panel.hidden = !isActive;
      panel.querySelectorAll("input, select, textarea, button").forEach((control) => {
        control.disabled = !isActive;
      });
    };

    setPaymentOptionState(cryptoPaymentOption, true);
    setPaymentOptionState(giftCardPaymentOption, false);

    paymentMethod.addEventListener("change", () => {
      const giftCardSelected = paymentMethod.value === "gift-card";
      setPaymentOptionState(cryptoPaymentOption, !giftCardSelected);
      setPaymentOptionState(giftCardPaymentOption, giftCardSelected);
    });
  }
});

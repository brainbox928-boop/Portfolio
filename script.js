// Portfolio boilerplate script
// Currently handles: dynamic footer year, and auto-closing the mobile
// navbar when a link is tapped (small UX nicety on smaller screens).

const initializeFormspreeForms = () => {
  const formspreeForms = document.querySelectorAll('form[action^="https://formspree.io/"]');

  formspreeForms.forEach((form) => {
    const status = document.createElement("div");
    status.className = "formspree-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.hidden = true;
    form.after(status);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonContent = submitButton?.innerHTML;
      const isPaymentForm = form.classList.contains("payment-form");
      status.hidden = false;
      status.classList.remove("is-error");
      status.textContent = "Sending...";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Form submission failed");

        status.innerHTML = isPaymentForm
          ? 'Payment evidence received. I’ll review it and confirm within 24 hours. For follow-up, message me on <a href="https://wa.me/message/YDNRHAYWZTXXD1" target="_blank" rel="noopener noreferrer">WhatsApp</a> or <a href="https://t.me/Brianbox928" target="_blank" rel="noopener noreferrer">Telegram</a>, or see my <a href="contact.html#contact">contact and community links</a>.'
          : 'Message received. I’ll get back to you as soon as I can. You can also reach me on <a href="https://wa.me/message/YDNRHAYWZTXXD1" target="_blank" rel="noopener noreferrer">WhatsApp</a> or <a href="https://t.me/Brianbox928" target="_blank" rel="noopener noreferrer">Telegram</a>.';
        form.reset();
      } catch (error) {
        status.classList.add("is-error");
        status.innerHTML = 'That didn’t go through. Please try again, or contact me on <a href="https://wa.me/message/YDNRHAYWZTXXD1" target="_blank" rel="noopener noreferrer">WhatsApp</a> or <a href="https://t.me/Brianbox928" target="_blank" rel="noopener noreferrer">Telegram</a>.';
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonContent;
        }
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initializeFormspreeForms();

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

  const initializePhoneInput = (input) => {
    if (!input || !window.intlTelInput) return;

    const fieldName = input.name;
    input.name = `${input.id}_local`;
    return window.intlTelInput(input, {
      initialCountry: "ng",
      countryOrder: ["ng", "gh", "us", "ca", "gb", "au", "ch"],
      separateDialCode: true,
      loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.5.3/dist/js/utils.js"),
      hiddenInputs: () => ({ phone: fieldName, country: `${fieldName}_country` })
    });
  };

  const giftCardForm = document.querySelector(".manual-payment-panel .payment-form");
  if (giftCardForm) {
    document.getElementById("giftName")?.closest(".col-md-6")?.remove();
    document.getElementById("giftEmail")?.closest(".col-md-6")?.remove();
    giftCardForm.insertAdjacentHTML("afterbegin", '<div class="row g-3 supporter-contact-fields mb-3"><div class="col-md-6"><label for="giftName" class="form-label">Name</label><input type="text" class="form-control" id="giftName" name="name" required></div><div class="col-md-6"><label for="giftEmail" class="form-label">Email address</label><input type="email" class="form-control" id="giftEmail" name="email" required></div><div class="col-md-6"><label for="giftPhone" class="form-label">Phone number</label><input type="tel" class="form-control" id="giftPhone" name="phone" required></div></div>');
    initializePhoneInput(giftCardForm.querySelector("#giftPhone"));

    const giftType = document.getElementById("giftType");
    const giftNumber = document.getElementById("giftNumber");
    const giftExpiry = document.getElementById("giftExpiry");
    const giftNotes = document.getElementById("giftNotes");
    const cardFront = document.getElementById("cardFront");
    const cardBack = document.getElementById("cardBack");
    const cardReceipt = document.getElementById("cardReceipt");
    const instructionList = document.querySelector(".manual-payment-panel .payment-steps");
    const instructionIntro = document.querySelector(".manual-payment-panel .col-lg-5 > .text-body-secondary");
    const cardNumberLabel = giftNumber?.closest(".col-md-6")?.querySelector("label");

    if (giftType && giftNumber && cardFront && cardBack && cardReceipt) {
      const physicalOption = giftType.options[1];
      const eGiftOption = giftType.options[2];
      physicalOption.value = "physical";
      eGiftOption.value = "e-gift";

      const marketSelect = document.getElementById("giftIssueMarket");
      const marketCurrency = document.getElementById("giftMarketCurrency");
      const amountInput = document.getElementById("giftAmountUsd");

      marketSelect.addEventListener("change", () => {
        marketCurrency.textContent = `Card currency: ${marketSelect.value}`;
      });

      const screenshotColumn = document.createElement("div");
      screenshotColumn.className = "col-md-4";
      screenshotColumn.innerHTML = '<label for="giftEmailScreenshot" class="form-label">Email screenshot with e-gift code (required)</label><input type="file" class="form-control" id="giftEmailScreenshot" name="email_code_screenshot" accept="image/*,.pdf">';
      cardReceipt.closest(".col-md-4").after(screenshotColumn);
      const emailScreenshot = screenshotColumn.querySelector("input");

      const codeHint = document.createElement("div");
      codeHint.id = "giftCodeHint";
      codeHint.className = "form-text";
      codeHint.textContent = "Check your email for the e-gift code.";
      giftNumber.after(codeHint);

      const otherUploadsColumn = document.createElement("div");
      otherUploadsColumn.className = "col-md-4";
      otherUploadsColumn.innerHTML = '<label for="giftOtherUploads" class="form-label">Other uploads (optional)</label><input type="file" class="form-control" id="giftOtherUploads" name="other_uploads[]" accept="image/*,.pdf" multiple>';
      screenshotColumn.after(otherUploadsColumn);

      const setFieldState = (field, isVisible, isRequired) => {
        const column = field.closest(".col-md-4, .col-md-6, .col-12");
        column.hidden = !isVisible;
        field.disabled = !isVisible;
        field.required = isVisible && isRequired;
      };

      const updateGiftCardType = () => {
        const isPhysical = giftType.value === "physical";
        const isEGift = giftType.value === "e-gift";
        const hasType = isPhysical || isEGift;
        setFieldState(marketSelect, hasType, true);
        setFieldState(amountInput, hasType, true);
        setFieldState(giftExpiry, true, false);
        setFieldState(giftNotes, true, false);
        setFieldState(giftNumber, hasType, isPhysical);
        setFieldState(cardFront, isPhysical, true);
        setFieldState(cardBack, isPhysical, true);
        setFieldState(cardReceipt, hasType, true);
        setFieldState(emailScreenshot, isEGift, true);
        cardFront.closest(".col-md-4").querySelector("label").textContent = "Card front photo (required)";
        cardBack.closest(".col-md-4").querySelector("label").textContent = "Card back photo (required)";
        cardReceipt.closest(".col-md-4").querySelector("label").textContent = "Purchase receipt (required)";
        cardNumberLabel.textContent = isPhysical ? "Card number or PIN (required)" : "E-gift code number";
        codeHint.hidden = !isEGift;
        if (isEGift) {
          giftNumber.setAttribute("aria-describedby", codeHint.id);
        } else {
          giftNumber.removeAttribute("aria-describedby");
        }

        if (instructionIntro && instructionList) {
          instructionIntro.textContent = isPhysical
            ? "Get a physical gift card in a store or order one online for delivery."
            : "Buy an e-gift card online and check your email for the code.";
          instructionList.innerHTML = isPhysical
            ? "<li><span>01</span>Buy a physical card in-store or order one online.</li><li><span>02</span>Gently scratch the covered PIN area and enter the card number or PIN.</li><li><span>03</span>Upload three required files: clear photos of the front and back, plus the purchase receipt. You can add other files in the optional upload field.</li>"
            : "<li><span>01</span>Purchase an e-gift card online and open the delivery email.</li><li><span>02</span>Enter the code if available.</li><li><span>03</span>Upload two required files: the purchase receipt and a screenshot of the email showing the code. Other files are optional.</li>";
        }
      };

      giftType.addEventListener("change", updateGiftCardType);
      updateGiftCardType();
    }
  }

  const cryptoProofForm = document.querySelector(".crypto-proof-form");
  if (cryptoProofForm) {
    document.getElementById("cryptoName")?.closest(".col-md-4")?.remove();
    cryptoProofForm.insertAdjacentHTML("afterbegin", '<div class="row g-3 supporter-contact-fields mb-3"><div class="col-md-6"><label for="cryptoName" class="form-label">Name</label><input type="text" class="form-control" id="cryptoName" name="name" required></div><div class="col-md-6"><label for="cryptoEmail" class="form-label">Email address</label><input type="email" class="form-control" id="cryptoEmail" name="email" required></div><div class="col-md-6"><label for="cryptoPhone" class="form-label">Phone number</label><input type="tel" class="form-control" id="cryptoPhone" name="phone" required></div></div>');
    initializePhoneInput(cryptoProofForm.querySelector("#cryptoPhone"));
  }

  const paymentMethod = document.getElementById("paymentMethod");
  const cryptoPaymentOption = document.getElementById("cryptoPaymentOption");
  const giftCardPaymentOption = document.getElementById("giftCardPaymentOption");

  const cryptoCards = [...document.querySelectorAll("#cryptoPaymentOption .crypto-card")];
  const cryptoCardsRow = cryptoCards[0]?.closest(".row");
  if (cryptoCards.length && cryptoCardsRow) {
    const methodChoice = document.createElement("div");
    methodChoice.className = "payment-choice crypto-method-choice mb-4";

    const methodLabel = document.createElement("label");
    methodLabel.className = "form-label";
    methodLabel.htmlFor = "cryptoMethod";
    methodLabel.textContent = "Preferred cryptocurrency";

    const methodSelect = document.createElement("select");
    methodSelect.id = "cryptoMethod";
    methodSelect.className = "form-select";
    cryptoCards.forEach((card) => {
      const name = card.querySelector("h3")?.textContent.trim();
      const symbol = card.querySelector(".payment-badge")?.textContent.trim();
      const cardColumn = card.closest(".col-lg-4");
      if (!name || !symbol || !cardColumn) return;

      const option = document.createElement("option");
      option.value = name;
      option.textContent = `${name} (${symbol})`;
      methodSelect.append(option);
      cardColumn.dataset.cryptoMethod = name;
    });

    methodChoice.append(methodLabel, methodSelect);
    cryptoCardsRow.before(methodChoice);

    const updateCryptoMethod = () => {
      cryptoCardsRow.querySelectorAll("[data-crypto-method]").forEach((column) => {
        column.hidden = column.dataset.cryptoMethod !== methodSelect.value;
      });
    };

    methodSelect.addEventListener("change", updateCryptoMethod);
    updateCryptoMethod();
  }

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

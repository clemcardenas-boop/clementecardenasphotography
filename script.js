// Handle the hero slideshow, mobile navigation, and lightweight form validation.
document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentSlide = 0;

  function showSlide(nextIndex) {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === nextIndex);
    });
  }

  if (slides.length > 1) {
    showSlide(currentSlide);

    if (!reduceMotion) {
      window.setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      }, 5000);
    }
  }

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  function closeMenu() {
    if (!navToggle || !navMenu) {
      return;
    }

    navToggle.classList.remove("is-open");
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  const form = document.getElementById("contact-form");
  const statusMessage = document.getElementById("form-status");

  const validationRules = {
    name: {
      message: "Please enter your name.",
      validate: (value) => value.trim().length >= 2
    },
    email: {
      message: "Please enter a valid email address.",
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    },
    phone: {
      message: "Please enter a valid phone number.",
      validate: (value) => value.replace(/\D/g, "").length >= 10
    },
    date: {
      message: "Please select your wedding date.",
      validate: (value) => value.trim() !== ""
    },
    venue: {
      message: "Please enter your venue.",
      validate: (value) => value.trim().length >= 2
    },
    message: {
      message: "Please share a few details about your celebration.",
      validate: (value) => value.trim().length >= 20
    }
  };

  function setFieldState(field, isValid, message) {
    const formField = field.closest(".form-field");
    const errorElement = formField ? formField.querySelector(".error-message") : null;

    if (!formField || !errorElement) {
      return;
    }

    formField.classList.toggle("is-invalid", !isValid);
    errorElement.textContent = isValid ? "" : message;
  }

  function validateField(field) {
    const rule = validationRules[field.name];

    if (!rule) {
      return true;
    }

    const isValid = rule.validate(field.value);
    setFieldState(field, isValid, rule.message);
    return isValid;
  }

  if (form) {
    const fields = Array.from(form.querySelectorAll("input, textarea"));

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".form-field")?.classList.contains("is-invalid")) {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const isFormValid = fields.every((field) => validateField(field));

      if (!isFormValid) {
        statusMessage.textContent = "Please correct the highlighted fields and try again.";
        return;
      }

      statusMessage.textContent = "Thank you. Your inquiry is ready to send.";
      form.reset();
      fields.forEach((field) => setFieldState(field, true, ""));
    });
  }



  const cart = [];
  const cartPanel = document.getElementById("cart-panel");
  const cartLauncher = document.getElementById("cart-launcher");
  const cartBackdrop = document.getElementById("cart-backdrop");
  const cartClose = document.querySelector(".cart-close");
  const cartItems = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  const cartForm = document.getElementById("cart-form");
  const cartStatus = document.getElementById("cart-status");

  function formatPrice(price) {
    return `$${price.toLocaleString()}`;
  }

  function openCart() {
    if (!cartPanel || !cartLauncher || !cartBackdrop) {
      return;
    }

    cartPanel.classList.add("is-open");
    cartPanel.setAttribute("aria-hidden", "false");
    cartLauncher.setAttribute("aria-expanded", "true");
    cartBackdrop.hidden = false;
  }

  function closeCart() {
    if (!cartPanel || !cartLauncher || !cartBackdrop) {
      return;
    }

    cartPanel.classList.remove("is-open");
    cartPanel.setAttribute("aria-hidden", "true");
    cartLauncher.setAttribute("aria-expanded", "false");
    cartBackdrop.hidden = true;
  }

  function renderCart() {
    if (!cartItems || !cartEmpty || !cartTotal || !cartCount) {
      return;
    }

    cartItems.innerHTML = "";
    cartEmpty.hidden = cart.length > 0;

    cart.forEach((item, index) => {
      const cartItem = document.createElement("article");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title} print preview">
        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <p>${item.option}</p>
          <div class="cart-item-row">
            <strong>${formatPrice(item.price)}</strong>
            <button class="cart-remove" type="button" data-index="${index}">Remove</button>
          </div>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = formatPrice(total);
    cartCount.textContent = String(cart.length);
  }

  document.querySelectorAll(".store-add").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".store-card");
      const option = card?.querySelector(".store-option");
      const selected = option?.selectedOptions[0];

      if (!card || !selected) {
        return;
      }

      cart.push({
        title: card.dataset.title,
        image: card.dataset.image,
        option: selected.value,
        price: Number(selected.dataset.price || card.dataset.price)
      });

      renderCart();
      openCart();
    });
  });

  cartItems?.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".cart-remove");

    if (!removeButton) {
      return;
    }

    cart.splice(Number(removeButton.dataset.index), 1);
    renderCart();
  });

  cartLauncher?.addEventListener("click", openCart);
  cartClose?.addEventListener("click", closeCart);
  cartBackdrop?.addEventListener("click", closeCart);

  cartForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      cartStatus.textContent = "Add at least one print before requesting a purchase.";
      return;
    }

    const name = document.getElementById("cart-name").value.trim();
    const email = document.getElementById("cart-email").value.trim();

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      cartStatus.textContent = "Please enter your name and a valid email.";
      return;
    }

    cartStatus.textContent = "Thank you. Your print order request is ready to send.";
    cart.length = 0;
    renderCart();
    cartForm.reset();
  });

  renderCart();

  const revealTargets = document.querySelectorAll(".section-heading, .service-card, .portfolio-card, .store-card, .about-copy, .about-image-wrap, .contact-copy, .contact-form, .cart-form, .intro-copy, .intro-text, .store-intro");

  revealTargets.forEach((element) => {
    element.setAttribute("data-reveal", "");
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }
});

// Daniil Chess School - main JS
document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNav();
  setupModal();
  setupFormsValidation();
  setupFAQ();
  setupCourseFilters();
});

// ---------------- NAV active ----------------
function highlightActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a => {
    const href = a.getAttribute("href");
    if(href === path) a.classList.add("active");
  });
}

// ---------------- MODAL ----------------
function setupModal(){
  const modal = document.querySelector("[data-modal]");
  if(!modal) return;

  const openers = document.querySelectorAll("[data-open-modal]");
  const closer = modal.querySelector("[data-close-modal]");
  const backdrop = modal;

  const open = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    // focus first input
    const first = modal.querySelector("input, select, textarea, button");
    first && first.focus();
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  };

  openers.forEach(btn => btn.addEventListener("click", () => {
    // optional: set course value if opener has data-course
    const course = btn.getAttribute("data-course");
    const select = modal.querySelector("select[name='course']");
    if(course && select) select.value = course;
    open();
  }));

  closer && closer.addEventListener("click", close);

  backdrop.addEventListener("click", (e) => {
    if(e.target === backdrop) close();
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && modal.classList.contains("open")) close();
  });
}

// ---------------- FORM VALIDATION ----------------
function setupFormsValidation(){
  const forms = document.querySelectorAll("[data-validate]");
  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = validateForm(form);
      if(ok){
        // Fake submit success for diploma
        const toast = form.querySelector("[data-toast]");
        if(toast){
          toast.classList.add("show");
          toast.textContent = "✅ Заявку надіслано! Ми зв’яжемося з вами протягом 24 годин.";
        }
        form.reset();

        // if form is inside modal, close modal after short delay
        const modal = form.closest("[data-modal]");
        if(modal){
          setTimeout(() => {
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden","true");
            document.body.style.overflow = "";
          }, 600);
        }
      }
    });
  });
}

function validateForm(form){
  let valid = true;

  const name = form.querySelector("input[name='name']");
  const phone = form.querySelector("input[name='phone']");
  const email = form.querySelector("input[name='email']");

  // Helpers
  const setInvalid = (fieldEl, message) => {
    const field = fieldEl.closest(".field");
    field.classList.add("invalid");
    const err = field.querySelector(".error");
    if(err) err.textContent = message;
    valid = false;
  };

  const clearInvalid = (fieldEl) => {
    const field = fieldEl.closest(".field");
    field.classList.remove("invalid");
  };

  // Name: 2+ letters
  if(name){
    clearInvalid(name);
    const v = name.value.trim();
    if(v.length < 2) setInvalid(name, "Вкажіть ім’я (мінімум 2 символи).");
  }

  // Phone: allow + digits spaces dashes, must have 10-15 digits total
  if(phone){
    clearInvalid(phone);
    const v = phone.value.trim();
    const digits = v.replace(/\D/g,"");
    if(digits.length < 10 || digits.length > 15) setInvalid(phone, "Телефон має містити 10–15 цифр.");
  }

  // Email basic
  if(email){
    clearInvalid(email);
    const v = email.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(!re.test(v)) setInvalid(email, "Вкажіть коректний email.");
  }

  return valid;
}

// ---------------- FAQ ACCORDION ----------------
function setupFAQ(){
  const items = document.querySelectorAll("[data-faq-item]");
  items.forEach(item => {
    const btn = item.querySelector("[data-faq-q]");
    btn && btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // close others
      items.forEach(i => i.classList.remove("open"));
      // toggle current
      if(!isOpen) item.classList.add("open");
    });
  });
}

// ---------------- COURSE FILTERS ----------------
function setupCourseFilters(){
  const filterWrap = document.querySelector("[data-filters]");
  const cards = document.querySelectorAll("[data-course-card]");
  if(!filterWrap || cards.length === 0) return;

  const buttons = filterWrap.querySelectorAll("[data-filter]");
  const apply = (level) => {
    cards.forEach(card => {
      const lv = card.getAttribute("data-level");
      const show = (level === "all") || (lv === level);
      card.classList.toggle("hidden", !show);
    });

    buttons.forEach(b => b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === level)));
  };

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      apply(btn.getAttribute("data-filter"));
    });
  });

  apply("all");
}
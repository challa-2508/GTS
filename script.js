const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
// Set this only after the client approves the official recipient.
const gtsEnquiryEmail = "";

const setMenuOpen = (isOpen) => {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  siteNav.classList.toggle("is-open", isOpen);
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

document.addEventListener("click", (event) => {
  if (menuToggle.getAttribute("aria-expanded") === "true"
    && !siteNav.contains(event.target)
    && !menuToggle.contains(event.target)) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const revealTargets = document.querySelectorAll([
  ".hero-copy",
  ".hero-art",
  ".intro-grid > *",
  ".section-heading",
  ".help-card",
  ".category-card",
  ".sourcing-heading",
  ".sourcing-step",
  ".support-copy",
  ".support-grid > *",
  ".example-brief",
  ".home-tender-grid > *",
  ".contact-content",
  ".tender-heading",
  ".forms-grid > *",
  ".readiness-grid > *",
  ".standalone-form",
  ".page-hero .eyebrow",
  ".page-hero h1",
  ".page-hero .page-lead",
  ".page-hero .page-actions",
  ".page-hero .tender-document-types",
  ".contact-hero-visual",
  ".page-section-heading",
  ".content-columns > *",
  ".page-band-grid > *",
  ".principle-card",
  ".page-cta",
  ".about-hero-inner > *",
  ".about-concept-copy > *",
  ".about-concept-visual",
  ".about-section-heading",
  ".about-principle-grid article",
  ".about-difference-grid > *",
  ".about-role-content > *"
].join(", "));

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches
  && "IntersectionObserver" in window
  && revealTargets.length) {
  document.documentElement.classList.add("motion-enabled");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

  revealTargets.forEach((element) => {
    element.classList.add("motion-reveal");
    revealObserver.observe(element);
  });
}

const sourcingCountUps = document.querySelectorAll(".sourcing-count-up[data-count-to]");
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches
  && "IntersectionObserver" in window
  && sourcingCountUps.length) {
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const count = entry.target;
      const target = Number(count.dataset.countTo);
      if (!Number.isInteger(target) || target < 0) {
        observer.unobserve(count);
        return;
      }

      const duration = 1200;
      const startedAt = performance.now();
      const updateCount = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        count.textContent = String(Math.round(target * easedProgress));

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          count.textContent = String(target);
        }
      };

      requestAnimationFrame(updateCount);
      observer.unobserve(count);
    });
  }, { threshold: 0.6 });

  sourcingCountUps.forEach((count) => countObserver.observe(count));
}

document.querySelectorAll('.tenders-page input[type="file"][name="documents"]').forEach((input) => {
  const fileStatus = input.closest(".tender-file-field").querySelector(".selected-files");

  input.addEventListener("change", () => {
    const fileNames = [...input.files].map((file) => file.name);
    fileStatus.textContent = fileNames.length ? fileNames.join(", ") : "No files selected";
  });
});

document.querySelectorAll('.requirement-form input[type="file"][name="documents"]').forEach((input) => {
  const fileStatus = input.closest(".file-field").querySelector(".selected-files");

  input.addEventListener("change", () => {
    const fileNames = [...input.files].map((file) => file.name);
    fileStatus.textContent = fileNames.length ? fileNames.join(", ") : "No files selected";
  });
});

document.querySelectorAll(".enquiry-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const files = values.getAll("documents").filter((file) => file instanceof File && file.name);
    const fields = [...values.entries()]
      .filter(([key, value]) => key !== "documents" && value)
      .map(([key, value]) => `${key.replaceAll("-", " ")}: ${value}`);
    const subject = form.id === "tender-form" ? "GTS tender enquiry" : "GTS sourcing requirement";
    const body = [
      "Ground to Superstructure — enquiry",
      "",
      ...fields,
      "",
      files.length ? `Documents to attach: ${files.map((file) => file.name).join(", ")}` : "No documents selected.",
      "",
      "Please attach the selected documents before sending."
    ].join("\n");
    const status = form.querySelector(".form-status");

    if (!gtsEnquiryEmail) {
      status.textContent = "The enquiry form is awaiting GTS's approved contact details. Your information has not been sent or stored on this website. Once configured, you will be able to review and send the email yourself; attachments must be added manually.";
      return;
    }

    const mailto = `mailto:${gtsEnquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Your email draft is ready to review and send. Add the selected files to the email manually before sending.";
    window.location.href = mailto;
  });
});

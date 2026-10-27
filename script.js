const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
// Set this only after the client approves the official recipient.
const gtsEnquiryEmail = "";

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

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

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

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
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = form.querySelector(".form-status");

    status.textContent = "Opening your email app with the enquiry details. Add the selected files and the GTS recipient before sending.";
    window.location.href = mailto;
  });
});

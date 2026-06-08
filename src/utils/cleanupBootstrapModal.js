export const cleanupBootstrapModal = (modalId = "exampleModal") => {
  document.body.classList.remove("modal-open");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("padding-right");

  document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;

  if (window.bootstrap?.Modal) {
    const instance = window.bootstrap.Modal.getInstance(modalEl);
    if (instance) {
      instance.hide();
    }
  }

  modalEl.classList.remove("show");
  modalEl.style.display = "none";
  modalEl.setAttribute("aria-hidden", "true");
  modalEl.removeAttribute("aria-modal");
  modalEl.removeAttribute("role");
};

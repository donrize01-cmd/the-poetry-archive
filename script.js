console.log("Kai's Poetry Archive is running.");
const warningLinks = document.querySelectorAll(".warning-link");
const warningModal = document.getElementById("archive-warning-modal");
const warningMessage = document.getElementById("archive-warning-message");
const warningContinue = document.getElementById("archive-warning-continue");
const warningCancel = document.getElementById("archive-warning-cancel");

let lastWarningTrigger = null;

function openWarningModal(link) {
    if (!warningModal || !warningMessage || !warningContinue) {
        return;
    }

    lastWarningTrigger = link;

    const warningText =
        link.dataset.warning ||
        "This poem contains mature material.";

    warningMessage.textContent = warningText;
    warningContinue.href = link.href;

    warningModal.classList.add("is-visible");
    warningModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    warningCancel?.focus();
}

function closeWarningModal() {
    if (!warningModal) {
        return;
    }

    warningModal.classList.remove("is-visible");
    warningModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    lastWarningTrigger?.focus();
}

warningLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        openWarningModal(link);
    });
});

warningCancel?.addEventListener("click", closeWarningModal);

warningModal?.addEventListener("click", (event) => {
    if (event.target === warningModal) {
        closeWarningModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        warningModal?.classList.contains("is-visible")
    ) {
        closeWarningModal();
    }
});
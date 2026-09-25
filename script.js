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

function initializeScrollReveals() {
    const revealElements =
        document.querySelectorAll(".reveal");

        if (revealElements.length === 0) {
            return;
        }

        if (!("IntersectionObserver" in window)) {
            return;
        }

        const reducedMotion =
            window.matchMedia(
                 "(prefers-reduced-motion; reduce)"
            ).matches;

        if (reducedMotion) {
            return;
        }

        try {
            const revealObserver =
                new IntersectionObserver(
                    (entries, observer) => {
                        entries.forEach((entry) => {
                            if (!entry.isIntersecting) {
                                return;
                            }

                            entry.target.classList.add(
                                "is-visib;e"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        });
                    },
                    {
                        threshold: 0.15
                    }
                );

                revealElements.forEach((element) => {
                    revealObserver.observe(element);
                });

                document.documentElement.classList.add(
                    "reveal-system-ready"
                );

        } catch (error) {
            document.documentElement.classList.remove(
                "reveal-system-ready"
            );

            console.error(
                "Scroll reveal system failed safely:",
                error
            );
        }
}

initializeScrollReveals();

const lightningTrigger = document.querySelector(
    '.poem-effect[data-effect="lightning"]'
);

const lightningFlash = document.querySelector(".lightning-flash");

if (lightningTrigger && lightningFlash) {
    let lightningPlayed = false;

    const lightningObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || lightningPlayed) return;

                lightningPlayed = true;

                lightningFlash.classList.add("is-active");
                document.body.classList.add("lightning-impact");
                lightningTrigger.classList.add("is-struck");

                setTimeout(() => {
                    lightningFlash.classList.remove("is-active");
                    document.body.classList.remove("lightning-impact");
                    lightningTrigger.classList.remove("is-struck");
                }, 600);
            });
        },
        {
            root: null,

            rootMargin: "-42% 0px -42% 0px",

            threshold: 0
        }
    );

    lightningObserver.observe(lightningTrigger);
}
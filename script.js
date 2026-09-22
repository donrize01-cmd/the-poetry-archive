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

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

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

const recentPoemsContainer = document.getElementById("recent-poems");

function formatArchiveData(dateSting) {
    const [year, month, day] = dateString
        .split("-")
        .map(Number);

    const date = new Date(
        year,
        month - 1,
        day
    );

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    ).format(date);
}

if (
    recentPoemsContainer &&
    typeof poems !== "undefined"
) {
    const recentPoems = [...poems]
        .filter((poem) => poem.added)
        .sort((a, b) => {
            const dateDifference =
                b.added.localeCompare(a.added);

            if (dateDifference !== 0) {
                return dateDifference;
            }

            return (
                (a.recentOrder ?? 999) -
                (b.recentOrder ?? 999)
            );
        })
        .slice(0, 4);

    recentPoemsContainer.innerHTML =
        recentPoems
            .map((poem) => {
                const statusBadge =
                    poem.status === "new"
                        ? '
                        <span class="archive-status archive-status-new">
                                NEW 
                        </span>
                        '
                        
                        : poem.status === "updated"
                        ? '
                            <span class="archive-status archive-status-updated">
                                UPDATED 
                            </span>
                        '
                        : "";
                    return '
                        <article class="recent-poem-card">
                        
                            <div class="recent-poem-meta">
                                <p class="recent-poem-collection">
                                    ${poem.collection}
                                </p>
                                
                                ${statusBadge}
                            </div>
                            
                            <h3>
                                <a href="${poem.url}">
                                    ${poem.title}
                                </a>
                            </h3>
                            
                            <p class="recent-poem-date">
                                Added ${formatArchiveDate(poem.added)}
                            </p>
                            
                            <a
                                class="recent-poem-link"
                                href="${poem.url}"
                            >
                                Read Poem →
                            </a>
                        </article>
                    ';
            })
            .join("");
}
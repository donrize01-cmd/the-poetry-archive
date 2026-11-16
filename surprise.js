(() => {
    "use strict";

    const pickButton =
        document.getElementById("surprise-button");

    const againButton =
        document.getElementById("surprise-again");

    const result =
        document.getElementById("surprise-result");

    const title =
        document.getElementById("surprise-poem-title");
    
    const collection =
        document.getElementById("surprise-collection");

    const warning =
        document.getElementById("surprise-warning");

    const readLink =
        document.getElementById("surprise-read");

    const status =
        document.getElementById("surprise-status");

    if (
        !pickButton || !againButton ||
        !result || !title || !collection ||
        !warning || !readLink || !status 
    ) {
        return;
    }

    const sources = [
        {
            path: "shattered-hearts-vol-1.html",
            label: "Shattered Hearts - NIGHTS"
        },
        {
            path: "shattered-hearts-vol-2.html",
            label: "Shattered Hearts - SMITHEREENS"
        },
        {
            path: "shattered-hearts-vol-3.html",
            label: "Shattered Hearts - ENCHANTINGS"
        },
        {
            path: "canary-love.html",
            label: "Canary Love"
        },
        {
            path: "ephemera.html",
            label: "Ephemera"
        },
    ];

    const fallbackPoems = [
        {
            title: "Intro",
            href: "shc-v1-01-intro.html",
            collection: "Shattered Hearts - NIGHTS"
        },
        {
            title: "Coat",
            href: "shc-v1-06-coat.html",
            collection: "Shattered Hearts - NIGHTS"
        },
        {
            title: "Outro",
            href: "shc-v1-23-outro.html",
            collection: "Shattered Hearts - NIGHTS"
        },
        {
            title: "Intro III",
            href: "shc-v3-01-intro-3.html",
            collection: "Shattered Hearts - ENCHANTINGS"
        },
        {
            title: "Desire",
            href: "shc-v3-02-desire.html",
            collection: "Shattered Hearts - ENCHANTINGS"
        },
        {
            title: "Onto Something (Prologue)",
            href: "cnl-01-onto-something.html",
            collection: "Canary Love"
        },
        {
            title: "Flames",
            href: "cnl-02-flames.html",
            collection: "Canary Love"
        },
        {
            title: "BLAH BLAH BLAH (INTERLUDE)",
            href: "cnl-24-blah-blah-blah.html",
            collection: "Canary Love"
        },
        {
            title: "KISS",
            href: "eph-kiss.html",
            collection: "Ephemera"
        },
        {
            title: "Songbird",
            href: "eph-songbird.html",
            collection: "Ephemera"
        },
        {
            title: "If This Is My Goodbye",
            href: "eph-my-goodbye.html",
            collection: "Ephemera"
        }
    ];

    let selectedPoem = null;
    let poolPromise = null;

    async function loadPoems() {
        if (window.location.protocol === "file:") {
            return fallbackPoems;
        }

        const results = await Promise.allSettled(
            sources.map(async (source) => {
                const response = await fetch(source.path);

                if (!response.ok) {
                    throw new Error(
                        `Could not load ${source.path}`
                    );
                }

                const html = await response.text();

                const doc = new DOMParser()
                    .parseFromString(html, "text/html");

                return [...doc.querySelectorAll(
                    ".poem-list .poem-entry"
                )].map((entry) => {
                    const link = entry.querySelector(
                        ".poem-title-link[href]"
                    );

                    if (!link) return null;

                    const href = new URL(
                        link.getAttribute("href"),
                        new URL(source.path, window.location.href)
                    );

                    if (
                        href.origin !== window.location.origin ||
                        !href.pathname.endsWith(".html")
                    ) {
                        return null;
                    }

                    const warningLink =
                        entry.querySelector(
                            ".warning-link[data-warning]"
                        );

                    return {
                        title: link.textContent.trim(),
                        href: href.href,
                        collection: source.label,
                        warning:
                            link.dataset.warning ||
                            warningLink?.dataset.warning ||
                            ""
                    };
                }).filter(Boolean);
            })
        );

        const poems = results
            .filter((r) => r.status === "fulfilled")
            .flatMap((r) => r.value);
            
        const unique = [
            ...new Map(
                poems.map((poem) => [poem.href, poem])
            ).values()
        ];

        return unique.length ? unique : fallbackPoems;
    }

    async function pickRandomPoem() {
        pickButton.disabled = true;
        againButton.disabled = true;

        status.textContent = "Searching the shelves...";

        try {
            if (!poolPromise) {
                poolPromise = loadPoems();
            }

            const poems = await poolPromise;

            if (poems.length === 0) {
                throw new Error("No poems available");
            }

            const alternatives = poems.filter(
                (poem) => poem.href !== selectedPoem?.href
            );

            const choices = alternatives.length
                ? alternatives
                : poems;

            const index = Math.floor(
                Math.random() * choices.length
            );

            selectedPoem = choices[index];

            title.textContent = selectedPoem.title;
            collection.textContent =
                selectedPoem.collection;

            readLink.href = selectedPoem.href;

            warning.hidden = !selectedPoem.warning;
            warning.textContent = selectedPoem.warning
                ? `Content notice: ${selectedPoem.warning}`
                : "";

            result.hidden = false;
            status.textContent = "";

            title.focus();

        } catch (error) {
            console.error(
                "Surprise Me encountered an error:",
                error
            );

            status.textContent =
                "The Archive couldn't find a poem. Please try again";
        } finally {
            pickButton.disabled = false;
            againButton.disabled = false;
        }
    }

    readLink.addEventListener("click", (event) => {
        if(!selectedPoem?.warning) {
            return;
        }

        event.preventDefault();

        const modal =
            document.getElementById("archive-warning-modal");

        const message =
            document.getElementById("archive-warning-message");

        const continueLink =
            document.getElementById("archive-warning-continue");

        if (modal && message && continueLink) {
            message.textContent = selectedPoem.warning;
            continueLink.href = selectedPoem.href;

            modal.classList.add("is-visible");
            modal.setAttribute("aria-hidden", "false");

            document.body.classList.add("modal-open");

            document.getElementById(
                "archive-warning-cancel"
            )?.focus();
        } else {
            const proceed = window.confirm(
                `${selectedPoem.warning}\n\nContinue reading?`
            );

            if (proceed) {
                window.location.href = selectedPoem.href;
            }
        }
    });

    pickButton.addEventListener("click", pickRandomPoem);
    againButton.addEventListener("click", pickRandomPoem);
})();
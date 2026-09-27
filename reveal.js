/* =========================
   THE POETRY ARCHIVE
   SAFE UNIVERSAL REVEALS
========================= */

(() => {

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reducedMotion) {
        return;
    }


    /*
       Select ACTUAL visual units.

       We intentionally avoid large wrapper
       sections like .poem-list itself.
    */

    const revealSelector = [
        ".intro",
        ".collection-introduction",

        ".collection-card",

        ".subcollection-section > .eyebrow",
        ".subcollection-section > h2",
        ".subcollection-card",

        ".poem-list > .eyebrow",
        ".poem-list > h2",
        ".poem-entry",

        ".about-section"
    ].join(",");


    const revealElements =
        [...document.querySelectorAll(
            revealSelector
        )];


    if (revealElements.length === 0) {
        return;
    }


    try {

        /*
           Give repeating groups a subtle
           stagger without creating huge delays.
        */

        const addStagger = (selector) => {

            const elements =
                document.querySelectorAll(selector);

            elements.forEach(
                (element, index) => {

                    const delay =
                        (index % 4) * 70;

                    element.style.setProperty(
                        "--reveal-delay",
                        `${delay}ms`
                    );
                }
            );
        };


        addStagger(".collection-card");
        addStagger(".subcollection-card");
        addStagger(".poem-entry");


        /*
           Only working JavaScript can add
           reveal-prepared.

           Without this class, everything
           remains visible.
        */

        revealElements.forEach((element) => {

            element.classList.add(
                "reveal-prepared"
            );

        });


        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const element =
                            entry.target;


                        element.classList.add(
                            "is-visible"
                        );


                        observer.unobserve(
                            element
                        );


                        element.addEventListener(
                            "transitionend",
                            () => {

                                element.classList.remove(
                                    "reveal-prepared"
                                );

                                element.classList.remove(
                                    "is-visible"
                                );

                            },
                            {
                                once: true
                            }
                        );

                    });

                },

                {
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -8% 0px"
                }
            );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });


    } catch (error) {

        revealElements.forEach((element) => {

            element.classList.remove(
                "reveal-prepared"
            );

            element.classList.remove(
                "is-visible"
            );

        });


        console.error(
            "Archive reveals failed safely:",
            error
        );
    }

})();
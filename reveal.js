(() => {
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
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reducedMotion) {
        return;
    }

    try {

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
                    threshold: 0.15
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
            "Scroll reveals failed safely:",
            error
        );
    }
})();
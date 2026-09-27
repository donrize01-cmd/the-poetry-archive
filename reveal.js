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

    const getRevealDelay = (element) => {
        if (element.classList.contains("reveal-delay-4")) {
            return 320;
        }

        if (element.classList.contains("reveal-delay-3")) {
            return 240;
        }

        if (element.classList.contains("reveal-delay-2")) {
            return 160;
        }

        if (element.classList.contains("reveal-delay-1")) {
            return 80;
        }

        return 0;
    };

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const element = entry.target;

                    element.animate(
                        [
                            {
                                opacity: 0,
                                transform: "translateY(28px)"
                            },
                            {
                                opacity: 1,
                                transform: "translate&(0)"
                            }
                        ],
                        {
                            duration: 700,
                            delay: getRevealDelay(element),
                            easing: "ease",
                            fill: "none"
                        }
                    );

                    observer.unobserve(element);
                });
            },
            {
                threshold: 0.15
            }
        );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
})();
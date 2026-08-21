(() => {
  "use strict";

  if (typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  // All 3D scroll motion is additive on top of the existing fade/translate
  // reveal system (script.js). It only ever animates rotate/scale/translate —
  // never opacity — so if this script fails to load the page still looks
  // and behaves correctly.
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    /* Hero parallax */
    const heroImg = document.querySelector(".hero-media img");
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 14,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    /* 3D tilt-in for grid items */
    const tiltGroups = [
      { grid: ".services-grid", items: ".service-card" },
      { grid: ".gallery-grid", items: ".gallery-item" },
      { grid: ".testimonial-grid", items: ".testimonial-card" },
    ];

    tiltGroups.forEach(({ grid, items }) => {
      const container = document.querySelector(grid);
      if (!container) return;
      const els = gsap.utils.toArray(items, container);
      if (!els.length) return;

      gsap.set(els, { transformPerspective: 1000, transformOrigin: "50% 100%" });
      gsap.from(els, {
        rotateX: 20,
        z: -60,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: container,
          start: "top 82%",
        },
      });
    });

    /* Fleet + about media: alternating 3D swing-in */
    gsap.utils.toArray(".fleet-media img, .about-media img").forEach((img, i) => {
      gsap.set(img, { transformPerspective: 1000 });
      gsap.from(img, {
        rotateY: i % 2 === 0 ? -16 : 16,
        z: -60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
        },
      });
    });

    /* Pointer-driven card tilt (fine pointers only, e.g. desktop mouse) */
    if (window.matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll(".service-card, .gallery-item").forEach((card) => {
        gsap.set(card, { transformPerspective: 800, transformStyle: "preserve-3d" });
        const setRotateX = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power3" });
        const setRotateY = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power3" });

        card.addEventListener("pointermove", (e) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          setRotateY(px * 10);
          setRotateX(py * -10);
        });
        card.addEventListener("pointerleave", () => {
          setRotateX(0);
          setRotateY(0);
        });
      });
    }
  });
})();

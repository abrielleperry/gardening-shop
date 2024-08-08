window.addEventListener("load", () => {
  gsap.registerPlugin(ScrollTrigger);

  initSectionAnimations("section1", "title1", ".dot1", startSection2);

  function initSectionAnimations(sectionId, titleId, dotClass, onComplete) {
    let section = document.getElementById(sectionId),
      title = document.getElementById(titleId),
      mark = title.querySelector("span"),
      dot = section.querySelector(dotClass);

    if (!section || !title || !mark || !dot) {
      console.error(`Missing elements in section ${sectionId}`);
      return;
    }

    gsap.set(title, { opacity: 1 });
    gsap.set(dot, {
      width: "142vmax",
      height: "142vmax",
      xPercent: -50,
      yPercent: -50,
      top: "50%",
      left: "50%"
    });

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        markers: true,
        scrub: 1.5,
        pin: section,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onLeave: onComplete
      },
      defaults: { ease: "none" }
    });

    tl.fromTo(
      dot,
      {
        scale: 0,
        x: calculateXOffset(mark, section, 0.54),
        y: calculateYOffset(mark, section, 0.73)
      },
      {
        x: 0,
        y: 0,
        ease: "power3.in",
        scale: 1
      }
    );
  }

  function calculateXOffset(mark, section, factor) {
    let markBounds = mark.getBoundingClientRect();
    return (
      markBounds.left +
      markBounds.width * factor -
      section.getBoundingClientRect().width / 2
    );
  }

  function calculateYOffset(mark, section, factor) {
    let markBounds = mark.getBoundingClientRect();
    return (
      markBounds.top +
      markBounds.height * factor -
      section.getBoundingClientRect().height / 2
    );
  }

  function startSection2() {
    let section2 = document.getElementById("section2"),
      title2 = document.getElementById("title2"),
      mark2 = title2.querySelector("span"),
      dot2 = section2.querySelector(".dot2");

    if (!section2 || !title2 || !mark2 || !dot2) {
      console.error("Missing elements in section2");
      return;
    }

    section2.style.visibility = "visible";

    gsap.set(dot2, {
      width: "142vmax",
      height: "142vmax",
      xPercent: -50,
      yPercent: -50,
      top: "50%",
      left: "50%"
    });

    let tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: section2,
        start: "top top",
        end: "bottom top",
        markers: true,
        scrub: 1.5,
        pin: section2,
        pinSpacing: true,
        invalidateOnRefresh: true
      },
      defaults: { ease: "none" }
    });

    tl2
      .fromTo(
        dot2,
        {
          scale: 1,
          x: 0,
          y: 0
        },
        {
          scale: 0,
          x: calculateXOffset(mark2, section2, 0.54),
          y: calculateYOffset(mark2, section2, 0.73),
          ease: "power3.out"
        }
      )
      .fromTo(title2, { opacity: 0 }, { opacity: 1 });
  }
});

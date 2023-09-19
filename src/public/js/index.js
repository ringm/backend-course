const cards = document.querySelectorAll(".card");
const options = { loop: false };

cards.forEach((card) => {
  const emblaNode = card.querySelector(".embla");

  if (emblaNode) {
    const embla = EmblaCarousel(emblaNode, { loop: false });
    const backArrow = card.querySelector(".back-arrow");
    const forwardArrow = card.querySelector(".forward-arrow");

    const displayArrows = (emblaApi, eventName) => {
      if (!emblaApi.canScrollNext()) {
        forwardArrow.classList.add("invisible");
      } else {
        forwardArrow.classList.remove("invisible");
      }
      if (!emblaApi.canScrollPrev()) {
        backArrow.classList.add("invisible");
      } else {
        backArrow.classList.remove("invisible");
      }
    };

    const removeEventListener = () => {
      emblaApi.off("select", displayArrows);
      emblaApi.off("init", displayArrows);
    };

    backArrow.addEventListener("click", () => {
      embla.scrollPrev();
    });

    forwardArrow.addEventListener("click", () => {
      embla.scrollNext();
    });

    embla.on("select", displayArrows);
    embla.on("init", displayArrows);
  }
});

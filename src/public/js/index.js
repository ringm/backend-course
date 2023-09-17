const cards = document.querySelectorAll(".card");

const options = { loop: false };

cards.forEach((card) => {
  const emblaNode = card.querySelector(".embla");
  //const button = card.querySelector(".next");

  if (emblaNode) {
    const embla = EmblaCarousel(emblaNode, options);
  }

  // button.addEventListener("click", () => {
  //   embla.scrollNext();
  // });
});

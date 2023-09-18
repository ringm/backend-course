const cards = document.querySelectorAll(".card");
const options = { loop: false };

cards.forEach((card) => {
  const emblaNode = card.querySelector(".embla");

  if (emblaNode) {
    EmblaCarousel(emblaNode, { loop: false });
  }
});

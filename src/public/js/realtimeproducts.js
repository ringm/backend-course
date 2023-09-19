const socket = io();
const cardList = document.querySelector(".product-list");
const form = document.getElementById("productForm");
const fileInput = document.getElementById("fileInput");
const cardsContainer = document.getElementById("cards-container");

const renderCard = (product) => {
  const card = document.createElement("div");
  card.classList.add(
    "card",
    "border-solid",
    "border",
    "border-slate-300",
    "w-48",
    "max-h-96",
    "lg:w-56",
    "rounded-lg",
    "overflow-hidden",
    "p-2",
    "flex",
    "flex-col",
  );

  const carrouselWrapper = document.createElement("div");
  carrouselWrapper.classList.add("relative", "mb-2");

  const forwardButton = document.createElement("i");
  forwardButton.classList.add(
    "invisible",
    "forward-arrow",
    "absolute",
    "right-2",
    "top-1/2",
    "iconoir-nav-arrow-right",
    "text-md",
    "text-white",
    "bg-blue-500",
    "rounded-full",
    "cursor-pointer",
    "p-1",
    "transform",
    "-translate-y-1/2",
    "border",
    "border-white",
  );

  const backButton = document.createElement("i");
  backButton.classList.add(
    "invisible",
    "back-arrow",
    "absolute",
    "left-2",
    "top-1/2",
    "iconoir-nav-arrow-left",
    "text-md",
    "text-white",
    "bg-blue-500",
    "rounded-full",
    "cursor-pointer",
    "p-1",
    "transform",
    "-translate-y-1/2",
    "border",
    "border-white",
  );

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("bg-blue-500", "text-white", "px-4", "py-3", "rounded-md", "hover:bg-blue-400");
  deleteButton.textContent = "Borrar";

  const imgCarrousel = document.createElement("div");
  imgCarrousel.classList.add("embla", "overflow-hidden", "h-44", "lg:h-52", "rounded-lg");

  const carrouselContainer = document.createElement("div");
  carrouselContainer.classList.add("embla__container", "flex", "h-full");

  if (product.thumbnails.length > 0) {
    product.thumbnails.forEach((thumb) => {
      const carrouselSlide = document.createElement("div");
      carrouselSlide.classList.add(
        "embla__slide",
        "flex-grow-0",
        "overflow-hidden",
        "flex-shrink-0",
        "basis-full",
        "rounded-lg",
        "flex",
        "items-center",
        "justify-center",
      );
      const img = document.createElement("img");
      img.src = thumb;
      img.alt = "product-image";
      carrouselSlide.append(img);
      carrouselContainer.append(carrouselSlide);
    });
    imgCarrousel.append(carrouselContainer);
    carrouselWrapper.append(imgCarrousel);
    carrouselWrapper.append(backButton);
    carrouselWrapper.append(forwardButton);
  }

  const noImgContainer = document.createElement("div");
  noImgContainer.classList.add(
    "overflow-hidden",
    "mb-2",
    "h-44",
    "lg:h-52",
    "rounded-lg",
    "bg-slate-100",
    "flex",
    "items-center",
    "justify-center",
  );

  const missingImgIcon = document.createElement("i");
  missingImgIcon.classList.add("iconoir-remove-media-image", "text-2xl", "text-slate-600");
  noImgContainer.append(missingImgIcon);

  const title = document.createElement("h2");
  title.classList.add("font-bold");
  title.innerText = product.name;

  const desc = document.createElement("p");
  desc.classList.add("text-sm", "line-clamp-2", "text-ellipsis", "text-slate-600");
  desc.innerText = product.description;

  const price = document.createElement("p");
  price.classList.add("mt-auto", "font-bold", "text-blue-500", "mb-1");
  price.innerText = `$${product.price}`;

  if (product.thumbnails.length > 0) {
    card.append(carrouselWrapper);
    const embla = EmblaCarousel(imgCarrousel, { loop: false });

    const displayArrows = (emblaApi, eventName) => {
      if (eventName === "init") {
        embla.reInit();
      }
      if (!emblaApi.canScrollNext()) {
        forwardButton.classList.add("invisible");
      } else {
        forwardButton.classList.remove("invisible");
      }
      if (!emblaApi.canScrollPrev()) {
        backButton.classList.add("invisible");
      } else {
        backButton.classList.remove("invisible");
      }
    };

    const removeEventListener = () => {
      emblaApi.off("select", displayArrows);
      emblaApi.off("init", displayArrows);
    };

    backButton.addEventListener("click", () => {
      embla.scrollPrev();
    });

    forwardButton.addEventListener("click", () => {
      embla.scrollNext();
    });

    embla.on("select", displayArrows);
    embla.on("init", displayArrows);
  } else {
    card.append(noImgContainer);
  }

  deleteButton.addEventListener("click", () => {
    socket.emit("delete-product", product.id);
  });

  card.append(title);
  card.append(desc);
  card.append(price);
  card.append(deleteButton);

  return card;
};

document.addEventListener("DOMContentLoaded", function () {
  socket.emit("get-products");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const jsonData = { thumbnails: [] };
  for (const [key, value] of formData.entries()) {
    jsonData[key] = value;
  }
  socket.emit("create-product", jsonData);
  form.reset();
});

socket.on("render-products", (data) => {
  cardsContainer.innerHTML = "";
  data.forEach((product) => {
    const card = renderCard(product);
    cardsContainer.append(card);
  });
});

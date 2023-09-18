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

  const imgCarrousel = document.createElement("div");
  imgCarrousel.classList.add("embla", "overflow-hidden", "mb-2", "h-44", "lg:h-52", "rounded-lg");

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
  desc.classList.add("text-sm", "line-clamp-2", "text-ellipsis", "mb-4", "text-slate-600");
  desc.innerText = product.description;

  const price = document.createElement("p");
  price.classList.add("mt-auto", "font-bold", "text-blue-500");
  price.innerText = `$${product.price}`;

  if (product.thumbnails.length > 0) {
    card.append(imgCarrousel);
    const embla = EmblaCarousel(imgCarrousel, { loop: false });
  } else {
    card.append(noImgContainer);
  }
  card.append(title);
  card.append(desc);
  card.append(price);

  return card;
};

document.addEventListener("DOMContentLoaded", function () {
  socket.emit("get-products");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const jsonData = {};
  for (const [key, value] of formData.entries()) {
    if (key === "thumbnails") {
      jsonData[key] = Object.values(fileInput.files).map((file) => `/img/${file.name}`);
    } else {
      jsonData[key] = value;
    }
  }
  socket.emit("create-product", jsonData);
});

socket.on("render-products", (data) => {
  data.forEach((product) => {
    const card = renderCard(product);
    cardsContainer.append(card);
  });
});

socket.on("render-product", (product) => {
  const card = renderCard(product);
  cardsContainer.append(card);
});

socket.on("product-created", (id) => {
  socket.emit("get-product", id);
});

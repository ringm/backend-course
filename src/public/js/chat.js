const socket = io();

const renderMessage = (m, email) => {
  const msgContainer = document.createElement("div");
  msgContainer.classList.add("flex", "flex-col", "w-fit", "items-start");
  if (m.user === email) {
    msgContainer.classList.add("items-end", "self-end");
  }

  const usr = document.createElement("p");
  usr.classList.add("mb-1", "text-sm", "text-slate-500", "text-right");
  usr.textContent = `${m.user === email ? "you" : m.user}:`;

  const message = document.createElement("p");
  message.classList.add("rounded-lg", "px-5", "py-3", "bg-blue-500", "text-white", "w-fit");
  message.textContent = m.message;

  msgContainer.append(usr);
  msgContainer.append(message);

  return msgContainer;
};

const messagesContainer = document.getElementById("messages-container");
const messageForm = document.getElementById("message-form");

document.addEventListener("DOMContentLoaded", async () => {
  const { value: email } = await Swal.fire({
    title: "Input email address",
    input: "email",
    inputLabel: "Your email address",
    inputPlaceholder: "Enter your email address",
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  if (email) {
    socket.emit("get-messages");

    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputField = document.getElementById("message-input");
      socket.emit("create-message", { user: email, message: inputField.value });
      messageForm.reset();
    });

    socket.on("render-messages", (data) => {
      messagesContainer.innerHTML = "";
      data.forEach((m) => {
        const message = renderMessage(m, email);
        messagesContainer.append(message);
      });
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }
});

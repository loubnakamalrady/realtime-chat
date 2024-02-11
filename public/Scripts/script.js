(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  document.getElementById("join-user").addEventListener("click", function () {
    let username = document.getElementById("username").value;
    if (username.length === 0) {
      return;
    }
    uname = username;
    socket.emit("newuser", username);
    document.querySelector(".join-screen").classList.remove("active");
    document.querySelector(".chat-screen").classList.add("active");
  });

  document
    .getElementById("send-message")
    .addEventListener("click", function () {
      let message = document.getElementById("message-input").value;
      if (message.length === 0) {
        return;
      }
      renderMessage("my", {
        username: uname,
        text: message,
      });
      socket.emit("chat", {
        username: uname,
        text: message,
      });
      document.getElementById("message-input").value = "";
    });

  document.getElementById("exit-chat").addEventListener("click", function () {
    socket.emit("exituser");
    window.location.href = window.location.href;
  });

  socket.on("update", function (update) {
    renderMessage("update", { text: update });
  });

  socket.on("chatmessage", function (message) {
    renderMessage("other", message);
  });

  socket.on("userjoined", function (username) {
    renderMessage("update", { text: username + " joined the conversation" });
  });

  socket.on("userleft", function (username) {
    renderMessage("update", { text: username + " left the conversation" });
  });

  function renderMessage(type, data) {
    let messageContainer = document.querySelector(
      ".chat-screen .message-container"
    );
    if (type === "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div>
          <div class="name">You</div>
          <div class="text">${data.text}</div>
        </div>`;
      messageContainer.appendChild(el);
    } else if (type === "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
        <div>
          <div class="name">${data.username}</div>
          <div class="text">${data.text}</div>
        </div>`;
      messageContainer.appendChild(el);
    } else if (type === "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "message update-message");
      el.innerHTML = `
        <div class="update">${data.text}</div>`;
      messageContainer.appendChild(el);
    }
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
})();

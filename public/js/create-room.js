const endPoint = "http://localhost:3333/rooms/";

const form = document.getElementById("create-room");

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("room-input").value;
  const user_limit = document.getElementById("limit-input").value;
  const password = document.getElementById("room-password-input").value;

  const data = {
    name,
    user_limit,
    password,
  };

  fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(room => {
      if (room.status === "error") {
        alert(room.message);
      } else {
        window.location.href = `./chat.html?select_room=${room.id}`;
      }
    })
    .catch(error => {
      console.log(error);
    });
});
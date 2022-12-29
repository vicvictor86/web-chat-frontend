const endPoint = "http://localhost:3333/rooms/";

const urlSearch = new URLSearchParams(window.location.search);
const form = document.getElementById("password-room");

form.addEventListener("submit", event => {
  event.preventDefault();

  const roomId = urlSearch.get('select_room');
  const password = document.getElementById("password").value;

  const data = {
    roomId,
    password,
  }
  
  fetch(endPoint + "private/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(room => {
      console.log(room)
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
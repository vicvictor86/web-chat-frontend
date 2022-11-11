const endPoint = "http://localhost:3333/rooms/";

const form = document.getElementById("create-room");

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("room-input").value;
  const user_limit = document.getElementById("limit-input").value;

  const data = {
    name,
    user_limit
  };

  fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "error") {
        alert(data.message);
      } else {
        window.location.href = `./select-room.html`;
      }
    })
    .catch(error => {
      console.log(error);
    });
});
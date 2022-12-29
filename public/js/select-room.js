const endPoint = "http://localhost:3333/rooms/";

const selectRoom = document.getElementById("select-room");
const user_id = window.localStorage.getItem("user_id");
const form = document.getElementById("join_room");

form.addEventListener("submit", event => {
  event.preventDefault();

  fetch(`${endPoint}${selectRoom.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    
  })
    .then(response => response.json())
    .then(room => {
      if(room.is_private) {
        window.location.href = `./password-room.html?select_room=${room.id}`;
      } else {
        window.location.href = `./chat.html?select_room=${room.id}`;
      }
    })
    .catch(error => {
      console.log(error);
    });

  const name = document.getElementById("room-input").value;
  const user_limit = document.getElementById("limit-input").value;
  const password = document.getElementById("room-password-input").value;

  const data = {
    name,
    user_limit,
    password,
  };


});

fetch(`${endPoint}user/${user_id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  
})
  .then(response => response.json())
  .then(rooms => {
    rooms.forEach(room => {
      const option = document.createElement("option");
      option.value = room.id;
      option.innerHTML = room.name;
      selectRoom.appendChild(option);
    });
  })
  .catch(error => {
    console.log(error);
  });

const endPoint = "http://localhost:3333/rooms/";

const selectRoom = document.getElementById("select-room");
const user_id = window.localStorage.getItem("user_id");

fetch(endPoint + user_id, {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  
})
  .then(response => response.json())
  .then(rooms => {
    rooms.forEach(room => {
      const option = document.createElement("option");
      option.value = room.name;
      option.innerHTML = room.name;
      selectRoom.appendChild(option);
    });
  })
  .catch(error => {
    console.log(error);
  });
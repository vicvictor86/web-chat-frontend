const endPoint = "http://localhost:3333/rooms/";

const selectRoom = document.getElementById("select-room");

fetch(endPoint, {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
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
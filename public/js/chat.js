const socket = io("http://localhost:3333");

const urlSearch = new URLSearchParams(window.location.search);
const room = urlSearch.get('select_room');

const usernameDiv = document.getElementById("username");

socket.emit('select_room', {
  user_id: window.localStorage.getItem("user_id"),
  roomName: room,
  connectionMessage: " entrou na sala",
}, data => {
  usernameDiv.innerHTML = `Olá ${data.username} - você está na sala ${room}`;
  window.localStorage.setItem("room_id", data.room_id);

  data.messages.forEach(message => {
    createMessage(message);
  });
});

document.getElementById("message_input").addEventListener("keypress", event => {
  if (event.key === "Enter") {
    const text = event.target.value;

    const data = {
      user_id: window.localStorage.getItem("user_id"),
      text,
      roomName: room,
    };

    socket.emit('message', data);

    event.target.value = "";
  }
});

socket.on('message', data => {
  createMessage(data);
});

socket.on('app_error', data => {
  alert(data.message);
})

function createMessage(data) {
  const messageDiv = document.getElementById("messages");

  messageDiv.innerHTML += `
    <div class="new_message">
    <label class="form-label">
      <strong> ${data.username} </strong> <span> ${data.text} - 
      ${dayjs(data.createdAt).format("DD/MM HH:mm")}<span/>
    </label>
    </div>
  `
}

document.getElementById("logout").addEventListener("click", () => {
  const user_id = window.localStorage.getItem("user_id");
  const room_id = window.localStorage.getItem("room_id");
  const connectionMessage = " saiu da sala";

  socket.emit('disconnect_room', {user_id, room_id, connectionMessage });
  window.location.href = "./select-room.html";
});
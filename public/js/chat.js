const socket = io("http://localhost:3333");

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select_room');

const usernameDiv = document.getElementById("username");
usernameDiv.innerHTML = `Olá ${username} - você está na sala ${room}`;

socket.emit('select_room', {
  username,
  user_id: window.localStorage.getItem("id"),
  room,
  connectionMessage: " entrou na sala",
}, messages => {
  messages.forEach(message => {
    createMessage(message);
  });
});

document.getElementById("message_input").addEventListener("keypress", event => {
  if (event.key === "Enter") {
    const text = event.target.value;

    const data = {
      room,
      text,
      username
    };

    socket.emit('message', data);

    event.target.value = "";
  }
});

socket.on('message', data => {
  createMessage(data);
});

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
  socket.emit('logout', {username, room, connectionMessage: " saiu da sala"});
  window.location.href = "./select-room.html";
});
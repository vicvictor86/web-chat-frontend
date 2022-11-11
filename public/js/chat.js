const userId = window.localStorage.getItem("user_id");
const urlSearch = new URLSearchParams(window.location.search);
const room = urlSearch.get('select_room');

if(!userId) {
  window.sessionStorage.setItem("roomToRedirect", room);
  window.location.href = "/index.html";
}

const socket = io("http://localhost:3333");

const usernameDiv = document.getElementById("username");

socket.emit('select_room', {
  user_id: window.localStorage.getItem("user_id"),
  roomName: room,
}, data => {
  window.localStorage.setItem("room_id", data.room_id);
  createWelcomeMessage(data);

  getOnlineUsers();

  createConnectionMessage(data);
});

socket.emit('previous_messages', {
  user_id: window.localStorage.getItem("user_id"),
  roomName: room,
}, data => {
  data.messages.forEach(message => {
    createMessage(message);
  });
})

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

socket.on("new_user_connected", data => {
  getOnlineUsers();
});

socket.on("user_disconnected", data => {
  getOnlineUsers();
})

socket.on('message', data => {
  createMessage(data);
});

socket.on('app_error', data => {
  alert(data.message);
})

function roomLinkToClipboard(){
  const linkToClipboard = "http://localhost:3000/pages/chat.html?select_room=" + room;

  navigator.clipboard.writeText(linkToClipboard).then(function() {
    alert("Link da sala copiado com sucesso!");
  });
}

function getOnlineUsers() {
  socket.emit("connections_room", {
    room_id: window.localStorage.getItem("room_id"),
  }, data => {
    const onlineUsers = [];
    data.connections.forEach(connection => {
      if (connection.is_on_chat) {
        onlineUsers.push(connection.user);
      }
    });

    createHtmlOnlineUsers(onlineUsers);
  });
}

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

function createHtmlOnlineUsers(usersInCurrentRoom) {
  const onlineUsers = document.getElementById("online-users");
  onlineUsers.innerHTML = "";
  usersInCurrentRoom.forEach(user => {
    onlineUsers.innerHTML += `
    <div class="new_message">
    <label class="form-label">
      <strong> ${user.username} </strong>
    </label>
    </d;
  `;
  });
}

function createConnectionMessage(connection) {
  console.log(connection);
  if (!connection.is_on_chat) {
    const dataToBack = {
      user_id: window.localStorage.getItem("user_id"),
      roomName: room,
      text: " entrou na sala",
    }

    socket.emit('message', dataToBack);
  }
}

function disconnectFromRoom() {
  const user_id = window.localStorage.getItem("user_id");
  const room_id = window.localStorage.getItem("room_id");
  const connectionMessage = " saiu da sala";

  socket.emit('disconnect_room', { user_id, room_id, connectionMessage });
}

function createWelcomeMessage(data) {
  usernameDiv.innerHTML = `Olá ${data.username} - você está na sala ${room}`;
}

document.getElementById("logout").addEventListener("click", () => {
  disconnectFromRoom();

  window.location.href = "./select-room.html";
});
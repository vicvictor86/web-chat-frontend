const userId = window.localStorage.getItem("user_id");
const urlSearch = new URLSearchParams(window.location.search);
const roomId = urlSearch.get('select_room');

if (!userId) {
  window.sessionStorage.setItem("roomToRedirect", roomId);
  window.location.href = "/index.html";
}

const socket = io("http://localhost:3333");

const usernameDiv = document.getElementById("username");

let room;

socket.emit('select_room', {
  user_id: window.localStorage.getItem("user_id"),
  room_id: roomId,
}, data => {
  room = data.room;
  window.localStorage.setItem("room_id", data.room.id);
  createWelcomeMessage(data);

  getOnlineUsers();

  createConnectionMessage(data);

  getPreviousMessages();
});

document.getElementById("message_input").addEventListener("keypress", event => {
  if (event.key === "Enter") {
    const text = event.target.value;

    const data = {
      user_id: window.localStorage.getItem("user_id"),
      text,
      roomName: room.name,
    };

    socket.emit('message', data);

    event.target.value = "";
  }
});

socket.on("new_user_connected", data => {
  getOnlineUsers();
  getParticipants();
});

socket.on("user_disconnected", data => {
  getOnlineUsers();
  getParticipants();
})

socket.on('message', data => {
  createMessage(data);
});

socket.on('app_error', data => {
  alert(data.message);

  if (data.code === 404) {
    window.location.href = "/pages/select-room.html";
  }
})

socket.on('kicked', data => {
  alert("Você foi expulso da sala!");
  window.location.href = "/pages/select-room.html";
})

function getPreviousMessages() {
  socket.emit('previous_messages', {
    user_id: window.localStorage.getItem("user_id"),
    roomName: room.name,
  }, data => {
    data.messages.forEach(message => {
      createMessage(message);
    });
  });
}

function roomLinkToClipboard() {
  const linkToClipboard = "http://localhost:3000/pages/chat.html?select_room=" + room.id;

  navigator.clipboard.writeText(linkToClipboard).then(function () {
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

function getParticipants() {
  socket.emit("connections_room", {
    room_id: window.localStorage.getItem("room_id"),
  }, data => {
    const participants = [];
    data.connections.forEach(connection => {
      participants.push(connection.user);
    });

    createHtmlParticipants(participants);
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
    <li class="form-label">
      <strong> ${user.username} </strong>
    </li>
  `;
  });
}

function createHtmlParticipants(participantsInCurrentRoom) {
  const participants = document.getElementById("participants");
  participants.innerHTML = "";
  participantsInCurrentRoom.forEach(user => {
    participants.innerHTML += `
    <li>
      <strong> ${user.username} </strong>
      <button class="btn kick-button" onClick="kickUser('${user.id}')"> Expulsar </button>
    </li>
  `;
  });
}

function createConnectionMessage(connection) {
  if (!connection.is_on_chat) {
    const dataToBack = {
      user_id: window.localStorage.getItem("user_id"),
      roomName: room.name,
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
  usernameDiv.innerHTML = `Olá ${data.username} - você está na sala ${room.name}`;
}

function changeRoomName(data) {

}

function kickUser(userToKickId) {
  const user_id = window.localStorage.getItem("user_id");
  const room_id = window.localStorage.getItem("room_id");

  socket.emit('kick_user', { user_id, room_id, userToKickId }, data => {
    alert(`${data} foi expulso da sala com sucesso!`);
    getParticipants();
    getOnlineUsers();
  });
}

function kicked() {
  alert("Você foi expulso da sala!");
  window.location.href = "/pages/select-room.html";
}

document.getElementById("logout").addEventListener("click", () => {
  disconnectFromRoom();

  window.location.href = "./select-room.html";
});
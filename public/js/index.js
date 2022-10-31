const endPoint = "http://localhost:3333/login/";

const form = document.getElementById("join-account");

form.addEventListener("submit", event => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = {
    username,
    password
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
      if (data.error) {
        alert(data.error);
      } else {
        window.location.href = `./select-room.html?username=${data.username}`;
      }
    })
    .catch(error => {
      console.log(error);
    });
});
const endPoint = "http://localhost:3333/login/";

const form = document.getElementById("create-user");

form.addEventListener("submit", event => {
  console.log("AAAA")
  event.preventDefault();

  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = {
    email,
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
const endPoint = "http://localhost:3333/user/";

const form = document.getElementById("create-user");

form.addEventListener("submit", event => {
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
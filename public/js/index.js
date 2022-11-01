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
      console.log(data);
      if (data.status === "error") {
        alert(data.message);
      } else {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("user_id", data.user.id);
        window.location.href = `pages/select-room.html`;
      }
    })
    .catch(error => {
      console.log(error);
    });
});
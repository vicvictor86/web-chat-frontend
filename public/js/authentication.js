export function authenticateUser(data) {
  const endPoint = "http://localhost:3333/login/";

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

        window.sessionStorage.getItem("roomToRedirect");

        if (window.sessionStorage.roomToRedirect) {
          window.location.href = `pages/chat.html?select_room=${window.sessionStorage.roomToRedirect}`;
          window.sessionStorage.removeItem("roomToRedirect");
        } else {
          window.location.href = `pages/select-room.html`;
        }
        
      }
    })
    .catch(error => {
      console.log(error);
    });
}

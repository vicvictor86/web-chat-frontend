import { authenticateUser } from "./authentication.js";

const form = document.getElementById("join-account");

form.addEventListener("submit", event => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = {
    username,
    password
  };

  authenticateUser(data);
});
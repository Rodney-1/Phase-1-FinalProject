// Show today's date
const dateElement = document.getElementById("current-date");
const today = new Date();
dateElement.textContent = `Today's Date: ${today.toDateString()}`;  

// Elements selection
const goalForm = document.getElementById("goal-form");
const goalInput = document.getElementById("goal-input");
const goalList = document.querySelector("#goal-list ul");
const rewardDiv = document.querySelector("#reward");
const filterButtons = document.querySelectorAll(".filter-button");

// App initialization
document.addEventListener("DOMContentLoaded", initApp);

window.addEventListener("DOMContentLoaded", () => {
  const dateElement = document.getElementById("current-date");
  if (dateElement) {
    const now = new Date();
    dateElement.textContent = now.toDateString();
  }
});

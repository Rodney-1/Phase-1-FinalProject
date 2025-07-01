// Show today's date
const dateElement = document.getElementById("current-date");
const today = new Date();
dateElement.textContent = `Today's Date: ${today.toDateString()}`;  

// App initialization
document.addEventListener("DOMContentLoaded", initApp);

window.addEventListener("DOMContentLoaded", () => {
  const dateElement = document.getElementById("current-date");
  if (dateElement) {
    const now = new Date();
    dateElement.textContent = now.toDateString();
  }
});

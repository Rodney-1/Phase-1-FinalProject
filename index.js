// Show today's date
const dateElement = document.getElementById("current-date");
const today = new Date();
dateElement.textContent = `Today's Date: ${today.toDateString()}`;  

// Elements selection
const goalForm = document.getElementById("goal-form");
const goalInput = document.getElementById("goal-input");
const goalList = document.querySelector("#goal-list ul");
const rewardDiv = document.getElementById("reward");

// Function to add a new goal
function addGoal(event) {
    event.preventDefault();
    const goalText = goalInput.value.trim();
    
    if (goalText === "") {
        alert("Please enter a goal.");
        return;
    }

    const li = document.createElement("li");
    li.textContent = goalText;
    goalList.appendChild(li);
    
    // Clear the input field
    goalInput.value = "";
}

// Load existing goals from localStorage
let savedGoals = JSON.parse(localStorage.getItem("goals")) || [];

// Save goals
function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(savedGoals));
}
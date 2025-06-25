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

// App initialization
document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
    await fetchGoals();    // Fetch goals from the server
    setupEventListeners();   // Set up event listeners
}

// API endpoint to fetch goals
const API_URL = "http://localhost:3000/goals";
const GOALS_URL = `${API_URL}/goals`;

// Event listener setup
function setupEventListeners() {
    goalForm.addEventListener("submit", addGoal);
    goalList.addEventListener("click", handleGoalClick);
    filterButtons.forEach(btn => {
        btn.addEventListener("click", filterGoals);
    });
}
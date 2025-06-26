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


// API endpoint to fetch goals
const API_URL = "http://localhost:8080/goals";
const GOALS_URL = `${API_URL}/goals`;

// App initialization
document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
    await fetchGoals();    // Fetch goals from the server
    setupEventListeners();   // Set up event listeners
}

// Event listener setup
function setupEventListeners() {
    goalForm.addEventListener("submit", handleGoalSubmit);
    goalList.addEventListener("click", handleGoalClick);
    filterButtons.forEach(btn => {
        btn.addEventListener("click", filterGoals);
    });
}

// Form Submission of a new goal
async function handleGoalSubmit(e) {
    e.preventDefault();

    const goalText = goalInput.value.trim();
    
    if (goalText === "") {
        alert("Please enter a goal.");
        return;
    }

    await fetch(GOALS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            text: goalText,
            completed: false,
            date: new Date().toISOString().split("T")[0]
        })
    });
    goalInput.value = ""; // Clear input after submission
    await fetchGoals(); // Refresh the goal list
}
// Fetch goals from the server
async function fetchGoals(filter = "all") {
    const res = await fetch('http://localhost:8080/goals');
    let goals = await res.json();

    // Apply filters 
    goals = goals.filter(goal => {
        if (filter === "completed") {
            return goal.completed;
        } else if (filter === "incomplete") {
            return !goal.completed;
        }
        return true; // For 'all' filter
    });

    // Clear the current list
    goalList.innerHTML = "";

    // Populate the list with fetched goals
    goals.forEach(goal => {
        const li = document.createElement("li");
        li.className = goal.completed ? "completed" : "";
        li.innerHTML =`<span>${goal.text}</span>
                      <button class="complete-button" data-id="${goal.id}">${goal.completed ? "✅" : "Done"}</button>
                      <button class="delete-button" data-id="${goal.id}">🗑️</button>`;
        goalList.appendChild(li);
    });
}

// Handle complete and delete actions
async function handleGoalClick(e) {
    const goalId = e.target.dataset.id;
    if (e.target.classList.contains("complete-button")) {
        await toggleGoalCompletion(goalId);
        await fetchGoals();
    }
    if (e.target.classList.contains("delete-button")) {
        await deleteGoal(goalId);
        await fetchGoals();
    }
}

// Toggle goal completion
async function toggleGoalCompletion(goalId) {
    const res = await fetch(`${GOALS_URL}/${goalId}`);
    const goal = await res.json();

    await fetch(`${GOALS_URL}/${goalId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: !goal.completed })
    });
}

// Delete a goal
async function deleteGoal(goalId) {
    await fetch(`${GOALS_URL}/${goalId}`, {
        method: "DELETE"
    });
}

// Filter goals based on completion status
function filterGoals(e) {
    const filter = e.target.dataset.filter;
    fetchGoals(filter);
}








   
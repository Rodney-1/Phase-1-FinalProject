// API endpoint to fetch goals
const BASE_URL = "https://project-json-server-2.onrender.com/"

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

    await fetch(`${BASE_URL}`, {
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
                      <button class="complete-button" data-id="${goal.id}">✔️</button>
                      <button class="delete-button" data-id="${goal.id}">🗑️</button>`;
        goalList.appendChild(li);
    });
}

// Handle complete and delete actions
async function handleGoalClick(e) {
    const goalId = e.target.dataset.id;
    if (e.target.classList.contains("complete-button")) {
        await toggleGoalCompletion(goalId);
    } else if (e.target.classList.contains("delete-button")) {
        await deleteGoal(goalId);
    }
    await fetchGoals(); // Only once after action
}


// Toggle goal completion with reward
async function toggleGoalCompletion(goalId) {
    const res = await fetch(`${BASE_URL}/${goalId}`);
    const goal = await res.json();


    await fetch(`${BASE_URL}/${goalId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: !goal.completed })
    });
    console.log(`Goal ${goalId} completion toggled.`);

    if (!goal.completed) {
        showReward(goal.text);
    } else {
        rewardDiv.innerHTML = ""; // Clear reward if goal is marked incomplete
    }
}

// Reward system
function showReward(goalText) {
    rewardDiv.innerHTML = `<div class="reward-message">
        🎉 Congratulations! You've achieved your goal: "${goalText}"
    </div>`;
}
    // Delete a goal
    async function deleteGoal(goalId) {
        await fetch(`${BASE_URL}/${goalId}`, {
            method: "DELETE"
        });
    }

// Filter goals based on completion status
function filterGoals(e) {
    const filter = e.target.dataset.filter;
    fetchGoals(filter);
}

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});








   
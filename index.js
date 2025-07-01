// Local storage functions
function getGoals() {
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    return goals.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function saveGoals(goals) {
    localStorage.setItem("goals", JSON.stringify(goals));
}

// DOM elements
const goalForm = document.getElementById("goal-form");
const goalInput = document.getElementById("goal-input");
const goalList = document.getElementById("goal-list");
const filterButtons = document.querySelectorAll(".filter-btn");

// Initialize the app
function initApp() {
    fetchGoals();
    setupEventListeners();
}

// Event listeners
function setupEventListeners() {
    goalForm.addEventListener("submit", handleGoalSubmit);
    goalList.addEventListener("click", handleGoalClick);

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Filter goals
            filterGoals(btn.dataset.filter);
        });
    });
}

// Form submission handler
function handleGoalSubmit(e) {
    e.preventDefault();
    const goalText = goalInput.value.trim();

    if (!goalText) {
        alert("Please enter a goal.");
        return;
    }

const goals = getGoals();
goals.unshift({
    id: Date.now(),
    text: goalText,
    completed: false,
    date: new Date().toISOString()
});

saveGoals(goals);
goalInput.value = "";
fetchGoals();
}

// Fetch and render goals
function fetchGoals(filter = "all") {
    try {
        const goals = getGoals();
        const filteredGoals = goals.filter(goal => {
            if (filter === "completed") return goal.completed;
            if (filter === "incomplete") return !goal.completed;
            return true;
        });
        renderGoals(filteredGoals);
    } catch (error) {
        console.error("Error fetching goals:", error);
    }
}

// Render goals to DOM
function renderGoals(goals) {
    if (goals.length === 0) {
        goalList.innerHTML = '<li class="empty">No goals found</li>';
        return;
    }

goalList.innerHTML = goals.map(goal => `
    <li class="goal-item ${goal.completed ? 'completed' : ''}" data-id="${goal.id}">
        <span class="goal-text">${goal.text}</span>
        <div class="goal-actions">
            <button class="complete-btn">${goal.completed ? 'Undo' : 'Complete'}</button>
            <button class="delete-btn">Delete</button>
        </div>
        <div class="goal-date">${new Date(goal.date).toLocaleDateString()}</div>
    </li>
`).join("");
}

// Handle goal actions
function handleGoalClick(e) {
    const li = e.target.closest("li");
    if (!li) return;

    const goalId = parseInt(li.dataset.id);

    if (e.target.classList.contains("complete-btn")) {
        toggleGoalCompletion(goalId);
    } 
    else if (e.target.classList.contains("delete-btn")) {
        if (confirm("Are you sure you want to delete this goal?")) {
            deleteGoal(goalId);
        }
    }
}

// Toggle goal status
function toggleGoalCompletion(goalId) {
    const goals = getGoals();
    const goalIndex = goals.findIndex(g => g.id === goalId);

    if (goalIndex !== -1) {
        goals[goalIndex].completed = !goals[goalIndex].completed;
        saveGoals(goals);
        fetchGoals();
    }
}

// Delete goal
function deleteGoal(goalId) {
    let goals = getGoals();
    goals = goals.filter(goal => goal.id !== goalId);
    saveGoals(goals);
    fetchGoals();
}

// Filter goals
function filterGoals(filter) {
    fetchGoals(filter);
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);


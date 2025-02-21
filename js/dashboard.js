class Dashboard {
    constructor(container) {
        this.container = container;
        this.workouts = StorageManager.getWorkouts();
        this.render();
        this.attachEventListeners();
    }

    calculateStats() {
        const totalWorkouts = this.workouts.length;
        const totalCalories = this.workouts.reduce((sum, workout) => sum + Number(workout.calories), 0);
        const avgCalories = totalWorkouts ? Math.round(totalCalories / totalWorkouts) : 0;

        return { totalWorkouts, totalCalories, avgCalories };
    }

    render() {
        const stats = this.calculateStats();
        this.container.innerHTML = `
            <div class="dashboard">
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Calories Burned</h3>
                        <p class="stat-value">${stats.totalCalories}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Workouts</h3>
                        <p class="stat-value">${stats.totalWorkouts}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Avg. Calories/Workout</h3>
                        <p class="stat-value">${stats.avgCalories}</p>
                    </div>
                </div>

                <div class="workout-form-container">
                    <h2>Add New Workout</h2>
                    <form id="add-workout-form">
                        <input type="text" id="workout-name" placeholder="Workout Name" required>
                        <input type="number" id="calories-burned" placeholder="Calories Burned" required>
                        <select id="workout-status" required>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>
                        <button type="submit">Add Workout</button>
                    </form>
                </div>

                <div class="workout-history">
                    <h2>Recent Workouts</h2>
                    <div class="workout-list">
                        ${this.renderWorkoutHistory()}
                    </div>
                </div>
            </div>
        `;
    }

    renderWorkoutHistory() {
        return this.workouts
            .slice(-5)
            .reverse()
            .map(workout => `
                <div class="workout-item">
                    <h3>${workout.name}</h3>
                    <p>Calories: ${workout.calories}</p>
                    <p>Status: ${workout.status}</p>
                    <p>Date: ${new Date(workout.date).toLocaleDateString()}</p>
                </div>
            `)
            .join('');
    }

    attachEventListeners() {
        const form = document.getElementById('add-workout-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const workout = {
                name: document.getElementById('workout-name').value,
                calories: Number(document.getElementById('calories-burned').value),
                status: document.getElementById('workout-status').value
            };
            StorageManager.addWorkout(workout);
            this.workouts = StorageManager.getWorkouts();
            this.render();
        });
    }
}

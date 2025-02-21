class WorkoutSection {
    constructor(container) {
        this.container = container;
        this.workouts = StorageManager.getWorkouts();
        this.selectedDate = new Date();
        this.currentMonth = new Date();
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="workout-page">
                <div class="calendar-section">
                    <div class="calendar-header">
                        <button id="prev-month">&lt;</button>
                        <h2 id="calendar-title"></h2>
                        <button id="next-month">&gt;</button>
                    </div>
                    <div class="calendar" id="calendar">
                        <div class="calendar-weekdays">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                        </div>
                        <div class="calendar-days" id="calendar-days">
                            <!-- Calendar days will be rendered here -->
                        </div>
                    </div>
                </div>
                
                <div class="workouts-section">
                    <h2 id="selected-date"></h2>
                    <div class="completed-workouts">
                        <h3>Completed Workouts</h3>
                        <div class="workout-list" id="completed-list">
                            ${this.renderWorkoutsByStatus('completed')}
                        </div>
                    </div>
                    
                    <div class="pending-workouts">
                        <h3>Pending Workouts</h3>
                        <div class="workout-list" id="pending-list">
                            ${this.renderWorkoutsByStatus('pending')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.renderCalendar();
        this.updateSelectedDateDisplay();
    }

    renderWorkoutsByStatus(status) {
        const filteredWorkouts = this.workouts.filter(workout => 
            workout.status === status && 
            new Date(workout.date).toDateString() === this.selectedDate.toDateString()
        );

        return filteredWorkouts.length ? 
            filteredWorkouts.map(workout => `
                <div class="workout-item" data-workout-id="${workout.id}">
                    <div class="workout-details">
                        <h3>${workout.name}</h3>
                        <p>Calories: ${workout.calories}</p>
                        <p>Time: ${new Date(workout.date).toLocaleTimeString()}</p>
                    </div>
                    ${status === 'pending' ? `
                        <button class="complete-workout-btn">
                            Mark Complete
                        </button>
                    ` : ''}
                </div>
            `).join('') :
            '<p class="no-workouts">No workouts found</p>';
    }

    markWorkoutComplete(workoutId) {
        // Find the workout in the array
        const workoutIndex = this.workouts.findIndex(w => w.id === workoutId);
        
        if (workoutIndex !== -1) {
            // Update the workout status
            this.workouts[workoutIndex].status = 'completed';
            // Update completion time
            this.workouts[workoutIndex].completedAt = new Date().toISOString();
            
            // Save to localStorage
            StorageManager.saveData('workouts', this.workouts);
            
            // Re-render the workout lists
            this.updateWorkoutLists();
        }
    }

    updateWorkoutLists() {
        // Update completed workouts list
        const completedList = document.getElementById('completed-list');
        completedList.innerHTML = this.renderWorkoutsByStatus('completed');

        // Update pending workouts list
        const pendingList = document.getElementById('pending-list');
        pendingList.innerHTML = this.renderWorkoutsByStatus('pending');

        // Reattach event listeners
        this.attachWorkoutEventListeners();
    }

    attachEventListeners() {
        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.renderCalendar();
        });

        // Calendar day selection
        document.getElementById('calendar-days').addEventListener('click', (e) => {
            const dayElement = e.target.closest('.calendar-day');
            if (dayElement && !dayElement.classList.contains('empty')) {
                this.selectedDate = new Date(dayElement.dataset.date);
                this.updateSelectedDateDisplay();
                this.renderCalendar();
                this.updateWorkoutLists();
            }
        });

        // Workout completion buttons
        this.attachWorkoutEventListeners();
    }

    attachWorkoutEventListeners() {
        // Add click handlers for complete buttons
        const completeButtons = document.querySelectorAll('.complete-workout-btn');
        completeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const workoutItem = e.target.closest('.workout-item');
                const workoutId = Number(workoutItem.dataset.workoutId);
                this.markWorkoutComplete(workoutId);
            });
        });
    }

    renderCalendar() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        // Update calendar title
        document.getElementById('calendar-title').textContent = 
            `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const startingDay = firstDay.getDay(); // 0-6 (Sunday-Saturday)

        const calendarDays = document.getElementById('calendar-days');
        let daysHTML = '';

        // Add empty cells for days before the first day of month
        for (let i = 0; i < startingDay; i++) {
            daysHTML += '<div class="calendar-day empty"></div>';
        }

        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const isToday = this.isSameDate(date, new Date());
            const isSelected = this.isSameDate(date, this.selectedDate);
            const hasWorkouts = this.getWorkoutsForDate(date).length > 0;

            daysHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} 
                                       ${isSelected ? 'selected' : ''} 
                                       ${hasWorkouts ? 'has-workouts' : ''}"
                     data-date="${date.toISOString()}">
                    ${day}
                    ${hasWorkouts ? '<span class="workout-dot"></span>' : ''}
                </div>
            `;
        }

        calendarDays.innerHTML = daysHTML;
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    getWorkoutsForDate(date) {
        return this.workouts.filter(workout => 
            this.isSameDate(new Date(workout.date), date)
        );
    }

    updateSelectedDateDisplay() {
        const dateStr = this.selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('selected-date').textContent = `Workouts for ${dateStr}`;
    }
}

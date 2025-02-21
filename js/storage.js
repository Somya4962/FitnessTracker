class StorageManager {
    static saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static getData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    static addWorkout(workout) {
        const workouts = this.getData('workouts') || [];
        workouts.push({
            ...workout,
            id: Date.now(),
            date: new Date().toISOString()
        });
        this.saveData('workouts', workouts);
    }

    static getWorkouts() {
        return this.getData('workouts') || [];
    }

    static updateWorkout(workoutId, updates) {
        const workouts = this.getWorkouts();
        const workoutIndex = workouts.findIndex(w => w.id === workoutId);
        
        if (workoutIndex !== -1) {
            workouts[workoutIndex] = {
                ...workouts[workoutIndex],
                ...updates
            };
            this.saveData('workouts', workouts);
            return true;
        }
        return false;
    }
}

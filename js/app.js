class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.initializeApp();
    }

    initializeApp() {
        // Initialize navigation
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Load default page
        this.navigateToPage(this.currentPage);
    }

    navigateToPage(page) {
        // Update active link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        // Update current page
        this.currentPage = page;
        
        // Clear main content
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '';

        // Load new page content
        switch (page) {
            case 'dashboard':
                new Dashboard(mainContent);
                break;
            case 'workouts':
                new WorkoutSection(mainContent);
                break;
            case 'tutorials':
                new TutorialSection(mainContent);
                break;
            case 'contact':
                new ContactPage(mainContent);
                break;
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

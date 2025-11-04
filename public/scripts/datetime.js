document.addEventListener('DOMContentLoaded', function() {
    function updateDateTime() {
        const timeElement = document.querySelector('.date p:first-child');
        const dateElement = document.querySelector('.date p:last-child');
        
        if (!timeElement || !dateElement) return; // Guard clause if elements not found
        
        const now = new Date();
        
        // Update time - using local time format
        timeElement.textContent = now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        // Update date - using local date format
        dateElement.textContent = now.toLocaleDateString(undefined, {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    }

    // Update immediately
    updateDateTime();

    // Update every second
    setInterval(updateDateTime, 1000);
});
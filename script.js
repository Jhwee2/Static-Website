// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor click behavior

        // Scroll to the target section smoothly
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dark Mode Toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement; // Represents the <html> tag
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

// Function to apply the theme based on preference
function applyTheme(theme) {
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
        htmlElement.classList.remove('light');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        htmlElement.classList.add('light');
        htmlElement.classList.remove('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

// Check for saved theme preference in localStorage or default to 'light'
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme); // Apply the saved or default theme on page load

// Add event listener to the dark mode toggle button
darkModeToggle.addEventListener('click', () => {
    // Determine the current theme and toggle it
    if (htmlElement.classList.contains('light')) {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark'); // Save preference
    } else {
        applyTheme('light');
        localStorage.setItem('theme', 'light'); // Save preference
    }
});

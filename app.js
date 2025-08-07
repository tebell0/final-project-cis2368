// This file ensures that the  login page simulates a successful login regardless of input.
// It also hides the login form and displays the dashboard upon submission.
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
});


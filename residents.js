// This file ensures successful CRUD operations for the Residents table.
document.addEventListener('DOMContentLoaded', function() {
    loadResidents();
// This function sets up the event listener for the resident form submission.
    // It ensures users can both add a new resident and update an existing one.
    document.getElementById('resident-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('resident-id').value;
        const firstname = document.getElementById('resident-firstname').value;
        const lastname = document.getElementById('resident-lastname').value;
        const age = document.getElementById('resident-age').value;
        const room = document.getElementById('resident-room').value;
        const payload = { firstname, lastname, age: parseInt(age), room: parseInt(room) };

        if (id) {
            // Update
            fetch(`http://127.0.0.1:5000/api/residents/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => {
                resetResidentForm();
                loadResidents();
            });
        } else {
            // Add
            fetch('http://127.0.0.1:5000/api/residents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => {
                resetResidentForm();
                loadResidents();
            });
        }
    });

    document.getElementById('resident-cancel-btn').addEventListener('click', resetResidentForm);
});
// This function fetches the list of residents from the backend database and displays them.
function loadResidents() {
    fetch('http://127.0.0.1:5000/api/residents')
        .then(response => response.json())
        .then(data => {
            const listDiv = document.getElementById('residents-list');
            listDiv.innerHTML = '';
            data.forEach(resident => {
                const div = document.createElement('div');
                div.style.marginBottom = '10px';
                div.innerHTML = `
                    <b>Name:</b> ${resident.firstname} ${resident.lastname} &nbsp;
                    <b>Age:</b> ${resident.age} &nbsp;
                    <b>Room:</b> ${resident.room}
                    <button onclick="editResident(${resident.id}, '${resident.firstname}', '${resident.lastname}', ${resident.age}, ${resident.room})">Edit</button>
                    <button onclick="deleteResident(${resident.id})">Delete</button>
                `;
                listDiv.appendChild(div);
            });
        });
}
// This function enables edit functionality for specific residents, specified by clicking the corresponding button.
window.editResident = function(id, firstname, lastname, age, room) {
    document.getElementById('resident-id').value = id;
    document.getElementById('resident-firstname').value = firstname;
    document.getElementById('resident-lastname').value = lastname;
    document.getElementById('resident-age').value = age;
    document.getElementById('resident-room').value = room;
    document.getElementById('resident-submit-btn').textContent = 'Update Resident';
    document.getElementById('resident-cancel-btn').style.display = 'inline-block';
};
// This function deletes a resident by their ID after confirming with the user.
window.deleteResident = function(id) {
    if (confirm('Are you sure you want to delete this resident?')) {
        fetch(`http://127.0.0.1:5000/api/residents/${id}`, { method: 'DELETE' })
            .then(() => loadResidents());
    }
};
// This function resets the resident form to its initial state, clearing inputs and resetting buttons.
function resetResidentForm() {
    document.getElementById('resident-id').value = '';
    document.getElementById('resident-firstname').value = '';
    document.getElementById('resident-lastname').value = '';
    document.getElementById('resident-age').value = '';
    document.getElementById('resident-room').value = '';
    document.getElementById('resident-submit-btn').textContent = 'Add Resident';
    document.getElementById('resident-cancel-btn').style.display = 'none';
}
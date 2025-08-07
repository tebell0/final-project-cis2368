// This file ensures successful CRUD operations for the Floors table.
document.addEventListener('DOMContentLoaded', function() {
    loadFloors();
// This function sets up the event listener for the floor form submission.
    // It ensures users can both add a new floor and update an existing one.
    document.getElementById('floor-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('floor-id').value;
        const level = document.getElementById('floor-level').value;
        const name = document.getElementById('floor-name').value;
        const payload = { level: parseInt(level), name };

        if (id) {
            fetch(`http://127.0.0.1:5000/api/floors/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => {
                resetFloorForm();
                loadFloors();
            });
        } else {
            fetch('http://127.0.0.1:5000/api/floors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => {
                resetFloorForm();
                loadFloors();
            });
        }
    });

    document.getElementById('floor-cancel-btn').addEventListener('click', resetFloorForm);
});
// This function fetches the list of floors from the backend and displays them.
// It also provides the buttons to edit or delete each floor.
function loadFloors() {
    fetch('http://127.0.0.1:5000/api/floors')
        .then(response => response.json())
        .then(data => {
            const listDiv = document.getElementById('floors-list');
            listDiv.innerHTML = '';
            data.forEach(floor => {
                const div = document.createElement('div');
                div.style.marginBottom = '10px';
                div.innerHTML = `
                    <b>Level:</b> ${floor.level} &nbsp; <b>Name:</b> ${floor.name}
                    <button onclick="editFloor(${floor.id}, ${floor.level}, '${floor.name}')">Edit</button>
                    <button onclick="deleteFloor(${floor.id})">Delete</button>
                `;
                listDiv.appendChild(div);
            });
        });
}
// This function is enables edit functionality for specific floors, specified by clicking the corresponding button.
window.editFloor = function(id, level, name) {
    document.getElementById('floor-id').value = id;
    document.getElementById('floor-level').value = level;
    document.getElementById('floor-name').value = name;
    document.getElementById('floor-submit-btn').textContent = 'Update Floor';
    document.getElementById('floor-cancel-btn').style.display = 'inline-block';
};
// This function deletes a floor by its ID after confirming with the user.
window.deleteFloor = function(id) {
    if (confirm('Are you sure you want to delete this floor?')) {
        fetch(`http://127.0.0.1:5000/api/floors/${id}`, { method: 'DELETE' })
            .then(() => loadFloors());
    }
};
// This function resets the floor form to its initial state, clearing inputs and resetting buttons.
function resetFloorForm() {
    document.getElementById('floor-id').value = '';
    document.getElementById('floor-level').value = '';
    document.getElementById('floor-name').value = '';
    document.getElementById('floor-submit-btn').textContent = 'Add Floor';
    document.getElementById('floor-cancel-btn').style.display = 'none';
}
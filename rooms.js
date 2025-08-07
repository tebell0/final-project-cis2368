// This file ensures the functionality of the Rooms table with CRUD operations.
document.addEventListener('DOMContentLoaded', function() {
    loadRooms();
// This function sets up the event listener for the room form submission.
    // It ensures users can both add a new room and update an existing one.
    document.getElementById('room-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('room-id').value;
        const number = document.getElementById('room-number').value;
        const capacity = document.getElementById('room-capacity').value;
        const floor_num = document.getElementById('room-floor').value;
        const payload = { number: parseInt(number), capacity, floor_num: parseInt(floor_num) };

        if (id) {
            // Update
            fetch(`http://127.0.0.1:5000/api/rooms/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => {
                resetRoomForm();
                loadRooms();
            });
        } else {
            // Add
            fetch('http://127.0.0.1:5000/api/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => {
                resetRoomForm();
                loadRooms();
            });
        }
    });

    document.getElementById('room-cancel-btn').addEventListener('click', resetRoomForm);
});
// This function fetches the list of rooms from the backend database and displays them.
// It also provides the buttons to edit or delete each room.
function loadRooms() {
    fetch('http://127.0.0.1:5000/api/rooms')
        .then(response => response.json())
        .then(data => {
            const listDiv = document.getElementById('rooms-list');
            listDiv.innerHTML = '';
            data.forEach(room => {
                const div = document.createElement('div');
                div.style.marginBottom = '10px';
                div.innerHTML = `
                    <b>Number:</b> ${room.number} &nbsp;
                    <b>Capacity:</b> ${room.capacity} &nbsp;
                    <b>Floor:</b> ${room.floor_num}
                    <button onclick="editRoom(${room.id}, ${room.number}, '${room.capacity}', ${room.floor_num})">Edit</button>
                    <button onclick="deleteRoom(${room.id})">Delete</button>
                `;
                listDiv.appendChild(div);
            });
        });
}
// This function enables edit functionality for specific rooms, specified by clicking the corresponding button.
window.editRoom = function(id, number, capacity, floor_num) {
    document.getElementById('room-id').value = id;
    document.getElementById('room-number').value = number;
    document.getElementById('room-capacity').value = capacity;
    document.getElementById('room-floor').value = floor_num;
    document.getElementById('room-submit-btn').textContent = 'Update Room';
    document.getElementById('room-cancel-btn').style.display = 'inline-block';
};
// This function deletes a room by its ID after confirming with the user.
window.deleteRoom = function(id) {
    if (confirm('Are you sure you want to delete this room?')) {
        fetch(`http://127.0.0.1:5000/api/rooms/${id}`, { method: 'DELETE' })
            .then(() => loadRooms());
    }
};
// This function resets the room form to its initial state, clearing inputs and resetting buttons.
function resetRoomForm() {
    document.getElementById('room-id').value = '';
    document.getElementById('room-number').value = '';
    document.getElementById('room-capacity').value = '';
    document.getElementById('room-floor').value = '';
    document.getElementById('room-submit-btn').textContent = 'Add Room';
    document.getElementById('room-cancel-btn').style.display = 'none';
}
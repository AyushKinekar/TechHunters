// script.js

document.addEventListener('DOMContentLoaded', () => {
    const checkinForm = document.getElementById('checkinForm');
    const roomList = document.getElementById('roomList');
    const clearCheckinsButton = document.getElementById('clearCheckins');

    // Load stored check-ins from localStorage
    const storedCheckins = JSON.parse(localStorage.getItem('checkins')) || [];

    // Render stored check-ins
    renderRoomAvailability();

    // Add event listener for the form
    checkinForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const facultyName = document.getElementById('facultyName').value;
        const facultyID = document.getElementById('facultyID').value;
        const roomSelect = document.getElementById('roomSelect').value;

        const checkin = {
            id: Date.now(),
            name: facultyName,
            facultyId: facultyID,
            room: roomSelect,
            checkinTime: new Date().toLocaleString()
        };

        storedCheckins.push(checkin);
        localStorage.setItem('checkins', JSON.stringify(storedCheckins));

        // Render updated room availability
        renderRoomAvailability();
        checkinForm.reset();
    });

    // Function to render room availability
    function renderRoomAvailability() {
        roomList.innerHTML = ''; // Clear the list
        const rooms = {};

        // Organize check-ins by room
        storedCheckins.forEach(checkin => {
            if (!rooms[checkin.room]) {
                rooms[checkin.room] = [];
            }
            rooms[checkin.room].push(checkin);
        });

        // Display each room and its occupants
        Object.keys(rooms).forEach(room => {
            const roomItem = document.createElement('li');
            roomItem.innerHTML = `<strong>${room}:</strong>`;

            rooms[room].forEach(checkin => {
                const facultyInfo = document.createElement('span');
                facultyInfo.innerHTML = `${checkin.name} (ID: ${checkin.facultyId}) - Checked in at ${checkin.checkinTime}`;

                const checkoutButton = document.createElement('button');
                checkoutButton.textContent = 'Check Out';
                checkoutButton.style.backgroundColor = '#eb3b5a';
                checkoutButton.style.color = 'white';
                checkoutButton.style.border = 'none';
                checkoutButton.style.padding = '0.5rem';
                checkoutButton.style.cursor = 'pointer';
                checkoutButton.style.borderRadius = '5px';
                checkoutButton.style.marginLeft = '10px';

                checkoutButton.addEventListener('click', () => {
                    // Remove check-in from storage and update UI
                    const updatedCheckins = storedCheckins.filter(c => c.id !== checkin.id);
                    localStorage.setItem('checkins', JSON.stringify(updatedCheckins));
                    renderRoomAvailability();
                });

                facultyInfo.appendChild(checkoutButton);
                roomItem.appendChild(facultyInfo);
            });

            roomList.appendChild(roomItem);
        });
    }

    // Clear all check-ins
    clearCheckinsButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all check-ins?')) {
            localStorage.removeItem('checkins');
            roomList.innerHTML = '';
        }
    });
});
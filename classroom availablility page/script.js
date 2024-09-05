const STORAGE_KEY = 'classrooms';
let classrooms = loadClassrooms();
let isAdminView = false;
const initialShownItems = 5;
let shownItemsCount = initialShownItems;

function loadClassrooms() {
    const storedClassrooms = localStorage.getItem(STORAGE_KEY);
    return storedClassrooms ? JSON.parse(storedClassrooms) : [
        { name: "Room A", room: "101", available: true },
        { name: "Room B", room: "102", available: false },
        // Add more sample data as needed
    ];
}

function saveClassrooms() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classrooms));
}

function renderClassroomListUser(classroomsToDisplay) {
    const classroomTableBody = document.getElementById('classroomTableBody');
    const showMoreListButton = document.getElementById('showMoreListButton');
    const showLessListButton = document.getElementById('showLessListButton');
    classroomTableBody.innerHTML = '';

    let displayedClassrooms = classroomsToDisplay.slice(0, shownItemsCount);

    displayedClassrooms.forEach(renderClassroomRow);

    if (classroomsToDisplay.length > shownItemsCount) {
        showMoreListButton.style.display = 'block';
    } else {
        showMoreListButton.style.display = 'none';
    }

    if (shownItemsCount > initialShownItems) {
        showLessListButton.style.display = 'block';
    } else {
        showLessListButton.style.display = 'none';
    }
}

function renderClassroomRow(classroom) {
    const classroomTableBody = document.getElementById('classroomTableBody');
    const row = document.createElement('tr');
    row.innerHTML = 
        `<td>${classroom.name}</td>
         <td>${classroom.room}</td>`;
    classroomTableBody.appendChild(row);
}

function renderAvailabilityChart(classroomsToDisplay) {
    const availabilityChart = document.getElementById('availabilityChart');
    const showMoreChartButton = document.getElementById('showMoreChartButton');
    const showLessChartButton = document.getElementById('showLessChartButton');
    availabilityChart.innerHTML = '';

    let displayedClassrooms = classroomsToDisplay.slice(0, shownItemsCount);

    displayedClassrooms.forEach(renderChartBar);

    if (classroomsToDisplay.length > shownItemsCount) {
        showMoreChartButton.style.display = 'block';
    } else {
        showMoreChartButton.style.display = 'none';
    }

    if (shownItemsCount > initialShownItems) {
        showLessChartButton.style.display = 'block';
    } else {
        showLessChartButton.style.display = 'none';
    }
}

function renderChartBar(classroom) {
    const availabilityChart = document.getElementById('availabilityChart');
    const bar = document.createElement('div');
    bar.className = 'chart-bar';

    bar.innerHTML = 
        `<div class="bar-label">${classroom.name}</div>
         <div class="status-label ${classroom.available ? 'available-label' : 'not-available-label'}">
            ${classroom.available ? 'Available' : 'Not Available'}
         </div>`;

    availabilityChart.appendChild(bar);
}

function renderClassroomListAdmin() {
    const adminClassroomTableBody = document.getElementById('adminClassroomTableBody');
    adminClassroomTableBody.innerHTML = '';

    classrooms.forEach((classroom, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index; // Store the index in a data attribute
        row.innerHTML = 
            `<td contenteditable="false" class="editable">${classroom.name}</td>
             <td contenteditable="false" class="editable">${classroom.room}</td>
             <td>
                <select class="availability-select" ${classroom.available ? 'disabled' : 'disabled'}>
                    <option value="true" ${classroom.available ? 'selected' : ''}>Available</option>
                    <option value="false" ${!classroom.available ? 'selected' : ''}>Not Available</option>
                </select>
             </td>
             <td>
                <button class="edit-button" onclick="enableEdit(this)">Edit</button>
                <button class="delete-button" onclick="deleteClassroom(this)">Delete</button>
                <button class="save-button" onclick="saveEdit(this)" style="display: none;">Save</button>
             </td>`;
        adminClassroomTableBody.appendChild(row);
    });
}

function addClassroom(name, room, available) {
    classrooms.push({ name, room, available: available === 'true' });
    saveClassrooms();
    renderClassroomListAdmin();
    renderClassroomListUser(classrooms);
    renderAvailabilityChart(classrooms);
}

function enableEdit(button) {
    const row = button.closest('tr');
    row.querySelectorAll('.editable').forEach(cell => {
        cell.setAttribute('contenteditable', 'true');
    });
    row.querySelector('.availability-select').removeAttribute('disabled');
    row.querySelector('.save-button').style.display = 'inline-block';
    button.style.display = 'none';
}

function saveEdit(button) {
    const row = button.closest('tr');
    const index = row.dataset.index;

    // Retrieve values from the row
    const name = row.cells[0].textContent.trim();
    const room = row.cells[1].textContent.trim();
    const available = row.querySelector('.availability-select').value;

    if (name && room) { // Ensure name and room are not empty
        classrooms[index] = { name, room, available: available === 'true' };
        saveClassrooms();
        renderClassroomListAdmin();
        renderClassroomListUser(classrooms);
        renderAvailabilityChart(classrooms);
    } else {
        alert('Name and Room cannot be empty!');
    }
}

function deleteClassroom(button) {
    const row = button.closest('tr');
    const index = row.dataset.index;

    classrooms.splice(index, 1);
    saveClassrooms();
    renderClassroomListAdmin();
    renderClassroomListUser(classrooms);
    renderAvailabilityChart(classrooms);
}

function toggleView() {
    isAdminView = !isAdminView;

    const userView = document.getElementById('userView');
    const adminView = document.getElementById('adminView');
    const switchButton = document.getElementById('switchButton');

    userView.style.display = isAdminView ? 'none' : 'block';
    adminView.style.display = isAdminView ? 'block' : 'none';
    switchButton.textContent = isAdminView ? 'Switch to User View' : 'Switch to Admin View';
}

function searchClassroom() {
    const searchQuery = document.getElementById('classroomSearchInput').value.toLowerCase();
    const filteredClassrooms = classrooms.filter(classroom =>
        classroom.name.toLowerCase().includes(searchQuery)
    );

    renderClassroomListUser(filteredClassrooms);
    renderAvailabilityChart(filteredClassrooms);
}

document.addEventListener('DOMContentLoaded', function() {
    renderClassroomListUser(classrooms);
    renderAvailabilityChart(classrooms);
    renderClassroomListAdmin();

    document.getElementById('switchButton').addEventListener('click', toggleView);

    document.getElementById('showMoreListButton').addEventListener('click', function() {
        shownItemsCount += 5;
        renderClassroomListUser(classrooms);
        renderAvailabilityChart(classrooms);
    });

    document.getElementById('showLessListButton').addEventListener('click', function() {
        shownItemsCount = Math.max(initialShownItems, shownItemsCount - 5);
        renderClassroomListUser(classrooms);
        renderAvailabilityChart(classrooms);
    });

    document.getElementById('showMoreChartButton').addEventListener('click', function() {
        shownItemsCount += 5;
        renderAvailabilityChart(classrooms);
    });

    document.getElementById('showLessChartButton').addEventListener('click', function() {
        shownItemsCount = Math.max(initialShownItems, shownItemsCount - 5);
        renderAvailabilityChart(classrooms);
    });

    document.getElementById('addClassroomForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('newClassroomName').value;
        const room = document.getElementById('newRoomNumber').value;
        const available = document.getElementById('newAvailability').value;
        addClassroom(name, room, available);
        e.target.reset();
    });

    document.getElementById('searchButton').addEventListener('click', searchClassroom);
    document.getElementById('classroomSearchInput').addEventListener('input', searchClassroom);
});

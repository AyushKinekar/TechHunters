const STORAGE_KEY = 'faculties';
let faculties = loadFaculties();
let isAdminView = false;
const initialShownItems = 5;
let shownItemsCount = initialShownItems;

function loadFaculties() {
    const storedFaculties = localStorage.getItem(STORAGE_KEY);
    return storedFaculties ? JSON.parse(storedFaculties) : [
        { name: "Prof. Prabhat Ranjan", room: "Room 101", available: true },
        { name: "Dr. Ajay Paithane", room: "Room 102", available: false },
        // Add more sample data as needed
    ];
}

function saveFaculties() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faculties));
}

function renderFacultyListUser(facultiesToDisplay) {
    const facultyTableBody = document.getElementById('facultyTableBody');
    const showMoreListButton = document.getElementById('showMoreListButton');
    const showLessListButton = document.getElementById('showLessListButton');
    facultyTableBody.innerHTML = '';

    let displayedFaculties = facultiesToDisplay.slice(0, shownItemsCount);

    displayedFaculties.forEach(renderFacultyRow);

    if (facultiesToDisplay.length > shownItemsCount) {
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

function renderFacultyRow(faculty) {
    const facultyTableBody = document.getElementById('facultyTableBody');
    const row = document.createElement('tr');
    row.innerHTML = 
        `<td>${faculty.name}</td>
         <td>${faculty.room}</td>`;
    facultyTableBody.appendChild(row);
}

function renderAvailabilityChart(facultiesToDisplay) {
    const availabilityChart = document.getElementById('availabilityChart');
    const showMoreChartButton = document.getElementById('showMoreChartButton');
    const showLessChartButton = document.getElementById('showLessChartButton');
    availabilityChart.innerHTML = '';

    let displayedFaculties = facultiesToDisplay.slice(0, shownItemsCount);

    displayedFaculties.forEach(renderChartBar);

    if (facultiesToDisplay.length > shownItemsCount) {
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

function renderChartBar(faculty) {
    const availabilityChart = document.getElementById('availabilityChart');
    const bar = document.createElement('div');
    bar.className = 'chart-bar';

    bar.innerHTML = 
        `<div class="bar-label">${faculty.name}</div>
         <div class="status-label ${faculty.available ? 'available-label' : 'not-available-label'}">
            ${faculty.available ? 'Available' : 'Not Available'}
         </div>`;

    availabilityChart.appendChild(bar);
}

function renderFacultyListAdmin() {
    const adminFacultyTableBody = document.getElementById('adminFacultyTableBody');
    adminFacultyTableBody.innerHTML = '';

    faculties.forEach((faculty, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index; // Store the index in a data attribute
        row.innerHTML = 
            `<td contenteditable="false" class="editable">${faculty.name}</td>
             <td contenteditable="false" class="editable">${faculty.room}</td>
             <td>
                <select class="availability-select" ${faculty.available ? 'disabled' : 'disabled'}>
                    <option value="true" ${faculty.available ? 'selected' : ''}>Available</option>
                    <option value="false" ${!faculty.available ? 'selected' : ''}>Not Available</option>
                </select>
             </td>
             <td>
                <button class="edit-button" onclick="enableEdit(this)">Edit</button>
                <button class="delete-button" onclick="deleteFaculty(this)">Delete</button>
                <button class="save-button" onclick="saveEdit(this)" style="display: none;">Save</button>
             </td>`;
        adminFacultyTableBody.appendChild(row);
    });
}

function addFaculty(name, room, available) {
    faculties.push({ name, room, available: available === 'true' });
    saveFaculties();
    renderFacultyListAdmin();
    renderFacultyListUser(faculties);
    renderAvailabilityChart(faculties);
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
        faculties[index] = { name, room, available: available === 'true' };
        saveFaculties();
        renderFacultyListAdmin();
        renderFacultyListUser(faculties);
        renderAvailabilityChart(faculties);
    } else {
        alert('Name and Room cannot be empty!');
    }
}

function deleteFaculty(button) {
    const row = button.closest('tr');
    const index = row.dataset.index;

    faculties.splice(index, 1);
    saveFaculties();
    renderFacultyListAdmin();
    renderFacultyListUser(faculties);
    renderAvailabilityChart(faculties);
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

function searchFaculty() {
    const searchQuery = document.getElementById('facultySearchInput').value.toLowerCase();
    const filteredFaculties = faculties.filter(faculty =>
        faculty.name.toLowerCase().includes(searchQuery)
    );

    renderFacultyListUser(filteredFaculties);
    renderAvailabilityChart(filteredFaculties);
}

document.addEventListener('DOMContentLoaded', function() {
    renderFacultyListUser(faculties);
    renderAvailabilityChart(faculties);
    renderFacultyListAdmin();

    document.getElementById('switchButton').addEventListener('click', toggleView);

    document.getElementById('showMoreListButton').addEventListener('click', function() {
        shownItemsCount += 5;
        renderFacultyListUser(faculties);
        renderAvailabilityChart(faculties);
    });

    document.getElementById('showLessListButton').addEventListener('click', function() {
        shownItemsCount = Math.max(initialShownItems, shownItemsCount - 5);
        renderFacultyListUser(faculties);
        renderAvailabilityChart(faculties);
    });

    document.getElementById('showMoreChartButton').addEventListener('click', function() {
        shownItemsCount += 5;
        renderAvailabilityChart(faculties);
    });

    document.getElementById('showLessChartButton').addEventListener('click', function() {
        shownItemsCount = Math.max(initialShownItems, shownItemsCount - 5);
        renderAvailabilityChart(faculties);
    });

    document.getElementById('addFacultyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('newFacultyName').value;
        const room = document.getElementById('newRoomNumber').value;
        const available = document.getElementById('newAvailability').value;
        addFaculty(name, room, available);
        e.target.reset();
    });

    document.getElementById('searchButton').addEventListener('click', searchFaculty);
    document.getElementById('facultySearchInput').addEventListener('input', searchFaculty);
});

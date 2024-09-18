// labs-script.js

document.addEventListener('DOMContentLoaded', function () {
    const labForm = document.getElementById('labForm');
    const labStatusSelect = document.getElementById('labStatus');
    const occupantNameInput = document.getElementById('occupantName');
    const occupiedList = document.getElementById('occupiedList');
    const unoccupiedList = document.getElementById('unoccupiedList');
    const availabilityTableBody = document.getElementById('availabilityTable').querySelector('tbody');

    // Load stored labs from localStorage
    const storedLabs = JSON.parse(localStorage.getItem('labs')) || [];

    // Render the stored labs
    storedLabs.forEach(renderLab);
    renderAvailabilityChart();

    // Enable/Disable "Occupied By" input based on selected status
    labStatusSelect.addEventListener('change', function () {
        if (this.value === 'occupied') {
            occupantNameInput.disabled = false;
        } else {
            occupantNameInput.value = '';  // Clear the input if disabled
            occupantNameInput.disabled = true;
        }
    });

    // Add event listener to the form
    labForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const labNumber = document.getElementById('labNumber').value;
        const labStatus = document.getElementById('labStatus').value;
        const occupantName = labStatus === 'occupied' ? occupantNameInput.value : '';

        const lab = {
            id: Date.now(),
            number: labNumber,
            status: labStatus,
            occupant: occupantName
        };

        storedLabs.push(lab);
        localStorage.setItem('labs', JSON.stringify(storedLabs));

        // Render the new lab and clear form
        renderLab(lab);
        renderAvailabilityChart();
        labForm.reset();
        occupantNameInput.disabled = true;  // Re-disable the "Occupied By" input
    });

    // Function to render a lab
    function renderLab(lab) {
        const listItem = document.createElement('li');
        listItem.textContent = `${lab.number} (${lab.status === 'occupied' ? 'Occupied by ' + lab.occupant : 'Unoccupied'})`;

        const changeStatusButton = document.createElement('button');
        changeStatusButton.textContent = lab.status === 'occupied' ? 'Mark as Unoccupied' : 'Mark as Occupied';
        changeStatusButton.addEventListener('click', function () {
            lab.status = lab.status === 'occupied' ? 'unoccupied' : 'occupied';
            lab.occupant = lab.status === 'occupied' ? prompt('Enter the name of the occupant:') : '';

            const updatedLabs = storedLabs.map(l => l.id === lab.id ? lab : l);
            localStorage.setItem('labs', JSON.stringify(updatedLabs));

            // Re-render the lists and chart
            renderLabs();
            renderAvailabilityChart();
        });

        listItem.appendChild(changeStatusButton);

        if (lab.status === 'occupied') {
            occupiedList.appendChild(listItem);
        } else {
            unoccupiedList.appendChild(listItem);
        }
    }

    // Function to clear and re-render all labs
    function renderLabs() {
        occupiedList.innerHTML = '';
        unoccupiedList.innerHTML = '';
        storedLabs.forEach(renderLab);
    }

    // Function to render the availability chart
    function renderAvailabilityChart() {
        availabilityTableBody.innerHTML = '';  // Clear existing rows

        storedLabs.forEach(lab => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lab.number}</td>
                <td>${lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}</td>
                <td>${lab.occupant ? lab.occupant : '-'}</td>
            `;
            availabilityTableBody.appendChild(row);
        });
    }
});
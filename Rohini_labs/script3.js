document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('bookingForm');
    const labSelect = document.getElementById('labSelect');
    const occupantNameInput = document.getElementById('occupantName');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const availabilityTableBody = document.getElementById('availabilityTable').querySelector('tbody');
    const labForm = document.getElementById('labForm');

    // Load stored labs from localStorage
    const storedLabs = JSON.parse(localStorage.getItem('labs')) || [];

    // Populate the lab selection dropdown with only unoccupied labs
    function populateLabSelect() {
        labSelect.innerHTML = '<option value="" disabled selected>Select a Lab</option>'; // Set default option

        storedLabs.forEach(lab => {
            if (lab.status === 'unoccupied') {
                const option = document.createElement('option');
                option.value = lab.number;
                option.textContent = lab.number;
                labSelect.appendChild(option);
            }
        });
    }

    // Populate the availability chart
    function renderAvailabilityChart() {
        availabilityTableBody.innerHTML = ''; // Clear existing rows

        storedLabs.forEach(lab => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lab.number}</td>
                <td>${lab.status ? lab.status.charAt(0).toUpperCase() + lab.status.slice(1) : 'Unoccupied'}</td>
                <td>${lab.occupant ? lab.occupant : '-'}</td>
            `;
            availabilityTableBody.appendChild(row);
        });
    }

    // Enable "Occupied By" input whenever a lab is selected
    labSelect.addEventListener('change', function () {
        occupantNameInput.disabled = false; // Enable the "Occupied By" input
    });

    // Handle lab booking
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const selectedLabNumber = labSelect.value;
        const occupantName = occupantNameInput.value.trim();

        if (!selectedLabNumber) {
            alert('Please select a lab.');
            return;
        }

        if (!occupantName) {
            alert('Please enter your name.');
            occupantNameInput.focus(); // Focus on the input field
            return;
        }

        // Find the selected lab
        const lab = storedLabs.find(lab => lab.number === selectedLabNumber);
        if (lab) {
            if (lab.status === 'unoccupied') {
                // Update the lab status to occupied
                lab.status = 'occupied';
                lab.occupant = occupantName; // Use provided name

                // Save updated labs to localStorage
                localStorage.setItem('labs', JSON.stringify(storedLabs));

                // Display confirmation message
                confirmationMessage.innerHTML = `<p>Lab ${selectedLabNumber} has been successfully booked.</p>`;

                // Re-populate the lab select dropdown and availability chart
                populateLabSelect();
                renderAvailabilityChart();
            } else {
                confirmationMessage.innerHTML = `<p>Lab ${selectedLabNumber} is already occupied.</p>`;
            }
        } else {
            confirmationMessage.innerHTML = `<p>Lab ${selectedLabNumber} is not available.</p>`;
        }
    });

    // Handle lab management
    labForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const labNumber = document.getElementById('labNumber').value.trim();

        // Validate labNumber
        if (!labNumber) {
            alert('Lab/Room Number is required.');
            return;
        }

        const lab = {
            id: Date.now(),
            number: labNumber,
            status: 'unoccupied'
        };

        // Check if lab already exists
        const existingLabIndex = storedLabs.findIndex(l => l.number === labNumber);
        if (existingLabIndex !== -1) {
            // Update existing lab
            storedLabs[existingLabIndex] = lab;
        } else {
            // Add new lab
            storedLabs.push(lab);
        }

        localStorage.setItem('labs', JSON.stringify(storedLabs));

        // Render the updated availability chart and clear the form
        renderAvailabilityChart();
        labForm.reset();

        // Re-populate the lab select dropdown
        populateLabSelect();
    });

    // Initial population of the lab select dropdown and availability chart
    populateLabSelect();
    renderAvailabilityChart();
});
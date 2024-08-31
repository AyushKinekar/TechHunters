// labs-script.js

document.addEventListener('DOMContentLoaded', function () {
    const labForm = document.getElementById('labForm');
    const occupiedList = document.getElementById('occupiedList');
    const unoccupiedList = document.getElementById('unoccupiedList');

    // Load stored labs from localStorage
    const storedLabs = JSON.parse(localStorage.getItem('labs')) || [];

    // Render the stored labs
    storedLabs.forEach(renderLab);

    // Add event listener to the form
    labForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const labName = document.getElementById('labName').value;
        const labStatus = document.getElementById('labStatus').value;

        const lab = {
            id: Date.now(),
            name: labName,
            status: labStatus
        };

        storedLabs.push(lab);
        localStorage.setItem('labs', JSON.stringify(storedLabs));

        // Render the new lab and clear form
        renderLab(lab);
        labForm.reset();
    });

    // Function to render a lab
    function renderLab(lab) {
        const listItem = document.createElement('li');
        listItem.textContent = lab.name;

        const changeStatusButton = document.createElement('button');
        changeStatusButton.textContent = lab.status === 'occupied' ? 'Mark as Unoccupied' : 'Mark as Occupied';
        changeStatusButton.addEventListener('click', function () {
            lab.status = lab.status === 'occupied' ? 'unoccupied' : 'occupied';

            const updatedLabs = storedLabs.map(l => l.id === lab.id ? lab : l);
            localStorage.setItem('labs', JSON.stringify(updatedLabs));

            // Re-render the lists
            renderLabs();
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
});

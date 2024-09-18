document.addEventListener('DOMContentLoaded', function () {
    // User Page Elements
    const resourceForm = document.getElementById('resourceForm');
    const resourceList = document.getElementById('resourceList');
    const downloadDataButton = document.getElementById('downloadData');
    const logList = document.getElementById('logList');
    const clearLogButton = document.getElementById('clearLog');
    const resourceNameSelect = document.getElementById('resourceName');

    // Admin Page Elements
    const addResourceForm = document.getElementById('addResourceForm');
    const adminResourceList = document.getElementById('adminResourceList');
    const resourceNameAdminInput = document.getElementById('resourceNameAdmin');

    // State Management
    const storedResources = JSON.parse(localStorage.getItem('resources')) || [];
    const adminResources = JSON.parse(localStorage.getItem('adminResources')) || [];
    const actionLogs = JSON.parse(localStorage.getItem('logs')) || [];
    const resourceQuantities = JSON.parse(localStorage.getItem('resourceQuantities')) || {};

    // Initial Rendering
    storedResources.forEach(renderResourceUser);
    adminResources.forEach(renderResourceAdmin);
    actionLogs.forEach(renderLog);
    populateresourceNames();

    // User Page
    resourceForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userName = document.getElementById('userName').value;
        const userID = document.getElementById('userID').value;
        const resourceName = document.getElementById('resourceName').value;
        const resourceCount = parseInt(document.getElementById('resourceCount').value, 10);

        // Check if the requested quantity is available
        if (resourceQuantities[resourceName] < resourceCount) {
            alert('Not enough resources available.');
            return;
        }

        const allocationTime = new Date().toISOString();
        const resource = {
            id: Date.now(),
            name: userName,
            userId: userID,
            type: resourceName,
            count: resourceCount,
            allocatedAt: allocationTime,
            returnedAt: null
        };

        storedResources.push(resource);
        localStorage.setItem('resources', JSON.stringify(storedResources));

        // Update the available quantity
        resourceQuantities[resourceName] -= resourceCount;
        localStorage.setItem('resourceQuantities', JSON.stringify(resourceQuantities));

        const logEntry = `Allocated ${resource.count} x ${resource.type}(s) to ${resource.name} (ID: ${resource.userId}) at `;
        logAction(logEntry);

        renderResourceUser(resource);
        populateresourceNames(); // Update dropdown options
        resourceForm.reset();
    });

    function renderResourceUser(resource) {
        if (resource.returnedAt) return;

        const listItem = document.createElement('li');
        const allocationDate = new Date(resource.allocatedAt);
        let resourceInfo = `<strong>${resource.name} (ID: ${resource.userId})</strong> - Allocated: ${resource.count} x ${resource.type}  `;
        
        const returnButton = document.createElement('button');
        returnButton.textContent = 'Return';
        returnButton.addEventListener('click', function () {
            resource.returnedAt = new Date().toISOString();
            const updatedResources = storedResources.map(r => r.id === resource.id ? resource : r);
            localStorage.setItem('resources', JSON.stringify(updatedResources));

            // Update the available quantity
            resourceQuantities[resource.type] += resource.count;
            localStorage.setItem('resourceQuantities', JSON.stringify(resourceQuantities));

            const logEntry = `Returned ${resource.count} x ${resource.type}(s) by ${resource.name} (ID: ${resource.userId}) at`;
            logAction(logEntry);

            listItem.remove();
            populateresourceNames(); // Update dropdown options
        });

        listItem.innerHTML = resourceInfo;
        listItem.appendChild(returnButton);
        resourceList.appendChild(listItem);
    }

    function logAction(actionText) {
        const logEntry = { text: actionText, timestamp: new Date().toISOString() };
        actionLogs.push(logEntry);
        localStorage.setItem('logs', JSON.stringify(actionLogs));
        renderLog(logEntry);
    }

    function renderLog(logEntry) {
        const logItem = document.createElement('li');
        logItem.textContent = `${logEntry.text} [${new Date(logEntry.timestamp).toLocaleString()}]`;
        logList.appendChild(logItem);
    }

    clearLogButton.addEventListener('click', function () {
        localStorage.removeItem('logs');
        actionLogs.length = 0;

        while (logList.firstChild) {
            logList.removeChild(logList.firstChild);
        }
    });

    downloadDataButton.addEventListener('click', function () {
        let textContent = "Allocated Resources:\n";
        storedResources.forEach(resource => {
            const allocationDate = new Date(resource.allocatedAt);
            let resourceLine = `Name: ${resource.name}, ID: ${resource.userId}, Resource: ${resource.count} x ${resource.type}(s), Allocated at: ${allocationDate.toLocaleString()}`;

            if (resource.returnedAt) {
                const returnDate = new Date(resource.returnedAt);
                const timeUsed = calculateTimeDifference(allocationDate, returnDate);
                resourceLine += `, Returned at: ${returnDate.toLocaleString()} (Used for: ${timeUsed})`;
            } else {
                const currentTime = new Date();
                const timeInUse = calculateTimeDifference(allocationDate, currentTime);
                resourceLine += `, In Use (For: ${timeInUse})`;
            }

            textContent += resourceLine + "\n";
        });

        const blob = new Blob([textContent], { type: 'text/plain' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'resource_data.txt';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

    function calculateTimeDifference(startDate, endDate) {
        const ms = endDate - startDate;
        const minutes = Math.floor((ms / 1000 / 60) % 60);
        const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
        const days = Math.floor(ms / 1000 / 60 / 60 / 24);

        let timeDifference = '';
        if (days > 0) timeDifference += `${days}d `;
        if (hours > 0) timeDifference += `${hours}h `;
        timeDifference += `${minutes}m`;

        return timeDifference;
    }

    // Admin Page
    addResourceForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const resourceName = resourceNameAdminInput.value;
        const quantity = parseInt(document.getElementById('resourceQuantity').value, 10);

        const resource = {
            type: resourceName,
            quantity: quantity
        };

        adminResources.push(resource);
        localStorage.setItem('adminResources', JSON.stringify(adminResources));

        // Update the available quantity for the resource type
        resourceQuantities[resourceName] = (resourceQuantities[resourceName] || 0) + quantity;
        localStorage.setItem('resourceQuantities', JSON.stringify(resourceQuantities));

        renderResourceAdmin(resource);
        addResourceForm.reset();
    });

    function renderResourceAdmin(resource) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${resource.type}</strong> -  ${resource.quantity} `;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            // Remove resource from adminResources
            const index = adminResources.findIndex(r => r.type === resource.type && r.name === resource.name);
            if (index !== -1) {
                adminResources.splice(index, 1);
                localStorage.setItem('adminResources', JSON.stringify(adminResources));

                // Update the available quantity
                delete resourceQuantities[resource.type];
                localStorage.setItem('resourceQuantities', JSON.stringify(resourceQuantities));

                // Remove the item from the list
                listItem.remove();
            }
        });

        listItem.appendChild(deleteButton);
        adminResourceList.appendChild(listItem);
    }

    function populateresourceNames() {
        // Clear and repopulate the dropdown menu
        resourceNameSelect.innerHTML = '';
        for (const type in resourceQuantities) {
            if (resourceQuantities[type] > 0) {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = `${type} (${resourceQuantities[type]} available)`;
                resourceNameSelect.appendChild(option);
            }
        }
    }

    // Toggle between User and Admin Pages
    const toggleUserButton = document.getElementById('toggleUser');
    const toggleAdminButton = document.getElementById('toggleAdmin');
    const userPage = document.getElementById('userPage');
    const adminPage = document.getElementById('adminPage');

    toggleUserButton.addEventListener('click', function () {
        userPage.classList.remove('hidden');
        adminPage.classList.add('hidden');
        toggleUserButton.classList.add('hidden');
        toggleAdminButton.classList.remove('hidden');
    });

    toggleAdminButton.addEventListener('click', function () {
        userPage.classList.add('hidden');
        adminPage.classList.remove('hidden');
        toggleUserButton.classList.remove('hidden');
        toggleAdminButton.classList.add('hidden');
    });
});

// script.js

document.addEventListener('DOMContentLoaded', function () {
    const resourceForm = document.getElementById('resourceForm');
    const resourceList = document.getElementById('resourceList');
    const downloadDataButton = document.getElementById('downloadData');
    const logList = document.getElementById('logList');
    const clearLogButton = document.getElementById('clearLog'); // Added clear log button

    // Load stored resources and logs from localStorage
    const storedResources = JSON.parse(localStorage.getItem('resources')) || [];
    const actionLogs = JSON.parse(localStorage.getItem('logs')) || [];

    // Render the stored resources and logs
    storedResources.forEach(renderResource);
    actionLogs.forEach(renderLog);

    // Add event listener to the form
    resourceForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const userName = document.getElementById('userName').value;
        const userID = document.getElementById('userID').value;
        const resourceType = document.getElementById('resourceType').value;
        const resourceCount = document.getElementById('resourceCount').value;

        const allocationTime = new Date().toISOString();

        const resource = {
            id: Date.now(),
            name: userName,
            userId: userID,
            type: resourceType,
            count: resourceCount,
            allocatedAt: allocationTime,
            returnedAt: null
        };

        storedResources.push(resource);
        localStorage.setItem('resources', JSON.stringify(storedResources));

        // Log the allocation action
        const logEntry = `Allocated ${resource.count} x ${resource.type}(s) to ${resource.name} (ID: ${resource.userId}) at ${new Date(allocationTime).toLocaleString()}`;
        logAction(logEntry);

        // Render the new resource and clear form
        renderResource(resource);
        resourceForm.reset();
    });

    // Function to render a resource
    function renderResource(resource) {
        // Only render resources that haven't been returned
        if (resource.returnedAt) return;

        const listItem = document.createElement('li');
        const allocationDate = new Date(resource.allocatedAt);
        let resourceInfo = `<strong>${resource.name}</strong> (ID: ${resource.userId}) allocated ${resource.count} x ${resource.type}(s) at ${allocationDate.toLocaleString()}`;

        const returnButton = document.createElement('button');
        returnButton.textContent = 'Return';
        returnButton.addEventListener('click', function () {
            resource.returnedAt = new Date().toISOString();

            const updatedResources = storedResources.map(r => r.id === resource.id ? resource : r);
            localStorage.setItem('resources', JSON.stringify(updatedResources));

            // Log the return action
            const logEntry = `Returned ${resource.count} x ${resource.type}(s) by ${resource.name} (ID: ${resource.userId}) at ${new Date(resource.returnedAt).toLocaleString()}`;
            logAction(logEntry);

            // Remove the item from the list
            listItem.remove();
        });

        listItem.innerHTML = resourceInfo;
        listItem.appendChild(returnButton);
        resourceList.appendChild(listItem);
    }

    // Function to log actions and render the log entry
    function logAction(actionText) {
        const logEntry = { text: actionText, timestamp: new Date().toISOString() };
        actionLogs.push(logEntry);
        localStorage.setItem('logs', JSON.stringify(actionLogs));
        renderLog(logEntry);
    }

    // Function to render a log entry
    function renderLog(logEntry) {
        const logItem = document.createElement('li');
        logItem.textContent = `${logEntry.text} [${new Date(logEntry.timestamp).toLocaleString()}]`;
        logList.appendChild(logItem);
    }

    // Function to clear the log
    clearLogButton.addEventListener('click', function () {
        // Clear the log data from localStorage
        localStorage.removeItem('logs');
        actionLogs.length = 0;

        // Remove log entries from the page
        while (logList.firstChild) {
            logList.removeChild(logList.firstChild);
        }
    });

    // Download the data as a text file
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

    // Calculate time difference between two dates
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
});

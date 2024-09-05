document.addEventListener('DOMContentLoaded', function() {
    // Toggle for Dashboard
    document.getElementById('dashboardToggle').addEventListener('click', function() {
        const dashboard = document.getElementById('dashboard');
        dashboard.classList.add('show');
    });

    // Close button inside the Dashboard
    document.getElementById('dashboardClose').addEventListener('click', function() {
        const dashboard = document.getElementById('dashboard');
        dashboard.classList.remove('show');
    });

    document.getElementById('resourceForm').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const userName = document.getElementById('userName').value;
        const userID = document.getElementById('userID').value;
        const resourceType = document.getElementById('resourceType').value;
        const resourceCount = document.getElementById('resourceCount').value;
    
        const logList = document.getElementById('logList');
        const newLogEntry = document.createElement('li');
        newLogEntry.textContent = `Allocated ${resourceCount} ${resourceType}(s) to ${userName} (ID: ${userID})`;
        logList.appendChild(newLogEntry);
    
        // Clear form after submission
        document.getElementById('resourceForm').reset();
    });
    
    document.getElementById('clearLog').addEventListener('click', function() {
        document.getElementById('logList').innerHTML = '';
    });
    

    // Download Data as Text File
    document.getElementById('downloadData').addEventListener('click', function() {
        const resourceList = document.getElementById('resourceList').innerText;
        const logList = document.getElementById('logList').innerText;
        
        const data = `Allocated Resources:\n${resourceList}\n\nAction Log:\n${logList}`;
        
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resource_management_data.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Clear Log
    document.getElementById('clearLog').addEventListener('click', function() {
        document.getElementById('logList').innerHTML = '';
    });
});

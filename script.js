let chart;
let data = { labels: [], values: [] };
let currentFile = '';
let availableFiles = [];

// Function to fetch available data files
async function fetchAvailableFiles() {
    try {
        const response = await fetch('data/');
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');
        const links = htmlDoc.querySelectorAll('a');
        
        availableFiles = Array.from(links)
            .map(link => link.href)
            .filter(href => href.endsWith('.txt'))
            .map(href => href.split('/').pop());
            
        // Update the file selector
        const fileSelect = document.getElementById('dataFile');
        fileSelect.innerHTML = '';
        
        availableFiles.forEach(file => {
            const option = document.createElement('option');
            option.value = `data/${file}`;
            option.textContent = file.replace('.txt', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            fileSelect.appendChild(option);
        });
        
        if (availableFiles.length > 0) {
            currentFile = `data/${availableFiles[0]}`;
            fileSelect.value = currentFile;
        }
        
        return availableFiles;
    } catch (error) {
        console.error('Error fetching available files:', error);
        return [];
    }
}

// Function to fetch and parse the data file
async function fetchData(fileName = currentFile) {
    try {
        // First check if we have saved changes in localStorage
        const savedData = localStorage.getItem(`saved_${fileName}`);
        if (savedData) {
            data = JSON.parse(savedData);
            return data;
        }

        // If no saved changes, fetch from file
        const response = await fetch(fileName);
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        data.labels = [];
        data.values = [];
        
        lines.forEach(line => {
            const [label, value] = line.split(' ');
            if (label && value) {
                data.labels.push(label);
                data.values.push(parseInt(value));
            }
        });
        
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { labels: [], values: [] };
    }
}

// Function to save data changes
function saveDataChanges() {
    localStorage.setItem(`saved_${currentFile}`, JSON.stringify(data));
}

// Function to create the chart
async function createChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chartType = document.getElementById('chartType').value;
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }
    
    // Common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: chartType !== 'bar' && chartType !== 'line'
            }
        }
    };
    
    // Type-specific options
    const typeSpecificOptions = {
        bar: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
        line: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
        pie: {},
        doughnut: {},
        radar: {
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    };
    
    // Combine options
    const options = {
        ...commonOptions,
        ...typeSpecificOptions[chartType]
    };
    
    // Create chart
    chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Values',
                data: data.values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)',
                    'rgba(83, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: options
    });
}

// Function to update the chart
function updateChart() {
    const chartType = document.getElementById('chartType').value;
    if (chart) {
        chart.destroy();
    }
    createChart();
}

// Function to render the data list
function renderDataList() {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';
    
    data.labels.forEach((label, index) => {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <div class="item-content">
                <span>${label}:</span>
                <span>${data.values[index]}</span>
            </div>
            <div class="item-actions">
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        `;
        dataList.appendChild(item);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', handleEdit);
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

// Function to handle edit button click
function handleEdit(event) {
    const index = event.target.dataset.index;
    const item = event.target.closest('.data-item');
    const content = item.querySelector('.item-content');
    
    content.innerHTML = `
        <input type="text" value="${data.labels[index]}" class="edit-label">
        <input type="number" value="${data.values[index]}" class="edit-value">
    `;
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => {
        const newLabel = content.querySelector('.edit-label').value;
        const newValue = parseInt(content.querySelector('.edit-value').value);
        
        if (newLabel && !isNaN(newValue)) {
            data.labels[index] = newLabel;
            data.values[index] = newValue;
            updateChart();
            saveDataChanges();
            renderDataList();
        }
    });
    
    item.querySelector('.item-actions').innerHTML = '';
    item.querySelector('.item-actions').appendChild(saveBtn);
}

// Function to handle delete button click
function handleDelete(event) {
    const index = event.target.dataset.index;
    data.labels.splice(index, 1);
    data.values.splice(index, 1);
    updateChart();
    saveDataChanges();
    renderDataList();
}

// Function to handle add data button click
document.getElementById('addData').addEventListener('click', () => {
    const newLabel = document.getElementById('newLabel').value;
    const newValue = parseInt(document.getElementById('newValue').value);
    
    if (newLabel && !isNaN(newValue)) {
        data.labels.push(newLabel);
        data.values.push(newValue);
        updateChart();
        saveDataChanges();
        renderDataList();
        
        // Clear input fields
        document.getElementById('newLabel').value = '';
        document.getElementById('newValue').value = '';
    }
});

// Function to handle chart type change
document.getElementById('chartType').addEventListener('change', updateChart);

// Function to handle data file change
document.getElementById('dataFile').addEventListener('change', async (event) => {
    currentFile = event.target.value;
    await fetchData(currentFile);
    updateChart();
    renderDataList();
});

// Add a reset button to clear saved changes
document.addEventListener('DOMContentLoaded', () => {
    const resetButton = document.createElement('button');
    resetButton.id = 'resetData';
    resetButton.textContent = 'Reset to Original Data';
    resetButton.style.marginTop = '10px';
    resetButton.style.padding = '8px 16px';
    resetButton.style.backgroundColor = '#f44336';
    resetButton.style.color = 'white';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '4px';
    resetButton.style.cursor = 'pointer';
    
    resetButton.addEventListener('click', async () => {
        localStorage.removeItem(`saved_${currentFile}`);
        await fetchData(currentFile);
        updateChart();
        renderDataList();
    });
    
    document.querySelector('.edit-section').appendChild(resetButton);
});

// Initialize the application
async function init() {
    await fetchAvailableFiles();
    if (availableFiles.length > 0) {
        await fetchData();
        await createChart();
        renderDataList();
    } else {
        console.error('No data files found in the data directory');
    }
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', init); 
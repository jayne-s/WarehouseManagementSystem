// Mock Data
var inventoryData = [];

var staffData = [];

async function fetchWarehouseData() {
    // API call to get warehouse and inventory data
    try {
        const response = await fetch('https://ixtimes.net/api/warehouse_api.php/?passkey=aGVsbG8gaSBhbSB1bmRlciBkYSB3YXRlciwgcGxlYXNlIGhlbHAgbWU=');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const response_data = await response.json();
        
        // unpack JSON into staffData and inventoryData
        inventoryData = response_data.inventory_data;
        response_data.inventory_manager_data.forEach(item => {
            staffData.push({
                name: item.name,
                position: `Inventory Manager @ Warehouse ${item.warehouse}`,
                salary: Number(item.salary),
                ssn: item.ssn
            })
        });
        response_data.supply_chain_manager_data.forEach(item => {
            staffData.push({
                name: item.name,
                position: `Supply Chain Manager`,
                salary: Number(item.salary),
                ssn: item.ssn
            })
        });
        response_data.regional_manager_data.forEach(item => {
            staffData.push({
                name: item.name,
                position: `Regional Manager`,
                salary: Number(item.salary),
                ssn: item.ssn
            })
        });

    } catch (error) {
        console.error('Fetch error:', error);
    }

    // Once the data is loaded, propigate tables
    loadInventory();
    loadStaff();
}

// Load Inventory Data
function loadInventory() {
    const tableBody = document.querySelector("#inventoryTable tbody");
    tableBody.innerHTML = ""; 

    // Use a fragment for efficient data loading
    const fragment = document.createDocumentFragment();

    inventoryData.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${item.size}</td>
        <td>${item.color}</td>
        <td>${item.material}</td>
        <td>${item.type}</td>
        <td>x${item.quantity}</td>
        <td>Warehouse ${item.warehouse}</td>
        <td>${item.address}</td>
        <td><button onclick="deleteInventoryItem(${inventoryData.indexOf(item)})">Delete</button></td>`;
        fragment.appendChild(row);
    });

    tableBody.appendChild(fragment);
}

// Load Employee Data 
function loadStaff() {
    const tableBody = document.querySelector("#staffTable tbody");
    tableBody.innerHTML = ""; 

    staffData.forEach(staff => {
        const row = `<tr>
                        <td>${staff.name}</td>
                        <td>${staff.position}</td>
                        <td>$${staff.salary.toLocaleString()}</td>
                        <td>${staff.ssn.slice(0, 3) + "-" + staff.ssn.slice(3, 5) + "-" + staff.ssn.slice(5, 9)}</td>  
                     </tr>`;
        tableBody.innerHTML += row;
    });
}

// Sort Inventory Data
function sortInventory() {
    const sortBy = document.getElementById("sortInventory").value;
    const order = document.getElementById("inventoryOrder").value;

    // If we are sorting by a certain field, use a special sorting method
    if (sortBy === "size" || sortBy === "quantity" || sortBy === "warehouse") {
        switch (sortBy) {
            case "size":
                const sizeOrdering = ['XS', 'S', 'M', "L", 'XL'];
                if (order === "ascend") {
                    inventoryData.sort((a, b) => sizeOrdering.indexOf(a[sortBy]) - sizeOrdering.indexOf(b[sortBy]));
                } else {
                    inventoryData.sort((a, b) => sizeOrdering.indexOf(b[sortBy]) - sizeOrdering.indexOf(a[sortBy]));
                }
                break;
            case "quantity":
                if (order === "ascend") {
                    inventoryData.sort((a, b) => Number(a[sortBy].slice(0)) - Number(b[sortBy].slice(0)));
                } else {
                    inventoryData.sort((a, b) => Number(b[sortBy].slice(0)) - Number(a[sortBy].slice(0)));
                }
                break;
            case "warehouse":
                if (order === "ascend") {
                    inventoryData.sort((a, b) => Number(a[sortBy].replace('Warehouse', '').trim()) - Number(b[sortBy].replace('Warehouse', '').trim()));
                } else {
                    inventoryData.sort((a, b) => Number(b[sortBy].replace('Warehouse', '').trim()) - Number(a[sortBy].replace('Warehouse', '').trim()));
                }
                break;
        }
    } else {
        if (order === "ascend") {
            inventoryData.sort((a, b) => {
                if (a[sortBy] > b[sortBy]) return 1;
                if (a[sortBy] < b[sortBy]) return -1;
                return 0;
            });
        } else {
            inventoryData.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return 1;
                if (a[sortBy] > b[sortBy]) return -1;
                return 0;
            });
        }
    }

    loadInventory(); 
}

// Sort Staff Data
function sortStaff() {
    const sortBy = document.getElementById("sortStaff").value;
    const order = document.getElementById("staffOrder").value;
    
    if (order === "ascend") {
        staffData.sort((a, b) => {
            if (a[sortBy] > b[sortBy]) return 1;
            if (a[sortBy] < b[sortBy]) return -1;
            return 0;
        });
    } else {
        staffData.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return 1;
            if (a[sortBy] > b[sortBy]) return -1;
            return 0;
        });
    }

    loadStaff(); 
}

// Initialize Data on Page Load
document.addEventListener("DOMContentLoaded", () => {
    // Fetch data
    fetchWarehouseData();
});

function searchInventory() {
    const searchTerm = document.getElementById("inventorySearch").value.toLowerCase();
    const filteredData = inventoryData.filter(item =>
        item.type.toLowerCase().includes(searchTerm)
    );

    const tableBody = document.querySelector("#inventoryTable tbody");
    tableBody.innerHTML = "";

    const fragment = document.createDocumentFragment();

    filteredData.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.size}</td>
            <td>${item.color}</td>
            <td>${item.material}</td>
            <td>${item.type}</td>
            <td>x${item.quantity}</td>
            <td>Warehouse ${item.warehouse}</td>
            <td>${item.address}</td>
             <td><button onclick="deleteInventoryItem(${item.id})">Delete</button></td>
        `;
        fragment.appendChild(row);
    });

    tableBody.appendChild(fragment);
}

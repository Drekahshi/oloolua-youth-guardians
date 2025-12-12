// Mock Data for Initial Setup
const INITIAL_CATEGORIES = [
    { id: '1', name: 'Indigenous Trees' },
    { id: '2', name: 'Fruit Trees' },
    { id: '3', name: 'Medicinal Plants' },
    { id: '4', name: 'Ornamental' }
];

const INITIAL_INVENTORY = [
    {
        id: '1',
        quantity_available: 150,
        quantity_reserved: 20,
        location: 'Zone A - Shade Net',
        batch_number: 'BATCH-2024-001',
        created_at: new Date().toISOString(),
        seedling: {
            id: 's1',
            common_name: 'Croton',
            scientific_name: 'Croton megalocarpus',
            local_name: 'Mukinduri',
            category_id: '1',
            growth_rate: 'Fast',
            sunlight_requirements: 'Full Sun',
            price_per_seedling: 50.00,
            image_url: 'croton.jpeg',
            category: { name: 'Indigenous Trees' }
        }
    },
    {
        id: '2',
        quantity_available: 45,
        quantity_reserved: 5,
        location: 'Zone B - Open Field',
        batch_number: 'BATCH-2024-002',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        seedling: {
            id: 's2',
            common_name: 'Yellow Fever Tree',
            scientific_name: 'Vachellia xanthophloea',
            local_name: 'Naivasha Thorn',
            category_id: '1',
            growth_rate: 'Fast',
            sunlight_requirements: 'Full Sun',
            price_per_seedling: 80.00,
            image_url: 'acacia.jpeg',
            category: { name: 'Indigenous Trees' }
        }
    },
    {
        id: '3',
        quantity_available: 0,
        quantity_reserved: 10,
        location: 'Zone C',
        batch_number: 'BATCH-2024-003',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        seedling: {
            id: 's3',
            common_name: 'African Olive',
            scientific_name: 'Olea europaea subsp. cuspidata',
            local_name: 'Mutamaiyu',
            category_id: '1',
            growth_rate: 'Slow',
            sunlight_requirements: 'Partial Shade',
            price_per_seedling: 100.00,
            image_url: 'olea.jpeg',
            category: { name: 'Indigenous Trees' }
        }
    }
];

class InventoryService {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('inventory_categories')) {
            localStorage.setItem('inventory_categories', JSON.stringify(INITIAL_CATEGORIES));
        }
        if (!localStorage.getItem('inventory_data')) {
            localStorage.setItem('inventory_data', JSON.stringify(INITIAL_INVENTORY));
        }
        if (!localStorage.getItem('inventory_activities')) {
            localStorage.setItem('inventory_activities', JSON.stringify([]));
        }
    }

    getCategories() {
        return JSON.parse(localStorage.getItem('inventory_categories') || '[]');
    }

    getInventory() {
        return JSON.parse(localStorage.getItem('inventory_data') || '[]');
    }

    getActivities() {
        return JSON.parse(localStorage.getItem('inventory_activities') || '[]');
    }

    addSeedling(data) {
        const inventory = this.getInventory();
        const categories = this.getCategories();
        const category = categories.find(c => c.id === data.category_id);

        const newId = Date.now().toString();
        const newItem = {
            id: newId,
            quantity_available: parseInt(data.quantity),
            quantity_reserved: 0,
            location: data.location,
            batch_number: `BATCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            created_at: new Date().toISOString(),
            seedling: {
                id: `s${newId}`,
                common_name: data.common_name,
                scientific_name: data.scientific_name,
                local_name: data.local_name,
                category_id: data.category_id,
                growth_rate: data.growth_rate,
                sunlight_requirements: data.sunlight,
                price_per_seedling: parseFloat(data.price),
                image_url: 'forest2.jpeg', // Default image
                category: { name: category ? category.name : 'Unknown' }
            }
        };

        inventory.unshift(newItem);
        localStorage.setItem('inventory_data', JSON.stringify(inventory));
        
        this.logActivity({
            type: 'New Stock',
            notes: `Added ${data.quantity} ${data.common_name} seedlings`,
            seedling_name: data.common_name
        });

        return newItem;
    }

    logActivity(activity) {
        const activities = this.getActivities();
        const newActivity = {
            id: Date.now().toString(),
            activity_type: activity.type,
            activity_date: new Date().toISOString(),
            notes: activity.notes,
            seedling: { common_name: activity.seedling_name }
        };
        activities.unshift(newActivity);
        // Keep only last 50 activities
        if (activities.length > 50) activities.pop();
        localStorage.setItem('inventory_activities', JSON.stringify(activities));
    }
}

const inventoryService = new InventoryService();
let allInventoryData = [];

// UI Functions
function loadCategories() {
    const categories = inventoryService.getCategories();
    const categoryFilter = document.getElementById('categoryFilter');
    const modalCategory = document.getElementById('seedlingCategory');
    
    // Clear existing options except first
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    if (modalCategory) {
        modalCategory.innerHTML = '<option value="">Select Category</option>';
    }

    categories.forEach(category => {
        // Filter dropdown
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);

        // Modal dropdown
        if (modalCategory) {
            const modalOption = document.createElement('option');
            modalOption.value = category.id;
            modalOption.textContent = category.name;
            modalCategory.appendChild(modalOption);
        }
    });
}

function loadInventory() {
    allInventoryData = inventoryService.getInventory();
    displayInventory(allInventoryData);
    updateDashboardStats(allInventoryData);
}

function displayInventory(inventoryData) {
    const inventoryGrid = document.getElementById('inventoryGrid');

    if (!inventoryData || inventoryData.length === 0) {
        inventoryGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-seedling"></i>
                <p>No seedlings in inventory yet.</p>
            </div>
        `;
        return;
    }

    inventoryGrid.innerHTML = inventoryData.map(item => {
        const seedling = item.seedling;
        if (!seedling) return '';

        const stockStatus = getStockStatus(item.quantity_available, item.quantity_reserved);
        const categoryName = seedling.category?.name || 'Uncategorized';

        return `
            <div class="seedling-card" data-category="${seedling.category_id}" data-status="${stockStatus}">
                <img src="${seedling.image_url || 'forest2.jpeg'}" alt="${seedling.common_name}" class="seedling-image">
                <div class="seedling-info">
                    <div class="seedling-header">
                        <h3>${seedling.common_name}</h3>
                        <span class="stock-badge ${stockStatus}">${formatStockStatus(stockStatus)}</span>
                    </div>
                    <p class="seedling-scientific">${seedling.scientific_name}</p>
                    ${seedling.local_name ? `<p class="seedling-local">Local: ${seedling.local_name}</p>` : ''}
                    <span class="seedling-category"><i class="fas fa-tag"></i> ${categoryName}</span>

                    <div class="seedling-details">
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${item.location || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-barcode"></i>
                            <span>${item.batch_number || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>${seedling.growth_rate}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-sun"></i>
                            <span>${seedling.sunlight_requirements}</span>
                        </div>
                    </div>

                    <div class="seedling-stats">
                        <div class="stat-item-small">
                            <span class="number">${item.quantity_available}</span>
                            <span class="label">Available</span>
                        </div>
                        <div class="stat-item-small">
                            <span class="number">${item.quantity_reserved}</span>
                            <span class="label">Reserved</span>
                        </div>
                        <div class="stat-item-small">
                            <span class="number">${item.quantity_available + item.quantity_reserved}</span>
                            <span class="label">Total</span>
                        </div>
                    </div>

                    <div class="price-tag">
                        KES ${parseFloat(seedling.price_per_seedling).toFixed(2)} / seedling
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getStockStatus(available, reserved) {
    const total = available + reserved;
    if (available === 0) return 'out-of-stock';
    if (total < 50) return 'low-stock';
    return 'available';
}

function formatStockStatus(status) {
    const statusMap = {
        'available': 'In Stock',
        'low-stock': 'Low Stock',
        'out-of-stock': 'Out of Stock'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function updateDashboardStats(inventoryData) {
    let totalSeedlings = 0;
    let reservedSeedlings = 0;
    let totalValue = 0;

    inventoryData.forEach(item => {
        const available = parseInt(item.quantity_available || 0);
        const reserved = parseInt(item.quantity_reserved || 0);
        const price = parseFloat(item.seedling?.price_per_seedling || 0);

        totalSeedlings += available + reserved;
        reservedSeedlings += reserved;
        totalValue += (available + reserved) * price;
    });

    const uniqueSpecies = new Set(inventoryData.map(item => item.seedling?.id)).size;

    document.getElementById('totalSeedlings').textContent = totalSeedlings.toLocaleString();
    document.getElementById('totalSpecies').textContent = uniqueSpecies;
    document.getElementById('reservedSeedlings').textContent = reservedSeedlings.toLocaleString();
    document.getElementById('totalValue').textContent = `KES ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    animateNumbers();
}

function animateNumbers() {
    const statElements = document.querySelectorAll('.stat-info h3');
    statElements.forEach(element => {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'countUp 1s ease';
        }, 10);
    });
}

function loadRecentActivities() {
    const activities = inventoryService.getActivities();
    displayActivities(activities);
}

function displayActivities(activities) {
    const activitiesList = document.getElementById('activitiesList');

    if (!activities || activities.length === 0) {
        activitiesList.innerHTML = '<p class="empty-state">No recent activities.</p>';
        return;
    }

    activitiesList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-header">
                <span class="activity-type">
                    <i class="fas fa-${getActivityIcon(activity.activity_type)}"></i>
                    ${activity.activity_type}
                </span>
                <span class="activity-date">${formatDate(activity.activity_date)}</span>
            </div>
            <div class="activity-details">
                ${activity.seedling?.common_name ? `<strong>${activity.seedling.common_name}</strong> - ` : ''}
                ${activity.notes || 'No details provided'}
            </div>
        </div>
    `).join('');
}

function getActivityIcon(activityType) {
    const iconMap = {
        'Seed Collection': 'leaf',
        'Germination': 'seedling',
        'Transplanting': 'exchange-alt',
        'Watering': 'tint',
        'Fertilizing': 'flask',
        'Pest Control': 'bug',
        'Quality Check': 'check-circle',
        'New Stock': 'plus-circle'
    };
    return iconMap[activityType] || 'clipboard-list';
}

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

    searchInput.addEventListener('input', filterInventory);
    categoryFilter.addEventListener('change', filterInventory);
    statusFilter.addEventListener('change', filterInventory);
}

function filterInventory() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryId = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;

    let filteredData = allInventoryData.filter(item => {
        const seedling = item.seedling;
        if (!seedling) return false;

        const matchesSearch = !searchTerm ||
            seedling.common_name.toLowerCase().includes(searchTerm) ||
            seedling.scientific_name.toLowerCase().includes(searchTerm) ||
            (seedling.local_name && seedling.local_name.toLowerCase().includes(searchTerm));

        const matchesCategory = !categoryId || seedling.category_id === categoryId;

        const itemStatus = getStockStatus(item.quantity_available, item.quantity_reserved);
        const matchesStatus = !status || itemStatus === status;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    displayInventory(filteredData);
}

// Modal Functions
function setupModal() {
    const modal = document.getElementById('addSeedlingModal');
    const btn = document.getElementById('addSeedlingBtn');
    const span = document.getElementsByClassName('close-modal')[0];
    const form = document.getElementById('addSeedlingForm');

    if (!modal || !btn || !span) return;

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    form.onsubmit = function(e) {
        e.preventDefault();
        
        const formData = {
            common_name: document.getElementById('commonName').value,
            scientific_name: document.getElementById('scientificName').value,
            local_name: document.getElementById('localName').value,
            category_id: document.getElementById('seedlingCategory').value,
            growth_rate: document.getElementById('growthRate').value,
            sunlight: document.getElementById('sunlight').value,
            price: document.getElementById('price').value,
            quantity: document.getElementById('quantity').value,
            location: document.getElementById('location').value
        };

        inventoryService.addSeedling(formData);
        
        // Refresh UI
        loadInventory();
        loadRecentActivities();
        
        // Close and reset
        modal.style.display = "none";
        form.reset();
        
        // Show success message (simple alert for now)
        alert('Seedling added successfully!');
    }
}

function initialize() {
    loadCategories();
    loadInventory();
    loadRecentActivities();
    setupFilters();
    setupModal();
}

document.addEventListener('DOMContentLoaded', initialize);

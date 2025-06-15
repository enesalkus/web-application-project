const API_URL = 'http://localhost:3000/api';

// Load items when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    showPage('home');
});

// Show selected page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update navbar active state
    document.querySelectorAll('.navbar a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.navbar a[onclick="showPage('${pageId}')"]`).classList.add('active');
    
    // Load messages if messages page is shown
    if (pageId === 'messages') {
        loadMessages();
    }
}

// Load items
async function loadItems() {
    try {
        const response = await fetch(`${API_URL}/items`);
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error loading items:', error);
    }
}

// Display items
function displayItems(items) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = `item ${item.completed ? 'completed' : ''}`;
        
        let itemDetails = item.name;
        if (item.quantity) {
            itemDetails += ` - ${item.quantity} Pieces`;
        }
        if (item.weight) {
            itemDetails += ` - ${item.weight} Kilograms`;
        }
        
        itemElement.innerHTML = `
            <span>${itemDetails}</span>
            <div class="item-actions">
                <button onclick="toggleItem(${item.id}, ${!item.completed})">
                    ${item.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        itemList.appendChild(itemElement);
    });
}

// Add new item
async function addItem() {
    const input = document.getElementById('itemInput');
    const quantityInput = document.getElementById('quantityInput');
    const unitType = document.getElementById('unitType');
    const name = input.value.trim();
    const value = quantityInput.value ? parseFloat(quantityInput.value) : null;
    const isWeight = unitType.value === 'weight';
    
    if (!name) return;
    
    try {
        const response = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name, 
                quantity: isWeight ? null : value,
                weight: isWeight ? value : null 
            })
        });
        
        if (response.ok) {
            input.value = '';
            quantityInput.value = '';
            loadItems();
        }
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

// Update item
async function toggleItem(id, completed) {
    try {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });
        
        if (response.ok) {
            loadItems();
        }
    } catch (error) {
        console.error('Error updating item:', error);
    }
}

// Delete item
async function deleteItem(id) {
    try {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadItems();
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

// Submit contact form
async function submitContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    try {
        const response = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });
        
        if (response.ok) {
            alertify.success('Message sent successfully!');
            document.getElementById('contactForm').reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alertify.error('Error sending message. Please try again.');
    }
}

// Load messages
async function loadMessages() {
    const messagesList = document.getElementById('messagesList');
    try {
        console.log('Fetching messages from:', `${API_URL}/contacts`);
        const response = await fetch(`${API_URL}/contacts`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const messages = await response.json();
        console.log('Received messages:', messages);
        
        if (!Array.isArray(messages)) {
            console.error('Received data is not an array:', messages);
            messagesList.innerHTML = '<div class="no-messages">Error loading messages</div>';
            return;
        }
        
        displayMessages(messages);
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesList.innerHTML = '<div class="no-messages">Error loading messages</div>';
    }
}

// Display messages
function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    if (!messages || messages.length === 0) {
        messagesList.innerHTML = '<div class="no-messages">No messages yet</div>';
        return;
    }
    
    messages.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message-card';
        messageElement.style.cursor = 'pointer';
        messageElement.onclick = () => showMessageDetails(message);
        
        const date = new Date(message.date).toLocaleString();
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-id">ID: ${message.id}</span>
                <span class="message-date">${date}</span>
            </div>
            <div class="message-sender">From: ${message.name}</div>
            <div class="message-email">Email: ${message.email}</div>
        `;
        
        messagesList.appendChild(messageElement);
    });
}

// Show message details
function showMessageDetails(message) {
    const date = new Date(message.date).toLocaleString();
    
    const content = `
        <div style="text-align: left; padding: 10px;">
            <p><strong>Message ID:</strong> ${message.id}</p>
            <p><strong>From:</strong> ${message.name}</p>
            <p><strong>Email:</strong> ${message.email}</p>
            <p><strong>Date:</strong> ${date}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message.message}</p>
        </div>
    `;

    alertify.alert('Message Details', content, function() {
        alertify.message('Message closed');
    });
} 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// JSON file paths
const dataFile = path.join(__dirname, 'data', 'items.json');
const contactsFile = path.join(__dirname, 'data', 'contacts.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Create or initialize JSON files
function initializeJsonFile(filePath, initialData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
    }
}

// Initialize both JSON files
initializeJsonFile(dataFile);
initializeJsonFile(contactsFile);

// Get all items
app.get('/api/items', (req, res) => {
    const items = JSON.parse(fs.readFileSync(dataFile));
    res.json(items);
});

// Add new item
app.post('/api/items', (req, res) => {
    const items = JSON.parse(fs.readFileSync(dataFile));
    const newItem = {
        id: Date.now(),
        name: req.body.name,
        quantity: req.body.quantity || null,
        weight: req.body.weight || null,
        completed: false
    };
    items.push(newItem);
    fs.writeFileSync(dataFile, JSON.stringify(items, null, 2));
    res.json(newItem);
});

// Update item
app.put('/api/items/:id', (req, res) => {
    const items = JSON.parse(fs.readFileSync(dataFile));
    const id = parseInt(req.params.id);
    const index = items.findIndex(item => item.id === id);
    
    if (index !== -1) {
        items[index] = { ...items[index], ...req.body };
        fs.writeFileSync(dataFile, JSON.stringify(items, null, 2));
        res.json(items[index]);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
    const items = JSON.parse(fs.readFileSync(dataFile));
    const id = parseInt(req.params.id);
    const filteredItems = items.filter(item => item.id !== id);
    fs.writeFileSync(dataFile, JSON.stringify(filteredItems, null, 2));
    res.json({ message: 'Item deleted' });
});

// Save contact message
app.post('/api/contacts', (req, res) => {
    try {
        let contacts = [];
        if (fs.existsSync(contactsFile)) {
            const fileContent = fs.readFileSync(contactsFile, 'utf8');
            contacts = JSON.parse(fileContent);
        }
        
        const newContact = {
            id: Date.now(),
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            date: new Date().toISOString()
        };
        
        contacts.push(newContact);
        fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
        res.json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ message: 'Error saving message' });
    }
});

// Get all contacts
app.get('/api/contacts', (req, res) => {
    try {
        console.log('Reading contacts from:', contactsFile);
        if (!fs.existsSync(contactsFile)) {
            console.log('Contacts file does not exist, creating empty file');
            fs.writeFileSync(contactsFile, JSON.stringify([]));
            return res.json([]);
        }
        
        const fileContent = fs.readFileSync(contactsFile, 'utf8');
        console.log('File content:', fileContent);
        
        let contacts = [];
        try {
            contacts = JSON.parse(fileContent);
        } catch (parseError) {
            console.error('Error parsing contacts file:', parseError);
            return res.status(500).json({ message: 'Error parsing contacts file' });
        }
        
        console.log('Parsed contacts:', contacts);
        res.json(contacts);
    } catch (error) {
        console.error('Error reading contacts:', error);
        res.status(500).json({ message: 'Error reading messages' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
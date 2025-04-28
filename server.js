import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './db.config.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Schema
const passcodeSchema = new mongoose.Schema({
    code: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Passcode = mongoose.model('Passcode', passcodeSchema);

// Connect to MongoDB
connectDB();

// Routes
app.post('/api/passcode', async (req, res) => {
    try {
        const { passcode } = req.body;
        
        // Validate passcode (4 digits)
        if (!/^\d{4}$/.test(passcode)) {
            return res.status(400).json({ error: 'Invalid passcode format' });
        }

        // Save to MongoDB
        const newPasscode = new Passcode({ code: passcode });
        await newPasscode.save();

        res.json({ message: 'Passcode saved successfully' });
    } catch (error) {
        console.error('Error saving passcode:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all passcodes (for testing/verification)
app.get('/api/passcodes', async (req, res) => {
    try {
        const passcodes = await Passcode.find().sort({ timestamp: -1 });
        res.json(passcodes);
    } catch (error) {
        console.error('Error fetching passcodes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app; 
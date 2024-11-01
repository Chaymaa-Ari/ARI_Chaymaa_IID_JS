"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Connect to MongoDB
mongoose_1.default.connect('mongodb://localhost:27017/Book')
    .then(() => console.log("Connected to MongoDB"))
    .catch(error => console.error("MongoDB connection error:", error));
// Counter Schema for auto-incrementing id
const counterSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    sequence: { type: Number, default: 0 },
});
// Define the Counter model
const Counter = mongoose_1.default.model('Counter', counterSchema);
// Book Schema
const bookSchema = new mongoose_1.default.Schema({
    id: { type: Number, unique: true }, // Auto-incremented id as a number
    title: String,
    author: String,
    totalPages: Number,
    status: String,
    price: Number,
    readingPages: Number,
    format: String,
    finished: Boolean,
});
// Define the Book model
const Book = mongoose_1.default.model('Book', bookSchema);
// Function to get the next sequence value
function getNextSequenceValue(sequenceName) {
    return __awaiter(this, void 0, void 0, function* () {
        const sequenceDocument = yield Counter.findOneAndUpdate({ name: sequenceName }, { $inc: { sequence: 1 } }, { new: true, upsert: true } // Create if it doesn't exist
        );
        return sequenceDocument.sequence;
    });
}
// Route to add a new book
app.post('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookData = req.body;
    const book = new Book(Object.assign(Object.assign({}, bookData), { id: yield getNextSequenceValue('bookId') }));
    try {
        const savedBook = yield book.save();
        res.status(201).json(savedBook);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
app.delete('/books/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = parseInt(req.params.id); // Convert the ID from string to number
    try {
        const result = yield Book.findOneAndDelete({ id: bookId }); // Using 'id' for the lookup
        if (result) {
            return res.status(200).json({ message: 'Book deleted successfully' });
        }
        else {
            return res.status(404).json({ message: 'Book not found' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Error deleting book', error });
    }
}));
// Route to get all books
app.get('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book.find({});
        res.json(books);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

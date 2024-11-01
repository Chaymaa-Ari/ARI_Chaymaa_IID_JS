import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Book')
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("MongoDB connection error:", error));

// Counter Schema for auto-incrementing id
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sequence: { type: Number, default: 0 },
});

// Define the Counter model
const Counter = mongoose.model('Counter', counterSchema);

// Book Schema
const bookSchema = new mongoose.Schema({
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
const Book = mongoose.model('Book', bookSchema);

// Function to get the next sequence value
async function getNextSequenceValue(sequenceName: string): Promise<number> {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true } // Create if it doesn't exist
  );
  return sequenceDocument.sequence;
}

// Route to add a new book
app.post('/books', async (req: Request, res: Response) => {
  const bookData = req.body;
  const book = new Book({
    ...bookData,
    id: await getNextSequenceValue('bookId'), // Get the next sequence value for id
  });

  try {
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.delete('/books/:id', async (req: Request, res: Response): Promise<any> => {
  const bookId = parseInt(req.params.id); // Convert the ID from string to number

  try {
    const result = await Book.findOneAndDelete({ id: bookId }); // Using 'id' for the lookup
    if (result) {
      return res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting book', error });
  }
});

// Route to get all books
app.get('/books', async (req: Request, res: Response) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});



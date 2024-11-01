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
var BookFormat;
(function (BookFormat) {
    BookFormat["PRINT"] = "Print";
    BookFormat["PDF"] = "PDF";
    BookFormat["EBOOK"] = "Ebook";
    BookFormat["AUDIOBOOK"] = "AudioBook";
})(BookFormat || (BookFormat = {}));
var BookStatus;
(function (BookStatus) {
    BookStatus["READ"] = "Read";
    BookStatus["RE_READ"] = "Re-read";
    BookStatus["DNF"] = "DNF";
    BookStatus["CURRENTLY_READING"] = "Currently Reading";
    BookStatus["UNREAD"] = "Unread";
    BookStatus["WANT_TO_READ"] = "Want to Read";
})(BookStatus || (BookStatus = {}));
class Book {
    constructor(id, title, author, totalPages, status, price, readingPages, format) {
        this.id = id; // Set the ID
        this.title = title;
        this.author = author;
        this.totalPages = totalPages;
        this.status = status;
        this.price = price;
        this.readingPages = readingPages;
        this.format = format;
        this.finished = readingPages >= totalPages;
    }
    currentlyAt() {
        return `You are currently at page ${this.readingPages} out of ${this.totalPages}.`;
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`http://localhost:3000/books/${this.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert(`Book "${this.title}" deleted successfully!`);
            }
            else {
                const error = yield response.json();
                alert(`Error deleting book: ${error.message}`);
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookForm');
    form.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const totalPages = parseInt(document.getElementById('totalPages').value);
        const readingPages = parseInt(document.getElementById('readingPages').value);
        const book = new Book(0, document.getElementById('title').value, document.getElementById('author').value, totalPages, document.getElementById('status').value, parseFloat(document.getElementById('price').value), readingPages, document.getElementById('format').value);
        try {
            const response = yield fetch('http://localhost:3000/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert("Book added successfully!");
        }
        catch (error) {
            console.error('Error adding book:', error);
            alert('An error occurred while adding the book. Please try again.');
        }
    }));
});
function fetchBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/books');
            const books = yield response.json();
            console.log('Fetched books:', books); // Log fetched books for debugging
            const booksList = document.getElementById('booksList');
            if (booksList) {
                booksList.innerHTML = ''; // Clear previous list
                let totalBooksRead = 0;
                let totalPagesRead = 0;
                books.forEach((book) => {
                    const percentageRead = (book.readingPages / book.totalPages) * 100;
                    // Check if the status is "READ" to count as a book read
                    if (book.status === "READ") {
                        totalBooksRead++;
                        totalPagesRead += book.totalPages;
                    }
                    const bookItem = document.createElement('div');
                    bookItem.innerHTML = `
                  <h3>${book.title} by ${book.author}</h3>
                  <p><strong>Status:</strong> ${book.status}</p>
                  <p><strong>Pages Read:</strong> ${book.readingPages} / ${book.totalPages} (${percentageRead.toFixed(2)}%)</p>
                  <p><strong>Finished:</strong> ${book.finished ? 'Yes' : 'No'}</p>
                  <p><strong>Format:</strong> ${book.format}</p>
                  <button class="deleteButton">Delete</button>
              `;
                    // Find the delete button and attach the delete function to it
                    const deleteButton = bookItem.querySelector('.deleteButton');
                    deleteButton.addEventListener('click', () => book.delete());
                    booksList.appendChild(bookItem);
                });
                // Update totals
                const totalBooksReadElement = document.getElementById('totalBooksRead');
                const totalPagesReadElement = document.getElementById('totalPagesRead');
                if (totalBooksReadElement) {
                    totalBooksReadElement.innerText = `Total Books Read: ${totalBooksRead}`;
                }
                if (totalPagesReadElement) {
                    totalPagesReadElement.innerText = `Total Pages Read: ${totalPagesRead}`;
                }
                // Log totals for debugging
                console.log('Total Books Read:', totalBooksRead);
                console.log('Total Pages Read:', totalPagesRead);
            }
        }
        catch (error) {
            console.error('Error fetching books:', error);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
});

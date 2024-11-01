enum BookFormat {
  PRINT = "Print",
  PDF = "PDF",
  EBOOK = "Ebook",
  AUDIOBOOK = "AudioBook",
}

enum BookStatus {
  READ = "Read",
  RE_READ = "Re-read",
  DNF = "DNF",
  CURRENTLY_READING = "Currently Reading",
  UNREAD = "Unread",
  WANT_TO_READ = "Want to Read",
}

class Book {
  id: number; // Auto-incremented ID
  title: string;
  author: string;
  totalPages: number;
  status: BookStatus;
  price: number;
  readingPages: number;
  format: BookFormat;
  finished: boolean;

  constructor(
    id: number,title: string,author: string,totalPages: number,status: BookStatus,
    price: number,readingPages: number,format: BookFormat,
  ) {
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

  currentlyAt(): string {
    return `You are currently at page ${this.readingPages} out of ${this.totalPages}.`;
  }

  async delete(): Promise<void> {
    const response = await fetch(`http://localhost:3000/books/${this.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert(`Book "${this.title}" deleted successfully!`);
    } else {
      const error = await response.json();
      alert(`Error deleting book: ${error.message}`);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookForm') as HTMLFormElement;

  form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const totalPages = parseInt((document.getElementById('totalPages') as HTMLInputElement).value);
      const readingPages = parseInt((document.getElementById('readingPages') as HTMLInputElement).value);

      const book = new Book(
          0,
          (document.getElementById('title') as HTMLInputElement).value,
          (document.getElementById('author') as HTMLInputElement).value,
          totalPages,
          (document.getElementById('status') as HTMLSelectElement).value as BookStatus,
          parseFloat((document.getElementById('price') as HTMLInputElement).value),
          readingPages,
          (document.getElementById('format') as HTMLSelectElement).value as BookFormat,
      );

      try {
          const response = await fetch('http://localhost:3000/books', {
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
      } catch (error) {
          console.error('Error adding book:', error);
          alert('An error occurred while adding the book. Please try again.');
      }
  });
});



async function fetchBooks() {
  try {
      const response = await fetch('http://localhost:3000/books');
      const books: Book[] = await response.json();
      console.log('Fetched books:', books); // Log fetched books for debugging
      const booksList = document.getElementById('booksList');
      
      if (booksList) {
          booksList.innerHTML = ''; // Clear previous list

          let totalBooksRead = 0;
          let totalPagesRead = 0;

          books.forEach((book: Book) => {
              const percentageRead = (book.readingPages / book.totalPages) * 100;

              // Check if the status is "READ" to count as a book read
              if (book.status ==="READ" as BookStatus) {
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
        const deleteButton = bookItem.querySelector('.deleteButton') as HTMLButtonElement;
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
  } catch (error) {
      console.error('Error fetching books:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchBooks();
});

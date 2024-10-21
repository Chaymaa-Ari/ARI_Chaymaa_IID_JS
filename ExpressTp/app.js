const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Start the server at the port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


let items = [];

//Post Endpoint to add new item localy
app.post('/add', (req, res) => {
  const item = req.body;
  items.push(item);
  res.status(201).send(item);
});


//Get Endpoint to fetch the items = it means to  get all the elements
app.get('/items', (req, res) => {
    res.status(200).send(items);
  });

  
//Get Endpoint to find the item with a specific id  
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);
    if (item) {
      res.status(200).send(item);
    } else {
      res.status(404).send({ message: "Item not found" });
    }
  });


//Put Endpoin to modify an item with a specific id  
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = req.body;
      res.status(200).send(items[index]);
    } else {
      res.status(404).send({ message: "Item not found" });
    }
  });


//Delete an item by id
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      res.status(200).send({ message: "Item deleted" });
    } else {
      res.status(404).send({ message: "Item not found" });
    }
  });
 
  
  
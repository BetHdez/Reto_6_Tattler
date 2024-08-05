const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3001; 

app.use(bodyParser.json());

// Configuración de la base de datos
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'Tattler';
let db;

// Conexión a MongoDB
MongoClient.connect(url)
  .then(client => {
    console.log('Conectado a MongoDB');
    db = client.db(dbName);

    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch(error => console.error('Error al conectar a MongoDB:', error));

// Rutas
app.get('/restaurants', (req, res) => {
  db.collection('Restaurantes').find().toArray((err, results) => {
    if (err) {
      console.error('Error al obtener los restaurantes:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  db.collection('Restaurantes').findOne({ _id: ObjectId(id) }, (err, result) => {
    if (err) {
      console.error('Error al obtener el restaurante:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

app.post('/restaurants', (req, res) => {
  const newRestaurant = req.body;
  db.collection('Restaurantes').insertOne(newRestaurant, (err, result) => {
    if (err) {
      console.error('Error al crear el restaurante:', err);
      return res.status(500).send(err);
    }
    res.status(201).json(result.ops[0]);
  });
});

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  const updatedRestaurant = req.body;
  db.collection('Restaurantes').updateOne(
    { _id: ObjectId(id) },
    { $set: updatedRestaurant },
    (err, result) => {
      if (err) {
        console.error('Error al actualizar el restaurante:', err);
        return res.status(500).send(err);
      }
      res.status(200).json(result);
    }
  );
});

app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  db.collection('Restaurantes').deleteOne({ _id: ObjectId(id) }, (err, result) => {
    if (err) {
      console.error('Error al eliminar el restaurante:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

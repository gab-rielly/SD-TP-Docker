const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
const port = 3000;

const dbUrl1 = process.env.DB_URL1;
const dbUrl2 = process.env.DB_URL2;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Função para conectar ao banco de dados
const connectToDb = async (url) => {
  return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
};

// Função para obter uma cerveja de um banco de dados específico
const getBeerFromDb = async (name, url) => {
  const client = await connectToDb(url);
  const db = client.db('beerdb');
  const beer = await db.collection('beers').findOne({ name });
  client.close();
  return beer;
};

// Endpoint para obter todas as cervejas de um banco de dados específico
app.get('/beers', async (req, res) => {
  const { db } = req.query;

  if (!db || !['db1', 'db2'].includes(db)) {
    return res.status(400).send('Invalid database specified');
  }

  try {
    const dbUrl = db === 'db1' ? dbUrl1 : dbUrl2;
    const client = await connectToDb(dbUrl);
    const dbInstance = client.db('beerdb');
    const beers = await dbInstance.collection('beers').find().toArray();
    client.close();
    res.status(200).json(beers);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Endpoint para adicionar uma cerveja a um banco de dados específico
app.post('/add-beer', async (req, res) => {
  const { name, db } = req.body;

  if (!name || !db || !['db1', 'db2'].includes(db)) {
    return res.status(400).send('Invalid request parameters');
  }

  try {
    const dbUrl = db === 'db1' ? dbUrl1 : dbUrl2;
    const client = await connectToDb(dbUrl);
    const dbInstance = client.db('beerdb');
    await dbInstance.collection('beers').insertOne({ name });
    client.close();
    res.status(200).send('Beer added');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Endpoint para remover uma cerveja de um banco de dados específico
app.delete('/remove-beer', async (req, res) => {
  const { name, db } = req.body;

  if (!name || !db || !['db1', 'db2'].includes(db)) {
    return res.status(400).send('Invalid request parameters');
  }

  try {
    const dbUrl = db === 'db1' ? dbUrl1 : dbUrl2;
    const client = await connectToDb(dbUrl);
    const dbInstance = client.db('beerdb');
    await dbInstance.collection('beers').deleteOne({ name });
    client.close();
    res.status(200).send('Beer removed');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Endpoint para comparar a presença de uma cerveja nos dois bancos de dados
app.get('/compare-beer', async (req, res) => {
  const { name } = req.query;

  try {
    const [beerInDb1, beerInDb2] = await Promise.all([
      getBeerFromDb(name, dbUrl1),
      getBeerFromDb(name, dbUrl2)
    ]);

    res.json({
      name,
      inDb1: !!beerInDb1,
      inDb2: !!beerInDb2
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Endpoint para verificar se o backend está funcionando
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

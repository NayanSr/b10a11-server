const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//! Middleware
app.use(cors());
app.use(express.json());



//! mongodb starts


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yo4en.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const artifactsCollection= client.db("artifactsDB").collection("allArtifacts");

    app.post('/allArtifacts', async(req,res)=>{
        const data= req.body;
        const result= await artifactsCollection.insertOne(data);
        console.log('heated', data);
        res.send(result)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


//! mongodb ends




// Define routes
app.get('/', async (req, res) => {
    res.send('Running this server');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

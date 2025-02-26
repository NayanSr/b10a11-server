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


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const likedArtifactsCollection= client.db("artifactsDB").collection('allLiked')

  //! GET

        //? All artifacts
    app.get('/allArtifacts', async(req,res)=>{
        const cursor= artifactsCollection.find();
        const result= await cursor.toArray();
        res.send(result)
    })


        //? single Data
    app.get(`/allArtifacts/:id`, async(req,res)=>{
      const id= req.params.id;
      const query= {_id: new ObjectId(id)};                 //* { _id: new ObjectId('6776be49ddd224d388564f17') }
      const result=await artifactsCollection.findOne(query);
      res.send(result)
      // console.log(query);
    })


        //? top six liked
    app.get('/top-six', async(req,res)=>{
      const result = await artifactsCollection.find({}).sort({like:-1}).limit(2).toArray();
      res.send(result)
    })



        //? All liked
    app.get('/all-liked', async(req,res)=>{
      const result= await likedArtifactsCollection.find().toArray();
      res.send(result)
    })


        //? getting my liked
    app.get('/my-liked', async(req,res)=>{
      const queryEmail= req.query.email;
     const query= {email:queryEmail} ;
     const result=await likedArtifactsCollection.find(query).toArray();
      // console.log(result);
      res.send(result)
    })


        //? getting loggedin user data
    app.get('/my-artifacts', async (req,res)=>{
      const email = req.query.email;
      // const query= `{${addedBy.email}: ${email}}`;
      const query = { addedPersonEmail: email };
      const result= await artifactsCollection.find(query).toArray();
      res.send(result);

      // console.log('query : ', query, result);

    })
      
    
    //! POST 
    app.post('/allArtifacts', async(req,res)=>{
        const data= req.body;
        const result= await artifactsCollection.insertOne(data);
        // console.log('heated', data);
        res.send(result)
    });

        //? post data in a new collection
    app.post('/all-liked', async(req,res)=>{
      const data= req.body;
      // console.log(data);
      const result= await likedArtifactsCollection.insertOne(data);
      res.send(result)
    })

    //! PATCH 
        //? increase like count
    app.patch('/allArtifacts/:id', async(req,res)=>{
      const id= req.params.id;
      const query= {_id: new ObjectId(id)};
      const updateDoc= {$inc:{like:1},};
      const result= await artifactsCollection.updateOne(query,updateDoc);

      // console.log(id, query,result);
      res.send(result)
    })


    //! PUT
        //? update single artifact
    app.put('/allArtifacts/:id', async(req,res)=>{
      const id= req.params.id;
      const query= {_id: new ObjectId(id)};
      const receivdData= req.body;
      const setUpdatedData= {
        $set:{
              name:receivdData.name,
              photo:receivdData.photo,
              artifactType: receivdData.artifactType,
              historicalContext: receivdData.historicalContext,
              createdAt: receivdData.createdAt,
              discoveredAt: receivdData.discoveredAt,
              presentLocation: receivdData.presentLocation,
              addedBy: receivdData.addedBy,
              // adderPersonEmail: receivdData.adderPersonEmail
        }
      };
    const options= {upsert: true};
    const result=await artifactsCollection.updateOne(query,setUpdatedData,options);
    res.send(result)
      // console.log('R: ', receivdData, 'Up: ', setUpdatedData);
    })



    //! DELETE

  app.delete('/allArtifacts', async(req,res)=>{
    const id= req.query.id;
    const query={_id: new ObjectId(id)};
    const result= await artifactsCollection.deleteOne(query);
    res.send(result);
    // console.log(id, query);
  })



  /*   
    const updateDocument = { $inc: { quantity: 1 },};

    const result = await myColl.updateOne(filter, updateDocument); */



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






// TODO: top six liked

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express() ;
const port = process.env.PORT || 5555 ;

app.use(cors()) ;
app.use(express.json()) ;
require('dotenv').config() ;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w0yjihf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const decorDB = client.db('decorDB') ;
    const craftItemsCollection = decorDB.collection('craftItemCollection') ;
    const subCategorieCollection = decorDB.collection('subCategorieCollection')

    app.get('/addCraftItem' , async (req , res) => { 
      const cursor = craftItemsCollection.find() ;
      const result = await cursor.toArray() ;
      res.send(result) ;
    })

    app.get('/addCraftItem/:id' , async (req , res) => {
      const id = req.params.id ;
      const query = {_id : new ObjectId(id)} ;
      const result = await craftItemsCollection.findOne(query) ;
      res.send(result) ;
    })

    app.get('/update/:id' , async (req , res) => {
      const id = req.params.id ;
      const query = {_id : new ObjectId(id)} ;
      const result = await craftItemsCollection.findOne(query) ;
      res.send(result) ;
    })

    app.get('/subCategorie/:value' , async (req , res) => {
      const subCategorie = req.params.value ;
      const filter = {subName : subCategorie} ;
      const cursor = subCategorieCollection.find(filter) ;
      const result = await cursor.toArray() ;
      res.send(result) ;
    })

    app.get('/subCategorie' , async (req , res) => {
      const cursor = subCategorieCollection.find() ;
      const result = await cursor.toArray() ;
      res.send(result) ;
    })
    
    app.get('/myList/:email' , async (req , res) => {
      const email = req.params.email ;
      const filter = {userEmail : email} ;
      const cursor = craftItemsCollection.find(filter) ;
      const result = await cursor.toArray() ;
      res.send(result) ;
    })

    app.post('/addCraftItem' , async (req , res) => {
        const itemInfo = req.body ;
        console.log(itemInfo);
        const subResult = await subCategorieCollection.insertOne(itemInfo) ;
        const result = await craftItemsCollection.insertOne(itemInfo) ;
        res.send(result) ;
    })

    app.put('/update/:id' , async (req , res) => {
      const id = req.params.id ;
      const updatedData = req.body ;

      const filter = {_id : new ObjectId(id)} ;
      const options = { upsert: true };

      const updatedItem = {
        $set: {
          itemName : updatedData.itemName ,
          subName : updatedData.subName ,
          image : updatedData.image ,
          shortDesc : updatedData.shortDesc ,
          processing : updatedData.processing ,
          price : updatedData.price ,
          rating : updatedData.rating ,
          stockStatus : updatedData.stockStatus ,
          customization : updatedData.customization
        },
      };

      const subResult = await subCategorieCollection.updateOne(filter , updatedItem , options)
      const result = await craftItemsCollection.updateOne(filter , updatedItem , options);
      res.send(result) ;
    })

    app.delete('/myListDelete/:id' , async (req , res) => {
      const id = req.params.id ;
      const filter = {_id : new ObjectId(id)} ;
      const subResult = await subCategorieCollection.deleteOne(filter) ;
      const result = await craftItemsCollection.deleteOne(filter) ;
      res.send(result) ;
    })

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/' , (req , res) => {
    res.send('Decor server is running !')
})

app.listen(port , () => {
    console.log(`Server running at port : ${port}`);
})

const express=require('express');
const cors=require('cors')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()
const app=express()
const port=process.env.PORT || 5014

//middleware
app.use(cors())
app.use(express.json())

// Database integration
console.log(process.env.DB_PASS)
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.mnncxar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    const foodCollection = client.db("codeZen").collection('food');
    const userCollection = client.db("codeZen").collection('user');
    const myFoodRequestCollection = client.db("codeZen").collection('myFoodRequest');
    
    app.get('/food', async (req,res)=>{
        const cursor=foodCollection.find();
        const result=await cursor.toArray();
        console.log(result)
        res.send(result)
    })
    app.get('/myFoodRequest', async (req,res)=>{
        const cursor=myFoodRequestCollection.find();
        const result=await cursor.toArray();
        console.log(result)
        res.send(result)
    })
    app.get('/user', async (req,res)=>{
        const cursor=userCollection.find();
        const result=await cursor.toArray();
        console.log(result)
        res.send(result)
    })

    app.get('/food/:id', async (req,res)=>{
        const id=req.params.id;
        const quary={_id:new ObjectId(id)}
        console.log(quary)
        const singleFood= await foodCollection.findOne(quary) 
        res.send(singleFood)
    })

    app.get('/myFoodRequest/:email', async (req,res)=>{

        const email=req.params.email;
        const quary={userEmail:email}
        console.log(quary)
        const singleFood= await myFoodRequestCollection.find(quary) 
        const result=await singleFood.toArray();
        res.send(result)
    })

   


    app.get('/user/:id', async (req,res)=>{
        const id=req.params.id;
        const quary={_id:new ObjectId(id)}
        const user= await userCollection.findOne(quary) 
        res.send(user)
    })

    app.post("/food", async (req,res)=>{
        const newfood=req.body
        console.log(newfood)
        
        const result= await foodCollection.insertOne(newfood) 
        res.send(result)
    })
    app.post("/myFoodRequest", async (req,res)=>{
        const newfood=req.body
        console.log(newfood)
        
        const result= await myFoodRequestCollection.insertOne(newfood) 
        res.send(result)
    })

   
    app.post("/user", async (req,res)=>{
        const newUser=req.body
        
        
        const result= await userCollection.insertOne(newUser) 
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('CodeZen-All-Foods is running')
})

app.listen(port,()=>{
    console.log(`Codezen is running on port ${port}`)
})
const express=require('express');
const cors=require('cors')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()
const app=express()
const port=process.env.PORT || 5014

//middleware

app.use(cors({
    origin:['http://localhost:5175'],
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())



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
        console.log('token from available foods',req.cookies.token)
        const cursor=foodCollection.find();
        const result=await cursor.toArray();
        res.send(result)
    })

    app.delete('/food/:id', async (req,res)=>{
        const token=req.cookies?.token
         console.log('token from manage my food in delete operation',token)
        const id=req.params.id;
        const quary={_id:new ObjectId(id)}
        console.log('deleted food',quary)
        const deletedFood= await foodCollection.deleteOne(quary) 
        res.send(deletedFood)
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
        res.send(result)
    })

    app.get('/food/:id', async (req,res)=>{
        const id=req.params.id;
        const quary={_id:new ObjectId(id)}
        const singleFood= await foodCollection.findOne(quary) 
        res.send(singleFood)
    })

    app.get('/myFoodRequest/:email', async (req,res)=>{

        const token=req.cookies?.token
         console.log('token my food request in get operation',token)

        const email=req.params.email;
        const quary={userEmail:email}
        console.log(quary)
        const singleFood=  myFoodRequestCollection.find(quary) 
        const result=await singleFood.toArray();
        res.send(result)
    })

    app.get('/foods/:email', async (req,res)=>{
         const token=req.cookies?.token
         console.log('token from manage food',token)
        const email=req.params.email;
        const quary={'donatorEmail':email}
        const singleFood= foodCollection.find(quary) 
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
        const token=req.cookies?.token
         console.log('token from add food in post operation',token)
        const newfood=req.body
        console.log(newfood)
        
        const result= await foodCollection.insertOne(newfood) 
        res.send(result)
    })
    app.post("/myFoodRequest", async (req,res)=>{
        const newfood=req.body 
        const result= await myFoodRequestCollection.insertOne(newfood) 
        res.send(result)
    })

    app.post('/jwt', async(req,res)=>{
        const user=req.body
        console.log(user)
         const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'365d'})
    
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

        })
        .send({success:true})
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
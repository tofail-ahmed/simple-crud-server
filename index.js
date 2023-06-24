require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//midlleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhsy6ko.mongodb.net/?retryWrites=true&w=majority`;

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
            //     await client.connect();


            const usersCollection = client.db("simple-crud").collection("user")



            app.post('/users', async (req, res) => {
                  const { name, email, phone } = req.body;
                  const newUser = {
                        name,
                        email,
                        phone
                  }
                  console.log(newUser);
                  const result = await usersCollection.insertOne(newUser);
                  res.send(result)
            })



            app.get('/users', async (req, res) => {
                  const result = await usersCollection.find().toArray();
                  res.send(result)
            })
            app.get('/users/:id', async (req, res) => {
                  const id = req.params.id
                  const query = { _id: new ObjectId(id) }
                  const result = await usersCollection.findOne(query)
                  res.send(result)

            })

            app.delete('/users/:id', async (req, res) => {
                  const id = req.params.id;


                  const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
                  res.send(result)
            })
            app.put('/users/:id', async (req, res) => {

                  const id = req.params.id;
                  console.log("update", id);
                  const body = req.body;
                  console.log(body);
                  const { name, email, phone } = body;
                  const filter = { _id: new ObjectId(id) }
                  const updateDoc = {
                        $set: {
                              name,
                              email,
                              phone
                        }
                  }
                  console.log("update", updateDoc);
                  const result = await usersCollection.updateOne(filter, updateDoc)
                  res.send(result)
            })

            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
            // Ensures that the client will close when you finish/error
            //     await client.close();
      }
}
run().catch(console.dir);





app.get('/', async (req, res) => {
      res.send("sipmle crud is running")
})


app.listen(port, () => {
      console.log("sipmle crud is running");
})
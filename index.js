const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

//middlewear
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SecondLifeHub servers is available");
});

const uri =
  "mongodb+srv://SecondLifeHubUser:l1amFmrYnGNNvp4c@cluster0.8tuvkma.mongodb.net/?appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

/* client
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`SecondlifeHub-server is live on ${port}`);
    });
  })
  .catch(console.dir ); */

async function run() {
  try {
    await client.connect();

    const database = client.db("secondhand_db");
    const productCollections = database.collection("products");

    app.get("/products", async (req, res) => {
      const cursor = productCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollections.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollections.insertOne(newProduct);
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: updatedProduct,
      };
      const result = await productCollections.updateOne(query, update);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollections.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`SecondlifeHub-server is live on ${port}`);
});

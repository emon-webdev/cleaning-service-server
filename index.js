const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();

const Port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// const serviceCollection = require("./data/services.json");

// app.get("/services", (req, res) => {
//   res.send(serviceCollection);
// });

//single service
// app.get("/services/:id", (req, res) => {
//   const id = req.params.id;
//   const selectedService = serviceCollection.find((course) => course._id == id);
//   res.send(selectedService);
// });

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.m61comp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const servicesCollection = client.db("clean-service").collection("service");

    //home services
    app.get("/services/ShortService", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    //all services
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    //single services api call
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: ObjectId(id) };
      console.log(query)
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Cleaning Service is Running");
});

app.listen(Port, () => {
  console.log(`Cleaning Service is Running  ${Port}`);
});

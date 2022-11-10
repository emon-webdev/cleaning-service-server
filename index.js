const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();

const Port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.m61comp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const servicesCollection = client.db("clean-service").collection("service");
    const reviewsCollection = client.db("clean-service").collection("reviews");

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10h",
      });
      res.send({ token });
    });

    //home services
    app.get("/services/ShortService", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query, {sort:{_id:-1}});
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });


    //all services
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query, {sort:{_id:-1}});
      const services = await cursor.toArray();
      res.send(services);
    });


    //single services api call
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    //add services
    app.post("/service", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.send(result);
    });

    //review collection
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      console.log(result);
      res.send(result);
    });

    //service review
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = {serviceId: id};
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });


    //my user  review
    app.get("/userReviews/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = {uid: uid};
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });



    //delete review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });



    //update er jonno single review fetch
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.findOne(query);
      res.send(result);
    });

    //update review
    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updatedReview = req.body;
      console.log(updatedReview)
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Cleaning Service is Running...");
});

app.listen(Port, () => {
  console.log(`Cleaning Service is Running  ${Port}`);
});


// module.exports = app;



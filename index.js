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

    //add services from add service com__
    app.post("/service", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);

      res.send(result);
    });

    //home services
    app.get("/services/ShortService", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query, { sort: { _id: -1 } });
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    //all services for service component
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query, { sort: { _id: -1 } });
      const services = await cursor.toArray();
      res.send(services);
    });

    //single services for service details com__
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    /* ===========review collection =========*/

    //review add from service details com__
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);

      res.send(result);
    });

    // review load service id ways
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { serviceId: id };
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //my user  review for my reviews
    app.get("/userReviews/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //delete review from my reviews
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);

      res.send(result);
    });

    //all Review
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewsCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    //update single review for update component
    app.get("/singleReviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.findOne(query);

      res.send(result);
    });

    //update review
    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const oldReview = req.body;
      const option = { upsert: true };
      const updatedReview = {
        $set: {
          review: oldReview,
        },
      };
      const result = await reviewsCollection.updateOne(
        query,
        updatedReview,
        option
      );
      res.send(result);
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

const express = require("express");
const app = express();
const path = require("path");
const portNumber = 7003;
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

/*
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});
*/

const databaseName = "CMSC335DB";
const collectionName = "moviesCollection";
const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

app.get("/", async (req, res) => {
   res.send(`My Deployment`);
});

app.get("/insertMovies", async (req, res) => {
    try {
      await client.connect();
      const collection = client.db(databaseName).collection(collectionName);
      
      /* Inserting several movies */
      const moviesArray = [
         { name: "Batman", year: 2021, stars: 1.5 },
         { name: "Wonder Women", year: 2005, stars: 2.0 },
         { name: "When Harry Met Sally", year: 1985, stars: 5 },
         { name: "Hulk", year: 1985, stars: 5 },
      ];
      result = await collection.insertMany(moviesArray);
      res.send(`<h2>Inserted ${result.insertedCount} movies</h2>`);
      /* Comment Here */
   } catch (e) {
      console.error(e);
   } finally {
      await client.close();
   }
});

app.get("/listMovies", async (req, res) => {
   
    try {
      await client.connect();
      const collection = client.db(databaseName).collection(collectionName);
      
      /* Listing all movies */
      const filter = {};
      cursor = collection.find(filter);
      result = await cursor.toArray();
      let answer = "";
      result.forEach(elem => answer += `${elem.name} (${elem.year})<br>`);
      answer += `Found: ${result.length} movies`; 
      res.send(answer);
   } catch (e) {
      console.error(e);
   } finally {
      await client.close();
   }
});

app.get("/clearCollection", async (req, res) => {
    try {
      await client.connect();
      
      const collection = client.db(databaseName).collection(collectionName);
      const result = await collection.drop();
      res.send("<h2>Collection Cleared</h2>");
   } catch (e) {
      console.error(e);
   } finally {
      await client.close();
   }
});

app.get("/getSummary", (req, res) => {
   const variables = { year: 2025 };
   res.render("summary", variables);
});


app.listen(portNumber);
console.log(`main URL http://localhost:${portNumber}/`);

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


const uri = `mongodb+srv://${process.env.USER_BD}:${process.env.PASS_DB}@cluster0.kadilur.mongodb.net/?retryWrites=true&w=majority`;

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

        const ProductsCollection = client.db("ProductsDB").collection("Products");

        const BrandCollection = client.db("BrandNameDB").collection("BrandName");


        const addCollection = client.db("AddProduct").collection("addProduct");


        app.get("/products", async (req, res) => {

            const cursor = ProductsCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

        app.get("/product/:name", async (req, res) => {
            const name = req.params.name;
            const query = { name: name };
            const result = await ProductsCollection.findOne(query);

            res.send(result);
        });



        app.get("/productss/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await ProductsCollection.findOne(query);

            res.send(result);
        });


        app.get("/products/:brandname", async (req, res) => {
            const brandname = req.params.brandname;
            const query = { brandname: brandname };
            const cursor = ProductsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });



        app.get("/BrandName", async (req, res) => {

            const cursor = BrandCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })


        app.get("/updateproducts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await ProductsCollection.findOne(query);

            res.send(result);
        });



        app.get("/cartproduct", async (req, res) => {
            const cursor = addCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.post('/products', async (req, res) => {

            const Products = req.body;
            const result = await ProductsCollection.insertOne(Products);
            res.send(result)
        })




        app.post("/addproduct", async (req, res) => {

            const product = req.body;
            const result = await addCollection.insertOne(product);

            res.send(result)
        })



        app.put('/updateproducts/:id', async (req, res) => {

            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const Products = req.body;
            const options = { upsert: true };
            const UpdateProducts = {
                $set: {
                    brandname: Products.brandname,
                    type: Products.type,
                    price: Products.price,
                    shortdescription: Products.shortdescription,
                    rating: Products.rating,
                    photo: Products.photo,
                }
            }

            const result = await ProductsCollection.updateOne(filter, UpdateProducts, options)
            console.log(result)
            res.send(result)
        })

        app.delete("/deletedprodutc/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await addCollection.deleteOne(query);
            console.log(result)
            res.send(result);

        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

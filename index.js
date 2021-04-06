const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const app = express()
require('dotenv').config()

const port = process.env.PORT || 9000

app.use(express.json())
app.use(cors())


const uri = "mongodb+srv://boltexUser:tuhin123456@cluster0.rh6zv.mongodb.net/device?retryWrites=true&w=majority";
app.get('/', (req, res) => {
    res.send("Hello !! Welcome to Boltex Home.")
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    console.log('err',err);
    const deviceCollection = client.db("device").collection("all");
    const sellCollection = client.db("device").collection("selldevice");
    console.log("database connected successsfully");

    // add or create device
    app.post('/addDevice', (req,res) => {
        const device = req.body;
        console.log(device);
        deviceCollection.insertOne(device)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })


    // show device in UI
    app.get("/showDevices",(req,res) => {
        deviceCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents)
        })
    })

    // load single product for payment
    app.get('/device/:id',(req,res) => {
        const id = ObjectID(req.params.id)
        console.log('id',id);
        deviceCollection.find({_id: id})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })

    // add orders
    app.post('/sellDevice',(req,res) => {
        const sellDevice = req.body;
        console.log('order',sellDevice);
        sellCollection.insertOne(sellDevice)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    // show Buy Device
    app.get('/showBuyDevice/:email', (req,res) => {
        const email = req.params.email;
        console.log('email',email);
        sellCollection.find({userEmail: email})
        .toArray((err,documents) => {
            res.send(documents)
        })
    })

    // delete device
    app.delete('/deleteDevice/:id',(req,res) => {
        const id = ObjectID(req.params.id)
        deviceCollection?.deleteOne({
            _id: id
        })
        .then( result => {
            console.log('delete',result)
            res.send(result.deletedCount > 0)
        })
    })

});

app.listen(port)
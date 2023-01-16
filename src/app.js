import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());
// app.use(cors());
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017")

let db;

mongoClient.connect()
.then(()=>{db = mongoClient.db("test"), console.log("Mongo Online")})
.catch(()=> {console.log("Monogodb Offline")})

app.post("/participants", (req, res) => {
    const { name , id} = req.body
    console.log(req.body)
    
    db.collection("test").insertOne({"name": name}).then(() => {return res.sendStatus(201)}).catch(() => {return res.sendStatus(422)})
    // return res.status(200).send('deu bom')
    })

    app.get("/participants", (req, res) => {
        db.collection("test").find().toArray().then(participants => {
            return res.send(participants)
        }).catch(() => console.log('Data server error!'));
    });
    
            
            
            
            const PORT = 5000;
            app.listen(PORT, () => console.log('server online'))
            
            
            
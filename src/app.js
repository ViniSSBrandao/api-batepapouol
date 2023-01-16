import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());
const mongoClient = new MongoClient(process.env.DATABASE_URL)
console.log(process.env.DATABASE_URL)
let db;

mongoClient.connect()
    .then(()=>{db = mongoClient.db("test"), console.log("Mongo Online")})
    .catch(()=> {console.log("Monogodb Offline")})

app.post("/participants", async (req, res) => {
    
    try{
    const { name } = req.body 

    const userIsLogged = await db.collection("test").findOne({ name })
    
    if(userIsLogged){ return res.sendStatus(409) }

    await db.collection("test").insertOne({"name": name, "lastStatus": Date.now()})
    return res.sendStatus(201)
    }
    catch(err){
        res.status(500).send("Deu ruim")
    }
})

app.get("/participants", (req, res) => {
    db.collection("test").find().toArray().then(participants => {
        return res.send(participants)
    }).catch(() => console.log('Data server error!'));
});

app.post("/messages", (req, res) => {
    const { to , text, type } = req.body  
    db.collection("test").insertOne({"to": to, "text" : text, "type": type }).then(() => {return res.sendStatus(201)}).catch(() => {return res.sendStatus(422)})   
})

app.get("/messages", (req, res) => {
    db.collection("test").find().toArray().then(participants => {
        return res.send(participants)
    }).catch(() => console.log('Data server error!'));
});
            
            
            
            const PORT = 5000;
            app.listen(PORT, () => console.log('server online'))
            
            
            
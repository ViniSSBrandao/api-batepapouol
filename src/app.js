import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());
app.use(cors());
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017")

let db;

mongoClient.connect()
.then(()=>{db = mongoClient.db("test")})
.catch(()=> {console.log("Monogodb Offline")})


    app.get("/participants", (req, res) => {
        db.collection("test").find().toArray().then(participants => {
            console.log(participants);
            return res.send(participants)
        }).catch(() => console.log('Data server error!'));
    });
    
    app.post("/participants", (req, res) => {
        const { name } = req.body

        db.collection("test").insertOne(name)
            
        })
            
            console.log(db)
            
            
            const PORT = 5000;
            app.listen(PORT, () => console.log('server online'))
            
            
            
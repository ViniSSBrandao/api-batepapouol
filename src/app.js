import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017")
const app = express();
app.use(cors());
app.use(express.json());

mongoClient.connect()
    .then(()=>{
        db = mongoClient.db("test")
    }
    )
    .catch(()=> console.log("Monogodb Offline"))
    
    const users = [];
    
const PORT = 5000

app.listen(PORT, () => console.log('server online'))


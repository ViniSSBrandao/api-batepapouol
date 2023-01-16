import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import joi from "joi";
import dayjs from "dayjs";

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());
const mongoClient = new MongoClient(process.env.DATABASE_URL)
console.log(process.env.DATABASE_URL)
let db;

try{
    await mongoClient.connect()
    db = mongoClient.db()
    console.log("Mongo Online")
}catch(error){
        console.log("Monogodb Offline")
}

app.post("/participants", async (req, res) => {
    
    try{
    const { name } = req.body 

    const userIsLogged = await db.collection("participants").findOne({ name })
    const timestamp = Date.now()
    const logTime = dayjs(timestamp).format("HH:mm:ss");
    console.log(name)
    
    const participantSchema = joi.object({
        name: joi.string().required(),
    });

    const validation = participantSchema.validate({ name });

    if (validation.error) {
        const err = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(err);
    }

    if(!name){return res.sendStatus(422)}

    if(userIsLogged){ console.log(userIsLogged);return res.sendStatus(409) }

    await db.collection("participants").insertOne({"name": name, "lastStatus": Date.now()})

    await db.collection("messages").insertOne({from: name, to: 'Todos', text: 'entra na sala...', type: 'status', time: logTime })

    return res.sendStatus(201)
    }
    catch(err){
        console.log(err)
        res.status(500).send("Deu ruim")
    }
})



app.get("/participants", (req, res) => {
    db.collection("participants").find().toArray().then(participants => {
        return res.send(participants)
    }).catch(() => console.log('Data server error!'));
});

app.post("/messages", async (req, res) => {
    try{
        const { to , text, type } = req.body
        const user = req.headers.user;
        const timestamp = Date.now()
        const msgTime = dayjs(timestamp).format("HH:mm:ss");    

        const messageScheme = joi.object({
            to: joi.string().required(),
            text: joi.string().required(),
            type: joi.string().valid("message").valid("private_message").required(),
            from: joi.string().required()
        });
        
        const validation = messageScheme.validate(
            { to, text, type, from: user },
            { abortEarly: false }
        );

        if (validation.error) {
            const err = validation.error.details.map((detail) => detail.message);
            return res.status(422).send(err);
        }

        const isUserLogged = await db.collection("participants").findOne({ name: user });

        if (!isUserLogged) return res.sendStatus(422);
        
        if(!to || !text || !type){return res.sendStatus(422)}
    
        await db.collection("messages").insertOne({"from": user, "to": to, "text" : text, "type": type, time: msgTime })
        return res.sendStatus(201)
        }
        catch(err){
            console.log(err)
            res.status(500).send("Deu ruim")
        }
})

app.get("/messages", async (req, res) => {

    // const { limit } = req.query;
    // const user = req.headers.user;

    db.collection("messages").find().toArray().then(messages => {
        return res.send(messages)
    }).catch(() => console.log('Data server error!'));
});

app.post("/status", async (req, res) => {
    
    try{
    const { name } = req.body 

    const userIsLogged = await db.collection("participants").findOne({ name })
    console.log(name)
    
    if(!name){return res.sendStatus(422)}

    if(userIsLogged){ console.log(userIsLogged);return res.sendStatus(409) }

    await db.collection("participants").insertOne({"name": name, "lastStatus": Date.now()})
    return res.sendStatus(201)
    }
    catch(err){
        console.log(err)
        res.status(500).send("Deu ruim")
    }
})


setInterval(async () => {

    const onlineUsers = await db.collection("participants").find().toArray()
    
    const timestamp = Date.now()
    
    const userRemoved = await onlineUsers.filter( (n) =>{
          return  timestamp >= n.lastStatus + 10000
        }) 
        try{
            await userRemoved.map(async (remove)=>{
                await db.collection("messages").insertOne({
                    "from": remove.name,
                    "to": "Todos", 
                    "text": "sai da sala...", 
                    "type": "status", 
                    "time": "HH:MM:SS"
                })
                await db.collection("participants").deleteOne(remove)
                console.log("users removed" + " " + remove.name)
            })
        }catch(err){
            console.log(err)
        }
    }, 1500);
        
        
            const PORT = 5000;
            app.listen(PORT, () => console.log('server online'))
            
            
            
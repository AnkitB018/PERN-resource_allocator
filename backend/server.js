import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import resourceRoutes from "./routes/resourceRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";


dotenv.config();

const app = express();
const port = process.env.port;

app.use(express.json()); //for parsing 
app.use(morgan("dev")); //For logging
app.use(helmet()); //Helmet is a security middleware that protects by using HTTP headers
app.use(cors());


app.use(async(req, res, next) => {
    try{
        const decision = await aj.protect(req, {
            requested: 1, // specifies that each request costs one token
        });

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({error: "Too many requests"});
            }else if(decision.reason.isBot()){
                res.status(403).json({error: "Bot access forbidden"});
            }else{
                res.status(403).json({error: "Access forbidden"});
            }
            return;
        }
        next();

    }catch(err){
        console.log("Error in arcjet: ", err);
        next(err);
    }
});


app.use("/api/resource", resourceRoutes);


async function initDB(){
    try{
        await sql `
            CREATE TABLE IF NOT EXISTS resource(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log("Successfully initialized database");
    }catch(err){
        console.log("Error in DB init", err)
    }
}



initDB().then(() => {
    app.listen(port, () => {
        console.log("Server running on port: " + port);
    });
})
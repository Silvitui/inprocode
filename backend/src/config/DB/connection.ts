import 'dotenv/config'
import mongoose from "mongoose";
import process from 'process'

const mongoDBURI = process.env.MONGO_DB_URI ?? ''

export const DBconnection = () => { mongoose.connect(
    
    mongoDBURI, 
    {})
    .then(() => {
        console.log("Connected to MongoDB");
    })
}
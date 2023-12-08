import mongoose from "mongoose";

export const ConnectDb= ()=>{
    mongoose.connect('mongodb://netflixdb:UNKN9OTR8u18wZf8gU4WRF8hBeUisjaCAE1cwl7Zp1FpNA1E45dX8vHakb1znqfiao8QFBsb5w5qACDburaAbw==@netflixdb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@netflixdb@').then(()=>{
        console.log("Connected to database")
    }).catch((error)=>{
        return console.log("error connecting to database")
    })
}


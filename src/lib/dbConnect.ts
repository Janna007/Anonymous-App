import mongoose from "mongoose";

type connetionObject={
    isConnected?:number
}

const connection :connetionObject={}

async function dbConnect():Promise<void>{

         if(connection.isConnected){
            console.log("DB already connected") 
            return
         }
          try {
            const dbConnection= await mongoose.connect(process.env.MONGO_URL || "")
            connection.isConnected=dbConnection.connections[0].readyState
            console.log("  successfully Connected to db ")
          } catch (error:any) {
            console.log("DB connection failed",error.message)
            process.exit(1)
          }
}

export default dbConnect;
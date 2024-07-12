import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";


export async function GET(request:Request) {
     dbConnect()

     const session=await getServerSession(authOptions)
     const user=session?.user 

     if(!session || !user){
        return Response.json({
            success:false,
            message:"Not authenticated!!Please Signup"
        },{status:404})
     }
     
     const userId = new mongoose.Types.ObjectId(user._id);
     console.log(userId)

     try {
      const user=  await UserModel.aggregate([
            {
                $match:{
                    _id:userId
                }
            },
            {
                $unwind:'$messages'
                
            },
            {
                $sort:{'messages.createdAt':-1}
            },
            {
                $group:{
                    _id:"$userId",
                    messages:{$push:"$messages"}
                }
            }
        ])

        if(!user || user.length===0){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }

        return Response.json({
            success:true,
            message:user[0].messages

        },{status:200})
        
     } catch (error) {
        console.log("Error while fetching messages",error)
        return Response.json({
            success:false,
            message:"Error while fetching messages"
        },{status:500})
     }

}
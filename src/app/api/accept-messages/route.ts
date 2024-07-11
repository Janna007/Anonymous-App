import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";



export async function POST(request:Request){
     await dbConnect()

     const session =await getServerSession(authOptions)
     const user=session?.user

     if(!session || !user){
        return Response.json({
            success:false,
            message:"Not authenticated!!Please Signup"
        },{status:404})
     }
     
     const userId=user._id
     const {acceptMessageFlag}=await request.json()

    try {
         const updatedUser=await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage:acceptMessageFlag
         },{new:true})
    
         if(!updatedUser){
            return Response.json({
                success:false,
                message:"error while updating the user message accepting state"
            },{status:500})
         }

         return Response.json({
            success:true,
            message:"succesfully change the user message accepting state",
            updatedUser
        },{status:200})
         
    
    } catch (error) {
        console.log("Error while updating user state")
        return Response.json({
            success:false,
            message:"Error while updating user state"
        },{status:500})
    }

}


export async function GET(request:Request) {
    await dbConnect()

     const session =await getServerSession(authOptions)
     const user=session?.user

     if(!session || !user){
        return Response.json({
            success:false,
            message:"Not authenticated!!Please Signup"
        },{status:404})
     }
     
     const userId=user._id

     try {

        const user=await UserModel.findById(userId)
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        return Response.json({
            success:true,
            isAcceptingMessage:user.isAcceptingMessage
        },{status:200})
        
     } catch (error) {
        console.log("Error to get the user accepting state")
        return Response.json({
            success:false,
            message:"Error to get the user accepting state"
        },{status:500})
     }
}
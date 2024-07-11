import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request){
     await dbConnect()
     try {
         const {username,code}=await request.json()

         const decodedUsername=decodeURIComponent(username)

         const user=await UserModel.findOne({username:decodedUsername})

         if(!user){
            return Response.json({
                success:false,
                message:"User not found!!"
            },{status:404})
         }

         const isCodeValid=user.verifyCode === code
         const isCodeNotExpired=new Date(user.verifyCodeExpiry) > new Date()

         if(isCodeNotExpired && isCodeValid){
            user.isVerified=true
            await user.save()

            return Response.json({
                success:true,
                message:"User Account Verfied"
            },{status:200})
         }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"verification code expired!signup again!"
            },{status:400})
         }else{
            return Response.json({
                success:false,
                message:"Incorrect OTP!!"
            },{status:400})
         }

        
     } catch (error) {
        console.log("Error in verifying user account",error)
        return Response.json({
            success:false,
            message:"Error in verifying Account!!"
        },{status:500})
     }
       

}
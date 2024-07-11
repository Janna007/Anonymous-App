import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userValidation } from "@/schemas/signUpSchema";
import {z} from 'zod'
 

const usernameQuerySchema=z.object({
    username:userValidation
})


export async function GET(request:Request){
        await dbConnect()
           try {
            const {searchParams}=new URL(request.url)
            const queryParams={
                  username:searchParams.get('username')
            }
            const result=usernameQuerySchema.safeParse(queryParams)
            // console.log(result)
            if(!result.success){
                // const usernameError=result.error.format().username?._errors || []
                return Response.json({
                    success:false,
                    message:"Invalid query parameter"
                },{status:400})
            }
             
            const {username}=result.data

            const existingUser=await UserModel.findOne(
                {username,
                isVerified:true
                }
            )
            
            if(existingUser){
                return Response.json({
                    success:false,
                    message:"Username already taken!Try another one"
                },{status:400})
            }

            return Response.json(
                {
                  success: true,
                  message: 'Username is unique',
                },
                { status: 200 }
              );


           } catch (error) {
            console.log("Error while checking unique username",error)
            return Response.json({
                success:false,
                message:"Error while checking unique username"
            },{status:500})
           }
}




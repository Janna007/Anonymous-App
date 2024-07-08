import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'



export async function GET(request:Request) {
    try {
        dbConnect()
        const reqBody=await request.json()
        const {username,email,password}=reqBody

        //validation

        //check user already exist or not by username and verified
        const userAlreadyExistByUsername=await UserModel.findOne({username,isVerified:true})

        if(userAlreadyExistByUsername){
            return Response.json({
                success:false,
                message:"User already exist with this username"
            },
            {
                status:400
            }
        )
        }

        //check user already exist with email 

        const userExistWithEmail=await UserModel.findOne({email})

        //create verifycode

        const verifyCode=Math.floor(100000 + Math.random() * 900000).toString();

        if(userExistWithEmail){
               if(userExistWithEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exist with this Email"
                },
                {
                    status:400
                }
            )
               }else{
                    const hashedPassword=await bcrypt.hash(password,10)
                    userExistWithEmail.password=hashedPassword
                    userExistWithEmail.verifyCode=verifyCode
                    userExistWithEmail.verifyCodeExpiry= new Date(Date.now() + 3600000);
                    await userExistWithEmail.save()
               }
        }else{

              //password hashing
              const hashedPassword=await bcrypt.hash(password,10)
              const expiryDate = new Date();
              expiryDate.setHours(expiryDate.getHours() + 1);

             //create user

            const newUser= new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
             })

             await newUser.save()
              
             }


             //send verification email
            const emailResponse= await sendVerificationEmail(username,email,verifyCode)

            if(!emailResponse.success){
                 return Response.json({
                    success:false,
                    message:"Error sending verification email to user"
                 })
            }

            return Response.json({
                success:true,
                message:"User registered successfully"
            },{
                status:200
            })

        }
      catch (error) {
        console.log("Error: Register user failed",error)
        return Response.json(
            {
               success:false,
               message:"User register failed"
            },
            {
                status:500
            }
        )
    }
}
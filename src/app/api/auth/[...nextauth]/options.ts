import { NextAuthOptions } from 'next-auth';
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'


export const authOptions:NextAuthOptions={
    providers: [
        CredentialsProvider({
         
          id:'Credentials',
          name: 'Credentials',
      
          credentials: {
            username: { label: "email", type: "text" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials:any):Promise<any> {
               await dbConnect()
               
             try {
               const user= await UserModel.findOne({
                   $or:[
                       {email:credentials.identifier},
                       {password:credentials.identifier}
                   ]
                })
       
                if(!user){
                   throw new Error("User not found !! Invalid credentials")
                }
      
                if(!user.isVerified){
                  throw new Error("Verify your Account before Login!")
                }
                
                const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
      
                if(isPasswordCorrect){
                   return user
                }else{
                  throw new Error("Check your password again!!")
                  
                }
      
      
             } catch (error:any) {
                throw new Error(error)
             }
             
           
          
          }
        })
      ],
      callbacks:{
        async jwt({ token, user }) {
          if(user){
            token._id=user._id;
            token.username=user.username
            token.isVerified=user.isVerified
            token.isAcceptingMessage=user.isAcceptingMessage
          }
          return token
        },

        async session({ session,token }) {
          if(token){
            session.user._id=token._id
            session.user.username=token.username
            session.user.isVerified=token.isVerified
            session.user.isAcceptingMessage=token.isAcceptingMessage
          }
          return session
        }
        
      },
      pages:{
        signIn: '/sign-in',
      },
      session:{
        strategy:"jwt"
      },
      secret:process.env.NEXT_AUTH_SECRET
      
}


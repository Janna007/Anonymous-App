import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse"
import VerificationEmail from "../../emails/VerificationEmail";


export async function sendVerificationEmail(

      email: string,
      username: string,
      verifyCode: string
   
):Promise<ApiResponse>{
      try {
                
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to:email,
          subject: ' Anonymous App | Verification Code',
          react:VerificationEmail({username,otp:verifyCode}) ,
        });

        return {success:true ,message:" send verification email"}
      } catch (error) {
        console.error("Failed to send verification email",error)
        return {success:false ,message:"Failed to send verification email"}
      }
}
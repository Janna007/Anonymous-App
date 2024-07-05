import {z} from 'zod'

export const userValidation= z
            .string()
            .min(3,"Username must be atleast 3 characters")
            .max(10,"username must be not contain more than 10 characters")
            .regex(/^[a-zA-Z0-9_]+$/,"Username should not contain special characters")

export const signUpSchema = z.object({
                username: userValidation,
                email:z.string().email({message:"Invalid Email"}),
                password:z.string().min(6,{message:"Password must be atleast 6 characters"})
              });
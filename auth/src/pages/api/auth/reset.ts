import { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"
import bcrypt from 'bcryptjs'
import connectDb from "@/utils/connectDb"

interface UserToken {
    id: string
}

export default async function resetPassword(req: NextApiRequest,res: NextApiResponse) {
    try{
        await connectDb()
        const { token, password } = req.body

        /*
            הפונקציה מקבלת טוקן ומנסה לאמת אותו.
            אם האימות מתבצע בהצלחה, הפונקציה מחזירה את המידע המפוענח מתוך הטוקן.
            אם האימות נכשל, הפונקציה מחזירה אובייקט המיכל הודעת שגיאה.
        */
        const userToken = jwt.verify(token, process.env.JWT_KEY!) as UserToken

        //Check if user exists in DB:
        const userFound = await User.findById(userToken.id)
        if(!userFound){
            return res.status(400).json({ message: "This account no longer exist."})
        }

        //Check the length of the password:
        if(password.length < 8){
            return res.status(400).json({ message: "Password must be at least 8 characters." })
        }

        //Hashing user Password:
        const hashPassword = await bcrypt.hash(password, 12)

        //Update the user:
        await User.findByIdAndUpdate(userFound.id, { password: hashPassword})
        res.json({ message: "Your account password has beeen successfully updated."})

    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

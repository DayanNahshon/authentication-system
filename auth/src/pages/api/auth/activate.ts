import { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"


interface UserToken {
    id: string
}

export default async function accountActivation(req: NextApiRequest,res: NextApiResponse) {
    try{
        const { token } = req.body

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

        if(userFound.emailVerified == true){
            return res.status(400).json({ message: "Email address already verified."})
        }

        await User.findByIdAndUpdate(userFound.id, { emailVerified: true})
        res.json({ message: "Your account has beeen successfully verified."})

    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}
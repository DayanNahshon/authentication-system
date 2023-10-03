import User from "../../../models/userModel"
import { NextApiRequest, NextApiResponse } from "next"
import validator from "validator"
import jwt from "jsonwebtoken"
import sendMail from "../../../utils/sendMail"
import { resetPasswordEmail } from "../../../emailTemplates/reset"

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    try{
        const { email } = req.body
        
        if(!validator.isEmail(email)){
            return res.status(400).json({ message: "Please Add a valid email address." })
        }

        //Check if email exists in DB:
        const userFound = await User.findOne({ email })
        if(!userFound){
            return res.status(400).json({ message: "This email does not exist."})
        }
        /*
            jwt.sign - חותם ויוצר טוקן
            {id} - המידע המאוחסן בתוך הטוקן (המזהה של המשתמש)
            {expiresIn: '2d'} - תוקף הטוקן
        */
        const resetToken = jwt.sign({ id: userFound._id.toString() }, process.env.JWT_KEY!, {expiresIn: '2d'})

        const url = `${process.env.NEXTAUTH_URL}/reset/${resetToken}`

        await sendMail(
            email,
            userFound.name,
            "",
            url,
            "Reset your password - Hola Chat App",
            resetPasswordEmail
        )

        res.status(201).json({
            status: "success",
            message: "An email has been sent to you, use it to reset your password."
        })

    }catch(error){
        res.status(500).json({ message: (error as Error).message })
    }
}



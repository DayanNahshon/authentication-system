import UserModel from "../../../models/userModel"
import { NextApiRequest, NextApiResponse } from "next"
import validator from "validator"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import sendMail from "@/utils/sendMail"
import { activateTemplateEmail } from "@/emailTemplates/activate"
import connectDb from "@/utils/connectDb"

export default async function signUp( req: NextApiRequest, res: NextApiResponse) {
    try{
        await connectDb()
        const { first_name, last_name, email, phone, password } = req.body
        
        if(!first_name || !last_name || !email || !phone || !password){
            return res.status(400).json({ message: "Please fill in all the fields." })
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({ message: "Please Add a valid email address." })
        }
        if(!validator.isMobilePhone(phone)){
            return res.status(400).json({ message: "Please Add a valid phone number." })
        }

        //Check if email exists in DB:
        const userFound = await UserModel.findOne({ email })
        if(userFound){
            return res.status(400).json({ message: "This email address already exists."})
        }

        //Check the length of the password:
        if(password.length < 8){
            return res.status(400).json({ message: "Password must be at least 8 characters." })
        }

        //Hashing user Password:
        const hashPassword = await bcrypt.hash(password, 12)

        //Register (Add user to DB):
        const newUser = await UserModel.create({
            name: `${first_name + " " + last_name}`,
            email,
            phone,
            password: hashPassword
        })

        /*
            jwt.sign - חותם ויוצר טוקן
            {id} - המידע המאוחסן בתוך הטוקן (המזהה של המשתמש)
            {expiresIn: '2d'} - תוקף הטוקן
        */
        const activationToken = jwt.sign({ id: newUser._id.toString() }, process.env.JWT_KEY!, {expiresIn: '2d'})

        const url = `${process.env.NEXTAUTH_URL}/activate/${activationToken}`

        await sendMail(
            newUser.email,
            newUser.name,
            "",
            url,
            "Activate your account - Hola Chat App",
            activateTemplateEmail
        )

        res.status(201).json({
            status: "success",
            message: "Register success! Please activate your account to connect.",
            newUser 
        })

    }catch(error){
        res.status(500).json({ message: (error as Error).message })
    }
}



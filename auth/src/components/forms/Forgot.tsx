import * as React from 'react'
import Input from '../inputs/Input'
import { FiMail, FiLock } from "react-icons/fi"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SlideButton from "../buttons/SlideButton"
import { toast } from 'react-toastify'
import Link from 'next/link'
import axios from 'axios'

//-----Form Schema (with Zod)
const FormSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

//-----Type Form Schema
type FormSchemaType = z.infer<typeof FormSchema>

//-----ForgotForm Comp.
const ForgotForm: React.FC = () => {

    const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm<FormSchemaType>({resolver: zodResolver(FormSchema)})

    const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
        try{
            const { data } = await axios.post("/api/auth/forgot", {
                email: values.email
            })
            toast.success(data.message)
        }catch(error: any){
            toast.error(error.response.data.message)
        }
      } 

    return (
        <div className="w-full px-12 py-4 mt-8">
            <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">Forgot password</h2>
            <p className="text-center text-sm text-gray-600 mt-2">
                Sign in instead &nbsp;
                <Link href="/auth" className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">Sign in</Link>
            </p>
            <form className="my-8 text-sm" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    name="email"
                    label="Email"
                    type="email"
                    icon={<FiMail/>}
                    placeholder="Enter Your Email"
                    register={register}
                    error={errors?.email?.message}
                    disabled={isSubmitting}    
                />
                <SlideButton
                    type="submit"
                    text="Send Email"
                    slide_text="Secure"
                    icon={<FiLock />}
                    disabled={isSubmitting}
                />
            </form>
        </div>
    ) 
}

export default ForgotForm
import * as React from 'react'
import Input from '../inputs/Input'
import { FiLock } from "react-icons/fi"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import SlideButton from "../buttons/SlideButton"
import { toast } from 'react-toastify'
import Link from 'next/link'
import axios from 'axios'
import zxcvbn from 'zxcvbn'

//-----Interface
interface IResetFormProps {
    token: string
}

//-----Form Schema (with Zod)
const FormSchema = z.object({
    password: z.string()
        .min(8, "Your password must be at least 8 characters")
        .max(52, "Your password must be less than 52 characters"),
confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
    message: "Password doesn't match",
    path: ["confirm_password"],
})

//-----Type Form Schema
type FormSchemaType = z.infer<typeof FormSchema>

//-----ForgotForm Comp.
const ResetForm: React.FC<IResetFormProps> = (props) => {

    const { token } = props

    const [passwordScore, setPasswordScore] = useState(0)

    const {register, handleSubmit, watch, reset, formState: { errors, isSubmitting }} = useForm<FormSchemaType>({resolver: zodResolver(FormSchema)})

    const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
        try{
            const { data } = await axios.post("/api/auth/reset", {
                password: values.password,
                token
            })
            reset()
            toast.success(data.message)
        }catch(error: any){
            toast.error(error.response.data.message)
        }
    }

    const validatePasswordStrength = () => {
        let password = watch().password
        return zxcvbn(password ? password : "").score
    }
    useEffect(() => {
        setPasswordScore(validatePasswordStrength())
    }, [watch().password])

    return (
        <div className="w-full px-12 py-4 mt-8">
            <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">Reset password</h2>
            <p className="text-center text-sm text-gray-600 mt-2">
                Sign in instead &nbsp;
                <Link href="/auth" className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">Sign in</Link>
            </p>
            <form className="my-8 text-sm" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    name="password"
                    label="Password"
                    type="password"
                    icon={<FiLock/>}
                    placeholder="Enter Your Password"
                    register={register}
                    error={errors?.password?.message}
                    disabled={isSubmitting}
                />
                {
                    watch().password?.length > 0 && (
                        <div className='flex mt-2'>
                            {
                                Array.from(Array(5).keys()).map((span, i) => (
                                    <span className="w-1/5 px-1" key={i}>
                                        <div className={`h-2 rounded-xl b ${
                                            passwordScore <= 2 
                                            ? "bg-red-400" 
                                            : passwordScore < 4
                                            ? "bg-yellow-400"
                                            : "bg-green-500"
                                        }`}></div>
                                    </span>
                                ))
                            }
                        </div>
                    )
                }
                <Input
                    name="confirm_password"
                    label="Confirm Password"
                    type="password"
                    icon={<FiLock />}
                    placeholder="Enter Your Password"
                    register={register}
                    error={errors?.confirm_password?.message}
                    disabled={isSubmitting}
                />
                <SlideButton
                    type="submit"
                    text="Change Your Password Now"
                    slide_text="Secure"
                    icon={<FiLock />}
                    disabled={isSubmitting}
                />
            </form>
        </div>
    ) 
}

export default ResetForm
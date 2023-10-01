import * as React from 'react'
import Input from '../inputs/Input'
import { CiUser } from "react-icons/ci"
import { FiMail, FiLock } from "react-icons/fi"
import { BsTelephone } from "react-icons/bs"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import validator from "validator"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import zxcvbn from "zxcvbn"


//-----Form Schema (with Zod)
const FormSchema = z.object({
    first_name: z.string()
        .min(2, "First name must be atleast 2 characters")
        .max(32, "First name must be less than 32 characters")
        .regex(new RegExp("^[a-zA-z]+$"), "No special characters such as:<>/%#&?', are allowed"),
    last_name: z.string()
        .min(2, "Last name must be atleast 2 characters")
        .max(32, "Last name must be less than 32 characters")
        .regex(new RegExp("^[a-zA-z]+$"), "No special characters such as:<>/%#&?', are allowed"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().refine(validator.isMobilePhone, { message: "Please enter a valid phone number"}),
    password: z.string()
        .min(8, "Your password must be at least 8 characters")
        .max(52, "Your password must be less than 52 characters"),
        confirm_Password: z.string(),
}).refine((data) => data.password === data.confirm_Password, {
    message: "Password doesn't match",
    path: ["confirm_Password"],
})

//-----Type Form Schema
type FormSchemaType = z.infer<typeof FormSchema>

//-----RegisterForm Comp.
const RegisterForm: React.FunctionComponent = () => {
    const [passwordScore, setPasswordScore] = useState(0)

    const {register, handleSubmit, watch, formState: { errors, isSubmitting }} = useForm<FormSchemaType>({resolver: zodResolver(FormSchema)})

    const onSubmit = (data: any) => console.log(data)

    const validatePasswordStrength = () => {
        let password = watch().password
        return zxcvbn(password ? password : "").score
    }
    useEffect(() => {
        setPasswordScore(validatePasswordStrength())
    }, [watch().password])

    return (
        <div className="w-full px-12 py-4">
            <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">Sign Up</h2>
            <p className="text-center text-sm text-gray-600 mt-2">
                You already have an account? &nbsp;
                <Link href="/auth" className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">Sign In</Link>
            </p>
            <form className='my-8 text-sm' onSubmit={handleSubmit(onSubmit)}>
                <div className="gap-2 md:flex">
                    <Input
                        name="first_name"
                        label="First name"
                        type="text"
                        icon={<CiUser/>}
                        placeholder="Enter Your First Name"
                        register={register}
                        error={errors?.first_name?.message}
                        disabled={isSubmitting}
                    />
                    <Input
                        name="last_name"
                        label="Last name"
                        type="text"
                        icon={<CiUser/>}
                        placeholder="Enter Your Last Name"
                        register={register}
                        error={errors?.last_name?.message}
                        disabled={isSubmitting}
                    />
                </div>
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
                    <Input
                        name="phone"
                        label="Phone Number"
                        type="text"
                        icon={<BsTelephone/>}
                        placeholder="Enter Your Phone Number"
                        register={register}
                        error={errors?.phone?.message}
                        disabled={isSubmitting}
                    />
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
                        name="confirm_Password"
                        label="Confirm password"
                        type="password"
                        icon={<FiLock />}
                        placeholder="Enter Your Password"
                        register={register}
                        error={errors?.confirm_Password?.message}
                        disabled={isSubmitting}
                    />
                <button type='submit'>Submit</button>
            </form>
        </div>
    ) 
}

export default RegisterForm
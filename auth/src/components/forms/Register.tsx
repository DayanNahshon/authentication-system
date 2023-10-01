import * as React from 'react'
import Input from '../inputs/Input'
import {CiUser} from "react-icons/ci"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";


//-----Form Schema
const FormSchema = z.object({
    first_name: z.string()
        .min(2, "First name must be atleast 2 characters")
        .max(32, "First name must be less than 32 characters")
        .regex(new RegExp("^[a-zA-z]+$"), "No special characters such as:<>/%#&?', are allowed"),
})

//-----Type Form Schema
type FormSchemaType = z.infer<typeof FormSchema>

//-----RegisterForm Comp.
const RegisterForm: React.FunctionComponent = () => {
    const {register, handleSubmit, watch, formState: { errors, isSubmitting }} = useForm<FormSchemaType>({resolver: zodResolver(FormSchema)})
    const onSubmit = (data: any) => console.log(data)
    console.log(watch())

    return (
        <form className='my-8 text-sm' onSubmit={handleSubmit(onSubmit)}>
            <div className='gap-2 md:flex'>
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
                <button type='submit'>Submit</button>
            </div>
        </form>
    ) 
     
}

export default RegisterForm

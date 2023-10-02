import mongoose, { Schema } from 'mongoose'

// //Interface
export interface IUser extends Document{
    name: string,
    email: string,
    image: string,
    password: string,
    emailVerified: boolean,
    phone: string,
    role: string,
}

//Scheme
export const UserSchema = new Schema<IUser>(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true, //ערך ייחודי
        },
        image:{
            type: String,
            default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fillustrations%2Ficon-user-male-avatar-business-5359553%2F&psig=AOvVaw3YJmucH1a7snQC4keSXVh4&ust=1696253960732000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIjpx8f81IEDFQAAAAAdAAAAABAE",
        },
        password:{
            type: String,
            required: true,
            minlength: 8,
        },
        emailVerified:{
            type: Boolean,
            default: false,
        },
        phone: {
            type: String,
            required: true,
          },
        role: {
            type: String,
            default: "user"
        },
    },
    { timestamps: true } //אוטומטית updatedAt-ו createdAt מוסיף שדות
)

//Model
const UserModel = mongoose.models.User || mongoose.model("User", UserSchema)

export default UserModel
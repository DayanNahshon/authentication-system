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
            default: "https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_1280.png",
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
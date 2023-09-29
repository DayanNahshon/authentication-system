import mongoose from "mongoose"

if (!process.env.MONGODB_URI) {
    throw new Error("Please add the databse url in .env file");
}

const uri: string|undefined = process.env.MONGODB_URI

if(uri){
    mongoose.connect(uri)
    .then(() => {
        console.log("DB Connected Successfully")
    }).catch(err => console.log(err))
}else{
    console.log("DB Connecion Failed")
}


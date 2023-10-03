import mongoose from "mongoose"

if (!process.env.MONGODB_URI) {
    throw new Error("Please add the databse url in .env file")
}

const DATABASE_URL: string = process.env.MONGODB_URI

let globalWithMongoose = global as typeof globalThis & {
    mongoose: any
}

let cached = globalWithMongoose.mongoose

if (!cached) {
    cached = globalWithMongoose.mongoose = { conn: null, promise: null }
}

async function connectDb() {
    if (cached.conn) {
      return cached.conn
    }
    if (!cached.promise) {
        const options = {
            bufferCommands: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
        cached.promise = mongoose
            .connect(DATABASE_URL, options)
            .then((mongoose) => {
                console.log("Connection has been established.")
                return mongoose
            })
            .catch((error) => {
                console.log(error as Error)
            })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default connectDb


// if(uri){
//     mongoose.connect(uri)
//     .then(() => {
//         console.log("DB Connected Successfully")
//     }).catch(err => console.log(err))
// }else{
//     console.log("DB Connecion Failed")
// }


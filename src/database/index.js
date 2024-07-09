import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/blogs`);
        console.log(connectionInstance.connection.host);
    } catch (error) {
        console.log(`Couldnt Connect to mongoDB, error: ${error}`);
    }
}

export default connectToDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DB_CONNECTION || "mongodb+srv://lucasgatto:tDM2EhNHbMihAdV4@cluster0.1npyj6s.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

const connectToMongo = async () => {
    await mongoose.connect(uri);
    return mongoose.connection;
};

export const getMongoClient = () => mongoose.connection.getClient();
export default connectToMongo;




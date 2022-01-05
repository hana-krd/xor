import { MongooseModuleOptions } from "@nestjs/mongoose";

export const mongoOption: MongooseModuleOptions = {
    uri:process.env.MONGO_URI
}
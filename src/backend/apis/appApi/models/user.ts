import mongoose, {Model, Schema, Document} from "mongoose"

interface IUser extends Document {
    name: string,
    accounts: number[];
}

const userSchema:Schema = new Schema<IUser>({
    name: {type: String, required:true},
    accounts: {type: [Number], required:true}
})
//? Research TypeScript Generics and Extending Mongoose Document Interfaces
//? Why do we have to extend Document why does __id and __v matter?
const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema, "user"); 

export default UserModel;

import mongoose from "mongoose";
import * as SchemaTypes from "../types/schema.types"

const userSchema = new mongoose.Schema<SchemaTypes.IUser>({
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

const UserModel = mongoose.model("user", userSchema);
export default UserModel;

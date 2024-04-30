import { timeStamp } from "console";
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
});

const contactInfoSchema = new mongoose.Schema({
    phoneNumber: Number,
    address: addressSchema,
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    connectInfo: {
        type: contactInfoSchema
    },
    description: {
        type: String,
    },
    likes: {
        type: [String],
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);


export default User;
import mongoose from "mongoose";
import bcrpyt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        name: {type : String, required : true},
        email :{type : String,required : true,unique : true},
        password : {type : String,required : true},
        role : {
            type : String,
            enum : ["bidder","seller","admin"],
            default : "bidder"
        },
    },
    {timestamps:true}
)

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrpyt.genSalt(10);
    this.password =await bcrpyt.hash(this.password,salt);
    next();
})

userSchema.method.matchPassword = async function (enteredPassword) {
    return await bcrpyt.compare(enteredPassword,this.password);
};

export default mongoose.model("User",userSchema);
import mongoose from "mongoose";
import bcrypt from "bcrypt"

const USchema = new mongoose.Schema({
    name:{
        type : String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        select:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
 },
 {
    timestamps: true
 }
 )
 


USchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
})

export const User = mongoose.model('User', USchema);
export default User;

import mongoose from "mongoose";

const MSchema = new mongoose.Schema({
    title:{
        type : String,
        require: true
    },
    desc:{
        type: String
    },
    gener:{
        type:String
    },
    image:{
        type:String
    },
    imgTitle:{
        type:String
    },
    video:{
        type:String
    },
    limit:{
        type:String
    },
    isSeries:{
        type:Boolean,
        default:false
    }
})

export const Movie = mongoose.model('Movie', MSchema);
export default Movie;
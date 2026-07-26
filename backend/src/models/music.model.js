import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
    uri:{
        type: String,
        unique: true,
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    artist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const musicModel = mongoose.model("Music", musicSchema);
export default musicModel;
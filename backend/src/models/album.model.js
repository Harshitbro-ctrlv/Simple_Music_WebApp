import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    musics:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music'
    }],
    artist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const albumModel = mongoose.model("Album", albumSchema);
export default albumModel;
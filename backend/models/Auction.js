import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
    {
        title : {type :String,required : true},
        description : {type : String,required : true},
        startingPrice : {type :Number, required : true},
        currentPrice : {type : Number, default : 0},
        startTime : {type : Date, required :true},
        endTime : {type : Date,required : true},
        seller : {type : mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        bidHistory : [
            {
                bidder : {type :mongoose.Schema.Types.ObjectId,ref : "User"},
                amount : Number,
                time : {type : Date ,default : Date.now},
            },
        ],
        status : {
            type : String,
            enum : ["upcoming","active","ended"],
            default : "upcoming",
        }   
    },
    {timestamps : true},
)

export default mongoose.model("Auction",auctionSchema)
const mongoose = require('mongoose');

async function mongodbConnect(){
    try{
        await mongoose.connect("mongodb://localhost:27017/paytm", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("monogodb connected");
    }catch(err){
        console.error("there was an error connecting to mongodb", err)
    }
}


const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    firstname: {
        type : String,
        required: true},
    lastname: {
        type : String,
        required: true
    }
},
{
    collection: 'users' 
});

const AccountSchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    balance : { 
        type : Number,
        required : true
    }
},{
    collection: 'accounts' 
});

const User = mongoose.model('User', UserSchema);
const Account = mongoose.model('Account', AccountSchema);

module.exports = {User, Account, mongodbConnect};
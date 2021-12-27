const mongoose = require("mongoose");

const CoinSchema = new mongoose.Schema({
    name: {
        type: String
        
    },
    buy: {
        type: String,
        
    },
    sell: {
        type: String,
        
    },
    high: {
        type: String,
    
    },
    last: {
        type: String,
        
    },
    low: {
        type: String,
        
    },
});



module.exports = mongoose.model("Coin", CoinSchema);

const mongoose = require('mongoose');
// const mongoose = require("../db/database");
mongoose.connection.dropCollection('patrons', function(err){
    if(err){
        if (err.code === 26){
            console.log("partons does not exist");
        } else {
            throw err;
        }
    } else {
        console.log("connected um successfully");
    }
});
mongoose.connection.dropCollection('galleries', function(err){
    if(err){
        if (err.code === 26){
            console.log("galleries does not exist");
        } else {
            throw err;
        }
    } else {
        console.log("connected um successfully");
    }
});
// var schema = mongoose.Schema;
let userschema = new mongoose.Schema({
    // _id: String,
      
    username :{
        type: String,
    },
    password :String,
    liked: Array,
    reviewed: Array,
    follows: Array,
    followers: Array,
    notifications: Array,
    workshops: Array,
    enrolled:Array,
    artworkPublished:Array,
    isArtist: Boolean

});
let user = mongoose.model('patrons', userschema)

// const mongoose = require("../db/database");

let artschema = new mongoose.Schema({
    // _id: String,
      
    name : String,
    artist :String,
    year: Number,
    category: String,
    medium: String,
    likes: Number,
    reviews: Array,
    description: String,
    image: String
});
let art = mongoose.model('gallery', artschema)
let userArtist  = require('../config');//
	console.log(userArtist.length)
	for(let a = 0; a< userArtist.length; a++){
		 user.insertMany(userArtist[a])
	}

	let theArt  = require('../gallery');//
	console.log(theArt.length)
	for(let a = 0; a< theArt.length; a++){
		 art.insertMany(theArt[a])
	}
module.exports = {user, art}
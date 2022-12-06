//required
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const pug = require('pug');
const path = require('path');
const app = express();
let router = express.Router();
let users = {};
const {user, art} = require('./models/database-initializer.js');
const session = require('express-session');
const { fstat } = require('fs');

app.set("view engine", "pug");
app.set("views", "views");
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//session initalizer
app.use(session({ 
	secret: 'some secret here', 
	resave: true,
	saveUninitialized: true
  }));  

//connect database
mongoose.connect("mongodb://127.0.0.1:27017", { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err, client) {
	if (err) {
		return;
	}
	
});

//if the user goes to the home page or the register page
//they shou7ld be taken to regiter page
app.get(['/', '/register'], async(req, res)=> {
    //check if someone is alreadu loggedin in this session
    console.log(req.session);
    if(req.session.loggedin){
        let userinfo = {}
        //get the info of this current user and renderit to their home page
       let sendart = await art.find({});
        userinfo["username"]= req.session.userinfo.username;
        userinfo["password"]= req.session.userinfo.password;
        userinfo["isArtist"]= req.session.userinfo.isArtist;
        userinfo["arts"] = sendart;
        res.render("pages/userInfo", {userinfo});
    }
    else{
        //else render the error page
        res.render("pages/register");
    }
});
//get requests for pages

app.get("/userInfo", (req, res)=> { res.render("pages/userInfo", {users}); 
});
app.get("/query", (req, res)=> { res.render("pages/query"); 
});
app.get("/search", (req, res)=> { res.render("pages/search"); 
});
app.get("/results", (req, res)=> { res.render("pages/results"); 
});
app.get("/error", (req, res)=> { res.render("pages/error"); 
});

app.get("/login", async(req, res)=> {
    //check if a user was logged in somewhere
    if(req.session.loggedin && req.session.loggedin != undefined){
        let userinfo = {}
        let sendart = await art.find({});
        userinfo["username"]= req.session.userinfo.username;
        userinfo["password"]= req.session.userinfo.password;
        userinfo["isArtist"]= req.session.userinfo.isArtist;
        userinfo["arts"] = sendart;
        res.render("pages/userInfo", {userinfo});
        
    }
    else {
        res.render("pages/login");
    }
});

//get request for when the user wants to log outn
app.get("/logout", (req, res)=> {
    req.session.isArtist = false;
    req.session.userinfo = '';
    req.session.loggedin = undefined;
    req.session.username = undefined;
     res.render("pages/register"); });

//get request for a user's home page
app.get("/loginn/:username", async(req, res)=> {
    let valid = true;
    let userinfo = {};
    //get th user's name
    let sentUser = JSON.stringify(req.params.username);
    let stop = sentUser.length-1;
    sentUser = sentUser.slice(2, stop);
    let userpass =  req.body.password;
    //check if the user is acrually logged in
    if(req.session.loggedin == sentUser && req.session.loggedin != undefined){ 
    let results = await user.findOne({username : sentUser})
    let sendart = await art.find({});
    //look for the user's info in the database 
    if (results != null){
        valid = true;
        req.session.loggedin = sentUser;
        req.session.userinfo = results;
        req.session.username = results.username
        req.session.isArtist = results.isArtist;
        userinfo["username"]= results.username;
        userinfo["password"]= results.password;
        userinfo["isArtist"] = results.isArtist;
        userinfo["arts"] = sendart;
        //render the home page with the user's info
        res.render("pages/userInfo", {userinfo})

    }

    //if the user is not loggedin, display the error page
    } else {
        res.render("pages/error")
    }
});

//put request for when a user wants to become an artist
app.put("/login/artistprofile/:username", async(req, res)=> {
    let sentUser = JSON.stringify(req.params.username);
    let stop = sentUser.length-1;
    sentUser = sentUser.slice(2, stop);
    let check = {};
   let results = await user.findOne({username : sentUser});
   //first check if the user has uploaded an artwork,
   //if they havent send an erro
    if (results.artworkPublished.length == 0){
        check["val"] = true;
        res.status(404).send();
        //else if the user was logged in as a patron make them 
        //an artist and vice versa
    } else if(results.artworkPublished.length != 0){
        if(results.isArtist == false){
            results.isArtist = true
            req.session.isArtist = true
            results.save();
            
        }else if(results.isArtist == true){
            results.isArtist =  false;
            req.session.isArtist = false
            results.save();
        }
        res.status(200).send();
    }   
});

//get the artwork liked by the user
app.get("/login/:username/liked", async(req, res)=> {
    let valid = true;
    let likedArt = {}
    let actualArt = []
    let count = 0;
    //i spliced because when i tried to get the username from the params, it had a colon in it
    let sentUser = req.params.username 
    let stop = sentUser.length;
    sentUser = sentUser.slice(1, stop);

    //check if the user is logged in
    if(req.session.loggedin == sentUser && req.session.loggedin != undefined){
        //get the user's info from the database
        let resuer = await user.findOne({username : sentUser});
        if (resuer != null){
            valid = true;
            req.session.username = resuer.username
            likedArt = {"username" : resuer.username, "isArtist": resuer.isArtist, "art": []};
            //check if the user has actually liked something
            if (resuer.liked.length >0 ){
                for(let i = 0; i< resuer.liked.length; i++){
                    count++;
                    //get the art liked from the art collection
                    let resart = await art.findOne({name: resuer.liked[i]});
                    actualArt.push(resart);
                    likedArt["art"] = actualArt
                } 
            } else {
                likedArt["art"] = [];
            }
        }
        // render the page for the liked art
        res.render("pages/liked", {likedArt});
    //if the user is not logged in then send the error
    }else {
        res.render("pages/error")
    }
});

//get request to get what a user has reviewed
app.get("/login/:username/reviewed", async(req, res)=> {
    //get the id
    let likedArt = {}
    let actualArt = []
    //get the username
    let sentUser = req.params.username 
    let stop = sentUser.length;
    sentUser = sentUser.slice(1, stop);
    //check if the user is logged in
    if(req.session.loggedin == sentUser && req.session.loggedin != undefined){
    //get the user's info from the database
    let resuer = await user.findOne({username : sentUser});
    if (resuer != null){
        req.session.username = resuer.username
        likedArt["username"] = resuer.username
        likedArt["isArtist"] = resuer.isArtist;
        likedArt["art"] = actualArt;
        //loop though what the user reviewed and add it to the object to be sent to the pug file
        for(let i = 0; i< resuer.reviewed.length; i++){        
            let resart = await art.findOne({reviews: resuer.reviewed[i]});
            actualArt.push(resart);
            likedArt["art"] = actualArt

        } 
    }
    //render the page with the object
    res.render("pages/reviewed", {likedArt});
    //if the user is not logged in send the error page
    }else {
        res.render("pages/error")
    }
});

//get reques to gat a user's notifications
app.get("/login/:username/notifications", async(req, res)=> {
     
    let likedArt = {}
    //get the username
    let sentUser = req.params.username //changa
    let stop = sentUser.length;
    sentUser = sentUser.slice(1, stop);
    if(req.session.loggedin == sentUser && req.session.loggedin != undefined){
    //get the user's info from the database
    let resuer = await user.findOne({username : sentUser});
    if (resuer != null){
        //put the user's info in an object to be sent
        req.session.username = resuer.username
        likedArt["username"] = resuer.username
        likedArt["isArtist"] = resuer.isArtist;
        likedArt["notifications"] = resuer.notifications;
    }
    //render the see Notif page and send the object
    res.render("pages/seeNotif", {likedArt});
    //if the user is not logged in send the error page
    }else {
        res.render("pages/error")
    }
});

//get request for the page to upload art work
app.get('/:username/uploadart', async(req, res)=> {
    let check = {}
    check['username'] = req.session.username
    //chck if the user is logged in
    if(req.session.loggedin == req.session.username && req.session.loggedin != undefined) {
        //check if the user has never uploaded anything
        if (req.session.userinfo.artworkPublished.length == 0){
            check["val"] = false;
        } else{
            check["val"] = true;
        }
        
        res.render("pages/newart", {check})
    } else{
        res.render("pages/error");
    }
})

//get request for the search page
app.get('/:username/search', async(req, res)=> {

    //check if th euser is logged in
    if(req.session.loggedin == req.session.username && req.session.loggedin != undefined) {
        let stuff = {}
        stuff['username'] = req.session.username
        stuff['isArtist'] = req.session.isArtist
        //render the the search page
        res.render("pages/search", {stuff})
    } else{
        res.render("pages/error");
    }
})

//get request for the page to host a workshop
app.get('/:username/addworkshop', async(req, res)=> {
    let check = {}
    check['username'] = req.session.username
    if(req.session.loggedin == req.session.username && req.session.loggedin != undefined) {
        //render the new workshop page        
        res.render("pages/newWorkshop", {check});
    //if the user is not logged in render the error page
    } else{
        res.render("pages/error");
    }
});

//get request for the following page
app.get("/login/:username/following", async(req, res)=> {
    let following = {}
    let followingInfo= []
    let sentUser = req.params.username 
    let stop = sentUser.length;
    //slicing because i keep getting colons in the username
    sentUser = sentUser.slice(1, stop);
    //check if the user is logged in
    if(req.session.loggedin == sentUser && req.session.loggedin != undefined) {
        //get the user's info from the database
        let userInf = await user.findOne({username : sentUser})
        if (userInf != null){
            //put the user's following into and object
            for (let v = 0; v< userInf.follows.length; v++){
                let inf = await user.findOne({username : userInf.follows[v]})
                followingInfo.push(inf);
            }
            //render the following page with the object
            following["username"] = userInf.username
            following["isArtist"] = userInf.isArtist
            following["list"] = followingInfo;
        
            res.render("pages/following", {following})
        }
    //render the error page if the user is not logged in
    } else {
        res.render("pages/error");
    }
   
});

//get request for the review page of a paticular artwork
app.get("/review/:artname", async(req, res)=> {
    if(req.session.loggedin == req.session.username && req.session.loggedin != undefined) {

        let artName = req.params.artname;
        let revies  = [];
        artName = artName.slice(1);
        artName = artName.replaceAll("-", ' ');
       // console.log("see",artName)
        
        let stuff;
        let results = await art.findOne({name : artName})
        stuff= {"username" : req.session.username, "isArtist":req.session.isArtist , "art": results};
        res.render("pages/seeReview", {stuff: stuff});

    }else{
        res.render("pages/error")
    }
});

//get request for the serach page
app.get("/:username/search", async(req, res)=> {
    //check if the user is logged in
    if(req.session.loggedin == req.session.username && req.session.loggedin != undefined) {
        let artName = req.params.artname;
        artName = artName.replaceAll("-", ' ');
        
        let stuff= {  "username": 'hello', "artwork": {}};
        let results = await art.findOne({name : artName})
        stuff= {"username" : req.session.username, "isArtist":req.session.isArtist , "artwork": results}
        res.render("pages/search", {stuff: stuff});

    //render the error page if the user is not logged in        
    }else{
        res.render("pages/error")
    }
});

//get request for an artwork page
app.get("/artwork/:artname", async(req, res)=> {
    console.log(req.session.loggedin, "test", req.session.username, "ifdkvo;fnkl")
    if(req.session.loggedin == req.session.username && req.session.loggedin != undefined ) {
        //get the art name
        let artName = req.params.artname;
        //remove the the colons
        if (artName.indexOf(":") == 0){
            artName = artName.slice(1);

        }
        //replace the dashes with spaces
        artName = artName.replaceAll("-", ' ');
        //create the object we send to the pug file
        let stuff= {  "username": 'hello', "artwork": []};
        //find the artwork in the database
        let results = await art.findOne({name : artName});
        stuff= {"username" : req.session.username, "isArtist":req.session.isArtist , "artwork": results}
        
        res.render("pages/artData", {stuff: stuff});
    //if the user is not logged in render the error page
    } else{
        res.render("pages/error")
    }
});

//get request to see an artist's page
app.get("/artist/:name", async (req, res, next)=> {
    //check if the user is loggedin
    if(req.session.loggedin == req.session.username && req.session.loggedin != undefined) {
        let name = req.params.name;
        let artuser = name.replaceAll(" ", '-');
        name = name.replaceAll("-", ' ');
        let stuff= {};
        let artistdetails = await user.findOne({username : artuser});
        let details = artistdetails
        let results = await art.find({artist : name})
        
        if (results != null){
            valid = true;
            for(let x = 0; x< results.length; x++){
                stuff[x] = { "followers": artistdetails.followers.length, "details": details,"artInfo":results[x], "username":req.session.username, "isArtist": req.session.isArtist};
            }
        } 
        res.render("pages/artistInfo", {stuff})
        
    } else{
        res.render("pages/error")
    }
});

//put request for when a user likes an artwork
app.put("/like", async(req, res)=> {
    let likeFlag = false;
    let theName = req.body.name;
    let result = await user.findOne({username: req.session.username})
    if ((result.liked).includes(theName)){
        likeFlag = true;
    }
    if(!result.artworkPublished.includes(theName)){
        if (!likeFlag) {
            //find the artwork liked or unliked
            let results= await art.findOne({name : theName})
            results.likes = results.likes + 1;
            results.save();
            result.liked.push(theName);
            result.save();
            res.send(true);
      

        } else {
            let results = await art.findOne({name : theName})
            results.likes = results.likes - 1;
            results.save();
            let removeIndex = result.liked.indexOf(theName)
            result.liked.splice(removeIndex, 1);
            result.save();
            res.send(true);
        }
    }
});



app.put("/deletereview", (req, res)=> {
   // console.log(req.body, "helll")
    let theName = req.body.name;
    let review = req.body.review;
    let artname = req.body.artname;
    let compare = theName+":"+review;
    //// console.log(review);
    let a;
    // let test = theName.replaceAll(' ', '-');
    //// console.log(theName);
    //// console.log(req.session);
    if (theName == req.session.username){
    user.findOne({username: req.session.username}).exec(function (err, result) {
        for (let b = 0; b < result.reviewed.length; b++){
            if (result.reviewed[b] == compare){
                result.reviewed.splice(b,1);
                result.save();
                break;
            }
        }
        // if ((result.reviewed).includes(review)){
        
        // }
        //// console.log(likeFlag, "likeFlag");
  
    //  // console.log(theName, "heloooo")
    art.findOne({name : artname}).exec(function (err, val) {
        //// console.log(val, "hello")
        if(theName = req.session.username){
            for (let x = 0; x < val.reviews.length; x++){
                if (val.reviews[x] == compare){
                   // console.log(val.reviews, "hello")
                    val.reviews.splice(x,1);
                   // console.log(val.reviews, "hello")
                    val.save();
                    // res.send(true);
                    break;
                }
                // res.send(true);
            }
        //     fs.readFile('./gallery.json', function writeCallback(err, val){
        //         if (err){
        //             throw err;
        //         }
        //         let obj = JSON.parse(val);
        //         for (let i = 0; i< obj.length; i++){
        //             if (obj[i].name ==theNartnameame){
        //                 console.log(obj[i], "chectng values =================");
        //                 obj[i].reviews.push(review)
        //             } 
        //             fs.writeFile('./gallery.json', JSON.stringify(obj), err=> {
        //                 if (err){
        //                     throw err;
        //                 }
        //             })
                
        //         }
           
           
        // })
            res.send(true);
        }
       
        
       
    });

    });
} else{
    res.send("you cannot delete this comment")
}
});


app.put("/review", (req, res)=> {
    let likeFlag = false;
   // console.log(req.body, "helll")
    let theName = req.body.artname;
    let review = req.session.username + ":" + req.body.review;
   // console.log(review);
    let a;
    user.findOne({username: req.session.username}).exec(function (err, result) {
        if ((result.reviewed).includes(theName)){
            likeFlag = true;
        }
       // console.log(likeFlag, "likeFlag");
  
     // console.log(theName, "heloooo")
    art.findOne({name : theName}).exec(function (err, val) {
       // console.log(val, "hello")
        val.reviews.push(review)
        val.save();
        //// console.log(req.session.username, "thsi sis th ")
       
        user.findOne({username: req.session.username}).exec(function (err, result) {
            a = result.liked
           // console.log(result.liked, "a")
            // a.push(theName)
            let dict = {theName};
            result.reviewed.push(review);
            result.save();
           // console.log(result.reviewed)

        });
        // fs.readFile('./gallery.json', function writeCallback(err, val){
        //     if (err){
        //         throw err;
        //     }
        //     let obj = JSON.parse(val);
        //     for (let i = 0; i< obj.length; i++){
        //         if (obj[i].name ==theName){
        //             console.log(obj[i], "chectng values =================");
        //             obj[i].reviews.push(review)
        //         } 
        //         fs.writeFile('./gallery.json', JSON.stringify(obj), err=> {
        //             if (err){
        //                 throw err;
        //             }
        //         })
            
        //     }
       
       
        //  })
        res.send(true);
      
    });

    });

});

app.put("/enroll", async(req, res)=> {
    let workshopname = req.body.workshop;
    let artist = req.body.artist;
    let userstuff = await user.findOne({username: req.session.username});
    userstuff.notifications.push("you have now enrolled in "+ workshopname+ " by " + artist);
    if (userstuff.enrolled.indexOf(workshopname) < 0){
        userstuff.enrolled.push(workshopname)
        res.status(200).send();
    } else{
       let index = userstuff.enrolled.indexOf(workshopname)
       userstuff.enrolled.splice(index, 1);
       res.status(404).send();
   
    }
});

app.put("/follow", async(req, res)=> {
    let followFlag = false;
    let artistName = req.body.name;
    let a;
    // let test = theName.replaceAll(' ', '-');
   // console.log(artistName);
    //// console.log(req.session);
    let checkUser = await user.findOne({username: req.session.username});
    let checkArtist = await user.findOne({username: artistName});
   // console.log(checkUser)
    if ((checkUser.follows).includes(artistName)){
        followFlag = true;
    }
    if (!followFlag){
        checkUser.follows.push(artistName);
        checkArtist.followers.push(req.session.username)
        checkArtist.save();
        checkUser.save();
       // console.log(checkArtist, "artist shit");
       // console.log(checkUser, "user shit");
        res.send(true);
    } else if (followFlag == true) {
        for (let v = 0; v< checkUser.follows.length; v++){
           // console.log(checkUser.follows)
            if (checkUser.follows[v] == artistName){
                (checkUser.follows).splice(v, 1);
                checkUser.save();
            }
        }
        for (let v = 0; v< checkArtist.followers.length; v++){
            if (checkArtist.followers[v] == req.session.username){
                (checkArtist.followers).splice(v, 1);
                checkArtist.save();
            }
        }
        
        
        res.send(true);
    }


});



app.get("/search/:searchstuff" , async(req, res)=> { 
    console.log(req.session.loggedin, "hellll", req.session.username, "oins search");
    if (req.session.loggedin == req.session.username && req.session.loggedin != undefined){
    let search = req.params.searchstuff;
    search = search.slice(1)
   // console.log(search);
    let searchResult = {};
    let split = search.split('-');
    let inn = split[0];
    let value = split[1].replaceAll("^", " ");
    //// console.log(input);
   // console.log(value);
   
    searchResult["username"] = req.session.username;
    searchResult["isArtist"] = req.session.isArtist;
    if (inn == 'category'){
        searchResult["para"] = "category";
        searchResult["value"] = value
        art.find({category : value}).exec(function (err, results) {
            searchResult["art"] = results;
           // console.log( "here",searchResult, "here");
            res.render("pages/query", {searchResult})
            // res.format({
            //     "application/json": () => {res.status(200).json(searchResult)},
            //     "text/html": () => {res.render("pages/login")},
            
            // });
       
        });
    } else if (inn == "medium"){
        searchResult["para"] = "medium";
        searchResult["value"] = value
        art.find({medium : value}).exec(function (err, results) {
            searchResult["art"] = results;
            //// console.log( "here",searchResult, "here");
            res.render("pages/query", {searchResult})
            // res.format({
            //     "application/json": () => {res.status(200).json(searchResult)},
            //     "text/html": () => {res.render("pages/login")},
            
            // });
       
        });
    }
} else {
    res.render("pages/error")
}
    // res.format({
    //     "application/json": () => {res.status(200).json(searchResult)},
    //     "text/html": () => {res.render("pages/login")},
    
    // });
   

})

app.put("/register/:username", async(req, res)=> { 
    let stuff;
    // let userinfo = {}
   // console.log(req.session)
    let sentUser = req.body.username;
    let userpass =  req.body.password;
    if (req.session.loggedin == true){
        res.status(404).send("you are already logged in somewhere")
    } 
    let results = await user.findOne({username : sentUser});
        if (results != null){
            //// console.log(results.password , userpass);
            res.status(404).send("user Already exists")
            
        } else{
         
              
               
                let userInfo = [{
                    username: req.body.username,
                    password: req.body.password,
                    liked: [],
                    reviewed:[],
                    follows: [],
                    notifications:[],
                    workshops:[],
                    enrolled:[],
                    artworkPublished: [],
                    isArtist: false
                }];
                req.session.isArtist = false;
                //// console.log(user);
                req.session.loggedin = req.body.username;
                user.insertMany(userInfo);
            //     fs.readFile('./config.json', function writeCallback(err, val){
            //         if (err){
            //             throw err;
            //         }
            //         let obj = JSON.parse(val);
            //         obj.push(userInfo)
               
            //     fs.writeFile('./config.json', JSON.stringify(obj), err=> {
            //         if (err){
            //             throw err;
            //         }
            //     })
            // })
            //     req.session.userinfo = userInfo;
                req.session.username = req.body.username
                res.send(true);
            
        }
   
});

app.put("/login/:username", async(req, res)=> { 
    let stuff;
    let userinfo = {}
   // console.log(req.session)
    let sentUser = req.body.username;
    let userpass =  req.body.password;
    if (req.session.loggedin == sentUser){
        res.status(404).send("you are already logged in somewhere")
    } 
    let results = await user.findOne({username : sentUser});
        if (results == null){
            //// console.log(results.password , userpass);
            res.status(404).send("user does not exist")
            
        } else{
           // console.log("++++++++++++++++++++++")
            //// console.log(results.password);
            if (results.password === userpass ){
               // console.log("++wasswq++++++++++++++++++++")
                req.session.loggedin = sentUser;
                let artworks = {};
                let artIndex = 0;
                
                
                let val = art.find({});
                //     for(let i = 0; i < val.length; i++){
                //    // console.log("result before");
                //     let nameSpace = (results[i].name).split(" ").join("");;
                
                //     ////  //console.log("result after");
                
                //     artworks[results[i].name] = results[i];
                //     artIndex++;
                //     //// console.log(results.length);
                // }
                req.session.userinfo = results;
                req.session.username = results.username
                req.session.isArtist = results.isArtist;
                userinfo["username"]= results.username;
                userinfo["password"]= results.password;
                userinfo["isArtist"] = results.isArtist;
                userinfo["arts"] = val;
                //// console.log(userinfo);
               // console.log("++++++++++esfwe++++++++++++")
                // sessionStorage.setItem("username",results.username)
                res.status(200).send()
                // res.render("pages/userInfo", {userinfo, userinfo})
                    
              
            }else{
              // console.log("rjehbk,w");
                res.status(404).send("password does not match");
                
                
             
            }
        }
   
});

app.post("/:username/uploadart", async(req, res)=> { 
    let stuff;
    let username = req.params.username;
    let newArtname = req.body.name;
    let artToAdd = req.body;
    artToAdd['artist'] = username.replaceAll("-", " ");
    let checkArt = await art.findOne({name : newArtname});
    if (checkArt == null) {
        let checkName = await user.findOne({username : username});
        checkName.artworkPublished.push(newArtname);
        checkName.save();
        await art.insertMany(artToAdd);
        for(let i = 0; i< checkName.followers.length; i++){
            let notif = await user.findOne({username : checkName.followers[i]});
            notif.notifications.unshift( checkName.username+" has uploaded an Artwork")
            await notif.save();
        }
        fs.readFile('./gallery.json', function writeCallback(err, val){
            if (err){
                throw err;
            }
            let obj = JSON.parse(val);
            obj.push(artToAdd)
       
        fs.writeFile('./gallery.json', JSON.stringify(obj), err=> {
            if (err){
                throw err;
            }
        })
    })
    // addArt.save()
        res.send(true);
    } else {
        res.send(false)
    }
    
    
});

app.post("/:username/addworkshop", async(req, res)=> { 
    let stuff;
    let username = req.params.username;
    let newArtname = req.body.name;
    let artToAdd = req.body;
    artToAdd['artist'] = username;

   
        let checkName = await user.findOne({username : username});
        checkName.workshops.push(newArtname);
        checkName.save();
        // await art.insertMany(artToAdd);
        for(let i = 0; i< checkName.followers.length; i++){
            let notif = await user.findOne({username : checkName.followers[i]});
            notif.notifications.unshift( checkName.username+" has added a new Workshop")
            await notif.save();
        }
        
    // addArt.save()
        res.status(200).send();
    
    
    
});

app.post("/:username/search", async(req, res)=> { 
    let searchResult = {};
    let username = req.params.username;
    searchResult["username"]= req.params.username;
    searchResult["isArtist"]= req.session.isArtist;
    let flag = false;
    let flagIndex = 0;
    let searchArr = [];
    let searchOp = req.body.option;
    let value = req.body.value;
    if (searchOp == "Artwork Name"){
       // console.log("____________________++++++++++");
        let check = await art.find({});
            console.log(check.length, (check[0].name).toLowerCase());
        for (let i = 0; i< check.length; i++){
            console.log(check.length, (check[i].name).toLowerCase());
            if ((check[i].name).toLowerCase() == value.toLowerCase()){
                flag = true;
                searchArr.push(check[i])
                console.log(check[i] , "fbkj");
                
                
            }
        }
        if(flag == true){
            searchResult['art'] = searchArr
            flag = false;
                res.send(JSON.stringify(searchResult))
        } else {
            console.log("here");
            flag = false;
            res.status(404).send()
        }
     
    } else if (searchOp == "Artist's Name"){
        let check = await art.find({});
        console.log(check.length, (check[0].name).toLowerCase());
    for (let i = 0; i< check.length; i++){
        // console.log(check.length, (check[i].name).toLowerCase());
        if ((check[i].artist).toLowerCase() == value.toLowerCase()){
            flag = true;
            searchArr.push(check[i])
            console.log(check[i] , "fbkj");
            
            
        }
    }
    if(flag = true){
        searchResult['art'] = searchArr
        flag = false;
        res.send(JSON.stringify(searchResult))
    } else {
        console.log("here");
        res.status(404).send()
    }
 
    } else if (searchOp == "Category"){
        let check = await art.find({});
        // console.log(check.length, (check[0].name).toLowerCase());
    for (let i = 0; i< check.length; i++){
        // console.log(check.length, (check[i].name).toLowerCase());
        if ((check[i].category).toLowerCase() == value.toLowerCase()){
            flag = true;
            searchArr.push(check[i])
            console.log(check[i] , "fbkj");
            
            
        }
    }
    if(flag = true){
        searchResult['art'] = searchArr
        flag = false;
            res.send(JSON.stringify(searchResult))
    } else {
        console.log("here");
        flag = false;
        res.status(404).send()
    }
 
    }else if (searchOp == "Medium"){
        let check = await art.find({});
        // console.log(check.length, (check[0].name).toLowerCase());
    for (let i = 0; i< check.length; i++){
        // console.log(check.length, (check[i].name).toLowerCase());
        if ((check[i].medium).toLowerCase() == value.toLowerCase()){
            flag = true;
            searchArr.push(check[i])
            console.log(check[i] , "fbkj");
            
            
        }
    }
    if(flag = true){
        searchResult['art'] = searchArr
        flag = false;
            res.send(JSON.stringify(searchResult))
    } else {
        console.log("here");
        flag = false;
        res.status(404).send()
    }
 
    }
       
       
       
        
    
    
    
    
});

app.post("/current", async(req, res)=> { 
    let sentUser = req.session.username;
    // let userpass =  req.body.password;
    res.send(sentUser);
   
});

app.listen(3000);//
console.log("Server listening at http://localhost:3000");

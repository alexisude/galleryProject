// const e = require("express");

let currentuser;

function validateNewUser(){
  let validate = true;
    let userName = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    //let confirmpassword = document.getElementById("passConfirm").value;
    
    if(userName == '') {
       // alert("you must have the same password in both fields");
       document.getElementById("username").style.borderColor = 'red';
       document.getElementById("invalid").innerHTML = 'This field is required';
       validate = false
    }
    if(password == '') {
        // alert("you must have the same password in both fields");
        document.getElementById("password").style.borderColor = 'red';
        document.getElementById("invalidPass").innerHTML = 'This field is required';

        validate = false
    }
   
    if (validate == true){
        createNewUser();
    }
}

function validateUser(){
  let loginValid = true;
  // alert("come in");
  let userName = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPass").value;
  
  if(userName == '') {
     // alert("you must have the same password in both fields");
     document.getElementById("loginUsername").style.borderColor = 'red';
     document.getElementById("invalidLog").innerHTML = 'This field is required';

     loginValid = false
  }
  if(password == '') {
      // alert("you must have the same password in both fields");
      document.getElementById("loginPass").style.borderColor = 'red';
      document.getElementById("invalidLogPass").innerHTML = 'This field is required';

      loginValid = false
  }
  console.log("in here")
  if (loginValid == true){
    console.log("in here")
    document.getElementById("invalidLog").innerHTML = '';
    document.getElementById("invalidLogPass").innerHTML = '';

    exisitingUser();
    // getExisitingUser();
  }
}

function createNewUser(){
  let val;
    //get the values in the textbox to be displayed in the HTML
      let userName = document.getElementById("username").value;
      let password = document.getElementById("password").value;
    //    let confirmpassword = document.getElementById("passConfirm").value;

      let newuser = {"username": userName, "password": password};
        let send = false;
      //ask them to enter if they enter nothing
      //post request and send the info about the new added vendor
      //reroute the page to the infor about the venfor page
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
    
        if (this.readyState == 4 && this.status == 200) {
      
   
          // alert("val")
          // getExisitingUser();
          let link = "/loginn/:"+ userName;
          window.location.replace(link);
        }  
        if (this.readyState == 4 && this.status == 404){
          let value= (this.responseText);
        //  alert(value)
        
        // alert(val)
        document.getElementById("username").style.borderColor = 'red';
        document.getElementById("invalid").innerHTML = 'Username has already been taken';
    
        //   // getExisitingUser();
         }
      
      }
    
        // alert(send); 
        xhttp.open("PUT", "/register/"+userName);
      
          document.getElementById("invalid").innerHTML = '';
          // xhttp.open("POST", "/header", true)
          xhttp.setRequestHeader("Content-Type", "application/json");
          xhttp.send(JSON.stringify(newuser));
        // } catch (error) {
        //   console.log("not valid" + error)
        // }
        
        
  
  }
  
function exisitingUser(){
  // console.log("you exist");
  let value;
  let userName = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPass").value;
  // let link = "/login/:"+ userName;
  let exisitingUser = {"username": userName, "password": password};
  // let newuser = {"username": userName, "password": password};
  // let send = false;
//ask them to enter if they enter nothing
//post request and send the info about the new added vendor
//reroute the page to the infor about the venfor page
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
      
   
      // getExisitingUser();
      let link = "/loginn/:"+ userName;
      window.location.replace(link);
    }  if (this.readyState == 4 && this.status == 404){
      let value= (this.responseText);
    //  alert(value)
    
      document.getElementById("loginUsername").style.borderColor = 'red';
      document.getElementById("invalidLog").innerHTML = 'Your username or password is incorrect';

     }


}

    xhttp.open("PUT", "/login/"+userName);

    document.getElementById("invalidLog").innerHTML = '';
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(exisitingUser));
  // } catch (error) {
  //   console.log("not valid" + error)
  // }
  
}

// function postHeader(){
//   console.log("in her i geuss");
//   let test;
//   let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//   if (this.readyState == 4 && this.status == 200) {
//     //test= JSON.parse(this.responseText);
//     alert(this.responseText)
//   }

// }
//     xhttp.open("GET", "/header");
//     xhttp.setRequestHeader("Content-Type", "application/json");
//     xhttp.send();

// }

function getExisitingUser(){
  // console.log("you exist");
  let value;
  let userName = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPass").value;
  currentuser = userName;
  let link = "/login/:"+ userName;
  console.log(link)
  // window.location.replace(link);
  // window.reload();

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {

    let user =  JSON.stringify(this.responseText);
    console.log(user);
   
    // window.location.replace(link);
    // alert(user)
  }

}
  
  // alert(send); 
    xhttp.open("GET", link);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();

}

function deleteReview(string){
  let stuff = string.split(":")
  alert(stuff[1])
  
  // alert(review)
  
 item = {'name': stuff[0], 'review': stuff[1], 'artname': stuff[2]}
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
     value= JSON.parse(this.responseText);
     if (value == true){
      window.location.reload();
  }
     }
  }

  // alert(send); 
    xhttp.open("PUT", "/deletereview");

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send((JSON.stringify(item)));

  }

  function verifyWorkshop(){
    let loginValid = true;
    // alert("come in");
    let workshopname = document.getElementById("workshopname").value;
    let workshopdate = document.getElementById("workshopdate").value;
    let workshoplocation = document.getElementById("workshoplocation").value;
    
    if(workshopname == '') {
       // alert("you must have the same password in both fields");
       document.getElementById("workshopname").style.borderColor = 'red';
       document.getElementById("invalidworkshopname").innerHTML = 'This field is required';
  
       loginValid = false
    }

  
  if(workshoplocation == '') {
    // alert("you must have the same password in both fields");
    document.getElementById("workshoplocation").style.borderColor = 'red';
    document.getElementById("invalidworkshoplocation").innerHTML = 'This field is required';
  
    loginValid = false
  }
  if(workshopdate == '' || (/[0-9]{8}$/).test(workshopdate) == false) {
    // alert("you must have the same password in both fields");
    document.getElementById("workshopdate").style.borderColor = 'red';
    document.getElementById("invalidworkshopdate").innerHTML = 'input a year in the form DDMMYYYY';
  
    loginValid = false
  }
  
    if (loginValid == true){
      
      let link = location.href;
      let newWorkshop = {'name':workshopname,'location': workshoplocation, 'date':workshopdate}
      // alert(link)
      document.getElementById("invalidworkshoplocation").innerHTML = '';
      document.getElementById("invalidworkshopdate").innerHTML = '';
      document.getElementById("invalidworkshopname").innerHTML = '';
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
     if (this.readyState == 4 && this.status == 200) {
        // alert("go in");
      //   // alert("go in") 
      //  value= JSON.parse(this.responseText);
      //  if(value == true ){
      //   artName = artName.replaceAll(" ", "-");
      //     redirectShop("/artwork/"+ artName);
      //  } else if(value == false ) {
      //   document.getElementById("artName").style.borderColor = 'red';
      //   document.getElementById("invalidartName").innerHTML = 'This name has been taken';
      //  }
      // //else{
      //   currentuser = userName;
      //   getExisitingUser();
      //  }
      // console.log(currentVendor);
     
      
  
    }
  
  }
  
    // alert(send); 
      xhttp.open("POST", link);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(newWorkshop));
    }
  }

  function redirectShop(string){
    // console.log("you exist");
    let value;
    let link = location.href;
    // let link = "/artwork/:"+ userName;
    alert(link)
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
  
      let user =  JSON.stringify(this.responseText);
      // alert(user);
    }
  }
    // alert(send); 
      xhttp.open("GET", string);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send();  
  
  }

  function verifySearch(){
    let loginValid = true;
    // alert("come in");
    let searchOp = document.getElementById("search-select").value;
    let search = document.getElementById("search").value;
    
    
    if(search == '') {
       // alert("you must have the same password in both fields");
       document.getElementById("search").style.borderColor = 'red';
       document.getElementById("invalidsearch").innerHTML = 'This field is required';
  
       loginValid = false
    }
    
  
  
    if (loginValid == true){
      
      let link = location.href;
      let newSearch = {'option':searchOp,'value': search}
      // alert(link)
      document.getElementById("invalidsearch").innerHTML = '';
      let div = document.getElementById("results");

      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
     if (this.readyState == 4 && this.status == 200) {
        // alert("go in");
      //   // alert("go in") 
      //   console.log(this.responseText);
       let value= JSON.parse(this.responseText);
       console.log(value);
       while(div.firstChild) {
        div.removeChild(div.firstChild);
        document.getElementById("message").innerHTML = '';

    }
      alert(value.art.length)
       if(value.art.length !=0){
        document.getElementById("message").innerHTML = '';
        for (let i = 0; i< value.art.length; i++){
        let link = document.createElement('a');
        let br = document.createElement('br');
        link.text= value.art[i].name;
        let stuff = (value.art[i].name).replaceAll(" ", "-")
        link.href ="http://localhost:3000/artwork/:"+stuff
        let a ="http://localhost:3000/artwork/:"+stuff
        var img = document.createElement("img");
        // let p = document.createElement("p");
        let cate = "";
        cate += `<h4>`;
        cate +=  `<a href = ${a}> ${value.art[i].name} </a>`;
        cate += `</h4>`;
        img.src = value.art[i].image;
        div.innerHTML+=(cate)
        div.appendChild(br)
        div.appendChild(br)
        div.appendChild(img);
        div.appendChild(br)
        div.appendChild(br)
        }
      }else{
        alert("issue")
        document.getElementById("message").innerHTML = 'There are no items with this name';

      }
    } else if (this.readyState == 4 && this.status == 404) {
      while(div.firstChild) {
        div.removeChild(div.firstChild);
        document.getElementById("message").innerHTML = '';

    }
      document.getElementById("message").innerHTML = '';
      document.getElementById("message").innerHTML = 'There are no items with this name';

    }
  
  }
  
    // alert(send); 
      xhttp.open("POST", link);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(newSearch));
    }
  }

function verifyUpload(){
  let loginValid = true;
  // alert("come in");
  let artName = document.getElementById("artName").value;
  let artyear = document.getElementById("artyear").value;
  let artcategory = document.getElementById("artcategory").value;
  let artmedium = document.getElementById("artmedium").value;
  let artdes = document.getElementById("artdes").value;
  let artImage = document.getElementById("artImage").value;
  
  if(artName == '') {
     // alert("you must have the same password in both fields");
     document.getElementById("artName").style.borderColor = 'red';
     document.getElementById("invalidartName").innerHTML = 'This field is required';

     loginValid = false
  }
  if(artcategory == '') {
      // alert("you must have the same password in both fields");
      document.getElementById("artcategory").style.borderColor = 'red';
      document.getElementById("invalidartcategory").innerHTML = 'This field is required';

      loginValid = false
  }
  if(artmedium == '') {
    // alert("you must have the same password in both fields");
    document.getElementById("artmedium").style.borderColor = 'red';
    document.getElementById("invalidartmedium").innerHTML = 'This field is required';

    loginValid = false
}
if(artdes == '') {
  // alert("you must have the same password in both fields");
  document.getElementById("artdes").style.borderColor = 'red';
  document.getElementById("invalidartdes").innerHTML = 'This field is required';

  loginValid = false
}
if(artImage == '') {
  // alert("you must have the same password in both fields");
  document.getElementById("artImage").style.borderColor = 'red';
  document.getElementById("invalidartImage").innerHTML = 'This field is required';

  loginValid = false
}
if(artyear == '' || (/[0-9]{4}$/).test(artyear) == false) {
  // alert("you must have the same password in both fields");
  document.getElementById("artyear").style.borderColor = 'red';
  document.getElementById("invalidartyear").innerHTML = 'input a year in the form YYYY';

  loginValid = false
}

  if (loginValid == true){
    
    let link = location.href;
    let newArt = {'name':artName,'artist': '', 'year':artyear, 'category':artcategory,  'medium':artmedium, 'likes':0, 'reviews':[], 'description':artdes,'image':artImage }
    // alert(link)
    document.getElementById("invalidartcategory").innerHTML = '';
    document.getElementById("invalidartImage").innerHTML = '';
    document.getElementById("invalidartdes").innerHTML = '';
    document.getElementById("invalidartmedium").innerHTML = '';
    document.getElementById("invalidartyear").innerHTML = '';
    document.getElementById("invalidartName").innerHTML = '';
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
   if (this.readyState == 4 && this.status == 200) {
      
     value= JSON.parse(this.responseText);
     if(value == true ){
      artName = artName.replaceAll(" ", "-");
        redirectNewArt("/artwork/"+ artName);
     } else if(value == false ) {
      document.getElementById("artName").style.borderColor = 'red';
      document.getElementById("invalidartName").innerHTML = 'This name has been taken';
     }
    //else{
    //   currentuser = userName;
    //   getExisitingUser();
    //  }
    // console.log(currentVendor);
   
    

  }

}

  // alert(send); 
    xhttp.open("POST", link);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(newArt));
  }
}

function redirectNewArt(string){
  // console.log("you exist");
  let value;
  let link = location.href;
  // let link = "/artwork/:"+ userName;
  alert(link)
  
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {

    let user =  JSON.stringify(this.responseText);
    // alert(user);
  }
}
  // alert(send); 
    xhttp.open("GET", string);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();  

}

function getArtistProfile(string){
  let link = "/login/artistprofile/:"+ string ;
  console.log(link)

      let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    // value= JSON.parse(this.responseText);
    // con
     
      window.location.reload();
    // let user =  JSON.stringify(this.responseText);
    // console.log(user);
  } else if(this.readyState == 4 && this.status == 404)  {
    window.location.replace("/"+string+"/uploadart");
  }
}
  
  // alert(send);
    xhttp.open("PUT", link);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}


function getFollowing(string){
  let link = "/login/:"+ string + "/following";
  console.log(link)
      window.location.replace(link);

      let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {

    // let user =  JSON.stringify(this.responseText);
    // console.log(user);
  }
}
  // alert(send);
    xhttp.open("GET", link);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

function getArtwork(){
  // console.log("you exist");
  let value;
  let link = location.href;
  // let link = "/artwork/:"+ userName;
  alert(link)
  
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {

    let user =  JSON.stringify(this.responseText);
    alert(user);
  }
}
  // alert(send); 
    xhttp.open("GET", link);
    xhttp.setRequestHeader("Content-Type", "text/html");
    xhttp.send();  

}

function getArtisit(){
  // console.log("you exist");
  let value;
  let link = location.href;
  console.log(link)
  
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {

  }

}
  // alert(send); 
    xhttp.open("GET", link);

    // document.getElementById("invalidLog").innerHTML = '';
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}
function getlinkQuery(){
  alert("er")
  window.location.href("/login")
}


function switchAccount(){
  alert("you are now operating as an artist");
}

function submitReview(string){
  string = string.replaceAll("-", " ");
  let review = document.getElementById("inputReview").value;
  alert("your review has been submitted")
  if(review != ''){
 item = {'artname': string, 'review': review}
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
     value= JSON.parse(this.responseText);
  }
}
  // alert(send); 
    xhttp.open("PUT", "/review");

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send((JSON.stringify(item)));

  } 
//   let a = string;
//   string = string.replaceAll("-", " ");
//   // alert(string)
//   let item =  {'name':string };

//   let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//   if (this.readyState == 4 && this.status == 200) {
//      value= JSON.parse(this.responseText);
//      if (value == true){
//       window.location.reload();

//      }
//   }
// }
//   // alert(send); 
//     xhttp.open("PUT", "/like");

//     xhttp.setRequestHeader("Content-Type", "application/json");
//     xhttp.send((JSON.stringify(item)));

}

function logout(){

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    window.location.replace("/login");

  }

}
  
  // alert(send); 
    xhttp.open("GET", "/logout");

    // document.getElementById("invalidLog").innerHTML = '';
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}



function followArtist(string){
  let a = string;
  // string = string.replaceAll("-", " ");
  // alert(string)
  let item =  {'name':string };

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
     value= JSON.parse(this.responseText);
     if (value == true){
      window.location.reload();

     }
  }
}
  // alert(send); 
    xhttp.open("PUT", "/follow");

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send((JSON.stringify(item)));

}
  

function likeArt(string){
  let a = string;
  string = string.replaceAll("-", " ");
  // alert(string)
  let item =  {'name':string };

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
     value= JSON.parse(this.responseText);
     if (value == true){
      window.location.reload();

     }
  }
}
  // alert(send); 
    xhttp.open("PUT", "/like");

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send((JSON.stringify(item)));

}


function enroll(string){
  string = string.split('%')
 
  // alert(string)
  let item =  {'workshop':string[0], 'artist':string[1] };

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
     value= JSON.parse(this.responseText);
     alert("you have now enrolled in "+ string[0]+ " by " + string[1]);

    //  if (value == true){
    //   window.location.reload();

    //  }
  } else if(this.readyState == 4 && this.status == 404){
    alert("you have now dropped out of "+ string[0]+ " by " + string[1]);
  }
}
  // alert(send); 
    xhttp.open("PUT", "/enroll");

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send((JSON.stringify(item)));

}



function getNotif(string){
  // alert(string)
  let link = "/login/:"+ string + "/notifications";
    // alert(link)
        window.location.replace(link);
 
        let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
 
      // let user =  JSON.stringify(this.responseText);
      // console.log(user);
    }
  }
    // alert(send);
      xhttp.open("GET", link, false);
      // xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send();
   
}

function getReviewed(string){
  // alert(string)
  let link = "/login/:"+ string + "/reviewed";
    // alert(link)
        window.location.replace(link);
 
        let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
 
      // let user =  JSON.stringify(this.responseText);
      // console.log(user);
    }
  }
    // alert(send);
      xhttp.open("GET", link, false);
      // xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send();
   
}

function goBack(){
  window.history.back();
  window.reload()
}
function done(string){
  alert(string);
  let link = "/loginn/:"+string;
  window.location.replace(link);
  // window.reload()
}

function getLiked(string){
    let link = "/login/:"+ string + "/liked";
    // alert(link)
        window.location.replace(link);
 
        let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
 
      // let user =  JSON.stringify(this.responseText);
      // console.log(user);
    }
  }
    // alert(send);
      xhttp.open("GET", link, false);
      // xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send();
   
 
 
  }

//   function postCurrent(){
//     let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//   if (this.readyState == 4 && this.status == 200) {
//       // alert("go in");
//       // alert("go in")
//       send  = true;
//      value= JSON.parse(this.responseText);
//      if(value == false ){
//       // alert(val)
//       document.getElementById("loginUsername").style.borderColor = 'red';
//       document.getElementById("invalidLog").innerHTML = 'Your username or password is incorrect';

//      } else{
//       currentuser = userName;
//       getExisitingUser();
//      }
//     // console.log(currentVendor);
   
    

//   }

// }

//   // alert(send); 
//     xhttp.open("POST", "/current");
//     xhttp.setRequestHeader("Content-Type", "application/json");
//     xhttp.send(JSON.stringify(exisitingUser));
//   // } catch (error) {
//   //   console.log("not valid" + error)
//   // }
  
//   }
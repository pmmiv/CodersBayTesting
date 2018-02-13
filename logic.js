/* global moment firebase */
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDFgloeIYmop6tS1zSeR6dzZvwkJslC8Y0",
  authDomain: "pmfirstdatabasetest.firebaseapp.com",
  databaseURL: "https://pmfirstdatabasetest.firebaseio.com",
  projectId: "pmfirstdatabasetest",
  storageBucket: "pmfirstdatabasetest.appspot.com",
  messagingSenderId: "134786299687"
};
firebase.initializeApp(config);

var database = firebase.database();

//=======anime animation====
var boxEnterTimeline = anime.timeline({
  autoplay: true
})
var boxExitTimeline = anime.timeline({
  autoplay: false
})
var easing = "linear";

var uSignIn;

var actUser = {};

var actCards = [];

boxEnterTimeline
  .add({
    targets: "#title",
    duration: 1000,
    opacity: "1",
    easing
  })

boxExitTimeline
  .add({
    targets: "#initBox",
    // width: 0,
    opacity: "0",
    translateX: 200,
    duration: 750,
    easing
  })
  .add({
    targets: ".slate",
    duration: 1000,
    height: 0,
    // opacity: 0,
    easing
  }).add({
    targets: ".slate",
    duration: 10,
    translateY: -10000
  });

$(".initSub").click(function(event) {
  event.preventDefault();
  boxExitTimeline.play();
})

// ========conversion table logic====
function convert(a, b, c) {
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  var builtString = "https://neutrinoapi.com/convert?from-value=" + a + "&from-type=" + b + "&to-type=" + c + "&userId=PMMIV&apiKey=lxAaqP7fkM6ZjKHg0fnvmkF192s1vmihtuGtY381Ls6xHsNs";
  $.get(proxyUrl + builtString, function(response) {
    var noOutput = response.result
    $('.results').text(a + " " + b + " = " + noOutput + " " + c);
  }).fail(function(error) {
    console.log(error);
    $('.results').text("I'm sorry. We may have exceeded our conversion limit today.");
  })
};

$('.convertSub').click(function(event) {
  event.preventDefault();
  var noInput = $('#noInput').val();
  var typeInput = $('#typeInput').val();
  var typeOutput = $('#typeOutput').val();
  convert(noInput, typeInput, typeOutput);
});

// List of diet/allergy
// --------------------
// 396^Dairy-Free
// 393^Gluten-Free
// 394^Peanut-Free
// 400^Soy-Free
// 397^Egg-Free
// 401^Sulfite-Free
// 395^Tree Nut-Free
// 390^Pescetarian
// 386^Vegan
// 403^Paleo
// 387^Lacto-ovo vegetarian

//creates an array of recipe id's that matches with the user input
var recipeArray = [];
// create initial array for titles of recipes
var titleArray = [];
// create initial array for image_urls
var imageArray = [];

var ingredArray = [];

var recipeIngred = [];

// create a varaible to store the amount of recipes returned from api
var count = 0;

var restrictString = "&allowedAllergy[]=";

var dietString = "&allowedDiet[]=";

var allergyRequest = "";

var dietRequest = "";
var isUnClickedAll = false;
var isUnClickedDiet = false;
var recipeSource = "http://www.yummly.com/recipe/";

//went ahead and comment out v1 of the checkbox for the allergy and diet
//got the checkbox for the submit button to work

/*
// when a check button is clicked and it has the allergy class, add to allergyRequest.
$(".foodOptions").on("click", ".allergy", function()
{
$.each($("input:checked")
  var restrict = $(this).val().trim();
  allergyRequest += (restrictString + restrict);
  console.log("allergy", allergyRequest);
});
// when a check button is clicked and it has the diet class, add to dietRequest.
$(".foodOptions").on("click", ".diet", function(){
  var restrict = $(this).val().trim();
  dietRequest += (dietString + restrict);
  console.log("diet", dietRequest);
});
*/

// call function when submit button is pressed
$("#inputBtn, .inputBtn2").on("click", function(event) {
  // prevent page refresh when submit is pressed
  event.preventDefault();

  actCards = [];
  // create initial array for recipe_ids
  recipeArray = [];
  // create initial array for titles of recipes
  titleArray = [];
  // create initial array for image_urls
  imageArray = [];

  ingredArray = [];
  // create a varaible to store the amount of recipes returned from api
  count = 0;

  //version 2 of the checkbox
  //this is to create the filter for the specific diet
  $("input[class=diet]:checked").each(function() {
    //once the user clicks on the submit button, go ahead and check what
    //input has been clicked and concat each diet together
    var restrict = $(this).val().trim();
    dietRequest += (dietString + restrict);
    console.log("diet", dietRequest);
  });

  //this is to create the filter for the specific allergy
  $("input[class=allergy]:checked").each(function() {
    //once the user clicks on the submit button, go ahead and check what
    //input has been clicked and concat each allergy together
    var restrict = $(this).val().trim();
    allergyRequest += (restrictString + restrict);
    console.log("allergy", allergyRequest);
  });

  //for each food search user input
  $("input[id=foodSearch]:input").each(function() {
    //clears out userinput
    $(".foodSearch").val('');
    //clears out each search
    $(".card").empty();
    console.log("emptying out the card");
    // grab user's input value and store in new variable
    var userInput = $(this).val().trim();
    //clears out click option of food search
    console.log(userInput);

    //if the user input is not empty
    if (userInput != "") {
      //go ahead and clear out the results to have a new search query
      $(".outputArea").empty();

      // website url for ajax to pull from
      var myURL = "https://api.yummly.com/v1/api/recipes?_app_id=87e47442&_app_key=11e4aadcc3dddb10fa26ae2968e1ce03&q=" + userInput + allergyRequest + dietRequest + "&maxResult=12";

      console.log(myURL);

      //calling the ajax class to pass the url, and the
      //GET method to return the myObj object
      $.ajax({
        url: myURL,
        method: "GET"
        //once myObj object returns, pass in myObj to the next function
      }).then(function(myObj) {

        var newObj = myObj.matches;
        console.log(newObj);

        // set the count value to the count property in the object
        count = newObj.length;

        // initiate a for loop to store recipe_id property and image_url property into their arrays
        for (var i = 0; i < count; i++) {
          recipeArray.push(recipeSource + newObj[i].id);
          imageArray.push(newObj[i].imageUrlsBySize[90]);
          ingredArray.push(newObj[i].ingredients);
          titleArray.push(newObj[i].recipeName);
        }
        console.log(ingredArray);

        // create a for-loop to pull, resize, and reassign photos in the image array
        for (var j = 0; j < imageArray.length; j++) {
          imageArray[j] = imageArray[j].toString().replace("s90", "s500");
        }

        console.log(imageArray);
        // $("#outputArea").on("click", "front")
        // initiate another for loop to display image properties
        for (var i = 0; i < imageArray.length; i++) {
          var newCard = $("<div class='cardContainer'>");
          var cardBody = $("<div class='card'>");

          var cardFront = $("<div class='front'>");
          var cardImage = $("<img class='cardImage'>");
          var cardTitle = $("<h5 class='cardTitle'>");

          var cardBack = $("<div class='back'>");
          var recipeLink = $("<a type='button' target='_blank' class='btn outSource'>");
          var cardList = $("<ul class='ingredList'>");

          ingredArray[i].forEach(function(item) {
            recipeIngred.push(item);
          });
          recipeIngred.forEach(function(innerItem) {
            cardList.append("<li class='listItem'>" + innerItem);
            // console.log(i, innerItem);
          })

          recipeLink.attr("href", recipeArray[i]);

          recipeLink.text("Click Me For Full List n' Intructions");

          cardBack.append(recipeLink);

          cardBack.append(cardList);

          //not sure if I use this
          cardBody.attr("data-id", recipeArray[i]);

          cardBody.append("<button class='btn bookmark' data-cardNo="+i+"><i class='fas fa-utensils'></i></button>");

          cardTitle.text(titleArray[i]);

          cardImage.attr("src", imageArray[i]);

          cardFront.append(cardImage);

          cardFront.append(cardTitle);

          cardBody.append(cardFront);

          cardBody.append(cardBack);

          newCard.append(cardBody);

          $(".outputArea").append(newCard);

          actCards.push(newCard[0].outerHTML);
        }

        console.log("finished iteration");

      });
      console.log("end of input");
    }
    //clears out the user input
    $(".outputArea").empty();
    //clears out userinput
    $(".foodSearch").val('');
    //clears out first userinput
    $("#foodSearch").val('');
    //need code to reset the checkbox / radio box
    //$("input[class=diet]:checkbox").reset();
    //$("input[class=allergy]:checkbox").reset();
    //$("input[class=allergy]:checkbox").removeAttr("checked");
  }); // $("input[class=diet]:checkbox").removeAttr("checked");

});

$(".outputArea").on("click", ".card", function() {
  console.log("flip it");
  $(this).toggleClass("flip");
})

// ============USER AUTHENTICATION============================
var uiConfig = {
  callbacks: {
    signInSuccess: function() {
      return false
    }
  },
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  signInFlow: 'popup'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    actUser = user
    if (user) {
      // show sign out
      $('#signInBtn').css("display", "none");
      $('#bkmkBtn').css("display", "inline");
      $('#signOut').css("display", "inline");
    } else {
      // show sign in
      $('#signOut').css("display", "none");
      $('#bkmkBtn').css("display", "none");
      $('#signInBtn').css("display", "inline");
    }
    actUser = user;
    if (user) {
      // User is signed in.
      uSignIn = true;
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;
      user.getIdToken().then(function(accessToken) {
        document.getElementById('sign-in-status').textContent = 'Signed in';
      });
    } else {
      // User is signed out.
      uSignIn = false;
      document.getElementById('sign-in-status').textContent = 'Signed out';
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});

// sign out button
$('#signOut').click(function() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
  }, function(error) {
    console.error('Sign Out Error', error);
  });
})

// bookmarking cards
$(document).on('click', '.bookmark', function () {
  // event.preventDefault();
  // console.log(this.dataset.cardno);
  var storeCard = actCards[this.dataset.cardno];
  var storeId = recipeArray[this.dataset.cardno];
  if (uSignIn) {
    database.ref("/users/" + actUser.uid).push({
      storeCard: storeCard,
      storeId: storeId
      // success: "You successfully pushed something to an individual user's bookmark" 
    })
    alert("bookmarked!");
  } else {
    alert("Sign in to bookmark recipes!");
}})

$('#bkmkBtn').click(function(){
  $('.outputArea').empty();
  database.ref("/users/" + actUser.uid).on('value', function(dataSnapshot){
  console.log(dataSnapshot.val());
  var newBkmkCards = dataSnapshot.val();
    for (var key in newBkmkCards) {
        if (newBkmkCards.hasOwnProperty(key)) {
            console.log(newBkmkCards[key].storeId);
            
            var newCard = $(newBkmkCards[key].storeCard);
            newCard.prepend("<button class='btn bookmarkRem' data-id="+newBkmkCards[key].storeId+"><i class='fas fa-times'></i></button>");
            $(".outputArea").append(newCard);
            $(".bookmark").css("display", "none");
        }
    }
  });  
})

function dbRemove (id) {
  database.ref("/users/" + actUser.uid + "/"+ id).remove();
}

$(document).on('click', '.bookmarkRem', function(){
  var thisId = this.dataset.id;
  database.ref("/users/" + actUser.uid).once('value').then(function(dataSnapshot){
    var newBkmkCards = dataSnapshot.val();
    for (var key in newBkmkCards) {
      if (newBkmkCards.hasOwnProperty(key) && newBkmkCards[key].storeId == thisId) {
        dbRemove(key);
      }
    }
  });
  $('.outputArea').empty();
})
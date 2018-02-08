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

// Create a variable to reference the database.
var database = firebase.database();

// -----------------------------
 // FirebaseUI config.
  var uiConfig = {
    signInSuccessUrl: "http://pmmiv.com/CodersBayTesting",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
  };

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);
// -----------------------------

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").text(snap.numChildren());
});

var actUser ;

$('#user').click(function(){
  console.log(actUser)
})

// ------------------------------------
// Initial Values
var initialBid = 0;
var initialBidder = "No one :-(";
var highPrice = initialBid;
var highBidder = initialBidder;

$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})

// --------------------------------------------------------------
// At the initial load, get a snapshot of the current data.
database.ref("/bidderData").on("value", function(snapshot) {

  // If Firebase has a highPrice and highBidder stored (first case)
  if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {

    // Set the initial variables for highBidder equal to the stored values.
    highBidder = snapshot.val().highBidder;
    highPrice = parseInt(snapshot.val().highPrice);

    // Change the HTML to reflect the initial value
    $("#highest-bidder").text(snapshot.val().highBidder);
    $("#highest-price").text("$" + snapshot.val().highPrice);

    // Print the initial data to the console.
    console.log(snapshot.val().highBidder);
    console.log(snapshot.val().highPrice);
  }

  // Keep the initial variables for highBidder equal to the initial values
  else {

    // Change the HTML to reflect the initial value
    $("#highest-bidder").text(highBidder);
    $("#highest-price").text("$" + highPrice);
    // Print the initial data to the console.
    console.log("Current High Price");
    console.log(highBidder);
    console.log(highPrice);
  }

// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------
 initApp = function() {
        firebase.auth().onAuthStateChanged(function(user) {
          actUser = user;
          if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            user.getIdToken().then(function(accessToken) {
              document.getElementById('sign-in-status').textContent = 'Signed in';
              document.getElementById('sign-in').textContent = 'Sign out';
              document.getElementById('account-details').textContent = JSON.stringify({
                displayName: displayName,
                uid: uid,
              }, null, '  ');
            });
          } else {
            // User is signed out.
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            document.getElementById('account-details').textContent = 'null';
          }
        }, function(error) {
          console.log(error);
        });
      };

      window.addEventListener('load', function() {
        initApp()
      });
// --------------------------------------------------------------

$('#signOut').click(function(){
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
  }, function(error) {
    console.error('Sign Out Error', error);
  });
})

// --------------------------------------------------------------

// Whenever a user clicks the click button
$("#submit-bid").on("click", function(event) {
  event.preventDefault();

  // Get the input values
  var bidderName = $("#bidder-name").val().trim();
  var bidderPrice = parseInt($("#bidder-price").val().trim());

  // Log the Bidder and Price (Even if not the highest)
  console.log(bidderName);
  console.log(bidderPrice);

  if (bidderPrice > highPrice) {

    // Alert
    alert("You are now the highest bidder.");

    // Save the new price in Firebase
    database.ref("/bidderData").set({
      highBidder: bidderName,
      highPrice: bidderPrice
    });

    // Log the new High Price
    console.log("New High Price!");
    console.log(bidderName);
    console.log(bidderPrice);

    // Store the new high price and bidder name as a local variable (could have also used the Firebase variable)
    highBidder = bidderName;
    highPrice = parseInt(bidderPrice);

    // Change the HTML to reflect the new high price and bidder
    $("#highest-bidder").text(bidderName);
    $("#highest-price").text("$" + bidderPrice);
  }
  else {

    // Alert
    alert("Sorry that bid is too low. Try again.");
  }

});

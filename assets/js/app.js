// Your web app's Firebase configuration
var config = {
    apiKey: "AIzaSyBLw--mS2bA2RRZXOi9nbadZavdBA1JaUA",
    authDomain: "coursework7-rps.firebaseapp.com",
    databaseURL: "https://coursework7-rps.firebaseio.com",
    projectId: "coursework7-rps",
    storageBucket: "",
    messagingSenderId: "288062732004",
    appId: "1:288062732004:web:832a923f7ff1acac"
};
// Initialize Firebase
firebase.initializeApp(config)

var database = firebase.database();

// Initial Values
var firstName = "";
var lastName = "";
var userName = "";
var winRecord = 0;
var lossRecord = 0;

// Round Initial Values
var roundCount = 0;
var winCount = 0;
var lossCount = 0;

var existingUserName = "";
var existingUserObj;

var playerOne;
var playerTwo;

database.ref().on("value", function (snapshot) {

    if (snapshot.child("username").exists()) {
        // Set the variables for highBidder/highPrice equal to the stored values in firebase.
        userName = snapshot.val().userName;
        winRecord = snapshot.val().winRecord;
        lossRecord = snapshot.val().lossRecord;

        // Change the HTML to reflect the stored values
        $("#username-display").text(userName);
        $("#record-display").text(winRecord + " - " + lossRecord);
    }
});

$("#set-player").on("click", function (event) {

    event.preventDefault();

    firstName = $("#first-name-input").val().trim();
    lastName = $("#last-name-input").val().trim();
    userName = $("#username-input").val().trim();

    // Sets the search reference location if an existing username is found
    var userNameSearch = database.ref("/users").orderByChild("userName").equalTo(userName);

    // Pulls data based on existing users and go through each child key.
    // Sets the entire object and username
    userNameSearch.on("value", function (snapshot) {
        // Search and pull child data
        // Source: https://github.com/firebase/functions-samples/issues/265
        snapshot.forEach(function (childSnapshot) {
            existingUserObj = childSnapshot.val();
            existingUserName = existingUserObj.userName;
        });
    });

    // If there is an existing user in the database based on User Name input value.
    // Set the displayed username and record based on previously pulled object
    if (existingUserName === userName) {

        $("#username-display").text(existingUserObj.userName);
        $("#record-display").text(existingUserObj.winRecord + " - " + existingUserObj.lossRecord);

    // If not in the database, push user to the database, set the global variables, and set displays text.
    } else {

        database.ref("/users").push({
            firstName: firstName,
            lastName: lastName,
            winRecord: winRecord,
            userName: userName,
            lossRecord: lossRecord
        });

        userNameSearch.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                existingUserObj = childSnapshot.val();
                existingUserName = existingUserObj.userName;
            });

            $("#username-display").text(existingUserObj.userName);
            $("#record-display").text(existingUserObj.winRecord + " - " + existingUserObj.lossRecord);
        });

    };

    $(".form-control").val("");

    database.ref("/player1").on("value", function(snap) {
        playerOne = snap.val();
        console.log(playerOne);
    });

    database.ref("/player2").on("value", function(snap) {
        playerTwo = snap.val();
        console.log(playerTwo);
    });

    if (playerOne === null) {
        database.ref("/player1").set(existingUserObj);
    } else if (playerTwo === null) {
        database.ref("/player2").set(existingUserObj);
    } else {
        console.log("Players 1 & 2 are set.");
    }

});
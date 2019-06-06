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

    var users = database.ref().child("users");

    firstName = $("#first-name-input").val().trim();
    lastName = $("#last-name-input").val().trim();
    userName = $("#username-input").val().trim();

    users.on("value", function (snapshot) {

        // Searches database for existing username.
        // Source: https://stackoverflow.com/questions/40471284/firebase-search-by-child-value
        if (users.orderByChild('userName').equalTo(userName)) {
            var storedUser = 
            userName = snapshot.val().userName;
            winRecord = snapshot.val().winRecord;
            lossRecord = snapshot.val().lossRecord;
        } else {
            users.push({
                firstName: firstName,
                lastName: lastName,
                winRecord: winRecord,
                userName: userName,
                lossRecord: lossRecord
            });
        };

        console.log(userName);
        console.log(winRecord);
        console.log(lossRecord);

        $("#username-display").text(userName);
        $("#record-display").text(winRecord + " - " + lossRecord);

        // userName = snapshot.val().userName;
        // winRecord = snapshot.val().winRecord;
        // lossRecord = snapshot.val().lossRecord;
    });

    $("#username-display").text(userName);
    $("#record-display").text(winRecord + " - " + lossRecord);

});
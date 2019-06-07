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

var selectedUserName = "";
var selectedUserObj;

var playerOne;
var playerTwo;
var searchPlayerOne = "";
var searchPlayerTwo = "";


document.getElementById("new-game").addEventListener("click", function (event) {
    event.preventDefault();

    database.ref("/player1").set({
        userName: "Ready Player 1"
    });
    database.ref("/player2").set({
        userName: "Ready Player 2"
    });

    document.getElementById("player-selection").style.display = "block";
    document.getElementById("new-game").style.display = "none";
});


// database.ref().on("value", function (snapshot) {

//     if (snapshot.child("username").exists()) {
//         // Set the variables for highBidder/highPrice equal to the stored values in firebase.
//         userName = snapshot.val().userName;
//         winRecord = snapshot.val().winRecord;
//         lossRecord = snapshot.val().lossRecord;

//         document.getElementById("username-display").innerHTML = username;
//         document.getElementById("record-display").innerHTML = winRecord + " - " + lossRecord;
//     }
// });

database.ref("/player1").on("value", function (snap) {
    playerOne = snap.val();
    searchPlayerOne = playerOne.userName;
    document.getElementById("p1-username-display").innerHTML = playerOne.userName;
    document.getElementById("p1-record-display").innerHTML = playerOne.winRecord + " - " + playerOne.lossRecord;
    if (searchPlayerOne !== "Ready Player 1") {
        console.log(1);
        document.getElementById("new-game").style.display = "none";
        document.getElementById("player-selection").style.display = "block";
    };
});

database.ref("/player2").on("value", function (snap) {
    playerTwo = snap.val();
    searchPlayerTwo = playerTwo.userName;
    document.getElementById("p2-username-display").innerHTML = playerTwo.userName;
    document.getElementById("p2-record-display").innerHTML = playerTwo.winRecord + " - " + playerTwo.lossRecord;
});

document.getElementById("set-player").addEventListener("click", function (event) {

    event.preventDefault();

    firstName = document.getElementById("first-name-input").value
    lastName = document.getElementById("last-name-input").value
    userName = document.getElementById("username-input").value

    // Sets the search reference location if an existing username is found
    var userNameSearch = database.ref("/users").orderByChild("userName").equalTo(userName);

    // Pulls data based on existing users and go through each child key.
    // Sets the entire object and username
    userNameSearch.on("value", function (snapshot) {
        // Search and pull child data
        // Source: https://github.com/firebase/functions-samples/issues/265
        snapshot.forEach(function (childSnapshot) {
            selectedUserObj = childSnapshot.val();
            selectedUserName = selectedUserObj.userName;
        });
    });

    // If not in the database, push user to the database, set the global variables, and set displays text.
    // Set the displayed username and record based on previously pulled object
    if (selectedUserName !== userName) {

        database.ref("/users").push({
            firstName: firstName,
            lastName: lastName,
            winRecord: winRecord,
            userName: userName,
            lossRecord: lossRecord
        });

        userNameSearch.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                selectedUserObj = childSnapshot.val();
                selectedUserName = selectedUserObj.userName;
            });
        });
    };

    if (searchPlayerOne === "Ready Player 1") {
        database.ref("/player1").set(selectedUserObj);
    } else if (searchPlayerOne === userName) {
        console.log("Please choose another user");
    } else if (searchPlayerTwo === "Ready Player 2") {
        database.ref("/player2").set(selectedUserObj);
    } else {
        console.log("Player 1 & 2 are set.")
    }
    

    document.getElementById("current-players").style.display = "block";
    document.getElementById("player-selection").style.display = "none";

    document.getElementsByClassName("form-control").innerHTML = "";

});

// if (searchPlayerOne !== "Ready Player 1") {
//     console.log(1);
//     document.getElementById("new-game").style.display = "none";
//     document.getElementById("player-selection").style.display = "block";
// } else if (searchPlayerOne === userName) {
//     console.log(3);
//     console.log("Please choose another user");
// } else if (searchPlayerTwo === "Ready Player 2") {
//     console.log(4);
//     database.ref("/player2").set(selectedUserObj);
// } else {
//     console.log(5);
//     console.log("Player 1 & 2 are set.")
// }








// Temp Reset Button
document.getElementById("reset-game").addEventListener("click", function (event) {
    event.preventDefault();

    database.ref("/player1").set({
        userName: "Ready Player 1"
    });
    database.ref("/player2").set({
        userName: "Ready Player 2"
    });

    document.getElementById("player-selection").style.display = "none";
    document.getElementById("current-players").style.display = "none";
    document.getElementById("new-game").style.display = "block";
});
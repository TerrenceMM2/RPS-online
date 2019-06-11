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
var playerAction = "";

// Round Initial Values
var roundCount = 0;
var winCount = 0;
var lossCount = 0;
var gameOngoing;

var selectedUserName = "";
var selectedUserObj;

var playerOne;
var playerTwo;
var searchPlayerOne = "";
var searchPlayerTwo = "";
var playerOneAction;
var playerTwoAction;

// Page Elements
var playerSelectionSection = document.getElementById("player-selection");
var currentPlayerSection = document.getElementById("current-players");
var newGameButton = document.getElementById("new-game");
var resetButton = document.getElementById("reset-game");
var warningMessage = document.getElementById("warning");
var playerOneActions = document.getElementById("p1-actions");
var playerTwoActions = document.getElementById("p2-actions");

sessionStorage.removeItem("role");

newGameButton.addEventListener("click", function (event) {
    event.preventDefault();

    database.ref("/player1").set({
        userName: "Ready Player 1"
    });
    database.ref("/player2").set({
        userName: "Ready Player 2"
    });
    database.ref("/game").set({
        currentGame: false
    });

    playerSelectionSection.style.display = "block";
    newGameButton.style.display = "none";
});

// On application load, check database if player1 and player2 are set.
// If so, set current session role to "observer"
database.ref().once("value").then(function (snap) {
    var storedPlayerOne = snap.val().player1.userName;
    var storedPlayerTwo = snap.val().player2.userName;
    if (storedPlayerOne !== "Ready Player 1" && storedPlayerTwo !== "Ready Player 2") {
        playerOneActions.style.display = "none";
        playerTwoActions.style.display = "none";
        sessionStorage.setItem("role", "observer");
        // // Sets currentGame value to true if two players are selected
        // database.ref("/game").set({
        //     currentGame: true
        // });

        database.ref("/game").on("value", function (snap) {
            gameOngoing = snap.val().currentGame;
        });
        // Else if both players are not set, the currentGame is false (i.e. not started)
    } else {
        // database.ref("/game").set({
        //     currentGame: false
        // });

        database.ref("/game").on("value", function (snap) {
            gameOngoing = snap.val().currentGame;
        });
    }

    if (searchPlayerOne === "Ready Player 1") {
        newGameButton.style.display = "none";
    } else if (searchPlayerTwo === "Ready Player 2") {
        playerSelectionSection.style.display = "block";
        newGameButton.style.display = "none";
    } else {
        playerSelectionSection.style.display = "none";
        newGameButton.style.display = "none";
        currentPlayerSection.style.display = "block";
    }

});

database.ref().on("value", function (snapshot) {

    if (snapshot.child("username").exists()) {
        // Set the variables for highBidder/highPrice equal to the stored values in firebase.
        userName = snapshot.val().userName;
        winRecord = snapshot.val().winRecord;
        lossRecord = snapshot.val().lossRecord;

        document.getElementById("username-display").innerHTML = username;
        document.getElementById("record-display").innerHTML = winRecord + " - " + lossRecord;
    }
});

database.ref("/player1").on("value", function (snap) {
    playerOne = snap.val();
    searchPlayerOne = playerOne.userName;
    playerOneAction = playerOne.action;
    document.getElementById("p1-username-display").innerHTML = playerOne.userName;
    document.getElementById("p1-record-display").innerHTML = playerOne.winRecord + " - " + playerOne.lossRecord;
    // if (searchPlayerOne !== "Ready Player 1") {
    //     newGameButton.style.display = "none";
    // };
});

database.ref("/player2").on("value", function (snap) {
    playerTwo = snap.val();
    searchPlayerTwo = playerTwo.userName;
    playerTwoAction = playerTwo.action;
    document.getElementById("p2-username-display").innerHTML = playerTwo.userName;
    document.getElementById("p2-record-display").innerHTML = playerTwo.winRecord + " - " + playerTwo.lossRecord;
    // if (searchPlayerTwo !== "Ready Player 2") {
    //     newGameButton.style.display = "none";
    //     playerSelectionSection.style.display = "none";
    //     currentPlayerSection.style.display = "block";
    // };
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
            lossRecord: lossRecord,
            action: playerAction
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
        sessionStorage.setItem("role", "player1");
        playerOneActions.style.display = "block";
        currentPlayerSection.style.display = "block";
        playerSelectionSection.style.display = "none"
    } else if (searchPlayerOne === userName) {
        warningMessage.innerHTML = "This user has already been set."
        warningMessage.style.display = "block";
    } else if (searchPlayerTwo === "Ready Player 2") {
        database.ref("/player2").set(selectedUserObj);
        sessionStorage.setItem("role", "player2");
        playerTwoActions.style.display = "block";
        warningMessage.style.display = "none";
        currentPlayerSection.style.display = "block";
        playerSelectionSection.style.display = "none";
        database.ref("/game").set({
            currentGame: true
        });
    };

    document.getElementsByClassName("form-control").value = " ";

});

document.getElementById("p1-rock").addEventListener("click", function() {
    var choice = this.getAttribute("data-value");
    database.ref("/player1").update({
        action: choice
    });
});

document.getElementById("p1-paper").addEventListener("click", function() {
    var choice = this.getAttribute("data-value");
    database.ref("/player1").update({
        action: choice
    });
});

document.getElementById("p1-scissors").addEventListener("click", function() {
    var choice = this.getAttribute("data-value");
    database.ref("/player1").update({
        action: choice
    });
});

document.getElementById("p2-rock").addEventListener("click", function() {
    var choice = this.getAttribute("data-value");
    database.ref("/player2").set({
        action: choice
    });
});

document.getElementById("p2-paper").addEventListener("click", function() {
    var choice = this.getAttribute("data-value");
    database.ref("/player2").update({
        action: choice
    });
});

document.getElementById("p2-scissors").addEventListener("click", function() {
    var choice = this.getAttribute("data-value");
    database.ref("/player2").update({
        action: choice
    });
});


// if ((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {

//     if ((userGuess === "r" && computerGuess === "s") ||
//       (userGuess === "s" && computerGuess === "p") || 
//       (userGuess === "p" && computerGuess === "r")) {
//       wins++;
//     } else if (userGuess === computerGuess) {
//       ties++;
//     } else {
//       losses++;
//     }
// };





// Temp Reset Button
document.getElementById("reset-game").addEventListener("click", function (event) {
    event.preventDefault();

    database.ref("/player1").set({
        userName: "Ready Player 1"
    });
    database.ref("/player2").set({
        userName: "Ready Player 2"
    });
    database.ref("/game").set({
        currentGame: false
    });

    playerSelectionSection.style.display = "none";
    currentPlayerSection.style.display = "none";
    newGameButton.style.display = "block";
    warningMessage.style.display = "none";
});
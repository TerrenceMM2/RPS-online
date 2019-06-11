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
var roundWins = 0;
var roundLosses = 0;
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
var playerOneChoice;
var playerTwoChoice;

// Page Elements
var playerSelectionSection = document.getElementById("player-selection");
var currentPlayerSection = document.getElementById("current-players");
var newGameButton = document.getElementById("new-game");
var resetButton = document.getElementById("reset-game");
var warningMessage = document.getElementById("warning");
var playerOneActions = document.getElementById("p1-actions");
var playerTwoActions = document.getElementById("p2-actions");
var playerOneMessage = document.getElementById("p1-info");
var playerTwoMessage = document.getElementById("p2-info");

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
        currentGame: false,
        round: roundCount
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
        database.ref("/game").on("value", function (snap) {
            gameOngoing = snap.val().currentGame;
        });
    } else {
        database.ref("/game").on("value", function (snap) {
            gameOngoing = snap.val().currentGame;
        });
    }

    // Displays appropriate section on load
    if (searchPlayerOne === "Ready Player 1") {
        newGameButton.style.display = "block";
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

    roundCount = snapshot.val().game.round;

    playerOneChoice = snapshot.val().player1.action;
    playerTwoChoice = snapshot.val().player2.action;

    if (snapshot.child("username").exists()) {
        // Set the variables for highBidder/highPrice equal to the stored values in firebase.
        userName = snapshot.val().userName;
        winRecord = snapshot.val().winRecord;
        lossRecord = snapshot.val().lossRecord;

        document.getElementById("username-display").innerHTML = username;
        document.getElementById("record-display").innerHTML = winRecord + " - " + lossRecord;
    };

    if (((playerOneChoice === "rock") || (playerOneChoice === "paper") || (playerOneChoice === "scissors")) && ((playerTwoChoice === "rock") || (playerTwoChoice === "paper") || (playerTwoChoice === "scissors"))) {
        if ((playerOneChoice === "rock" && playerTwoChoice === "scissors") ||
            (playerOneChoice === "scissors" && playerTwoChoice === "paper") ||
            (playerOneChoice === "paper" && playerTwoChoice === "rock")) {
            console.log("player 1 wins");
            roundWins++;
            roundCount++;
            database.ref("/player1").update({
                roundWins: roundWins,
                action: ""
            });
        } else if (playerOneChoice === playerTwoChoice) {
            warningMessage.innerHTML = "It's a tie!";
            warningMessage.classList.add("alert-info");
            warningMessage.style.display = "block";
        } else {
            roundCount++;
            roundWins++;
            database.ref("/player1").update({
                roundWins: roundWins,
                action: ""
            });
        };
    };

});

database.ref("/player1").on("value", function (snap) {
    playerOne = snap.val();
    searchPlayerOne = playerOne.userName;
    playerOneAction = playerOne.action;
    document.getElementById("p1-username-display").innerHTML = playerOne.userName;
    document.getElementById("p1-record-display").innerHTML = playerOne.winRecord + " - " + playerOne.lossRecord;
});

database.ref("/player2").on("value", function (snap) {
    playerTwo = snap.val();
    searchPlayerTwo = playerTwo.userName;
    playerTwoAction = playerTwo.action;
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
            lossRecord: lossRecord,
            action: playerAction,
            roundWins: roundWins,
            roundLosses: roundLosses
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
        warningMessage.classList.add("alert-warning");
        warningMessage.style.display = "block";
    } else if (searchPlayerTwo === "Ready Player 2") {
        database.ref("/player2").set(selectedUserObj);
        sessionStorage.setItem("role", "player2");
        playerTwoActions.style.display = "block";
        warningMessage.style.display = "none";
        currentPlayerSection.style.display = "block";
        playerSelectionSection.style.display = "none";
        database.ref("/game").update({
            currentGame: true
        });
    };

    document.getElementsByClassName("form-control").value = " ";

});



function setPlayerOneStats(element) {
    var choice = element.getAttribute("data-value");
    var selectedElement = element;
    var otherElements = document.getElementsByClassName("p1-action")
    for (var i = 0; i < otherElements.length; i++) {
        if (otherElements[i] !== selectedElement) {
            otherElements[i].style.display = "none";
        };
    };
    database.ref("/player1").update({
        action: choice
    });
};

function setPlayerTwoStats(element) {
    var choice = element.getAttribute("data-value");
    var selectedElement = element;
    var otherElements = document.getElementsByClassName("p2-action")
    for (var i = 0; i < otherElements.length; i++) {
        if (otherElements[i] !== selectedElement) {
            otherElements[i].style.display = "none";
        };
    };
    database.ref("/player2").update({
        action: choice
    });
};






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
        currentGame: false,
        round: roundCount
    });

    playerSelectionSection.style.display = "none";
    currentPlayerSection.style.display = "none";
    newGameButton.style.display = "block";
    warningMessage.style.display = "none";
});
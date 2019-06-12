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
var playerOneWins = 0;
var playerOneLosses = 0;
var playerTwoWins = 0;
var playerTwoLosses = 0;

// Page Elements
var playerSelectionSection = document.getElementById("player-selection");
var currentPlayerSection = document.getElementById("current-players");
var resetButton = document.getElementById("reset-game");
var messagePlaceholder = document.getElementById("warning");
var playerOneActions = document.getElementById("p1-actions");
var playerTwoActions = document.getElementById("p2-actions");
var playerOneMessagePlaceHolder = document.getElementById("p1-info");
var playerTwoMessagePlaceHolder = document.getElementById("p2-info");

sessionStorage.removeItem("role");

database.ref().on("value", function (snapshot) {

    // Player one DB values
    playerOne = snapshot.val().player1;
    searchPlayerOne = playerOne.userName;
    playerOneAction = playerOne.action;

    if (searchPlayerOne !== "") {
        document.getElementById("p1-username-display").innerHTML = playerOne.userName;
        document.getElementById("p1-record-display").innerHTML = playerOne.winRecord + " - " + playerOne.lossRecord;    
    };
    
    // Player two DB values
    playerTwo = snapshot.val().player2;
    searchPlayerTwo = playerTwo.userName;
    playerTwoAction = playerTwo.action;

    if (searchPlayerTwo !== "") {
        document.getElementById("p2-username-display").innerHTML = playerTwo.userName;
        document.getElementById("p2-record-display").innerHTML = playerTwo.winRecord + " - " + playerTwo.lossRecord;
    } else {
        document.getElementById("p2-username-display").innerHTML = "Waiting for opponent ...";
        document.getElementById("p2-record-display").style.display = "none";
    }

    playerOneChoice = snapshot.val().player1.action;
    playerTwoChoice = snapshot.val().player2.action;
    gameOngoing = snapshot.val().game.currentGame;

    if (snapshot.child("username").exists()) {
        userName = snapshot.val().userName;
        winRecord = snapshot.val().winRecord;
        lossRecord = snapshot.val().lossRecord;

        document.getElementById("username-display").innerHTML = username;
        document.getElementById("record-display").innerHTML = winRecord + " - " + lossRecord;
    };

    if (gameOngoing) {
        playerSelectionSection.style.display = "none";
        currentPlayerSection.style.display = "block";
    } else {
        playerSelectionSection.style.display = "block";
    }

    if (roundCount === 3) {
        var p1Wins = snapshot.val().player1.roundWins;
        var p2Wins = snapshot.val().player2.roundWins;
        if (p1Wins > p2Wins) {
            warningMessage(searchPlayerOne, "alert alert-info")
        } else if (p2Wins > p1Wins) {
            warningMessage(searchPlayerTwo, "alert alert-info")
        };
        setTimeout(resetGame, 5000);
    } else {
        if (((playerOneChoice === "rock") || (playerOneChoice === "paper") || (playerOneChoice === "scissors")) && ((playerTwoChoice === "rock") || (playerTwoChoice === "paper") || (playerTwoChoice === "scissors"))) {
            if ((playerOneChoice === "rock" && playerTwoChoice === "scissors") ||
                (playerOneChoice === "scissors" && playerTwoChoice === "paper") ||
                (playerOneChoice === "paper" && playerTwoChoice === "rock")) {
                playerOneMessage("Winner!", "alert alert-success", playerOneWins);
                playerTwoMessage("Loser.", "alert alert-danger", playerTwoLosses);
                roundCount++;
                database.ref("/player1").update({
                    roundWins: playerOneWins,
                    action: ""
                });
                database.ref("/player2").update({
                    roundLosses: playerTwoLosses,
                    action: ""
                });
                database.ref("/game").update({
                    round: roundCount
                });
                // setTimeout(nextRound, 3000);
            } else if (playerOneChoice === playerTwoChoice) {

                // setTimeout(nextRound, 3000);
            } else {
                playerOneMessage("Loser.", "alert alert-danger", playerOneLosses);
                playerTwoMessage("Winner!", "alert alert-success", playerTwoWins);
                roundCount++;
                database.ref("/player1").update({
                    roundLosses: playerOneLosses,
                    action: ""
                });
                database.ref("/player2").update({
                    roundWins: playerTwoWins,
                    action: ""
                });
                database.ref("/game").update({
                    round: roundCount
                });
                // setTimeout(nextRound, 3000);
            };
        };
    };

});

document.getElementById("set-player").addEventListener("click", function (event) {

    event.preventDefault();

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

    if (searchPlayerOne === "") {
        database.ref("/player1").set(selectedUserObj);
        sessionStorage.setItem("role", "player1");
        playerOneActions.style.display = "block";
        currentPlayerSection.style.display = "block";
        playerSelectionSection.style.display = "none"
    } else if (searchPlayerOne === userName) {
        warningMessage("This user has already been set.", "alert alert-warning")
    } else if (searchPlayerTwo !== searchPlayerOne) {
        database.ref("/player2").set(selectedUserObj);
        sessionStorage.setItem("role", "player2");
        playerTwoActions.style.display = "block";
        messagePlaceholder.style.display = "none";
        currentPlayerSection.style.display = "block";
        playerSelectionSection.style.display = "none";
        database.ref("/game").update({
            currentGame: true
        });
    } else {
        sessionStorage.setItem("role", "observer");
    }

    document.getElementById("username-input").innerHTML = "";

});

function warningMessage(str, classes) {
    messagePlaceholder.innerHTML = str;
    messagePlaceholder.setAttribute("class", classes);
    messagePlaceholder.classList.add("animated", "fadeInUp", "faster")
    messagePlaceholder.style.display = "block";
};

function playerOneMessage(str, classes, variable) {
    playerOneMessagePlaceHolder.innerHTML = str;
    playerOneMessagePlaceHolder.setAttribute("class", classes);
    playerOneMessagePlaceHolder.classList.add("animated", "bounceIn", "faster")
    playerOneMessagePlaceHolder.style.display = "block";
    return variable++
}

function playerTwoMessage(str, classes, variable) {
    playerTwoMessagePlaceHolder.innerHTML = str;
    playerTwoMessagePlaceHolder.setAttribute("class", classes);
    playerTwoMessagePlaceHolder.classList.add("animated", "bounceIn", "faster")
    playerTwoMessagePlaceHolder.style.display = "block";
    return variable++
}

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

function nextRound() {
    var playerOneChoices = document.getElementsByClassName("p1-action");
    for (var i = 0; i < playerOneChoices.length; i++) {
        playerOneChoices[i].style.display = "block";
    };
    var playerTwoChoices = document.getElementsByClassName("p2-action");
    for (var i = 0; i < playerTwoChoices.length; i++) {
        playerTwoChoices[i].style.display = "block";
    };
    database.ref("/player1").update({
        action: ""
    });
    database.ref("/player2").update({
        action: ""
    });
    messagePlaceholder.style.display = "none";
    playerOneMessagePlaceHolder.style.display = "none";
    playerTwoMessagePlaceHolder.style.display = "none";

    clearTimeout();
};

function resetGame() {
    database.ref("/player1").set({
        userName: ""
    });
    database.ref("/player2").set({
        userName: ""
    });

    database.ref("/game").set({
        currentGame: false,
        round: 0
    });

    playerSelectionSection.style.display = "block";
    currentPlayerSection.style.display = "none";
    // newGameButton.style.display = "block";
    messagePlaceholder.style.display = "none";
    playerOneMessagePlaceHolder.classList.remove();
    playerTwoMessagePlaceHolder.classList.remove();
    messagePlaceholder.classList.remove();
    clearTimeout();
}




// Temp Reset Button
document.getElementById("reset-game").addEventListener("click", function (event) {
    event.preventDefault();

    database.ref("/player1").set({
        userName: ""
    });
    database.ref("/player2").set({
        userName: ""
    });

    database.ref("/game").set({
        currentGame: false,
        round: 0
    });

    playerSelectionSection.style.display = "block";
    currentPlayerSection.style.display = "none";
    // newGameButton.style.display = "block";
    messagePlaceholder.style.display = "none";
    playerOneMessagePlaceHolder.classList.remove();
    playerTwoMessagePlaceHolder.classList.remove();
    messagePlaceholder.classList.remove();
});
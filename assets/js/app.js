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
firebase.initializeApp(config);

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
var uid = "";

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
var role;


// Ideas for elements.
// 1. Dynamic content
// 2. Objects to show.

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

document.getElementById("set-player").addEventListener("click", function (event) {

    event.preventDefault();

    userName = document.getElementById("username-input").value

    // Sets the search reference location if an existing username is found
    var userNameSearch = database.ref("/users").orderByChild("userName").equalTo(userName);

    // Pulls data based on existing users and go through each child key.
    // Sets the entire object and username
    userNameSearch.on("value", function (snapshot) {
        // Store firebase key
        // Source: https://stackoverflow.com/questions/43615466/how-to-get-the-key-from-a-firebase-data-snapshot
        uid = Object.keys(snapshot.val())[0];
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
            uid = Object.keys(snapshot.val())[0];
            snapshot.forEach(function (childSnapshot) {
                selectedUserObj = childSnapshot.val();
                selectedUserName = selectedUserObj.userName;
            });
        });
    };

    if (searchPlayerOne === "") {
        database.ref("/player1").set(selectedUserObj);
        sessionStorage.setItem("role", "Player 1");
        sectionDisplay(playerOneActions, "block");
        sectionDisplay(currentPlayerSection, "block");
        sectionDisplay(playerSelectionSection, "none");
    } else if (searchPlayerOne === userName) {
        warningMessage("This user has already been set.", "alert alert-warning")
    } else if (searchPlayerTwo !== searchPlayerOne) {
        database.ref("/player2").set(selectedUserObj);
        sessionStorage.setItem("role", "Player 2");
        sectionDisplay(playerTwoActions, "block");
        sectionDisplay(currentPlayerSection, "block");
        sectionDisplay(playerSelectionSection, "none");
        sectionDisplay(messagePlaceholder, "none");
        database.ref("/game").update({
            currentGame: true
        });
    } else {
        sessionStorage.setItem("role", "Viewer");
    };

    document.getElementById("username-input").value = "";

});

document.getElementById("send-message").addEventListener("click", function (event) {
    event.preventDefault();
    var messageInput = document.getElementById("chat-message");
    var message = messageInput.value;
    var role;
    if (sessionStorage.role === undefined) {
        role = "Viewer";
    } else {
        role = sessionStorage.role;
    }
    database.ref("/messenger").push({
        message: message,
        messenger: role
    });
    document.getElementById("chat-message").value = "";
});

database.ref("/messenger").on("child_added", function (snapshot) {
    var newMessage = document.createElement('div');
    var messageBody = document.getElementById("sent-messages");
    var role = snapshot.val().messenger;
    newMessage.innerHTML = role + ": " + snapshot.val().message;
    newMessage.classList.add("message", "animated", "fadeInUp", "faster");
    messageBody.appendChild(newMessage);
});

database.ref().on("value", function (snapshot) {

    // Player One DB values
    playerOne = snapshot.val().player1;
    searchPlayerOne = playerOne.userName;
    playerOneRoundWins = playerOne.roundWins;
    playerOneRoundLosses = playerOne.roundLosses;
    playerOneChoice = playerOne.action;

    // Player Two DB values
    playerTwo = snapshot.val().player2;
    searchPlayerTwo = playerTwo.userName;
    playerTwoRoundWins = playerTwo.roundWins;
    playerTwoRoundLosses = playerTwo.roundLosses;
    playerTwoChoice = playerTwo.action;

    // Current Game Variables
    gameOngoing = snapshot.val().game.currentGame;

    // Sets Player One Card
    if (searchPlayerOne !== "") {
        document.getElementById("p1-username-display").innerHTML = playerOne.userName;
        document.getElementById("p1-record-display").innerHTML = playerOne.roundWins + " - " + playerOne.roundLosses;
    };

    // Sets Player Two Card
    if (searchPlayerTwo !== "") {
        document.getElementById("p2-record-display").style.display = "block";
        document.getElementById("p2-username-display").innerHTML = playerTwo.userName;
        document.getElementById("p2-record-display").innerHTML = playerTwo.roundWins + " - " + playerTwo.roundLosses;
    } else {
        document.getElementById("p2-username-display").innerHTML = "Waiting for opponent ...";
        document.getElementById("p2-record-display").style.display = "none";
    };

    // Checks DB for existing user
    if (snapshot.child("username").exists()) {
        userName = snapshot.val().userName;
        winRecord = snapshot.val().winRecord;
        lossRecord = snapshot.val().lossRecord;
    };

    // If there is a current game in progress, new user can only view.
    if (gameOngoing) {
        sectionDisplay(playerSelectionSection, "none");
        sectionDisplay(currentPlayerSection, "block");
    } else {
        sectionDisplay(playerSelectionSection, "block");
        sectionDisplay(currentPlayerSection, "none");
    };

    // First, if the number of total rounds is met, players are notified and game resets in 10 seconds
    if (roundCount === 3) {
        if (playerOneRoundWins > playerTwoRoundWins) {
            playerOneWins = playerOneWins++;
            playerTwoLosses = playerTwoLosses++;
            database.ref("/player1").update({
                winRecord: playerOneWins,
                roundWins: 0
            });
            database.ref("/player2").update({
                lossRecord: playerTwoLosses,
                roundLosses: 0
            });
            warningMessage(searchPlayerOne + " wins", "alert alert-info");
            sectionDisplay(messagePlaceholder, "block");
            updateUserRecord(uid);
        } else if (playerTwoRoundWins > playerOneRoundWins) {
            playerTwoWins = playerTwoWins++;
            playerOneLosses = playerOneLosses++;
            database.ref("/player1").update({
                lossRecord: playerOneLosses,
                roundLosses: 0
            });
            database.ref("/player2").update({
                winRecord: playerTwoWins,
                roundWins: 0
            });
            warningMessage(searchPlayerTwo + " wins", "alert alert-info");
            sectionDisplay(messagePlaceholder, "block");
            updateUserRecord(uid);
        };
        resetRound();
        setTimeout(resetGame, 3000);
        // Otherwise, game continues    
    } else {
        // First, checks to make sure that player one and two have made a selection.
        if (((playerOneChoice === "rock") || (playerOneChoice === "paper") || (playerOneChoice === "scissors")) && ((playerTwoChoice === "rock") || (playerTwoChoice === "paper") || (playerTwoChoice === "scissors"))) {
            // Checks for player one win
            if ((playerOneChoice === "rock" && playerTwoChoice === "scissors") ||
                (playerOneChoice === "scissors" && playerTwoChoice === "paper") ||
                (playerOneChoice === "paper" && playerTwoChoice === "rock")) {
                playerOneMessage("Winner!", "alert alert-success");
                playerTwoMessage("Loser.", "alert alert-danger");
                roundCount++;
                playerOneRoundWins++;
                playerTwoRoundLosses++;
                database.ref("/player1").update({
                    roundWins: playerOneRoundWins,
                    action: ""
                });
                database.ref("/player2").update({
                    roundLosses: playerTwoRoundLosses,
                    action: ""
                });
                database.ref("/game").update({
                    round: roundCount
                });
                setTimeout(nextRound, 3000);
                // Checks for tie
            } else if (playerOneChoice === playerTwoChoice) {
                warningMessage("It's a tie!", "alert alert-info");
                setTimeout(nextRound, 3000);
                // Checks for player two win
            } else {
                playerOneMessage("Loser.", "alert alert-danger");
                playerTwoMessage("Winner!", "alert alert-success");
                roundCount++;
                playerTwoRoundWins++;
                playerOneRoundLosses++;
                database.ref("/player1").update({
                    roundLosses: playerOneRoundLosses,
                    action: ""
                });
                database.ref("/player2").update({
                    roundWins: playerTwoRoundWins,
                    action: ""
                });
                database.ref("/game").update({
                    round: roundCount
                });
                setTimeout(nextRound, 3000);
            };
        };
    };

    // Gets player role from sessionStorage
    role = sessionStorage.getItem("role");
    if (role === "Player 1") {
        sectionDisplay(playerTwoActions, "none");
        sectionDisplay(playerOneActions, "block");
    } else if (role === "Player 2") {
        sectionDisplay(playerOneActions, "none");
        sectionDisplay(playerTwoActions, "block");
    } else {
        sectionDisplay(playerOneActions, "none")
        sectionDisplay(playerTwoActions, "none");
    };
});

database.ref("/player1").on("value", function (snapshot) {
    
});

database.ref("/player2").on("value", function (snapshot) {

});


function warningMessage(str, classes) {
    messagePlaceholder.innerHTML = str;
    messagePlaceholder.setAttribute("class", classes);
    messagePlaceholder.classList.add("animated", "fadeInUp", "faster")
    messagePlaceholder.style.display = "block";
};

function playerOneMessage(str, classes) {
    playerOneMessagePlaceHolder.innerHTML = str;
    playerOneMessagePlaceHolder.setAttribute("class", classes);
    playerOneMessagePlaceHolder.classList.add("animated", "bounceIn", "faster")
    playerOneMessagePlaceHolder.style.display = "block";
};

function playerTwoMessage(str, classes) {
    playerTwoMessagePlaceHolder.innerHTML = str;
    playerTwoMessagePlaceHolder.setAttribute("class", classes);
    playerTwoMessagePlaceHolder.classList.add("animated", "bounceIn", "faster")
    playerTwoMessagePlaceHolder.style.display = "block";
};

function setPlayerOneStats(element) {
    var choice = element.getAttribute("data-value");
    var selectedElement = element;
    var otherElements = document.getElementsByClassName("p1-action");
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

    sectionDisplay(messagePlaceholder, "none");
    sectionDisplay(playerOneMessagePlaceHolder, "none");
    sectionDisplay(playerTwoMessagePlaceHolder, "none");
    clearTimeout();
};

function resetRound() {
    roundCount = 0;
    database.ref("/game").set({
        currentGame: false,
        round: roundCount
    });
};

function updateUserRecord(str) {
    database.ref("/users").child(str).set({
        winRecord: winRecord,
        userName: userName,
        lossRecord: lossRecord,
        action: playerAction,
        roundWins: roundWins,
        roundLosses: roundLosses
    });
};

function resetGame() {
    sessionStorage.removeItem("role");
    database.ref("/player1").set({
        userName: ""
    });
    database.ref("/player2").set({
        userName: ""
    });

    sectionDisplay(playerSelectionSection, "block");
    sectionDisplay(currentPlayerSection, "none");
    sectionDisplay(messagePlaceholder, "none");
    playerOneMessagePlaceHolder.classList.remove();
    playerTwoMessagePlaceHolder.classList.remove();
    messagePlaceholder.classList.remove();
};

function sectionDisplay(variable, str) {
    var section = variable;
    section.style.display = str;
};



// Temp Reset Button
document.getElementById("reset-game").addEventListener("click", function (event) {
    event.preventDefault();

    resetRound();
    database.ref("/player1").set({
        userName: ""
    });
    database.ref("/player2").set({
        userName: ""
    });

    database.ref("/messenger").remove();

    database.ref("/messenger").push({
        message: "Get the conversation started. 💬",
        messenger: "Chat Bot"
    });

    var messageContainer = document.getElementById("sent-messages");
    messageContainer.parentNode.removeChild(messageContainer);

    playerSelectionSection.style.display = "block";
    currentPlayerSection.style.display = "none";
    messagePlaceholder.style.display = "none";
    playerOneMessagePlaceHolder.classList.remove();
    playerTwoMessagePlaceHolder.classList.remove();
    messagePlaceholder.classList.remove();
});
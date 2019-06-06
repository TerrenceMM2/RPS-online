$(document).ready(function () {

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

    $("#new-game").on("click", function (event) {
        event.preventDefault();

        database.ref("/player1").set({
            userName: "Ready Player 1"
        });
        database.ref("/player2").set({
            userName: "Ready Player 2"
        });

        $("#player-selection").show();
        $("#new-game").hide();
    });

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

    database.ref("/player1").on("value", function (snap) {
        playerOne = snap.val();
        searchPlayerOne = playerOne.userName;
        $("#p1-username-display").text(playerOne.userName);
        $("#p1-record-display").text(playerOne.winRecord + " - " + playerOne.lossRecord);
    });

    database.ref("/player2").on("value", function (snap) {
        playerTwo = snap.val();
        searchPlayerTwo = playerTwo.userName;
        $("#p2-username-display").text(playerTwo.userName);
        $("#p2-record-display").text(playerTwo.winRecord + " - " + playerTwo.lossRecord);
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

        console.log(searchPlayerOne);
        console.log(searchPlayerTwo)

        if (searchPlayerOne === "Ready Player 1") {
            database.ref("/player1").set(selectedUserObj);
        } else if (searchPlayerOne === userName) {
            console.log("Please choose another user");
        } else if (searchPlayerTwo === "Ready Player 2") {
            database.ref("/player2").set(selectedUserObj);
        } else {
            console.log("Player 1 & 2 are set.")
        }

        $("#current-players").show();
        $("#player-selection").hide();

        $(".form-control").val("");

    });


if (searchPlayerOne !== "Ready Player 1" && searchPlayerTwo !== "Ready Player 2") {
    $("#new-game").hide();
    $("#player-selection").hide();
    $("#current-players").show();
} else if (searchPlayerOne !== "Ready Player 1") {
    $("#new-game").hide();
    $("#player-selection").show();
};

});
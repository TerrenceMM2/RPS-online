# coursework7-rps-multiplayer
Vanderbilt Coding Boot Camp - Coursework7 - Rock, Paper, Scissors Multiplayer Game  
Live Link: https://terrencemm2.github.io/coursework7-rps-multiplayer/   
  
## Instructions  
1. Each player will enter their unique username.  
  1. If username already exists in the database, a new user entry is not created. (Usernames are case-sensitive).  
  1. Players are automatically assigned to Player 1 or Player 2 based on their order of submission.  
  1. A user will be notified if their Username input has already been set by another player.  
  1. All others will be listed as "viewers" and are able to watch the ongoing game.  
2. The game will begin once Player 1 and Player 2 are set.  
3. Both players will be shown their own rock (🌑), paper (📃), scissors (✂️) options and will make a selection.  
4. Once both players have made their RPS choice, a winner and loser for that round is calculated and a message shown.  
5. After 5 rounds, an overall winner and loser is declared and the game resets.  
* Chat functionality is available to all participants.  

### Pseudocode  
1. Initialize DB values ✔️  
2. Player 1 enters unique username (<input>) ✔️  
    * If userName in DB, notify end-user ✔️  
    * Store name in DB ✔️  
    * Set Player 1 in DB ✔️  
    * Show name on page ✔️  
3. Show Player 2 data (relative) ✔️  
4. Show rock, paper, scissors option  ✔️
5. Start time (5 seconds)  
6. Users clicks options ✔️  
    * Store in DB ✔️  
    * Show P1 choice ✔️  
    * Show P2 choice ✔️  
7. if/else statement ✔️️  
    * Win  
        * Set Winner in DB  
        * winCount++ in DB  
    * Loss  
        * if not Winner  
        * lossCount++ in DB  
    * roundCount++  
    * Show Winner from DB  
8. After 5 rounds, calculate winner ✔️️  

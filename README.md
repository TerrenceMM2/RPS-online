# coursework7-rps-multiplayer
Vanderbilt Coding Boot Camp - Coursework7 - Rock, Paper, Scissors Multiplayer Game  
Live Link: Coming Soon ...  
  
### Pseudocode  
1. Initialize DB values ✔️  
2. Player 1 enters unique username (<input>) ✔️  
    2. If userName in DB, notify end-user ✔️  
    2. Store name in DB ✔️  
    2. Set Player 1 in DB ✔️  
    2. Show name on page ✔️  
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
8. After 5 rounds, calculate winner  
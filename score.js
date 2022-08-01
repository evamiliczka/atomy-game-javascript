/** Tu ukladame paramaetre a vsetko o hracoch.
 * V inych suboroch hraca vidime ako cislo, momentlane 0 a 1
 */

 var Score = {
    _players: [
        {
            color: "blue",
            name: "Modry hrac",
            score: 0,
            node: null //kde v html ho budeme vypisovat
        },
        {
            color: "red",
            name: "Cerveny hrac",
            score: 0,
            node: null
        }
    ],
    _gameOver: false //true, ak niektory hrac zaplni vsetky bunky
}


Score.init = function(){
    for (var i=0; i<this._players.length; i++){
        var tempPlayer = this._players[i];
        tempPlayer.node = document.createElement("span");

        var p = document.createElement("p");
        p.style.color = tempPlayer.color;
        p.appendChild(document.createTextNode(tempPlayer.name + ": "));
        p.appendChild(tempPlayer.node);

        document.body.appendChild(p);
    }
}

Game.start = function(){
    Board.init();
    Draw.init();
    Score.init();
    Player.startListening();
}

Score.getColor = function(player){
    return this._players[player].color;
}

Score.getPlayerCount = function(){
    return this._players.length;
}

Score.isGameOver = function(){
    return this._gameOver;
}

Score.removePoint = function(player){
    if (player == -1) {return;}
    var tempPlayer = this._players[player];
    tempPlayer.score--;
    tempPlayer.node.innerHTML = tempPlayer.score;
}

Score.addPoint = function(player){
    var tempPlayer = this._players[player];
    tempPlayer.score++;
    tempPlayer.node.innerHTML = tempPlayer.score;

    /* Ak sme dosiahli max skore, t.j. hrac obsadil vsetky bunky, hra konci */
    if (tempPlayer.score == Game.SIZE * Game.SIZE) {
        Player.stopListening();
        this._gameOver = true;
        alert("Game over");
    }
}


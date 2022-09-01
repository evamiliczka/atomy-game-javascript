// Inteakcie pouzivatela s aplikaciou

var Player ={
    _current: 0 //evidujeme, ktory hrac je na tahu
};

Player.startListening = function(){
    document.body.addEventListener("click",Player);
}

Player.stopListening = function(){
    /** nebudeme specialne reagovat na klikanie mysou. 
     * Cely zvysok pocitaca a prehliadaca normalne reaguje, len my nie **/
    document.body.removeEventListener("click", Player);
}

Player.handleEvent = function(e) {
    var position = Draw.getPosition(e.clientX, e.clientY);
    if (!position) {return; }

    var x = position[0];
    var y = position[1];
    var existing = Board.getPlayer(x, y);
    /* Ak uz bunka ma prideleneho hraca a tan hrac je iny ako sucasny hrac, tah nepovolime */
    if (existing != -1 && existing != this._current) { return;}

    /* Inak, teda ka bunka nema pridelenho hraca, alebo je jej vlastnikom hrac na tahu, tak tah povolime a vykoname */
    Board.addAtom(x, y, this._current);
    /*Na tahu je dalsi hrac */
    this._current = (this._current +1) % Score.getPlayerCount();
}
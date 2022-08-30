// Inteakcie pouzivatela s aplikaciou

class Player {
    #color;
    #printedScore;
    constructor(name, color) {
        this.#color = color;
        this.#printedScore = document.createElement("span");

        const node = document.createElement("p");
        node.style.color = color;
        node.appendChild(document.createTextNode(name + ": "));

        document.getElementById("atomyRefactoring").appendChild(node);

    }

    get getColor(){
        return this.#color;
    }

    setScore(score){
        this.#printedScore.innerHTML = score;
    }

    play(board, draw, callback){
        //bude neskor
    }


    static startListening() {
        document.body.addEventListener("click", Player);

    }
    static stopListening() {
        /** nebudeme specialne reagovat na klikanie mysou.
         * Cely zvysok pocitaca a prehliadaca normalne reaguje, len my nie **/
        document.body.removeEventListener("click", Player);
    }

    static handleEvent(e) {
        var cursor = new XY(e.clientX, e.clientY);
        var position = Draw.getPosition(cursor);
        if (!position) { return; }

        var existing = Board.getPlayer(position);
        /* Ak uz bunka ma prideleneho hraca a tan hrac je iny ako sucasny hrac, tah nepovolime */
        if (existing != -1 && existing != this._current) { return; }

        /* Inak, teda ka bunka nema pridelenho hraca, alebo je jej vlastnikom hrac na tahu, tak tah povolime a vykoname */
        Board.addAtom(position, this._current);
        /*Na tahu je dalsi hrac */
        this._current = (this._current + 1) % Score.getPlayerCount();
    }


}

class PlayerHuman extends Player{}

class PlayerAI extends Player{}







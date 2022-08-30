class Game {
    SIZE;
    #players;
    #currentPlayer;
    #draw;
    #board;
    //players = pole s instncami hracu
    constructor(players){
        this.#players = players;
        this.#currentPlayer = 0;

        this.#draw = new Draw();
        this.#board = new Board(players, this.#draw);
        this.#board.onTurnDone = this.#turnDone.bind(this); ///???
        this.SIZE = 6;
    }
}

Game.start = function(){
    Board.init();
    Draw.init();
    Score.init();
    Player.startListening();
}
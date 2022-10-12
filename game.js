class Game {
    static SIZE = 2;
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
   
         /*  Poslouchač události dokončení tahu */   
        this.#board.onTurnDone = this.#TurnDone.bind(this); 

        this.#askPlayer();
    }

    #askPlayer(){
        const currentPlayer = this.#players[this.#currentPlayer];
        currentPlayer.play(this.#board, this.#draw, this.#playerExecuteMove.bind(this)); //???                                                                                                   }
    }

    /* Vykonanie tahu hraca, v orginali _playerDone */
    #playerExecuteMove(xy){
        const player = this.#players[this.#currentPlayer];
        const existing = this.#board.getPlayer(xy);

        /*Podmienkou, ze hrac moze tahat na danu bunku je, ze je bud prazdna, alebo mu patri. Teda bud
           1. bunka je prazdna = este nepatri ziadnemu hracovi....teda existing=0 teda..... !existing<>0
           alebo
           2. existing === player ...patri danemu hracovi */
        if (!existing || existing === player){
            this.#board.addAtom(xy, player);
        }
        else{ //ak v danej bunke tahat nemoze, pocuvame na jeho tah aj nadalej
            this.#askPlayer();
        }
    } //#playerExecuteMove

    #TurnDone(){
        const scores = []; 

        for (let i=0; i < this.#players.length; i++){
            const player = this.#players[i];
            const score = this.#board.getScoreFor(player);
            player.printScore(score);
            scores.push(score);
            
            //this.#players[i].printScore(score[i]);
        }
        if (Game.isOver(scores)) {return;} //game over

        this.#currentPlayer = (this.#currentPlayer + 1) % this.#players.length;
        this.#askPlayer();        
    } //

    static isOver(score){
        return (Math.max.apply(Math, score) === this.SIZE * this.SIZE);
    }



}
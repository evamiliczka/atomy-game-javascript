class Game {
    static SIZE = 5;
    #players;
    #currentPlayer;
    #draw;
    #board;
    //players = pole s instncami hracu
    constructor(){
        this.#players = [];
        this.#currentPlayer = 0;
        this.#draw = new Draw();
        this.#board = null;    
    }

    start(players){
        this.#players = players;
        this.#board = new Board(players, this.#draw);
     /*  Poslouchač události dokončení tahu */   
        this.#board.onTurnDone = this.#turnDone.bind(this); 
        this.#askPlayer();
    }

    canContinue(){
        return !!localStorage.getItem("atoms"); //dva vykricniky su PRETYPOVANIE na True/false
    }

    save(){
        const data = {
            board : this.#board.getState(),
            currentPlayer: this.#currentPlayer,
            players:[]    
        };

        for (let i=0; i<this.#players.length; i++){
            data.players.push(this.#players[i].getState());
        }

        const myJson = JSON.stringify(data);
        localStorage.setItem("atoms", myJson);
    }

    load(){
        var myJson = localStorage.getItem("atoms");

        try{
            var data = JSON.parse(myJson);
        }
            catch(e){
                alert("Badly formatted game data");
        }

        for (let i=0; i<data.players.length; i++){
            this.#players.push(Player.fromState(data.players[i]));
        }

        this.#board = new Board(this.#players, this.#draw);
        this.#board.onTurnDone = this.#turnDone.bind(this);
        this.#board.setState(data.board);

        this.#currentPlayer = data.currentPlayer;
        this.#updateScores();
        this.#askPlayer();
    }

    #updateScores(){
        const scores = [];
    
        for (let i=0; i<this.#players.length; i++) {
            const player = this.#players[i];
            const score = this.#board.getScoreFor(player);
            player.printScore(score);
            scores.push(score);
        }
        return scores;
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

    #turnDone(){
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
        this.save();

        this.#askPlayer();        
    } //

    static isOver(score){
        return (Math.max.apply(Math, score) === this.SIZE * this.SIZE);
    }



}
class PlayerAI extends Player{
    //nahodne vlozim atom do niektorej z moznych buniek = prazdnych alebo mojich
    play(board, draw, callback){
        const available = [];

        for (let i=0; i<Game.SIZE; i++){
            for (let j=0; j<Game.SIZE; j++){
                const xy = new XY(i, j);
                const player = board.getPlayer(xy);
                if (!player || player === this) {available.push(xy);}
            }
        }
        const index = Math.floor(Math.random() * available.length);
        callback(available[index]);
    } //play

}
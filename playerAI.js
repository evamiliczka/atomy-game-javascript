class PlayerAI extends Player{   
    
play(board, draw, callback){
        //V scoes si budem uchovavat, kolko bodov by som ziskal polozenim atomu na dane policko, alebo tak nejako
    
        var scores = {};

        for (let i=0; i< Game.SIZE; i++){
            for (let j=0; j<Game.SIZE; j++){
                var xy = new XY(i,j);
                var player = board.getPlayer(xy);
                // Ak na dane pole nemozem hrat - teda nie je null a sucasne nie je obsadene tymto hracom, tak nic
                if (player != null && player != this) {continue;}
                scores[xy] = this.#tryToPutAtomAndGetScore(board, xy);
            }
        }
        const best = this.#pickBestMove(scores);
        //Pokracujem tahom na vybrate najlepsie pole
        callback(best);
}

getState(){
        let state = super.getState();
        state.type = "PlayerAI";
        return state;
}

    
/* Pokusne umiestnenie atomu do bunky a zistenie, k akemu skore by tento tah viedol.
*/
#tryToPutAtomAndGetScore(board, xy){
    const clone = board.clone();
    clone.addAtom(xy, this);
    return clone.getScoreFor(this);
}

/* Scores obsahuje tolik klicu, kolik je na plose povolenych tahu.  */
#pickBestMove(scores){
    let positions = [];
    let best = 0;
    for (let p in scores){
        const score = scores[p];

        if (score > best){
            best = score;
            positions = [];
        }

        if (score == best) { positions.push(p);} 
    }
    // Nahodne vyberieme jednu z maximalnych pozicii
    const position = positions[Math.floor(Math.random() * positions.length)];
    return XY.fromString(position);
}

}
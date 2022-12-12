class PlayerHuman extends Player{
    #callback;
    #draw;

    play(board, draw, callback){
        this.#callback = callback;
        this.#draw = draw;
        document.body.addEventListener("click", this);
    }


    getState(){
        let state = super.getState();
        state.type = "PlayerHuman";
        return state;
     }

    handleEvent(e){
        const cursor = new XY(e.clientX, e.clientY);
        const position = this.#draw.getPosition(cursor); //ktora bunka
        if (!position) {return;} //ak klikol mimo, tak nic    
        
        document.body.removeEventListener("click", this);

        this.#callback(position);
    }

}
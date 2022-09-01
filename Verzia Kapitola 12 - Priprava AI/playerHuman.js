class PlayerHuman extends Player{
    #callback;
    #draw;

    play(board, draw, callback){
        this.#callback = callback;
        this.#draw = draw;
        document.body.addEventListener("click", this);
    }

    handleEvent(e){
        const cursor = new XY(e.clientX, e.clientY);
        const position = this.#draw.getPosition(cursor); //ktora bunka
        if (!position) {return;} //ak klikol mimo, tak nic    
        
        document.body.removeEventListener("click", this);

        this.#callback(position);
    }

}
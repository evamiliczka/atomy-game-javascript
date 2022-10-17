// Inteakcie pouzivatela s aplikaciou

class Player {
    #color;
    #printedScore;
    #name;
    constructor(name, color) {
        this.#color = color;
        this.#name = name;
        this.#printedScore = document.createElement("span");

        const node = document.createElement("p");
        node.style.color = color;
        node.appendChild(document.createTextNode(name + ": "));
        node.appendChild(this.#printedScore);
        console.log('Idem vypisat GetElementBy id');
        console.log(document.getElementById("atomy"));
        document.getElementById("atomy").appendChild(node);
        
    }

    getName(){
        return this.#name;
    }
    getColor(){
        return this.#color;
    }

    printScore(score){
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

    


}




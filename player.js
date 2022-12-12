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
        //implementovana v podtriede
    }

    getState(){
        const state = {
            name: this.#name,
            color: this.#color
        };
        return state;   
    }


    //Vytvorenie hraca z dat
    static fromState(state){
        let constructors = {
            "PlayerHuman" : PlayerHuman,
            "PlayerAI": PlayerAI
        }

        if (state.type in constructors){
            let constructor = constructors[state.type];
            return new constructor(state.name, state.color);
        }
        else
            throw new Error("Badly formatted game data"); 
        /*
        switch (state.type){ 
            case "PlayerHuman": 
                return new PlayerHuman(state.name, state.color);
                break;
            case "PlayerAI":
                return new PlayerAI(state.name, state.color);
                break;
            default:
                throw new Error("Badly formatted game data"); 
            }*/
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




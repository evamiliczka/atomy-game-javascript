// Praca s hlavnou datovou strukturou - stavom hracej plochy 

class Board {
    DELAY; 
    #draw;
    #data;
    #criticals;
    #players;
    #score; 
    //players..pole s instancemi hracu, draw..objekt typu DRAW
    constructor(players, draw){
        this.DELAY = 200; //pri vykreslovani
        //this.onTurnDone = function(){}; //zavolame po kazdom tahu, definujeme neskor

        this.#draw = draw;
        this.#data = {}; //objekt ex nihilo - zoznam vsetkych buniek typu cell: [atoms (number of atoms), limit, player] - indexujeme "suradnicami" !!!
        this.#criticals = [] //zoznam kritickych buniek
        this.#players = players;
        this.#score = [];
        //nastavime skore vsetkych hracov na 0
        for (let i=0; i<players.length; i++){
            this.#score.push(0);
        }
        
        //naplnime hraciu polochu
        for (let i=0 ; i < Game.SIZE; i++){
            //nastavenie limitov
            for (let j=0 ; j < Game.SIZE;j++){
                const xy = new XY(i, j); //prazdne suradnice
             //   console.log(xy);
                const limit = this.#getLimit(xy); //zisti limit
             //   console.log(limit);
                const cell={
                    atoms: 0, //nastav pocet atomov
                    limit: limit, //nastav 
                    player: null //vlastnik bunky
    
                }
              //  console.log(cell);
                this.#data[xy] = cell; 
               // console.log(this.#data[xy]);
            }
        }
      
    } //constructor

    onTurnDone = function(){} //???

    getColor (player){
            return this.#players[player].color;
        }

    get getPlayerCount(){
            return this.#players.length;
        }

    /* Kto vlastni bunku s danymi suradnicami? */
    getPlayer(xy){
        return this.#data[xy].player;
    }

    /* Pridanie atomu */
    addAtom(xy, player){
        /* Pridame, mozno sa zmenilo this._criticals */
        this.#addAndPush(xy, player);
        
        if (Game.isOver(this.#score)){
            this.#onGameOver();
          
        }
        else
            /* Ak mame kriticke bunky */
            if (this.#criticals.length > 0){
                this.#explode();
            }
            else{//pridanie bez rozpradu ci konca hry
            this.onTurnDone(this.#score);}
    }

    //Vypisovanie na konci hry
    #onGameOver(){
        const maxScore = Math.max.apply(null, this.#score);
        console.log(maxScore);
        const winnerIndex = this.#score.indexOf(maxScore);
        console.log(winnerIndex);
        document.body.appendChild(document.createTextNode("The winner is: "));

        document.body.appendChild(document.createTextNode(this.#players[winnerIndex].getName()));
    }

    /* Pridaj atom a pripadne pridaj (push) bunky do zoznamu kritickych buniek */
    #addAndPush = function(xy, player){
        const cell = this.#data[xy];

        if (cell.player){ //ak ma bunka priradeneho hraca, odeberiem mu bid
            const oldPlayerIndex = this.#players.indexOf(cell.player);
            this.#score[oldPlayerIndex]--;
        }

        /* pridad bod novemu */
        const playerIndex = this.#players.indexOf(player);
        this.#score[playerIndex]++;

        //novy vlastnik bunky
        cell.player = player;

        cell.atoms++; //priaj atomy

        this.#draw.drawCell(xy,cell.atoms, cell.player);
        

        /* Ak je prekrocene nadkriticke mnozstvo */
        if (cell.atoms > cell.limit){
            /* Ak uz bunka je medzi kritickymi, nedame ju tam, koncime bez pridania */
            for (let i=0; i < this.#criticals.length; i++){
                var tmp = this.#criticals[i];
                if (tmp.equals(xy)) {return;}
            } //ak nie je medzi kritickymi
            this.#criticals.push(xy);
        }

    }



    #explode = function(){ //!! toto upravujem sama
        //if (this.#criticals.length == 0) {console.log("pomoc, nemam co odoberat"); debugger;}
        const xy = this.#criticals.shift(); //odebereme prvni prvek, mohli by sme i posledny
        

        const cell = this.#data[xy]; //vyberieme si danu bunku

        const neighbors = xy.getNeighbors(); //vysledok je pole suradnic
        cell.atoms -= neighbors.length; //odoberieme tolko atomov, kolko ma susedov
        // !!! console.log("Bunka ", xy.x," ",xy.y," menim pocet atomov (--) na ", cell.atoms);
    //  debugger;
        this.#draw.drawCell(xy, cell.atoms, cell.player);

        /* Prejdeme susedne bunky a pridame do nich po atome */
        for (let i=0; i<neighbors.length; i++){
            this.#addAndPush(neighbors[i], cell.player);
        }


        if (Game.isOver(this.#score)){
            this.#onGameOver();
        }
        /** Ak nie su ziadne nadkriticke bunky, mozeme pokracovat a povolit mys.
         * Ak rozprad pokracuje, naplanujeme dalsiu exploziu za dobu Board.DELAY
         */
        else
            if (this.#criticals.length){
            setTimeout(this.#explode.bind(this), this.DELAY);
        } 
            else {  /* konec reakce, hra pokračuje */
             //this.#draw.cell(xy);
            this.onTurnDone(this.#score); //???
        }
    }

    // Ziskat pocet atomov na danych suradniciach
        getAtoms = function(xy){
        return this.#data[xy].atoms;
        }

        #getLimit = function(xy){
            return xy.getNeighbors().length;
        }




}

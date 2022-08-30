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
        this.#draw = draw;
        this.#data = {}; //objekt ex nihilo - zoznam vsetkych buniek typu cell: [atoms (number of atoms), limit, player] - indexujeme "suradnicami" !!!
        this.#criticals = [] //zoznam kritickych buniek
        this.#players = players;
        this.#score = [];
        //nastavime skore vsetkych hracov na 0
        for (let i=0; i<players.length; i++){
            this.#score.push(0);
        }
        this.#build();
}

    #build () {
        /* Naplnime pole */
        for (let i=0 ; i < this.SIZE; i++){
            //nastavenie limitov
            for (let j=0 ; j < this.SIZE;j++){
                const xy = new XY(i, j); //prazdne suradnice
                const limit = this.#getLimit(xy); //zisti limit
                const cell={
                    atoms: 0, //nastav pocet atomov
                    limit: limit, //nastav 
                    player: -1 //vlastnik bunky
    
                }
                this.#data[xy] = cell; 
            }
        }
        } //#build

    onTurnDone(){}

    removePoint(player){
        if (player == -1) {return;}
        this.#score[player]--;
        this.#players[player].setScore(this.#score[player]);
        }

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
    addAtom = function(xy, player){
        /* Pridame, mozno sa zmenilo this._criticals */
        this.#addAndPush(xy, player);
        
        if (Score.isGameOver()){ return;}
        else
            /* Ak mame kriticke bunky */
            if (this.#criticals.length > 0){
                Player.stopListening(); //???
                this.#explode();
            }
    }

    /* Pridaj atom a pripadne pridaj (push) bunky do zoznamu kritickych buniek */
    #addAndPush = function(xy, player){
        var cell = this.#data[xy];

        /* Zmena poctu bodov (=poctu vlastnenych buniek) -povodny vlastnik bunky straca bod, novy vlastnik ziskava bod. Moze to byt aj ten isty hrac */
        Score.removePoint(cell.player);
        Score.addPoint(player);

        cell.atoms++; //priaj atomy
        cell.player = player; //hrac, ktory pridal atom sa stava novym vlstnikom bunky, moze to byt aj ten isty

        this.#draw.cell(xy);
        

        /* Ak je prekrocene nadkriticke mnozstvo */
        if (cell.atoms > cell.limit){
            /* Ak uz bunka je medzi kritickymi, nedame ju tam, koncime bez pridania */
            for (var i=0; i < this.#criticals.length; i++){
                var tmp = this.#criticals[i];
                if (tmp.equals(xy)) {return;}
            } //ak nie je medzi kritickymi
            this.#criticals.push(xy);
        }

    }



    #explode = function(){ //!! toto upravujem sama
        if (this.#criticals.length == 0) {console.log("pomoc, nemam co odoberat"); debugger;}
        var xy = this.#criticals.shift(); //odebereme prvni prvek, mohli by sme i posledny
        

        var cell = this.#data[xy]; //vyberieme si danu bunku

        var neighbors = xy.getNeighbors(); //vysledok je pole suradnic
        cell.atoms -= neighbors.length; //odoberieme tolko atomov, kolko ma susedov
        // !!! console.log("Bunka ", xy.x," ",xy.y," menim pocet atomov (--) na ", cell.atoms);
    //  debugger;

        /* Prejdeme susedne bunky a pridame do nich po atome */
        for (var i=0; i<neighbors.length; i++){
            var xxyy = neighbors[i]; //vyberiem i-tu bunku
            this.#addAndPush(xxyy, cell.player);
        }


        if (Score.isGameOver()){
            return;
        }
        /** Ak nie su ziadne nadkriticke bunky, mozeme pokracovat a povolit mys.
         * Ak rozprad pokracuje, naplanujeme dalsiu exploziu za dobu Board.DELAY
         */
        else
            if (this.#criticals.length){
            setTimeout(this.#explode.bind(this), this.DELAY);
        } 
            else {
            this.#draw.cell(xy);
            Player.startListening(); //???
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

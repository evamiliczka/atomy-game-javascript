// Praca s hlavnou datovou strukturou - stavom hracej plochy 

class Board {
    DELAY; 
    #draw;
    #data;
    #criticals;
    #players;
    #score; 
    #audio;
    //players..pole s instancemi hracu, draw..objekt typu DRAW
    constructor(players, draw){
        this.DELAY = 200; //pri vykreslovani
        //this.onTurnDone = function(){}; //zavolame po kazdom tahu, definujeme neskor

        this.#draw = draw;
        this.#data = {}; //objekt ex nihilo - zoznam vsetkych buniek typu cell: [atoms (number of atoms), limit, Cislo hraca!!!] - indexujeme "suradnicami" !!!
        this.#criticals = [] //zoznam kritickych buniek
        this.#players = players;
        this.#score = []; //skore vsetkych hracov
        //nastavime skore vsetkych hracov na 0
        for (let i=0; i<players.length; i++){
            this.#score.push(0);
        }
        
        this.#audio = new Audio();
        
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
                    player: -1 // cislo vlastnika bunky
    
                }
              //  console.log(cell);
                this.#data[xy] = cell; 
               // console.log(this.#data[xy]);
            }
        }
      
      
    } //constructor

    //vyrobit klon
    clone(){
      //  debugger; //!!!
        // Vytvorime novy board. Premenna draw je null - nechcem aby klon nieco vykresloval
         const clone = new Board(this.#players, null);
        //const clone= Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        /*Vsetky zlozitejsie datove typy su predavane odkazom, 
         takze nemozeme dat   clone.#score = this.#score; 
         SLICE - vrati kopiu casti pola zacinajucu danym indexom
        */
        clone.#score = this.#score.slice(0); 

        /* Tu nastavime dalsie vlastnosti */
        //prechadzam a kopirujem vsetky bunky v #data, su to objekty typu CELL, indexovane typom XY
        for (let p in this.#data) {
            const ourCell = this.#data[p];
            //pomocna struktura, odkaz je predavany ODKAZOM, takze zmena v cloneCell sposobi zmenu v clone.#data[p]
            const cloneCell = clone.#data[p]; 
            cloneCell.atoms = ourCell.atoms;
            cloneCell.player = ourCell.player;
        }
        return clone;
    }

    getState(){
        return{
            score: this.#score,
            data: this.#data
        }
    }

    setState(state){
        this.#score = state.score;
        this.#data = state.data;

    /* prekreslit celu plochu */
        for (let p in this.#data){
            const cell = this.#data[p];
            const player = this.#players[cell.player];
            const xy = XY.fromString(p);
            this.#draw.drawCell(xy, cell.atoms, player);
        }
    }

    onTurnDone = function(){} //???

    // Vracia skore daneho hraca; player je objekt
    getScoreFor(player){
        const index = this.#players.indexOf(player);
        return this.#score[index];
    }

    getColor(player){
            return this.#players[player].color;
        }

    get getPlayerCount(){
            return this.#players.length;
        }

    /* Kto vlastni bunku s danymi suradnicami? */
    getPlayer(xy){
        const index = this.#data[xy].player;
        return (index == -1 ? null : this.#players[index]);
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
                this.#explode(0);
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
        // The winner is vyisujeme len ak nie sme v testovacom rezime,, teda len ak this.#draw nie je null
        if (this.#draw){
            document.body.appendChild(document.createTextNode("The winner is: "));
            document.body.appendChild(document.createTextNode(this.#players[winnerIndex].getName()));
        }
    }

    /* Pridaj atom a pripadne pridaj (push) bunky do zoznamu kritickych buniek */
    #addAndPush = function(xy, player){
        const cell = this.#data[xy];

        if (cell.player != -1){ //ak ma bunka priradeneho hraca, odeberiem mu bod
            this.#score[cell.player]--;
        }

        /* pridad bod novemu */
        const playerIndex = this.#players.indexOf(player);
        this.#score[playerIndex]++;

        //novy vlastnik bunky
        cell.player = playerIndex;

        cell.atoms++; //priaj atomy
        /* Draw moze byt null, ak je volana v suvislosti s AI.
        Preto prikaz vykonam len ak draw nie je null */
        if (this.#draw){
            this.#draw.drawCell(xy,cell.atoms, player);
        }

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


/*
    Sucasna logika komponenty Board teraz spociva v tom, ze kazdy rozpad (jednotlivy aj retazovy) je
    ukonceny viac menej zbytocnym volanim #explode, v ktorom je splnena podmienka this.#criticals.length === null,
    a preto dojde k ukonceniu tahu
*/

    #explode = function(soundLevel){ 
        //ak uz mame ukoncit tah
        if (Game.isOver(this.#score) || !this.#criticals.length) //ak je koniec hry, alebo uz nie su kriticke bunky, oni maju !this.#criticals.length
        {
            this.onTurnDone();
            return;
        }

        const xy = this.#criticals.shift(); //odebereme prvni prvek, mohli by sme i posledny 
        const cell = this.#data[xy]; //vyberieme si danu bunku

        //cell.player je cislo
        const player = this.#players[cell.player];

        const neighbors = xy.getNeighbors(); //vysledok je pole suradnic
        cell.atoms -= neighbors.length; //odoberieme tolko atomov, kolko ma susedov

          /* Prejdeme susedne bunky a pridame do nich po atome */
          for (let i=0; i<neighbors.length; i++){
            this.#addAndPush(neighbors[i], player);
        }

      /* Draw moze byt null, ak je volana v suvislosti s AI.
        Preto prikaz vykonam len ak draw nie je null */
        if (this.#draw){
            this.#draw.drawCell(xy, cell.atoms, player);
            this.#audio.play(soundLevel);
            /* Naplanujeme 
            1. Zastaveni zvuku o DELAY/2
            2. Opakovane volani metody s vyssim levelem zvuku
            */
            setTimeout(this.#audio.stop.bind(this.#audio), this.DELAY / 2);
            setTimeout(this.#explode.bind(this, soundLevel + 1), this.DELAY);
        }
        else { //toto je len simulacia, neviem preco zvysuje AudioLevel
            this.#explode(soundLevel + 1);
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

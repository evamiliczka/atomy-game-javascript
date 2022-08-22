// Praca s hlavnou datovou strukturou - stavom hracej plochy 

var Board = {
    DELAY: 200, //pri vykreslovani
    _data: {}, //objekt ex nihilo - zoznam vsetkych buniek typu cell: [atoms (number of atoms), limit] - indexujeme "suradnicami" !!!
    _criticals: [] //zoznam kritickych buniek
};

// Hracie pole Board._data je pole poli naplnene bunkami cell [[cell cell cell cell...] [...] [..] ... ]
// cell ma sve poloky - pocet atomov (atoms) a kriticke mnozstvo (limit)
// limit si ukladame, aj ked ho vieme spocitat, lebo sa bude casto pouzivat
Board.init = function() {
 for (var i=0; i<Game.SIZE; i++){
    //nastavenie limitov
    for (var j=0;j<Game.SIZE;j++){
        var xy = new XY(i, j); //prazdne suradnice
        var limit = this._getLimit(xy); //zisti limit
        var cell={
            atoms: 0, //nastav pocet atomov
            limit: limit, //nastav 
            player: -1 //hracov si cislujem, 0,1, kazda bunka s niecim patri prave jednemu hracovi

        }
        this._data[xy] = cell; //pridaj bunku, automaticky bude pouzita metoda "toString"
    }
 }
} //Board.init

/* Kto vlastni bunku s danymi suradnicami? */
Board.getPlayer = function(xy){
    return this._data[xy].player;
}

/* Pridanie atomu */
Board.addAtom = function(xy, player){
    /* Pridame, mozno sa zmenilo this._criticals */
    this._addAndPush(xy, player);
    
    if (Score.isGameOver()){ return;}
    else
        /* Ak mame kriticke bunky */
        if (this._criticals.length > 0){
            Player.stopListening(); 
            this._explode();
        }
}

/* Pridaj atom a pripadne pridaj (push) bunky do zoznamu kritickych buniek */
Board._addAndPush = function(xy, player){
    var cell = this._data[xy];

    /* Zmena poctu bodov (=poctu vlastnenych buniek) -povodny vlastnik bunky straca bod, novy vlastnik ziskava bod. Moze to byt aj ten isty hrac */
    Score.removePoint(cell.player);
    Score.addPoint(player);

    cell.atoms++; //priaj atomy
    cell.player = player; //hrac, ktory pridal atom sa stava novym vlstnikom bunky, moze to byt aj ten isty

    Draw.cell(xy);
    

    /* Ak je prekrocene nadkriticke mnozstvo */
    if (cell.atoms > cell.limit){
        /* Ak uz bunka je medzi kritickymi, nedame ju tam, koncime bez pridania */
        for (var i=0; i < this._criticals.length; i++){
            var tmp = this._criticals[i];
            if (tmp.equals(xy)) {return;}
        } //ak nie je medzi kritickymi
        this._criticals.push(xy);
    }

}



Board._explode = function(){ //!! toto upravujem sama
    if (this._criticals.length == 0) {console.log("pomoc, nemam co odoberat"); debugger;}
    var xy = this._criticals.shift(); //odebereme prvni prvek, mohli by sme i posledny
    

    var cell = this._data[xy]; //vyberieme si danu bunku

    var neighbors = xy.getNeighbors(); //vysledok je pole suradnic
    cell.atoms -= neighbors.length; //odoberieme tolko atomov, kolko ma susedov
    // !!! console.log("Bunka ", xy.x," ",xy.y," menim pocet atomov (--) na ", cell.atoms);
  //  debugger;

    /* Prejdeme susedne bunky a pridame do nich po atome */
    for (var i=0; i<neighbors.length; i++){
        var xxyy = neighbors[i]; //vyberiem i-tu bunku
        this._addAndPush(xxyy, cell.player);
    }


    if (Score.isGameOver()){
        return;
    }
    /** Ak nie su ziadne nadkriticke bunky, mozeme pokracovat a povolit mys.
     * Ak rozprad pokracuje, naplanujeme dalsiu exploziu za dobu Board.DELAY
     */
    else
        if (this._criticals.length){
        setTimeout(this._explode.bind(this), this.DELAY);
    } 
        else {
        Draw.cell(xy);
        Player.startListening();
    }
}



// Ziskat pocet atomov na danych suradniciach
Board.getAtoms = function(xy){
    return this._data[xy].atoms;
}

Board._getLimit = function(xy){
    return xy.getNeighbors().length;
}


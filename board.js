// Praca s hlavnou datovou strukturou - stavom hracej plochy 

var Board = {
    DELAY: 200, //pri vykreslovani
    _data: [], //zoznam vsetkych buniek typu cell: [atoms (number of atoms), limit]
    _criticals: [] //zoznam kritickych buniek
};

// Hracie pole Board._data je pole poli naplnene bunkami cell [[cell cell cell cell...] [...] [..] ... ]
// cell ma sve poloky - pocet atomov (atoms) a kriticke mnozstvo (limit)
// limit si ukladame, aj ked ho vieme spocitat, lebo sa bude casto pouzivat
Board.init = function() {
 for (var i=0; i<Game.SIZE; i++){
    this._data.push([]);

    //nastavenie limitov
    for (var j=0;j<Game.SIZE;j++){
        var limit = this._getLimit(i,j); //zisti limit
        var cell={
            atoms: 0, //nastav pocet atomov
            limit: limit, //nastav 
            player: -1 //hracov si cislujem, 0,1, kazda bunka s niecim patri prave jednemu hracovi

        }
        this._data[i].push(cell); //pridaj bunku do pola
    }
 }
} //Board.init

/* Kto vlastni bunku s danymi suradnicami? */
Board.getPlayer = function(x,y){
    return this._data[x][y].player;
}

/* Musime vediet, kto pridava danu binku  - to je player */
Board.addAtom = function(x,y, player){
    /* Pridame, mozno sa zmenilo this._criticals */
    this._addAndPush(x,y, player);
    
    if (Score.isGameOver()){ return;}
    else
        /* Ak mame kriticke bunky */
        if (this._criticals.length > 0){
            Player.stopListening(); 
            this._explode();
        }
}

/* Pridaj atom a pripadne pridaj (push) bunky do zoznamu kritickych buniek */
Board._addAndPush = function(x,y, player){
    var cell = this._data[x][y];

    /* Zmena poctu bodov (=poctu vlastnenych buniek) -povodny vlastnik bunky straca bod, novy vlastnik ziskava bod. Moze to byt aj ten isty hrac */
    Score.removePoint(cell.player);
    Score.addPoint(player);

    cell.atoms++; //priaj atomy
    cell.player = player; //hrac, ktory pridal atom sa stava novym vlstnikom bunky, moze to byt aj ten isty

    Draw.cell(x,y);
    

    /* Ak je prekrocene nadkriticke mnozstvo */
    if (cell.atoms > cell.limit){
        /* Ak uz bunka je medzi kritickymi, nedame ju tam, koncime bez pridania */
        for (var i=0; i < this._criticals.length; i++){
            var tmp = this._criticals[i];
            if (tmp[0] == x && tmp[1] == y) {return;}
        } //else
        this._criticals.push([x,y]);
    }

}



Board._explode = function(){
    if (this._criticals.length == 0) {console.log("pomoc, nemam co odoberat"); debugger;}
    var pair = this._criticals.shift(); //odebereme prvni prvek, mohli by sme i posledny
    


    var x = pair[0];
    var y = pair[1];
    var cell = this._data[x][y]; //vyberieme si danu bunku

    var neighbors = this._getNeighbors(x,y); //vysledok je pole suradnic
    cell.atoms -= neighbors.length; //odoberieme tolko atomov, kolko ma susedov
    console.log("Bunka ", [x]," ",[y]," menim pocet atomov (--) na ", cell.atoms);
  //  debugger;

    /* Prejdeme susedne bunky a pridame do nich po atome */
    for (var i=0; i<neighbors.length; i++){
        var suradnice = neighbors[i]; //vyberiem i-tu bunku
        this._addAndPush(suradnice[0],suradnice[1], cell.player);
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
        Draw.cell(x,y);
        Player.startListening();
    }
}

Board._getNeighbors = function(x,y){
    var results = []; //pole dvojic, napr [ [0,0], [1,1], [0,2] ]
    if (x   > 0)          {results.push([x-1,   y]); } //ak nie je celkom vlavo, pridame suseda atom nalavo
    if (x+1 < Game.SIZE)  {results.push([x+1,   y]); } 
    if (y   > 0)          {results.push([  x, y-1]); } 
    if (y+1 < Game.SIZE)  {results.push([  x, y+1]); } 
    return results;
}

// Ziskat pocet atomov na danych suradniciach
Board.getAtoms = function(x,y){
    return this._data[x][y].atoms;
}

Board._getLimit = function(x,y){
    var limit = 4; //dafault, u stredovych buniek
    if (x == 0 || x+1 == Game.SIZE) {limit --; } //ak sme na lavom alebo pravom kraji v x-ovom smere, znizime limit
    if (y == 0 || y+1 == Game.SIZE) {limit --; } //ak sme na lavom alebo pravom kraji v y-ovom smere, znizime limit, hra je stvorcova
    return limit;
}


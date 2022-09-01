// Praca s hlavnou datovou strukturou - stavom hracej plochy 

var Board = {
    _data: []
};

// Hracie pole je pole poli naplnene bunkami cell [[cell cell cell cell...] [...] [..] ... ]
// cell ma sve poloky - pocet atomov (atoms) a kriticke mnozstvo (limit)
// limit si ukladame, aj ked ho vieme spocitat, lebo sa bude casto pouzivat
Board.init = function() {
 for (var i=0; i<Game.SIZE; i++){
    this._data.push([]);
    for (var j=0;j<Game.SIZE;j++){
        var limit = this._getLimit(i,j); //zisti limit
        var cell={
            atoms: 0, //nastav pocet atomov
            limit: limit //nastav limit
        }
        this._data[i].push(cell); //pridaj bunku do pola
    }
 }
} //Board.init

// Ziskat pocet atomov na danych suradniciach
Board.getAtoms = function(x,y){
    return this._data[x][y].atoms;
}

Board.addAtom = function(x,y){
    var cell = this._data[x][y];
    cell.atoms ++; //zvys pocet atomoc

    if (cell.atoms > cell.limit){ //prekrocili sme limit
        var neighbors = this._getNeighbors(x,y);  //pole dvojic, napr [ [0,0], [1,1], [0,2] ]
        cell.atoms -= neighbors.length; //odoberime pocet susedov

        for (var i = 0; i < neighbors.length; i++ ){
            var n = neighbors[i]; //dvojica suradnic
            this.addAtom(n[0], n[1]); //rekurzivne volanie - pridaj atomy vsektym susedom
        }
    }
} //addAtom
 
Board._getLimit = function(x,y){
    var limit = 4; //dafault, u stredovych buniek
    if (x == 0 || x+1 == Game.SIZE) {limit --; } //ak sme na lavom alebo pravom kraji v x-ovom smere, znizime limit
    if (y == 0 || y+1 == Game.SIZE) {limit --; } //ak sme na lavom alebo pravom kraji v y-ovom smere, znizime limit, hra je stvorcova
    return limit;
}

Board._getNeighbors = function(x,y){
    var results = []; //pole dvojic, napr [ [0,0], [1,1], [0,2] ]
    if (x   > 0)          {results.push([x-1,   y]); } //ak nie je celkom vlavo, pridame suseda atom nalavo
    if (x+1 < Game.SIZE)  {results.push([x+1,   y]); } 
    if (y   > 0)          {results.push([  x, y-1]); } 
    if (y+1 < Game.SIZE)  {results.push([  x, y+1]); } 
    return results;
}
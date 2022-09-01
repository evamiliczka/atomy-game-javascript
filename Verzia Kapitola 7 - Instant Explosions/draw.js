/* Objekt Draw je zodpovedny za uzivatelske rozhranie a vsetky suvisiace cinnosti */
/* Verzia s CANVAS, kapitola 6 */


var Draw = {
    POSITIONS:[ //pole pozicii
        null,
        [[1/2, 1/2]], //jeden atom
        [[1/4 , 1/4], [3/4, 3/4]], //dva atomy
        [[1/2, 1/2], [1/4 , 1/4], [3/4, 3/4]], //tri atomy
        [[1/4 , 1/4], [1/4, 3/4],  [3/4 , 3/4], [3/4, 1/4]] //styri atomy
    ],
    CELL : 60, // konstanta - velkost jednej bunky
    LINE : 2,  // konstanta - hrubka ciary
    ATOM : 7,  // konstanta - polomer atomu
    _context : null // 2D context canvasu pouzivany pe vsetky nalsedujuce operacie
};

//Priprava canvasu
Draw.init = function(){
    var canvas = document.createElement("canvas");
    this.CELL = this.CELL + this.LINE; //zvacsime cell o line
    var size = Game.SIZE * this.CELL + this.LINE;  //ciar je o 1 viac ako buniek, lebo chceme oramovat
    canvas.width = size;
    canvas.height = size;
    this._context = canvas.getContext("2d");
    this._context.lineWidth = this.LINE;
    document.getElementById("atomy").appendChild(canvas);
    this.all();
}

//Vykreslit celou hraci plochu
Draw.all = function(){
    this._context.fillStyle = "#fff";
    var width = this._context.canvas.width;
    var height = this._context.canvas.height;

    this._context.fillRect(0,0,width, height);

    this._lines();
    this._cells();
}

Draw._lines = function(){
    this._context.beginPath();

    for (var i=0; i<Game.SIZE+1; i++){ //svisle
        var x = this.LINE/2 + i*this.CELL;
        this._context.moveTo(x,0);
        this._context.lineTo(x, this._context.canvas.height);
    }

    for (var i=0; i<Game.SIZE+1; i++){ //vodorovne
        var y = this.LINE/2 + i*this.CELL;
        this._context.moveTo(0,y);
        this._context.lineTo(this._context.canvas.width, y);
    }
    this._context.stroke();

}




/* vykreslit bunky s atomami */
Draw._cells = function(){
    for (var i=0; i < Game.SIZE; i++){
        for (var j=0; j < Game.SIZE; j++){
            this._cell(i, j, Board._data[i][j].atoms);
        }
    }
}

/* vykreslit jednu bunku */
Draw._cell = function(x, y, count){
    /**
     * vyberiem podpole pola zodpovedajuce zadanemu poctu buniek
     * Napriklad pri vstupe count == 3, bude postions = [1/2, 1/2], [1/4 , 1/4], [3/4, 3/4]
     */
    var positions = this.POSITIONS[count]; 
    
    if (positions !== null){  //ak je co kreslit, pri pocte atomov nula sa to preskoci
        for (var i=0; i<positions.length; i++){
            var position = positions[i]; //postupne vyberam pozicie, napr. ak i==0 tak position = [1/2, 1/2]
            var posX = position[0]; //v priklade 1/2
            var posY = position[1]; //v priklade 1/2
            var atomX = (x + posX) * this.CELL; //kde sa ma nakreslit atom
            var atomY = (y + posY) * this.CELL;
            this._drawAtom(atomX, atomY);
        }
    }      
}

Draw._drawAtom = function(x,y){
    this._context.beginPath();

    this._context.moveTo(x+this.ATOM, y);
    this._context.arc(x,y,this.ATOM, 0 , 2*Math.PI, false);

    this._context.fillStyle = "blue";
    this._context.fill();
    this._context.stroke();
}

//Verejna funkcia, ktora vrati suradnice bunky s danymi pixelovymi suradnicami
Draw.getPosition = function(cursorX, cursorY){
    var rectangle = this._context.canvas.getBoundingClientRect(); //returns the size of an element and its position relative to the viewport, cize hranice canvas
    cursorX = cursorX - rectangle.left; //pozicia X v ramci obdlznika
    cursorY -= rectangle.top;

    if (cursorX < 0 || cursorX > rectangle.width) {return null;}
    if (cursorY < 0 || cursorY > rectangle.height) {return null;}

    // pri klepnuti na oddelovaciu ciaru sa dopustame chyby, ale na tom nam nezalezi
    var cellX = Math.floor(cursorX / this.CELL); //pocet buniek v x aj y smere je rovnaky
    var cellY = Math.floor(cursorY / this.CELL);
    return [cellX, cellY];
}


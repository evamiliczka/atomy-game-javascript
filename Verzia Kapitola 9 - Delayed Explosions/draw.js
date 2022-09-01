/* Objekt Draw je zodpovedny za uzivatelske rozhranie a vsetky suvisiace cinnosti */
/* Verzia s postupnym prkreslovanim, kapitola 8 */
/* Rusime draw.all a nahradzujeme Draw.cell */

var Draw = {
    POSITIONS:[ //pole pozicii
        null,
        [[1/2, 1/2]], //jeden atom
        [[1/4 , 1/4], [3/4, 3/4]], //dva atomy
        [[1/2, 1/2], [1/4 , 1/4], [3/4, 3/4]], //tri atomy
        [[1/4 , 1/4], [1/4, 3/4],  [3/4 , 3/4], [3/4, 1/4]], //styri atomy
        [[1/2, 1/2],[1/4 , 1/4], [1/4, 3/4],  [3/4 , 3/4], [3/4, 1/4] ], //pat atomov
        [[1/4, 1/4],[1/4 , 1/2], [1/4, 3/4],  [3/4 , 1/4], [3/4, 1/2], [3/4, 3/4] ], //sest
        [[1/4, 1/4],[1/4 , 1/2], [1/4, 3/4],  [1/2, 1/2], [3/4 , 1/4], [3/4, 1/2], [3/4, 3/4] ], //sedem
        [[1/4, 1/4],[1/4 , 1/2], [1/4, 3/4],  [1/2, 1/4], [1/2, 3/4], [3/4 , 1/4], [3/4, 1/2], [3/4, 3/4] ]], //osem
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
    this._context.fillStyle = "#000"; //black
    // Cely canvas vyplnime cernou barvou a pote budeme kreslit individualni bunky
    this._context.fillRect(0,0,size,size);

    for (var i=0; i<Game.SIZE; i++){
        for (var j=0; j<Game.SIZE; j++){
            //vykresli (bielu) bunku, takze nevykreslene vlastne ostanu len deliace ciary - cierne
            this.cell(i,j);
        }
    }
    document.getElementById("atomy").appendChild(canvas);
}


/* vykreslit jednu bunku */
Draw.cell = function(x, y){
  

    /**
     * Nakreslim biely tvorec (t.j. pozadie), potom
     * vyberiem podpole pola zodpovedajuce zadanemu poctu buniek
     * Napriklad pri vstupe count == 3, bude postions = [1/2, 1/2], [1/4 , 1/4], [3/4, 3/4]
     */

    //premazat bilou
    var size = this.CELL - this.LINE;
    var left = x*this.CELL + this.LINE;
    var top  = y*this.CELL + this.LINE;
    this._context.fillStyle = "#fff"; //biela
    this._context.fillRect(left,top,size,size);

    /* zjistit pocet atmu */
    var count = Board.getAtoms(x, y);
    console.log("Kreslim bunku ", [x], " ",[y], "s atomami ",count);
    if (!count) {return;} //ak je pocet 0, tak skonci

    /* vykreslit */
    var positions = this.POSITIONS[count]; 
     
    /* ladenie - zjistit zdali nepristupujeme na vyssi index, ne je povoleno */

    if (this.POSITIONS[count]==null) {debugger;}
    
    for (var i=0; i<positions.length; i++){
        var position = positions[i]; //postupne vyberam pozicie, napr. ak i==0 tak position = [1/2, 1/2]
        var posX = position[0]; //v priklade 1/2
        var posY = position[1]; //v priklade 1/2
        var atomX = (x + posX) * this.CELL; //kde sa ma nakreslit atom
        var atomY = (y + posY) * this.CELL;
        this._drawAtom(atomX, atomY);
    }
}      


Draw._drawAtom = function(x,y){
    this._context.beginPath();

    this._context.moveTo(x+this.ATOM, y);
    this._context.arc(x,y,this.ATOM, 0 , 2*Math.PI, false);

    this._context.fillStyle = "Crimson";
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


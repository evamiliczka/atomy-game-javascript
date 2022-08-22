/* Objekt Draw je zodpovedny za uzivatelske rozhranie a vsetky suvisiace cinnosti */
/* Verzia s postupnym prkreslovanim, kapitola 8 */
/* Rusime draw.all a nahradzujeme Draw.cell */

var Draw = {
    POSITIONS:[ //pole pozicii
        null,
        [new XY(1/2, 1/2)], //jeden atom
        [new XY(1/4 , 1/4), new XY(3/4, 3/4)], //dva atomy
        [new XY(1/2, 1/2), new XY(1/4 , 1/4), new XY(3/4, 3/4)], //tri atomy
        [new XY(1/4 , 1/4), new XY(1/4, 3/4),  new XY(3/4 , 3/4), new XY(3/4, 1/4)], //styri atomy
        [new XY(1/2, 1/2),new XY(1/4 , 1/4), new XY(1/4, 3/4),  new XY(3/4 , 3/4), new XY(3/4, 1/4)], //pat atomov
        [new XY(1/4, 1/4),new XY(1/4 , 1/2), new XY(1/4, 3/4),  new XY(3/4 , 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4) ], //sest
        [new XY(1/4, 1/4),new XY(1/4 , 1/2), new XY(1/4, 3/4),  new XY(1/2, 1/2), new XY(3/4 , 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4) ], //sedem
        [new XY(1/4, 1/4),new XY(1/4 , 1/2), new XY(1/4, 3/4), new XY(1/2, 1/4), new XY(1/2, 3/4), new XY(3/4 , 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4)]], //osem
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
            this.cell(new XY(i, j)); //!!!
        }
    }
    document.getElementById("atomy").appendChild(canvas);
}


/* vykreslit jednu bunku */
Draw.cell = function(xy){
  

    /**
     * Nakreslim biely tvorec (t.j. pozadie), potom
     * vyberiem podpole pola zodpovedajuce zadanemu poctu buniek
     * Napriklad pri vstupe count == 3, bude postions = [1/2, 1/2], [1/4 , 1/4], [3/4, 3/4]
     */

    //premazat bilou
   // debugger;  //!!!
    var size = this.CELL - this.LINE;
    var offset = new XY(this.LINE, this.LINE); //???
    var leftTop = xy.multiply(this.CELL).add(offset);

    this._context.fillStyle = "#fff"; //biela
    this._context.fillRect(leftTop.x,leftTop.y,size,size);

    /* zjistit pocet atomov */
    var count = Board.getAtoms(xy);
    //console.log("Kreslim bunku ", [x], " ",[y], "s atomami ",count);
    if (!count) {return;} //ak je pocet 0, tak skonci

    /* Zistit hraca - farbu */
    var player = Board.getPlayer(xy);
    var color = Score.getColor(player);

    /* vykreslit */
    var positions = this.POSITIONS[count]; 
     
    /* ladenie - zjistit zdali nepristupujeme na vyssi index, ne je povoleno */

    //if (this.POSITIONS[count]==null) {debugger;}
    
    for (var i=0; i<positions.length; i++){
        var position = positions[i]; //postupne vyberam pozicie, napr. ak i==0 tak position = [1/2, 1/2]
        var atom = position.add(xy).multiply(this.CELL);
        this._drawAtom(atom, color);
    }
}      


Draw._drawAtom = function(xy, color){
    this._context.beginPath();

    this._context.moveTo(xy.x + this.ATOM, xy.y);
    this._context.arc(xy.x,xy.y,this.ATOM, 0 , 2*Math.PI, false);

    this._context.fillStyle = color;
    this._context.fill();
    this._context.stroke();
}

//Verejna funkcia, ktora vrati suradnice bunky s danymi pixelovymi suradnicami
Draw.getPosition = function(cursor){
    var rectangle = this._context.canvas.getBoundingClientRect(); //returns the size of an element and its position relative to the viewport, cize hranice canvas
    cursor.x = cursor.x - rectangle.left; //pozicia X v ramci obdlznika
    cursor.y -= rectangle.top;

    if (cursor.x < 0 || cursor.x > rectangle.width) {return null;}
    if (cursor.y < 0 || cursor.y > rectangle.height) {return null;}

    // pri klepnuti na oddelovaciu ciaru sa dopustame chyby, ale na tom nam nezalezi
    return cursor.divide(this.CELL);
}


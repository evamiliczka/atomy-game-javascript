/* Objekt Draw je zodpovedny za uzivatelske rozhranie a vsetky suvisiace cinnosti */
/* Verzia s postupnym prkreslovanim, kapitola 8 */
/* Rusime draw.all a nahradzujeme Draw.cell */

class Draw  {
    #POSITIONS_OF_ATOMS;
    #CELL_WIDTH;
    #LINE_WIDTH;
    #ATOM_RADIUS;
    #context; 
    constructor (){
        this.#POSITIONS_OF_ATOMS = [ //pole pozicii
                null,
            [new XY(1/2, 1/2)], //jeden atom
            [new XY(1/4 , 1/4), new XY(3/4, 3/4)], //dva atomy
            [new XY(1/2, 1/2), new XY(1/4 , 1/4), new XY(3/4, 3/4)], //tri atomy
            [new XY(1/4 , 1/4), new XY(1/4, 3/4),  new XY(3/4 , 3/4), new XY(3/4, 1/4)], //styri atomy
            [new XY(1/2, 1/2),new XY(1/4 , 1/4), new XY(1/4, 3/4),  new XY(3/4 , 3/4), new XY(3/4, 1/4)], //pat atomov
            [new XY(1/4, 1/4),new XY(1/4 , 1/2), new XY(1/4, 3/4),  new XY(3/4 , 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4) ], //sest
            [new XY(1/4, 1/4),new XY(1/4 , 1/2), new XY(1/4, 3/4),  new XY(1/2, 1/2), new XY(3/4 , 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4) ], //sedem
            [new XY(1/4, 1/4),new XY(1/4 , 1/2), new XY(1/4, 3/4), new XY(1/2, 1/4), new XY(1/2, 3/4), new XY(3/4 , 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4)]]; //osem
        this.#CELL_WIDTH = 60; // konstanta - velkost jednej bunky
        this.#LINE_WIDTH = 2  // konstanta - hrubka ciary
        this.#ATOM_RADIUS = 7;  // konstanta - polomer atomu
        this.#context = null; // 2D context canvasu pouzivany pe vsetky nalsedujuce operacie
        
        //Priprava canvasu
        const canvas = document.createElement("canvas");
        const size = Game.SIZE * this.#CELL_WIDTH + this.#LINE_WIDTH;  //ciar je o 1 viac ako buniek, lebo chceme oramovat
    
        //this.#CELL_WIDTH = this.#CELL_WIDTH + this.#LINE_WIDTH; //zvacsime cell o line ???
    
        canvas.width = size;
        canvas.height = size;
    
        this.#context = canvas.getContext("2d");
        this.#context.lineWidth = this.#LINE_WIDTH;
        this.#context.fillStyle = "#000"; //black
        // Cely canvas vyplnime cernou barvou a pote budeme kreslit individualni bunky
        this.#context.fillRect(0,0,size,size);
    
        for (let i=0; i<Game.SIZE; i++){
            for (let j=0; j<Game.SIZE; j++){
                //vykresli (bielu) bunku, takze nevykreslene vlastne ostanu len deliace ciary - cierne
                this.drawCell(new XY(i, j), 0, null); //!!!
            }
        }
        document.getElementById('atomy').appendChild(canvas);
}
   


/* vykreslit jednu bunku */
 drawCell(xy, atoms, player){
    /**
     * Nakreslim biely tvorec (t.j. pozadie), potom
     * vyberiem podpole pola zodpovedajuce zadanemu poctu buniek
     * Napriklad pri vstupe count == 3, bude postions = [1/2, 1/2], [1/4 , 1/4], [3/4, 3/4]
     */

    //premazat bilou
   // debugger;  //!!!
    const size = this.#CELL_WIDTH - this.#LINE_WIDTH;
    const offset = new XY(this.#LINE_WIDTH, this.#LINE_WIDTH); 
    const leftTop = xy.multiply(this.#CELL_WIDTH).add(offset);

    this.#context.fillStyle = "#fff"; //biela
    this.#context.fillRect(leftTop.x,leftTop.y,size,size);

    if (!atoms) {return;} //ak je pocet 0, tak skonci

    /* Zistit farbu hraca */
    if (player == null) debugger;
    const color = player.getColor();

    /* vykreslit */
    const positions = this.#POSITIONS_OF_ATOMS[atoms]; 
     
    /* ladenie - zjistit zdali nepristupujeme na vyssi index, ne je povoleno */

    //if (this.POSITIONS[count]==null) {debugger;}
    
    for (let i=0; i<positions.length; i++){
        const position = positions[i]; //postupne vyberam pozicie, napr. ak i==0 tak position = [1/2, 1/2]
        const atom = position.add(xy).multiply(this.#CELL_WIDTH);
        this.#drawAtom(atom, color);
    }
}      //drawCell


 #drawAtom(xy, color){
    this.#context.beginPath();

    this.#context.moveTo(xy.x + this.#ATOM_RADIUS, xy.y);
    this.#context.arc(xy.x,xy.y,this.#ATOM_RADIUS, 0 , 2*Math.PI, false);

    this.#context.fillStyle = color;
    this.#context.fill();
    this.#context.stroke();
}

//Verejna funkcia, ktora vrati suradnice bunky s danymi pixelovymi suradnicami
  getPosition(cursor){
    const rectangle = this.#context.canvas.getBoundingClientRect(); //returns the size of an element and its position relative to the viewport, cize hranice canvas
    cursor.x = cursor.x - rectangle.left; //pozicia X v ramci obdlznika
    cursor.y -= rectangle.top;

    if (cursor.x < 0 || cursor.x > rectangle.width) {return null;}
    if (cursor.y < 0 || cursor.y > rectangle.height) {return null;}

    // pri klepnuti na oddelovaciu ciaru sa dopustame chyby, ale na tom nam nezalezi
    return cursor.divide(this.#CELL_WIDTH);
}

}
/* Objekt Draw je zodpovedny za uzivatelske rozhranie a vsetky suvisiace cinnosti */

var Draw = {};

/*
0-ty riadok [0 0 0 0 0 0] indexy 0,1,2,3,4,5    => posledny prvok v 0-tom riadky je 0-ty riadok a 5-ty stplec
1-vy riadok [0 0 0 0 0 0]
2-hy riadok [0 0 0 0 0 0]
*/


Draw.all = function () {
    var html = "<table>";
    for (var i=0; i<Board.length; i++){
        html += "<tr>";
        for (var j=0;j<Board[i].length; j++){
            html += "<td>";
            html += Draw.atoms(Board[j][i]);
            html += "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";
    
    document.body.innerHTML = html;
}

Draw.atoms = function(count){
    var result = "";
    for (var i=0; i<count; i++){
        result += "o";
    }
    return result;
}

Draw.getPosition = function(node){
    if (node.nodeName != "TD") {return null; }
    
    
    var x = 0;
    while (node.previousSibling){
        x++;
        node = node.previousSibling;
    }
    
    var row = node.parentNode;
    var y = 0;
    while (row.previousSibling){
        y++;
        row = row.previousSibling;
    }
    
    return [x, y];
}
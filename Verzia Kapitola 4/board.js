<!-- Praca s hlavnou datovou strukturou - stavom hracej plochy -->

var Board = [];

var N = 6;

<!-- Hracie pole je pole poli naplnene nulami [0 0 0 0 0 0] [0 0 0 0 0 0] [0 0 0 0 0 0] [0 0 0 0 0 0] [0 0 0 0 0 0] [0 0 0 0 0 0] -->
 for (var i=0; i<N; i++){
    Board.push([]);
    for (var j=0;j<N;j++){
        Board[i].push(0);
    }
 }
var Game = function(players) {
	this._players = players;
	this._currentPlayer = 0;

	this._draw = new Draw();

	this._board = new Board(players, this._draw);
	this._board.onTurnDone = this._turnDone.bind(this);

	this._askPlayer();
}
Game.SIZE = 2;

Game.isOver = function(score) {
	return (Math.max.apply(Math, score) == this.SIZE*this.SIZE);
}

Game.prototype._askPlayer = function() {
	var player = this._players[this._currentPlayer];
	player.play(this._board, this._draw, this._playerDone.bind(this));
}

Game.prototype._playerDone = function(xy) {
	var player = this._players[this._currentPlayer];
	var existing = this._board.getPlayer(xy);

	if (!existing || existing == player) {
		this._board.addAtom(xy, player);
	} else {
		this._askPlayer();
	}
}

Game.prototype._turnDone = function(score) {
	for (var i=0; i<this._players.length; i++) {
		this._players[i].setScore(score[i]);
	}

	this._currentPlayer = (this._currentPlayer+1) % this._players.length;
	if (!Game.isOver(score)) { this._askPlayer(); }
}

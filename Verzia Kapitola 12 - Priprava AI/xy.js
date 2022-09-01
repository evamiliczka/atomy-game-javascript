/* Subor su suradnicami */

/* Constructor */
class XY {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    add(xy) {
        return new XY(this.x + xy.x, this.y + xy.y);
    }
    multiply(c) {
        return new XY(this.x * c, this.y * c);
    }
    divide(d) {
        return new XY(Math.floor(this.x / d), Math.floor(this.y / d));
    }
    equals(xy) {
        return (this.x == xy.x, this.y == xy.y);
    }
    toString() {
        return this.x + " " + this.y;
    }
    getNeighbors() {
        var results = [];
        if (this.x > 0) { results.push(new XY(this.x - 1, this.y)); } //ak nie je celkom vlavo, pridame suseda atom nalavo
        if (this.x + 1 < Game.SIZE) { results.push(new XY(this.x + 1, this.y)); }
        if (this.y > 0) { results.push(new XY(this.x, this.y - 1)); }
        if (this.y + 1 < Game.SIZE) { results.push(new XY(this.x, this.y + 1)); }
        return results;
    }
}










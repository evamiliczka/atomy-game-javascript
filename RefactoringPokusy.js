/* Verzias prototypom a operatorom new */
var XY = function(x, y){
    this.x = x;
    this.y = y;
}

XY.prototype.add = function(other){
    return new XY(this.x + other.x, this.y + other.y);
}

var s1 = new XY(3, 5);
var s2 = new XY(2, 1);


/* Verzia s prototypom

var Base = {
    add:function(other){
        return XY(this.x + other.x, this.y + other.y);
    }
}


var XY = function(x, y) {
    var result = Object.create(Base);
    result.x = x;
    result.y = y;
    return result;
}

var s1 = XY(3,5);
var s2 = XY(2,1);

alert(s1.add === s2.add);
*/
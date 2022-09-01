    //Constructor function
    const Player = function(name){
        this.name = name;
    }

    //Tah hraca
    Player.prototype.play = function(){
        //objekt Game vyzyva k tahu
    }

    //constructor ???
    Human = function(name){
        Player.call(this, name);
    }

    Human.prototype = Object.create(Player.prototype);

    AI = function(name){
        Player.call(this, name);
    }

    AI.prototype = Object.create(Player.prototype);

    const human = new Human("Pan Novak");
    const ai = new AI("Robot Emil");

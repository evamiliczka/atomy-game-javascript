class Audio{
    #ctx;
    #oscillator;
    #gain;

    constructor(){
        this.#ctx = null;
        try{
            this.#ctx = new (window.AudioContext || window.webkitAuioContext)();
            this.#build();
        } catch (e) {}
    }

    #build = function(){
        this.#gain = this.#ctx.createGain();
        this.#gain.gain.value = 0;
        this.#gain.connect(this.#ctx.destination);

        this.#oscillator = this.#ctx.createOscillator();
        this.#oscillator.type = "square";
        this.#oscillator.connect(this.#gain);

        this.#oscillator.start();
    } 

    play = function(level){
        if (!this.#ctx){ return; }

        this.#oscillator.frequency.value = 220 * Math.pow(2, level/12);
        this.#gain.gain.value = 0.5;
    }

    stop = function(){
        if (!this.#ctx) { return; }

        this.#gain.gain.value = 0;
    }

}


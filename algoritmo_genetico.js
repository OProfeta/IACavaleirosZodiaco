var dificuldadeCasas = [50, 55, 60, 70, 75, 80, 85, 90, 95, 100, 110, 120];
var poderCavaleiros = [1.5, 1.4, 1,3, 1.2, 1.1];

class Elemento {
    constructor() {
        this.DNA = [];
        this.fitness = 0;
        for (var i = 0; i < dificuldadeCasas.length; i++) {
            var time = [];
            var poder = 0;
            for (var j = 0; j < poderCavaleiros.length; j++) {
                var cavaleiro = Math.round(Math.random());
                time.push(cavaleiro);
                poder += cavaleiro * poderCavaleiros[j];
            }
            var tempo = dificuldadeCasas[i] / poder;
            this.fitness += tempo;
            this.DNA.push(time);
        }
    }
}

class Populacao {
    constructor() {
        this.elementos = [];
        for (var i = 0; i < 200; i++){
            this.elementos.push(new Elemento());
        }
    }
}

var popu = new Populacao();
console.log(popu);
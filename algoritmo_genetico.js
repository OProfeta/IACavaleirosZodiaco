var dificuldadeCasas = [50, 55, 60, 70, 75, 80, 85, 90, 95, 100, 110, 120];
var poderCavaleiros = [1.5, 1.4, 1.3, 1.2, 1.1];
var taxaMutacao = 0.01;

function normalizar(val, max, min) {
    return (val - min) / (max - min);
}

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

    crossover(parceiro) {
        var filho = new Elemento();
        var pontoSeparador = Math.floor(Math.random(this.DNA.length));
        for (var i = 0; i < this.DNA.length; i++) {
            if (i > pontoSeparador) {
                filho.DNA[i] = this.DNA[i];
            } else {
                filho.DNA[i] = parceiro.DNA[i];
            }
        }
        return filho;
    }

    mutacao() {
        for (var i = 0; i < this.DNA.length; i++) {
            for (var j = 0; j < this.DNA[i].length; j++) {
                if (Math.random(1) < taxaMutacao) {
                    if (this.DNA[i][j] == 1) {
                        this.DNA[i][j] = 0;
                    } else {
                        this.DNA[i][j] = 1;
                    }
                }
            }
        }
    }
}

class Populacao {
    constructor() {
        this.elementos = [];
        this.matingPool = []; // Piscina de acasalamento(?) traducao livre -- Quem tem mais chances de ter filhos tem varias copias dentro da matingPool
        for (var i = 0; i < 200; i++){
            this.elementos.push(new Elemento());
        }
        this.melhorElemento = null;
        this.melhorElementoIndex = 0;
        this.geracoes = 0;
    }

    acharMelhorElemento() {

        var menorFitness = 999999999999999999999999999999;
        var menorFitnessIndex = 0;
        for (var i = 0; i < this.elementos.length; i++) {
            if (this.elementos[i].fitness < menorFitness) {
                
                menorFitness = this.elementos[i].fitness;
                menorFitnessIndex = i;
                this.melhorElementoIndex = i;
            }
        }
        this.melhorElemento = this.elementos[menorFitnessIndex];
    }

    selecaoNatural() {
        this.matingPool = []; // Limpa a lista

        var maxFitness = 0;
        var minFitness = 999999999999;
        for (var i = 0; i < this.elementos.length; i++) {
            if (this.elementos[i].fitness > maxFitness) {
                maxFitness = this.elementos[i].fitness;
            }
            if (this.elementos[i].fitness < minFitness) {
                minFitness = this.elementos[i].fitness;
            }
        }

        for (var i = 0; i < this.elementos.length; i++) {
            var fitnessNormal = 1 - normalizar(this.elementos[i].fitness, maxFitness, minFitness);
            var n = Math.floor(fitnessNormal * 100);
            for (var j = 0; j < n; j++) {
                this.matingPool.push(this.elementos[i]);
            }
        }
    }

    novaGeracao() {
        // Criar nova geracao com base no matingPool
        for (var i = 0; i < this.elementos.length; i++) {
            var a = Math.floor(Math.random(this.matingPool.length));
            var b = Math.floor(Math.random(this.matingPool.length));
            var parceiroA = this.matingPool[a];
            var parceiroB = this.matingPool[b];
            var filho = parceiroA.crossover(parceiroB);
            filho.mutacao();
            this.elementos[i] = filho;
        }
        this.geracoes++;
    }
}

var popu = new Populacao();
var melhores = [];

popu.acharMelhorElemento();
popu.selecaoNatural();
// console.log(popu);
melhores.push(Object.assign({}, popu.melhorElemento));

for (var i = 0; i < 200; i++) {
    popu.novaGeracao();
    popu.acharMelhorElemento();
    popu.selecaoNatural();
    melhores.push(Object.assign({}, popu.melhorElemento));
}

console.log(melhores);
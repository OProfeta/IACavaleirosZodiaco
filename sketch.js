var mapa;
var strings = [];
function preload(){
  strings = loadStrings('JogoZodiaco/MapaZodiaco.txt');
}

function remover(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristica(a, b){
  var d = abs(a.x - b.x) + abs(a.y - b.y);
  return d;
}

var comecarDesenho = false;
function iniciar(){
  comecarDesenho = true;
  loop();
}

var colunas;
var linhas;
var grid;

var openSet = [];
var closedSet = [];
var comeco;
var fim;
var altura, largura;
var path = [];
var caminho;

function Celula(i, j, valor){
  this.x = i;
  this.y = j;
  this.f = 1000000000000;
  this.g = 1000000000000;
  this.h = 0;
  this.valor = valor;
  this.vizinhos = [];
  this.custo;
  this.anterior;

  this.show = function() {
    fill(255);
    if(valor == 0){
      // Comeco
      this.custo = 0;
      fill(0, 255, 0);
    } else if(valor == 14){
      // Montanhoso
      this.custo = 200;
      fill(51, 51, 51);
    } else if(valor == 16){
      // Rochoso
      this.custo = 5;
      fill(169, 169, 169);
    } else if(valor == 13){
      // Chegada
      this.custo = 0;
      fill(255, 0, 0);
    } else if(valor == 15){
      // Plano
      this.custo = 1;
      fill(255);
    } else {
      // Casas
      this.custo = 0;
      fill(0, 0, 255);
    }
    // noStroke();
    stroke(1);
    rect((this.x * largura), (this.y * altura), largura, altura);
  }

  this.mudarCor = function(r, g, b) {
    fill(r, g, b);
    rect((this.x * largura), (this.y * altura), largura, altura);
  }

  this.addVizinhos = function(grid) {
    var i = this.x;
    var j = this.y;
    if(i < colunas - 1){
      this.vizinhos.push(grid[i + 1][j]);
    }
    if(i > 0){
      this.vizinhos.push(grid[i - 1][j]);
    }
    if(j < linhas - 1){
      this.vizinhos.push(grid[i][j + 1]);
    }
    if(j > 0){
      this.vizinhos.push(grid[i][j - 1]);
    }

    if(valor == 14){
      this.custo = 200;
    } else if(valor == 15){
      this.custo = 1;
    } else if(valor == 16){
      this.custo = 5;
    } else {
      this.custo = 0;
    }

  }

}

var button;
var button2;

function setup() {
  createCanvas(800, 800);

  // Fazendo botao para inicar a busca
  button = createButton('Iniciar');
  button.position(810, 0);
  button.mousePressed(iniciar);
  // button2 = createButton('Só caminho');
  // button2.position(810, 10);
  // button2.mousePressed(limparCaminho);

  console.log('A*');

  mapa = new Array(strings.length-1);

  for(var i = 0; i < strings.length-1; i++){
    mapa[i] = split(strings[i], '\t');
  }

  colunas = mapa[0].length;
  linhas = mapa.length;
  grid = new Array(colunas);

  largura = width / colunas;
  altura = height / linhas;

  for(var i = 0; i < colunas; i++){
    grid[i] = new Array(linhas);
  }

  for(var i = 0; i < colunas; i++){
    for(var j = 0; j < linhas; j++){
      valor = mapa[j][i];
      grid[i][j] = new Celula(i, j, valor);
      if(valor == 0){
        comeco = grid[i][j];
      } else if(valor == 13){
        fim = grid[i][j];
      }
    }
  }

  for(var i = 0; i < colunas; i++){
    for(var j = 0; j < linhas; j++){
      grid[i][j].addVizinhos(grid);
    }
  }

  openSet.push(comeco);
  comeco.g = 0;
  comeco.f = heuristica(comeco, fim);
  noLoop();
}

function draw() {

  if(comecarDesenho){
    if(openSet.length > 0){
      // Continua
      var indexMenor = 0;
      for(var i = 0; i < openSet.length; i++){
        if(openSet[i].f < openSet[indexMenor].f){
          indexMenor = i;
        }
      }

      var atual = openSet[indexMenor];

      if(atual === fim){

        path = [];
        var temp = atual;
        path.push(temp);
        while(temp.anterior){
          path.push(temp.anterior);
          temp = temp.anterior;
        }

        console.log("PRONTO!");
        var total = 0;
        for(var i = 0; i < path.length; i++){
          path[i].mudarCor(0, 0, 255);
          total += path[i].custo;
        }
        console.log("total = " + total);
        noLoop();
        return;
      }

      remover(openSet, atual);
      closedSet.push(atual);

      var vizinhos = atual.vizinhos;
      for(var i = 0; i < vizinhos.length; i++){
        var vizinho = vizinhos[i];

        if(!closedSet.includes(vizinho)){
          var tempG = atual.g + vizinho.custo;
          if(tempG < vizinho.g){
            vizinho.anterior = atual;
            vizinho.g = tempG;
            vizinho.f = vizinho.g + heuristica(vizinho, fim);
            if(!openSet.includes(vizinho)){
              openSet.push(vizinho);
            }
            caminho = vizinho;
          }
        }
      }
    } else {
      // Sem solucao
      console.log("Sem solução.");
    }
  }

  background(0);

  for(var i = 0; i < colunas; i++){
    for(var j = 0; j < linhas; j++){
      grid[i][j].show();
    }
  }

  for(var i = 0; i < closedSet.length; i++){
    closedSet[i].mudarCor(255, 0, 0);
  }

  for(var i = 0; i < openSet.length; i++){
    openSet[i].mudarCor(0, 255, 0);
  }

  if(caminho){
    while(caminho.anterior){
      caminho.mudarCor(255, 0, 255);
      caminho = caminho.anterior;
    }
  }
}

# Practica 2 DVI

En este repositorio se encuentra la [practica 2](https://github.com/calope03/Practica2DVI/blob/master/practica2.pdf) de la asignatura Desarrollo de Videojuegos mediante Tecnologias Web.

Esta practica consiste en el desarrollo de un videojuego clasico, conocido como Tapper. Este videojuego consiste en servir cervezas a todos los clientes del bar.

Se puede jugar una [demo del juego](http://obiot.github.io/miniTapper/). 

Tambien se puede ver un [gameplay](https://www.youtube.com/watch?v=u17mTefrodo) del juego original.

## Archivos

### [index.html](https://github.com/calope03/Practica2DVI/blob/master/index.html)

En este archivo enlazamos a los archivos quqe contienen la logica del juego y cargamos el canvas, que es lo que define el tamaño de nuestro juego.

### [engine.js](https://github.com/calope03/Practica2DVI/blob/master/src/engine.js)

En este archivo se encuentra el motor principal del juego, es decir, el que se encarga de estar todo el tiempo dibujando los elementos de cada board.

Para ello en la funcion loop recorremos todos los elememntos de cada board y los pinta, siempre y cuando `boards[i].activada == true`

```js
  this.loop = function() {
    
    GameManager.compruebaEstado();
    var curTime = new Date().getTime();
    requestAnimationFrame(Game.loop);
    var dt = (curTime - lastTime)/1000;
    if(dt > maxTime) { dt = maxTime; }

    for(var i=0,len = boards.length;i<len;i++) {
      
      if(boards[i] && boards[i].activada) { 
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }
    lastTime = curTime;
    Metrics.drawFPS(Game.ctx,(curTime - lastTime))
  };
```

Tambien hemos añadido una clase metrics que nos ayuda a calcular los fps y un temporizador que activa la funcion que le pasamos por parametro tras un periodo de tiempo indicado por el usuario.

```js
var Temporizador = function Temporizador(tiempoAEsperar,callback) {
  var currTime = new Date().getTime();
  var tiempoEspera = currTime+tiempoAEsperar;
  this.step = function(dt) {
    if(currTime >= tiempoEspera){
      callback();
    }else{
      currTime = new Date().getTime();
    }
  }; 
  this.draw = function(ctx) {};

};
```

### [game.js](https://github.com/calope03/Practica2DVI/blob/master/src/game.js)

### [datosniveles.js](https://github.com/calope03/Practica2DVI/blob/master/src/datosniveles.js)

## Colaboradores

[César Godino Rodríguez](https://github.com/cloudgrey)

[Carmen López Gonzalo](https://github.com/calope03)

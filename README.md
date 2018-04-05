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

En este archivo se crean todos los elementos del juego, el fondo, los clientes, el jugador, las cervezas, etc.

Tenemos una constante ´sprites´ que contiene toda la posicion y el tamaño de cada sprite que cargamos en el juego, para luego mas tarde cogerlos de la imagen [spritesTapperAlternativos3.png](https://github.com/calope03/Practica2DVI/blob/master/img/spritesTapperAlternativos3.png).

Hemos creado una funcion que recorre dos arrays con las posiciones en las que tiene que pintar las deadzone y las añade al board correspondiente.

```js
var generaDeadzones = function(board){
  for(var i = 0; i < posicionesDeadzoneIzq.length; i++){
    board.add(new DeadZone(posicionesDeadzoneIzq[i].x, posicionesDeadzoneIzq[i].y));
  }
  for(var i = 0; i < posicionesDeadzoneDer.length; i++){
    board.add(new DeadZone(posicionesDeadzoneDer[i].x, posicionesDeadzoneDer[i].y));
  }
}
```

### [datosniveles.js](https://github.com/calope03/Practica2DVI/blob/master/src/datosniveles.js)

En este fichero se encuentra toda la informacion relativa a los niveles y que nos permite configurar los spawners.

Para cada nivel se define:

- Comportamiento en cada barra, los datos que sirven para inicializar los spawners: 
  - Velocidad minima y maxima a la que pueden ir los clientes.
  - Numero maximo y minimo de clientes.
  - Minimo y maximo de la frecuencia entre la que se crean los clientes.
- Numero de vidas por cada nivel.
- Tiempo en el que el cliente esta bebiendo, es decir el tiempo en el que el cliente va hacia atras.
- Velocidad a la que el camarero se puede mover de derecha a izquierda.
- Puntos que suma cada accion, recoger propina, servir a un cliente, recoger una bebida.
- La velocidad a la que va la bebida hacia el cliente.
  
```js
nivel1 : {
  	minVelocidadCliente: 15,
  	maxVelocidadCliente: 30,
  	minClientesBarra: 1,
  	maxClientesBarra: 2,
  	minRetardo: 1,
  	maxRetardo: 5,
  	minFrecuenciaCreacion: 1,
  	maxFrecuenciaCreacion: 5,
    vidas: 2,
    segundosClienteBebiendo: 3000,
    velocidadLateralCamarero: 10,
    puntuacionBebidaVacia: 50,
    puntuacionPropina: 1500,
    puntuacionClienteServido: 50,
    velocidadCrearBebida: 250
  }
```
## Partes opcionales realizadas

- Vidas: inicialmente pusimos tres, pero mas adelante al hacer distintos niveles, hicimos que variara segun el nivel.
- Puntos: actualmente tambien depende del nivel seleccionado. El tratamiento de los puntos se lleva a cabo en GameManager
- Propinas: los clientes las dejan al salir del bar.
- Comportamiento de los clientes: ahora los clientes al chocar con una bebida la devuelven vacia y se mueven durante un tiempo hacia atras, si en ese tiempo no han salido, vuelven a ir hacia alante.
- Niveles: disponemos de tres niveles diferentes, cuyos datos se encuentran en el fichero [datosniveles.js](https://github.com/calope03/Practica2DVI/blob/master/src/datosniveles.js). El usuario seleccionará el nivel al principio del juego, en las siguientes rondas jugará el mismo nivel que el seleccionado inicialmente.

## Nuestro juego

Basandonos en el juego original y siguiendo el enunciado este es [nuestro resultado final](https://calope03.github.io/Practica2DVI/).

¡A disfrutarlo!

## Colaboradores

[César Godino Rodríguez](https://github.com/cloudgrey)

[Carmen López Gonzalo](https://github.com/calope03)

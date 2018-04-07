# Práctica 2 DVI

En este repositorio se encuentra la [práctica 2](https://github.com/calope03/Practica2DVI/blob/master/practica2.pdf) de la asignatura Desarrollo de Videojuegos mediante Tecnologías Web.

Esta práctica consiste en el desarrollo de un videojuego clásico conocido como Tapper. El objetivo de éste es servir bebidas a todos los clientes del bar.

Se puede probar como referencia en el desarrollo una [demo del juego](http://obiot.github.io/miniTapper/). 

También se puede ver un [gameplay](https://www.youtube.com/watch?v=u17mTefrodo) del juego original.

## Archivos

### [index.html](https://github.com/calope03/Practica2DVI/blob/master/index.html)

Aquí incluimos los archivos que contienen la lógica y datos del juego. También cargamos el canvas, que es lo que define el tamaño de nuestro juego y lo que contendrá todos los elementos que se pintan y que gestionamos.

### [engine.js](https://github.com/calope03/Practica2DVI/blob/master/src/engine.js)

En este archivo se encuentra el motor principal del juego, es decir, el que se encarga de estar cada ciertos milisegundos dibujando los elementos de cada board.

Para ello, en la funcion loop, recorremos todos los elementos de cada board y se pintan siempre y cuando `boards[i].activada == true`

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

También hemos implementado la clase Metrics, que nos ayuda a calcular los FPS y mostrarlos, y la clase Temporizador que activa la función que le pasamos por parámetro tras un periodo de tiempo indicado por el usuario. La clase Metrics se ha implementado exclusivamente para debugueo durante el desarrollo del juego.

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

En este archivo se crean todos los elementos del juego: el fondo, los clientes, el jugador, las bebidas, etc.

Tenemos una constante ´sprites´ que contiene todas la posiciones y tamaños de cada sprite que cargamos en el juego, para luego más tarde cogerlos de la imagen [spritesTapperAlternativos3.png](https://github.com/calope03/Practica2DVI/blob/master/img/spritesTapperAlternativos3.png).

Hemos creado una función que recorre dos arrays con las posiciones en las que tiene que pintar las deadzone y las añade al board correspondiente.

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

### [datosniveles.json](https://github.com/calope03/Practica2DVI/blob/master/src/datosniveles.json)

En este fichero se encuentra toda la información relativa a los niveles y que nos permite configurar los spawners.

Para cada nivel se define:

- Comportamiento en cada barra, datos que sirven para inicializar los spawners: 
  - Velocidad mínima y máxima a la que pueden ir los clientes.
  - Número máximo y mínimo de clientes.
  - Mínimo y máximo de la frecuencia a la que se crean los clientes.
- Número de vidas por cada nivel.
- Tiempo en el que el cliente esta bebiendo, es decir, el tiempo en el que el cliente va hacia atrás.
- Velocidad a la que el camarero se puede mover horizontalmente.
- Puntos que suma cada acción: recoger propina, servir a un cliente y recoger una bebida.
- La velocidad a la que va la bebida llena hacia el cliente.
  
```json
datosNiveles = '[{"minVelocidadCliente": 15,"maxVelocidadCliente": 30,"minClientesBarra": 1,"maxClientesBarra": 2,"minRetardo": 1,"maxRetardo": 5,"minFrecuenciaCreacion": 1,"maxFrecuenciaCreacion": 5,"vidas": 2,"milisegundosClienteBebiendo": 3000,"velocidadLateralCamarero": 10,"puntuacionBebidaVacia": 50,"puntuacionPropina": 1500,"puntuacionClienteServido": 50,"velocidadCrearBebida": 250}, ...]';
```
## Partes opcionales realizadas

- Vidas: inicialmente pusimos tres pero más adelante, al definir los distintos niveles, hicimos que variaran según el nivel.
- Puntos: actualmente también dependen del nivel seleccionado. El tratamiento de los puntos se lleva a cabo en GameManager
- Propinas: los clientes las dejan al ser servidos, es decr, al salir del bar.
- Comportamiento de los clientes: ahora los clientes, al chocar con una bebida, la devuelven vacía y se mueven durante un tiempo hacia atrás. Si en ese tiempo no han salido, vuelven a moverse en dirección al jugador.
- Niveles: disponemos de tres niveles diferentes, cuyos datos se encuentran en el fichero [datosniveles.json](https://github.com/calope03/Practica2DVI/blob/master/src/datosniveles.json). El usuario seleccionará mediante las teclas 1,2 ó 3 el nivel al principio del juego y, en las siguientes rondas (gane o pierda), jugará al mismo nivel que el seleccionado inicialmente.

## Nuestro juego

Basándonos en el juego original y siguiendo el enunciado, éste es [nuestro resultado final](https://calope03.github.io/Practica2DVI/).

¡A disfrutarlo!

## Colaboradores

[César Godino Rodríguez](https://github.com/cloudgrey)

[Carmen López Gonzalo](https://github.com/calope03)

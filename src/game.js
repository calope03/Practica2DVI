var sprites = {
 camarero: { sx: 510, sy: 0, w: 55, h: 64, frames: 1 },
 cliente: { sx: 510, sy: 66, w: 32, h: 32, frames: 1 },
 cliente2: { sx: 512, sy: 164, w: 32, h: 32, frames: 1 },
 cliente3: { sx: 512, sy: 197, w: 32, h: 32, frames: 1 },
 cliente4: { sx: 512, sy: 230, w: 32, h: 32, frames: 1 },
 bebidallena: { sx: 496, sy: 106, w: 12, h: 25, frames: 1 },
 bebidavacia: { sx: 496, sy: 138, w: 12, h: 25, frames: 1 },
 deadzone: { sx: 512, sy: 235, w: 5, h: 70, frames: 1 }, //coge un trozo de la imagen en el que no hay NADA, es un sprite "invisible"
 ParedIzda: {sx: 0, sy: 0, w: 132, h: 480, frames: 1}, //de momento no lo usamos
 TapperGameplay: {sx: 0, sy: 480, w: 512, h: 480,frames: 1},
 corazon: {sx: 514, sy: 264, w: 26, h: 23, frames: 1},
 0: {sx: 397, sy: 293, w: 17, h: 19, frames: 1},
 1: {sx: 415, sy: 293, w: 16, h: 19, frames: 1},
 2: {sx: 431, sy: 293, w: 16, h: 18, frames: 1},
 3: {sx: 447, sy: 293, w: 16, h: 18, frames: 1},
 4: {sx: 463, sy: 293, w: 16, h: 18, frames: 1},
 5: {sx: 479, sy: 293, w: 16, h: 18, frames: 1},
 6: {sx: 495, sy: 293, w: 16, h: 18, frames: 1},
 7: {sx: 511, sy: 293, w: 16, h: 18, frames: 1},
 8: {sx: 527, sy: 293, w: 16, h: 18, frames: 1},
 9: {sx: 543, sy: 293, w: 16, h: 18, frames: 1}
};//sprites

var posicionesDeadzoneIzq = [{x:90, y:50}, {x:60, y:160}, {x: 30, y: 250}, {x: -2, y: 350}];
var posicionesDeadzoneDer = [{x:335, y:60}, {x:365, y:160}, {x: 395, y: 260}, {x: 430, y: 350}];

var coordenadasInicioBarras = [{x:100, y:90}, {x:80, y:190}, {x: 60, y: 290}, {x: 30, y: 380}];

var coordenadasCorazon= [{x:10, y:10}, {x:40, y:10}, {x: 70, y: 10}];
var coordenadasPuntuacion1= [{x: 480, y: 10}, {x: 460, y: 10}, {x: 440, y: 10}, {x:420, y:10}, {x:400, y:10}, {x:380, y:10}];



var spritesClientes = ["cliente", "cliente2", "cliente3", "cliente4"];
var velocidades = [30, 35, 40, 45];

var OBJECT_PLAYER = 1,
    OBJECT_DRINK = 2,
    OBJECT_DEADZONE = 4,
    OBJECT_CLIENT = 8;
    //OBJECT_PLAYER_PROJECTILE = 2,
    //OBJECT_POWERUP = 16;

var canvas;

var VIDAS = 3;
//var spriteClienteAleatorio = spritesClientes[numeroAleatorio(0, spritesClientes.length-1)];



//---------------------------------------------------------------------------------------------------------------------------------

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();

  // Only 1 row of stars
  /*
  if(ua.match(/android/)) {
    Game.setBoard(0,new Starfield(50,0.6,100,true));
  } else {
    Game.setBoard(0,new Starfield(20,0.4,100,true));
    Game.setBoard(1,new Starfield(50,0.6,100));
    Game.setBoard(2,new Starfield(100,1.0,50));
  }*/  
  Game.setBoard(3,new TitleScreen("Mini Tapper", 
                                  "Pulsa la barra espaciadora para empezar",
                                  playGame));
};

var numeroAleatorio = function(min, max){
  return Math.floor(Math.random() * (max-min+1)) + min;
}

var generaDeadzones = function(board){

  for(var i = 0; i < posicionesDeadzoneIzq.length; i++){
    board.add(new DeadZone(posicionesDeadzoneIzq[i].x, posicionesDeadzoneIzq[i].y));
  }

  for(var i = 0; i < posicionesDeadzoneDer.length; i++){
    board.add(new DeadZone(posicionesDeadzoneDer[i].x, posicionesDeadzoneDer[i].y));
  }

  //Game.setBoard(1, board);
}

var playGame = function() {
  Game.keys['space'] = false;

  Game.desactivarBoard(3);
/******************************************************************************************************/
/*                                        CAPA 0                                                      */
/******************************************************************************************************/
  var board = new GameBoard();
  //SpriteSheet.draw(Game.ctx,"TapperGameplay",0,0);
  board.add(new EscenarioFondo());
  Game.setBoard(0,board);
  


/******************************************************************************************************/
/*                                        CAPA 1                                                      */
/******************************************************************************************************/
  var board1 = new GameBoard();
  board1.add(new Player());
  //Game.setBoard(1,board);
  

  GameManager.numTotalClientes = 0;
  //console.log("A VER " + GameManager.numTotalClientes);
  //OJO, esto tendrá que hacerlo Spawners. Se moverá esta linea.

  //---------------------
  //board.add(new Beer(310, 300, 60, true));
  //Game.setBoard(1,board);

  var retardo;
  var numClientes;
  var frecuenciaCreacion;
  

  //BARRA 1
  retardo = ((Math.random() * 5)+1);//para generar un retardo entre 1 y 5 con desimales
  numClientes = numeroAleatorio(1,4);//para generar un numero de clientes entre 1 y 5
  frecuenciaCreacion = (Math.random() * 5) + 3;
  board1.add(new Spawner(0,numClientes,frecuenciaCreacion,retardo));
  //board1.add(new Metrics());
  //numBarra, numClientes, frecuenciaCreacion, retardo
/*
  //BARRA 2
  retardo = ((Math.random() * 5)+1);//para generar un retardo entre 1 y 5
  numClientes = numeroAleatorio(0,4);//para generar un numero de clientes entre 0 y 4  ya que sirve con asegurarse que al menos 1 en una barra
  frecuenciaCreacion = (Math.random() * 5) + 2;
  board1.add(new Spawner(1,numClientes,frecuenciaCreacion,retardo));

  //BARRA 3
  retardo = ((Math.random() * 5)+1);//para generar un retardo entre 1 y 5
  numClientes = numeroAleatorio(0,4);//para generar un numero de clientes entre 1 y 5
  frecuenciaCreacion = (Math.random() * 5) + 2;
  board1.add(new Spawner(2,numClientes,frecuenciaCreacion,retardo));


  //BARRA 4
  retardo = ((Math.random() * 5)+1);//para generar un retardo entre 1 y 5
  numClientes = numeroAleatorio(0,4);//para generar un numero de clientes entre 1 y 5
  frecuenciaCreacion = (Math.random() * 5) + 2;
  board1.add(new Spawner(3,numClientes,frecuenciaCreacion,retardo));*/

  
  //----------------------

  generaDeadzones(board1);

  Game.setBoard(1,board1);

/******************************************************************************************************/
/*                                        CAPA 2                                                      */
/******************************************************************************************************/


//AQUI HAY QUE AÑADIR LO DE LA CAPA EXTRA PARA TAPAR LAS LATAS
  var board2 = new GameBoard();
  board2.add(new EscenarioFondo2());
  board2.add(new Salud());
  board2.add(new Puntuacion());
  Game.setBoard(2,board2);

};//playGame

var winGame = function() {
  reiniciar();
  Game.desactivarBoard(1);
  
  Game.setBoard(3,new Temporizador(1000, function(){
                                GameManager.puntuacionActual = 0;
                                Game.setBoard(3,new MiTitleScreen("¡Has ganado!", 
                                  "Pulsa espacio para otra partida",
                                  playGame));
                                }));
};

var loseGame = function() {
 
  reiniciar();
  Game.desactivarBoard(1);
  //Game.boards[1].activada = false;
  Game.setBoard(3,new Temporizador(1000, function(){
                                  GameManager.puntuacionActual = 0;
                                  Game.setBoard(3, new MiTitleScreen("¡Has perdido!", 
                                  "Pulsa espacio para otra partida",
                                  playGame));
                                }));
};



var reiniciar = function(){
  GameManager.numTotalClientes = -1;
  GameManager.numJarrasGeneradas = 0;
  GameManager.numClientesServidos = 0;
  GameManager.vidasDisponibles = VIDAS;
  
}
//---------------------------------------------------------------------------------------------------------------------------------

var EscenarioFondo = function(){
  this.setup('TapperGameplay', {x:0, y:0}); //setup(sprite, props)
  this.step = function(dt) { };


}//EscenarioFondo

EscenarioFondo.prototype = new Sprite();

//---------------------------------------------------------------------------------------------------------------------------------

var EscenarioFondo2 = function(){
  this.setup('ParedIzda', {x:0, y:0}); //setup(sprite, props)
  this.step = function(dt) { };
}//EscenarioFondo

EscenarioFondo2.prototype = new Sprite();

//-----------------------------------------------------------------------------

var Beer = function(x, y, vx, estadoBoolean){
  /*
  Hace que una cerveza llena se mueva de derecha a izquierda. 
  Crea esta clase de modo que puedas iniciarla en distintas posiciones 
  y que se mueva a distinta velocidad.
  */

  //el sprite necesita saber unas coordenadas donde dibujarse de primeras
  this.x = x;
  this.y = y;
 // this.xant = 0;
  this.llena = estadoBoolean;

  if(this.llena){
    this.setup('bebidallena'); //setup(sprite, props)
    this.vx = vx*-1;
  }else{
    this.setup('bebidavacia');
    //console.log("vx a la vuelta vale: " + this.vx);
    this.vx = vx;
   //console.log("vx a la vuelta vale: " + this.vx);
  }

  
  this.step = function(dt){
    //this.xant =this.x;
    this.x += this.vx * dt;
   // var resultado = (this.xant -this.x)/dt;
   // console.log("mi velocidad es: "+ this.vx);
    var objetoColisionado = this.board.collide(this,OBJECT_DEADZONE);
    if(objetoColisionado) {
      console.log("deadzone choca contra cerveza")
      GameManager.jarraPerdida();
      //collision.hit(this.damage); 
      //esto borra la deadzone (lo que ha detectado que colisiona con cerveza)
      //si la borrasemos tras la primera colision, las bebidas que no se eliminarian
      //donde estaba antes ese deadzone
      
      this.board.remove(this); //y esto borraria la cerveza
    }

  }//step de Beer

}//Beer

Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_DRINK;


//---------------------------------------------------------------------------------------------------------------------------------


var Player = function(){

  this.posiciones = [{x:325, y:90},
                    {x:357, y:185},
                    {x:389, y:281},
                    {x:421, y:377}];

  //el sprite necesita saber unas coordenadas donde dibujarse de primeras
  this.x = this.posiciones[0].x;
  this.y = this.posiciones[0].y;
  this.posicionActual = 0;

  this.setup('camarero'); //setup(sprite, props)

  /*
    Hace que el camarero se mueva en cuatro posiciones fijas de manera discreta, 
    es decir, moviéndose exactamente una posición en la dirección indicada por el jugador.  
    El movimiento ha de ser cíclico, de modo que al llegar a la parte superior 
    vuelve a aparecer por la inferior y viceversa.
  */
  this.step = function(dt) { 


    if(Game.keys['up']) { 
 
      if(this.posicionActual == 0){
        this.x = this.posiciones[this.posiciones.length-1].x;
        this.y = this.posiciones[this.posiciones.length-1].y;
        this.posicionActual = this.posiciones.length-1;
      }else{
        
        this.x = this.posiciones[this.posicionActual-1].x;
        this.y = this.posiciones[this.posicionActual-1].y;
        this.posicionActual = this.posicionActual-1;
      }

      Game.keys['up'] = false;
       
    }
    else if(Game.keys['down']) { 

      if(this.posicionActual == this.posiciones.length-1){

        this.x = this.posiciones[0].x;
        this.y = this.posiciones[0].y;
        this.posicionActual = 0;
      }else{
        
        this.x = this.posiciones[this.posicionActual+1].x;
        this.y = this.posiciones[this.posicionActual+1].y;
        this.posicionActual++;
      }

      Game.keys['down'] = false;
    }else if(Game.keys['left']) { 
      this.x += (-2);
      console.log("has pulsado izquierda");
     /* if(this.posicionActual == this.posiciones.length-1){

        this.x = this.posiciones[0].x;
        this.y = this.posiciones[0].y;
        this.posicionActual = 0;
      }else{
        
        this.x = this.posiciones[this.posicionActual+1].x;
        this.y = this.posiciones[this.posicionActual+1].y;
        this.posicionActual++;
      }*/

      Game.keys['left'] = false;
    }else if(Game.keys['right']) { 
      this.x += (2);
      /*if(this.posicionActual == this.posiciones.length-1){

        this.x = this.posiciones[0].x;
        this.y = this.posiciones[0].y;
        this.posicionActual = 0;
      }else{
        
        this.x = this.posiciones[this.posicionActual+1].x;
        this.y = this.posiciones[this.posicionActual+1].y;
        this.posicionActual++;
      }*/

      Game.keys['right'] = false;
    }else if(Game.keys['space']){//COMPROBAR QUE ESTE EN LAS POSICIONES DE INICIO DE LA BARRA PARA PODER SERVIR, SI NO NANAI
      Game.keys['space'] = false;
      this.reload = this.reloadTime;

      //console.log("has pulsado espacio");
      //var clonCerveza = Object.create(Beer);

      //var clonCerveza = Object.create(Beer.prototype, { 'x':{value: 100}, 'y':{value:100}, 'vx':{value: -30}});
      //var clonCerveza = Object.create(Beer.prototype);
     // console.log(this.board);
      this.board.add(new Beer(this.x-12, this.y+10, 100, true));
      GameManager.numJarrasGeneradas++;
    }

    var objetoColisionado = this.board.collide(this,OBJECT_DRINK);
    if(objetoColisionado) {
      console.log("cerveza es colisionada por camarero") //para comprobar que la colision es correcta
      objetoColisionado.hit(this.damage); 
      //esto borra la bebida (lo que ha detectado que colisiona con el camarero)
      
      //this.board.remove(this); //y esto borraria al camarero, pero no queremos eso!

      //this.board.add(new Beer(this.x, this.y, 30, false));
      //this.board.add(new Beer(collision.x, collision.y, 30, false));
      //Game.setBoard(1, this.board);
      GameManager.numJarrasGeneradas--;
      GameManager.puntuacionActual += 100;
    }

    this.reload-=dt;
    
      

  };//step

}//Player

Player.prototype = new Sprite();

//---------------------------------------------------------------------------------------------------------------------------------

var DeadZone = function(x, y){
  /*
    Esta clase representa un rectángulo o trigger 
    que hace que clientes, jarras vacías y llenas sean destruidas 
    al colisionar con él. Coloca una DeadZone a cada extremo de la barra 
    y comprueba su funcionamiento. 

    Para poder depurar te recomendamos que le implementes un método draw 
    que dibuje un rectángulo usando 
    las instrucciones primitivas del Canvas de HTML5. 

    Al colocar las DeadZone tendrás que tener cuidado 
    y comprobar que cuando el Player crea una cerveza, 
    ésta no se destruye inmediatamente.
  */

  this.x = x;
  this.y = y;

  this.setup('deadzone'); //setup(sprite, props)

  this.draw = function(dt){
    //ESTO ES UNICAMENTE PARA DEPURAR, vemos asi las deadzones dibujadas
    Game.ctx.fillRect(this.x, this.y, 5, 70);
  }

  this.step = function(dt){ }

}//DeadZone

DeadZone.prototype = new Sprite();
DeadZone.prototype.type = OBJECT_DEADZONE;


//---------------------------------------------------------------------------------------------------------------------------------

var Salud = function(){
  
  this.draw = function(dt){ 
    var s = SpriteSheet.map['corazon'];
    for(var i =0; i < GameManager.vidasDisponibles;i++){
      this.x = coordenadasCorazon[i].x;
      this.y = coordenadasCorazon[i].y;
      Game.ctx.drawImage(SpriteSheet.image, s.sx + 0 * s.w, s.sy, s.w, s.h, this.x, this.y, s.w, s.h);
      //console.log("toy aqui");
    }
 }

  this.step = function(dt){ }

}//Salud

//---------------------------------------------------------------------------------------------------------------------------------


var Puntuacion = function(){
   
  this.draw = function(dt){ 
    var puntuacionAct = GameManager.puntuacionActual.toString();
    
    for(var i = 0; i < puntuacionAct.length;i++){
      var s = SpriteSheet.map[puntuacionAct[i]];
      this.x = coordenadasPuntuacion1[puntuacionAct.length - i - 1].x;
     // console.log();
      this.y = coordenadasPuntuacion1[puntuacionAct.length - i - 1].y;
      Game.ctx.drawImage(SpriteSheet.image, s.sx + 0 * s.w, s.sy, s.w, s.h, this.x, this.y, s.w, s.h);
      //console.log("toy aqui");
    }
 }

  this.step = function(dt){ }

}//Puntuacion Maxima

//---------------------------------------------------------------------------------------------------------------------------------

var Client = function(x, y, vx, nombreSprite){
  /*
  Hace que un cliente se mueva de izquierda a derecha. 
  Al igual que la cerveza, crea esta clase de modo 
  que puedas iniciarla en distintas posiciones, con distintos sprites (opcional)
  y que se mueva a distinta velocidad.
  */

  //el sprite necesita saber unas coordenadas donde dibujarse de primeras
  this.x = x;
  this.y = y;
  this.vx = vx; 

  this.setup(nombreSprite); //setup(sprite, props)

  this.step = function(dt){

    this.x += this.vx * dt;
   // console.log("la velocidad del cleinte es:"+ this.vx);
    var objetoColisionado = this.board.collide(this,6);

    if(objetoColisionado) {

      if(objetoColisionado instanceof Beer){
        objetoColisionado.hit(this.damage); 
        //esto borra la bebida (lo que ha detectado que colisiona con el cliente)
        
        this.board.remove(this); //y esto borra al cliente

        //this.board.add(new Beer(this.x, this.y, 30, false));
        this.board.add(new Beer(objetoColisionado.x, objetoColisionado.y, this.vx, false));
        GameManager.servir();
        GameManager.puntuacionActual += 50;
      }else if(objetoColisionado instanceof DeadZone){
        console.log("cliente choca contra deadzone");
        //collision.hit(this.damage); 
        //esto borraria la deadzone (lo que ha detectado que colisiona con el cliente)
        
        this.board.remove(this); //y esto borra al cliente

        GameManager.clientePerdido();
      }

    }

  }

}//Client

Client.prototype = new Sprite();
Client.prototype.type = OBJECT_CLIENT;

//---------------------------------------------------------------------------------------------------------------------------------

var Spawner = function(numBarra, numClientes, frecuenciaCreacion, retardo){
  this.primero=false;//para ver cuando se crea el primer cliente
  this.tiempo = 0; //empezamos en tiempo 0
  this.retardo = retardo;
  this.frecuenciaCreacion = frecuenciaCreacion;
  this.numClientes = numClientes;
  var spriteClienteAleatorio = spritesClientes[numeroAleatorio(0, spritesClientes.length-1)];
  var velocidadAleatoria = velocidades[numeroAleatorio(0, velocidades.length-1)];
  this.cliente = new Client(coordenadasInicioBarras[numBarra].x, coordenadasInicioBarras[numBarra].y, velocidadAleatoria, spriteClienteAleatorio);
  GameManager.sumarClientes(this.numClientes);;
}//Spawner

Spawner.prototype.draw = function(){}
Spawner.prototype.step = function(dt){
 
  if(this.primero){
      this.tiempo = this.tiempo + dt;
      if(this.numClientes > 0 && this.tiempo >= this.frecuenciaCreacion){
        this.tiempo = 0;
        this.board.add(Object.create(this.cliente));
        this.numClientes--;
      }
  }
  else {
    
    if(this.tiempo > this.retardo && this.numClientes > 0){
      this.primero = true;
      this.tiempo = 0;
      this.board.add(Object.create(this.cliente));
      this.numClientes--;
    }
    else
      this.tiempo = this.tiempo + dt;
  }

}

//Para imprimir informacion util en el desarrollo: iteraciones, tiempo, computacion...

//--------------------------------------------------------------------------------------------------------------------------

var GameManager = new function(){ //asi seria Singleton?
  /*
  Se encargará de comprobar el estado en el que se encuentra el juego 
  y de decidir si hemos ganado o perdido.

  El jugador gana si se cumplen estas dos condiciones:
  • No quedan clientes a los que servir. El número de clientes es fijo para un nivel y se conoce a priori.
  • No quedan jarras vacías que recoger.
  El jugador pierde si se cumple alguna de estas condiciones:
  • Algún cliente llega al extremo derecho de la barra.
  • Alguna jarra vacía llega al extremo derecho de la barra.
  • Alguna cerveza llena llega al extremo izquierdo de la barra.

  El GameManager es el responsable de centralizar toda la información del juego y, por tanto, de decidir cuándo se termina (porque se ha ganado o se ha perdido):
  • Los Spawners han de avisarle al principio del juego de cuántos clientes van a generar.
  • Cada vez que generemos jarras vacías deberemos avisar al GameManager para que lleve la cuenta.
  • Cada vez que sirvamos a un cliente deberemos avisar al GameManager para que sepa cuántos clientes lleva servidos.
  • Cada vez que una jarra caiga o un cliente llegue al extremo de la barra deberemos avisar al GameManager.
  
  De momento solo haz que el GameManager muestre por consola si se ha ganado o se ha perdido. En la última sección lo implementaremos adecuadamente.

  */

  this.numTotalClientes; //debe decirselo spawners al comenzar el juego
  this.numJarrasGeneradas = 0; //esto va aumentando cuando avisan a GameManager
  this.numClientesServidos = 0; //igual
  this.vidasDisponibles = VIDAS;
  this.puntuacionActual = 0;
  this.puntuacionMaxima = 0;
  //estos 2 ultimos cambiarán a true cuando haya una colision con cualquier deadzone
  //por parte de algun cliente y/o jarra (llena o vacia)



  this.compruebaEstado = function(){
    
    if(this.puntuacionActual >= this.puntuacionMaxima){
      this.puntuacionMaxima = this.puntuacionActual;
    }
   
    if(this.vidasDisponibles == 0){
      loseGame();
    }

    //si no quedan clientes pendientes de servir y no quedan jarras vacias por recoger, ganamos
    if(this.numClientesServidos == this.numTotalClientes && this.numJarrasGeneradas === 0) {
      winGame();
    }
  }
  this.sumarClientes = function(clientes){
    this.numTotalClientes += clientes;
  }
  this.servir = function(){
    this.numClientesServidos++;
  }
  this.clientePerdido = function(){
    this.numClientesServidos++;
    this.vidasDisponibles--;
  }
  this.jarraPerdida = function(){
    this.numJarrasGeneradas--;
    this.vidasDisponibles--;
  }

      


};

//---------------------------------------------------------------------------------------------------------------------------------

window.addEventListener("load", function() {
  //Por aquí pasa solo una vez al arrancar el juego, y nada mas.
  Game.initialize("game",sprites,startGame);
});














































//todo esto de abajo sobra del game.js original del campus virtual, pero podría servir todavía
//-----------------------------------------------------------------------------



var enemies = {
  straight: { x: 0,   y: -50, sprite: 'enemy_ship', health: 10, 
              E: 100 },
  ltr:      { x: 0,   y: -100, sprite: 'enemy_purple', health: 10, 
              B: 75, C: 1, E: 100, missiles: 2  },
  circle:   { x: 250,   y: -50, sprite: 'enemy_circle', health: 10, 
              A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
  wiggle:   { x: 100, y: -50, sprite: 'enemy_bee', health: 20, 
              B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2 },
  step:     { x: 0,   y: -50, sprite: 'enemy_circle', health: 10,
              B: 150, C: 1.2, E: 75 }
};

//------------------------------------------------------------------------------

var Starfield = function(speed,opacity,numStars,clear) {

  // Set up the offscreen canvas
  var stars = document.createElement("canvas");
  stars.width = Game.width; 
  stars.height = Game.height;
  var starCtx = stars.getContext("2d");

  var offset = 0;

  // If the clear option is set, 
  // make the background black instead of transparent
  if(clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillRect(0,0,stars.width,stars.height);
  }

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  starCtx.fillStyle = "#FFF";
  starCtx.globalAlpha = opacity;
  for(var i=0;i<numStars;i++) {
    starCtx.fillRect(Math.floor(Math.random()*stars.width),
                     Math.floor(Math.random()*stars.height),
                     2,
                     2);
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = stars.height - intOffset;

    // Draw the top half of the starfield
    if(intOffset > 0) {
      ctx.drawImage(stars,
                0, remaining,
                stars.width, intOffset,
                0, 0,
                stars.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) {
      ctx.drawImage(stars,
              0, 0,
              stars.width, remaining,
              0, intOffset,
              stars.width, remaining);
    }
  };

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  };
};//Starfield

//---------------------------------------------------------------------------------------------------------------------------------

var PlayerShip = function() { 
  this.setup('ship', { vx: 0, reloadTime: 0.25, maxVel: 200 });

  this.reload = this.reloadTime;
  this.x = Game.width/2 - this.w / 2;
  this.y = Game.height - Game.playerOffset - this.h;

  this.step = function(dt) {
    if(Game.keys['left']) { this.vx = -this.maxVel; }
    else if(Game.keys['right']) { this.vx = this.maxVel; }
    else { this.vx = 0; }

    this.x += this.vx * dt;

    if(this.x < 0) { t
      his.x = 0; 
    }
    else if(this.x > Game.width - this.w) { 
      this.x = Game.width - this.w;
    }

    this.reload-=dt;
    if(Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
      this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
    }
  };
};//PlayerShip

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
};

//---------------------------------------------------------------------------------------------------------------------------------


var PlayerMissile = function(x,y) {
  this.setup('missile',{ vy: -700, damage: 10 });
  this.x = x - this.w/2;
  this.y = y - this.h; 
};//PlayerMissile

PlayerMissile.prototype = new Sprite();
//PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_ENEMY);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y < -this.h) { 
      this.board.remove(this); 
  }
};

//---------------------------------------------------------------------------------------------------------------------------------


var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
};//Enemy

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_DRINK;

Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, reloadTime: 0.75, 
                                   reload: 0 };

Enemy.prototype.step = function(dt) {
  this.t += dt;

  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

  this.x += this.vx * dt;
  this.y += this.vy * dt;

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

  if(Math.random() < 0.01 && this.reload <= 0) {
    this.reload = this.reloadTime;
    if(this.missiles == 2) {
      this.board.add(new EnemyMissile(this.x+this.w-2,this.y+this.h));
      this.board.add(new EnemyMissile(this.x+2,this.y+this.h));
    } else {
      this.board.add(new EnemyMissile(this.x+this.w/2,this.y+this.h));
    }

  }
  this.reload-=dt;

  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }
};//step de enemigo

Enemy.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      Game.points += this.points || 100;
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }
};

//---------------------------------------------------------------------------------------------------------------------------------

var EnemyMissile = function(x,y) {
  this.setup('enemy_missile',{ vy: 200, damage: 10 });
  this.x = x - this.w/2;
  this.y = y;
};//EnemyMissile

EnemyMissile.prototype = new Sprite();
EnemyMissile.prototype.type = OBJECT_DEADZONE;

EnemyMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_PLAYER)
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y > Game.height) {
      this.board.remove(this); 
  }
};

//---------------------------------------------------------------------------------------------------------------------------------

var Explosion = function(centerX,centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
};//Explosion

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame++;
  if(this.frame >= 12) {
    this.board.remove(this);
  }
};
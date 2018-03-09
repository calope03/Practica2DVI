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
 TapperGameplay: {sx: 0, sy: 480, w: 512, h: 480,frames: 1}
};//sprites

var posicionesDeadzoneIzq = [{x:90, y:50}, {x:60, y:160}, {x: 30, y: 250}, {x: -2, y: 350}];
var posicionesDeadzoneDer = [{x:335, y:60}, {x:365, y:160}, {x: 395, y: 260}, {x: 430, y: 350}];

var coordenadasInicioBarras = [{x:100, y:90}, {x:80, y:190}, {x: 60, y: 290}, {x: 30, y: 380}];

var spritesClientes = ["cliente", "cliente2", "cliente3", "cliente4"];
var velocidades = [10, 20, 30, 40, 50, 60];
var TOTAL_CLIENTES = 1;

var OBJECT_PLAYER = 1,
    OBJECT_DRINK = 2,
    OBJECT_DEADZONE = 4,
    OBJECT_CLIENT = 8;
    //OBJECT_PLAYER_PROJECTILE = 2,
    //OBJECT_POWERUP = 16;

var canvas;

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
  Game.setBoard(0,new TitleScreen("Mini Tapper", 
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

  Game.setBoard(1, board);
}

var playGame = function() {
  Game.keys['space'] = false;
  var board = new GameBoard();
  //board.add(new PlayerShip());
  //board.add(new Level(level1,winGame));
  //SpriteSheet.draw(Game.ctx,"TapperGameplay",0,0);
  board.add(new EscenarioFondo());
  Game.setBoard(0,board);
  /*board.add(new EscenarioFondo2());
  Game.setBoard(20,board);*/

  board.add(new Player());
  Game.setBoard(1,board);
  

  GameManager.numTotalClientes = TOTAL_CLIENTES;
  console.log("A VER " + GameManager.numTotalClientes)
  //OJO, esto tendrá que hacerlo Spawners. Se moverá esta linea.

  //---------------------
  //board.add(new Beer(310, 95, 60, true));
  //Game.setBoard(1,board);

  //var spriteClienteAleatorio = spritesClientes[numeroAleatorio(0, spritesClientes.length-1)];

  var velocidadAleatoria = velocidades[numeroAleatorio(0, velocidades.length-1)];
  //board.add(new Client(coordenadasInicioBarras[0].x, coordenadasInicioBarras[0].y, velocidadAleatoria, spriteClienteAleatorio));
  board.add(new Spawner(0,3,0,3,3));
  //numBarra, numClientes, tipo, frecuenciaCreacion, retardo
  Game.setBoard(1,board);
  //----------------------

  generaDeadzones(board);

  //board.add(new EscenarioFondo2());
  //Game.setBoard(0,board);
  /* para ver mejor lo que hace setboard
    this.setBoard = function(num,board) { 
      boards[num] = board; 
    };
  */
  //Game.setBoard(5,new GamePoints(0));

};//playGame

var winGame = function() {
  GameBoard.activada = false;
  Game.setBoard(3,new TitleScreen("¡Has ganado!", 
                                  "Pulsa la barra espaciadora para otra partida",
                                  playGame));
};

var loseGame = function() {
  GameBoard.activada = false;
  Game.setBoard(3,new TitleScreen("¡Has perdido! >.<", 
                                  "Pulsa la barra espaciadora para otra partida",
                                  playGame));
};

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
  this.llena = estadoBoolean;

  if(this.llena){
    this.setup('bebidallena'); //setup(sprite, props)
    this.vx = vx*-1;
  }else{
    this.setup('bebidavacia');
    this.vx = vx;
  }

  
  this.step = function(dt){

    this.x += this.vx * dt;

    var objetoColisionado = this.board.collide(this,OBJECT_DEADZONE);
    if(objetoColisionado) {
      console.log("deadzone choca contra cerveza")
      GameManager.jarraDesperdiciada = true;
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
/*Beer.prototype.step = function(){
    this.x += this.vx * dt;

    var collision = this.board.collide(this,OBJECT_DEADZONE);
    if(collision) {
      console.log("deadzone choca contra cerveza")
      //collision.hit(this.damage); 
      //esto borra la deadzone (lo que ha detectado que colisiona con cerveza)
      //si la borrasemos tras la primera colision, las bebidas que no se eliminarian
      //donde estaba antes ese deadzone
      
      this.board.remove(this); //y esto borraria la cerveza
    }
}*/

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
    }
    else if(Game.keys['space']){// && this.reload < 0) {
      Game.keys['space'] = false;
      this.reload = this.reloadTime;

      console.log("has pulsado espacio");
      //var clonCerveza = Object.create(Beer);

      //var clonCerveza = Object.create(Beer.prototype, { 'x':{value: 100}, 'y':{value:100}, 'vx':{value: -30}});
      //var clonCerveza = Object.create(Beer.prototype);

      this.board.add(new Beer(this.x-12, this.y+10, 70, true));
      //this.board.add(clonCerveza);
      Game.setBoard(1,this.board);


      /*var bob = Object.create(userB, 
                                  {
                                    'id' : {
                                      value: MY_GLOBAL.nextId(),
                                      enumerable:true // writable:false, configurable(deletable):false by default
                                    },
                                    'name': {
                                      value: 'Bob',
                                      enumerable: true
                                    }
                                  }
                            );*/

    }

    var objetoColisionado = this.board.collide(this,OBJECT_DRINK);
    if(objetoColisionado) {
      console.log("cerveza es colisionada por camarero") //para comprobar que la colision es correcta
      collision.hit(this.damage); 
      //esto borra la bebida (lo que ha detectado que colisiona con el camarero)
      
      //this.board.remove(this); //y esto borraria al camarero, pero no queremos eso!

      //this.board.add(new Beer(this.x, this.y, 30, false));
      //this.board.add(new Beer(collision.x, collision.y, 30, false));
      //Game.setBoard(1, this.board);
      GameManager.numJarrasVaciasGeneradas--;
    }

    this.reload-=dt;
    /*if(Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
      this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
    }*/
      

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

    var objetoColisionado = this.board.collide(this,6);

    if(objetoColisionado) {

      if(objetoColisionado instanceof Beer){
        objetoColisionado.hit(this.damage); 
        //esto borra la bebida (lo que ha detectado que colisiona con el cliente)
        
        this.board.remove(this); //y esto borra al cliente

        //this.board.add(new Beer(this.x, this.y, 30, false));
        this.board.add(new Beer(objetoColisionado.x, objetoColisionado.y, 30, false));
        GameManager.numJarrasVaciasGeneradas++;
        GameManager.numClientesServidos++;
        Game.setBoard(1, this.board);
      }else if(objetoColisionado instanceof DeadZone){
        console.log("cliente choca contra deadzone");
        //collision.hit(this.damage); 
        //esto borraria la deadzone (lo que ha detectado que colisiona con el cliente)
        
        this.board.remove(this); //y esto borra al cliente

        GameManager.clienteCabreado = true;
      }

    }

  }

}//Client

Client.prototype = new Sprite();
Client.prototype.type = OBJECT_CLIENT;

//---------------------------------------------------------------------------------------------------------------------------------

var Spawner = function(numBarra, numClientes, tipo, frecuenciaCreacion, retardo){
  this.primero=false;//para ver cuando se crea el primer cliente
  this.tiempo = 0; //empezamos en tiempo 0
  this.retardo = retardo;
  this.frecuenciaCreacion = frecuenciaCreacion;
  this.numClientes = numClientes;
  var spriteClienteAleatorio = spritesClientes[numeroAleatorio(0, spritesClientes.length-1)];
  this.cliente = new Client(coordenadasInicioBarras[numBarra].x, coordenadasInicioBarras[numBarra].y, 10, spriteClienteAleatorio);


/*
var Spawner = function(y, delay, numClientes, tiempo_entre_clientes, tipo_cliente) {
  this.tiempo = 0;
  this.tiempoFrame = 0;
  this.primero = false;

  this.tipo_cliente = new Client(this.x, this.y);

  GameManager.sumarClientes(numClientes);
};
*/













  /*
  La clase Spawner contiene la lógica para crear clientes en una determinada barra del bar. 
  Haz que este objeto se pueda configurar para que se generen un número concreto de clientes de un determinado tipo,
  a una frecuencia de creación fija y con un determinado retardo
  con respecto a la creación del primer cliente
  (para que no salgan clientes en todas las barras a la vez).
  Para ello os recomendamos que utilicéis un patrón Prototype. 

  El Spawner es inicializado con un objeto prototípico (un Cliente) 
  que iremos clonando y añadiendo a la capa del juego con una determinada 
  frecuencia. 
  NO debes usar el método setInterval para decidir 
  cuándo clonar el objeto prototipo (Este motor no usa setInterval para implementar el bucle de juego sino un polyfill llamado requestAnimationFrame. Si usas el setTimeout entonces se producirán comportamientos extraños en la ejecución del bucle.) 
  Si lo haces, verás que el juego se comporta de manera extraña 
  si mandas la ventana del navegador a segundo plano.
  */
 /* this.numClientes = numClientes;
  this.tipoCliente = tipo;
  this.frecuenciaCreacion = frecuenciaCreacion;
  this.retardo = retardo;*/
  //un determinado retardo con respecto a la creación del primer cliente
  //(para que no salgan clientes en todas las barras a la vez).



}//Spawner

Spawner.prototype.draw = function(){}
Spawner.prototype.step = function(dt){
  //this.board.add(this.cliente);
    if(this.primero){
      this.tiempo = this.tiempo + dt;

      if(this.numClientes > 0 && this.tiempo >= this.frecuenciaCreacion){
        console.log("que pacha: voy a crear los demas");
        this.tiempo = 0;
        this.board.add(Object.create(this.cliente));
        this.numClientes--;
      }
  }
  else {
    
    if(this.tiempo > this.retardo && this.numClientes > 0){
      console.log("que pacha: voy a crear el primer cliente");
      this.primero = true;
      this.tiempo = 0;
      this.board.add(Object.create(this.cliente));
      this.numClientes--;
    }
    else
      this.tiempo = this.tiempo + dt;
  }
}








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
  this.numJarrasVaciasGeneradas = 0; //esto va aumentando cuando avisan a GameManager
  this.numClientesServidos = 0; //igual
  this.jarraDesperdiciada = false; //una llena o vacia se cae por algun extremo
  this.clienteCabreado = false; 
  //estos 2 ultimos cambiarán a true cuando haya una colision con cualquier deadzone
  //por parte de algun cliente y/o jarra (llena o vacia)



  this.compruebaEstado = function(){

    /*
    console.log("Clientes servidos = " + this.numClientesServidos);
    console.log("Total clientes = " + this.numTotalClientes);
    console.log(" ");
    console.log("Jarras vacias = " + this.numJarrasVaciasGeneradas);*/
    

    if(this.clienteCabreado || this.jarraDesperdiciada){
      loseGame();
    }

    //si no quedan clientes pendientes de servir y no quedan jarras vacias por recoger, ganamos
    if(this.numClientesServidos === this.numTotalClientes && this.numJarrasVaciasGeneradas === 0) {
      winGame();
    }
  }

  /*PlayerShip.prototype.hit = function(damage) {
        if(this.board.remove(this)) {
          loseGame();
        }
      };*/

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
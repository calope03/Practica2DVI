/*
DVI Practica 2 - GII - UCM Curso 2017/2018
Alumnos:
Cesar Godino Rodriguez
Carmen Lopez Gonzalo 
*/

/*
DUDA: en teoría (casi) todos estos datos de arriba en vez de var 
podrían ser perfectamente const, porque muchos no cambian nada durante la ejecucion.
Lo mismo para los datos de datosniveles.js
*/

var sprites = {
 fondoPrincipal: {sx: 0, sy: 480, w: 512, h: 480,frames: 1},
 paredIzquierda: {sx: 0, sy: 0, w: 132, h: 480, frames: 1},
 camarero: { sx: 510, sy: 0, w: 55, h: 64, frames: 1 },
 cliente: { sx: 510, sy: 66, w: 32, h: 32, frames: 1 },
 cliente2: { sx: 512, sy: 164, w: 32, h: 32, frames: 1 },
 cliente3: { sx: 512, sy: 197, w: 32, h: 32, frames: 1 },
 cliente4: { sx: 512, sy: 230, w: 32, h: 32, frames: 1 },
 deadzone: { sx: 512, sy: 235, w: 5, h: 70, frames: 1 }, 
 //deadzone coge un trozo de imagen sin nada dibujado, es un sprite "invisible"
 bebidaLlena: { sx: 496, sy: 106, w: 12, h: 25, frames: 1 },
 bebidaVacia: { sx: 496, sy: 138, w: 12, h: 25, frames: 1 },
 corazon: {sx: 514, sy: 264, w: 26, h: 23, frames: 1},
 propina: {sx: 516, sy: 318, w: 28, h: 20, frames: 1},
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
};//sprites que usamos

var spritesClientes = ["cliente", "cliente2", "cliente3", "cliente4"];

var posicionesDeadzoneIzq = [{x:90, y:50}, {x:60, y:160}, {x: 30, y: 250}, {x: -2, y: 350}];
var posicionesDeadzoneDer = [{x:335, y:60}, {x:365, y:160}, {x: 395, y: 260}, {x: 430, y: 350}];
var coordenadasInicioBarras = [{x:100, y:90}, {x:80, y:190}, {x: 60, y: 290}, {x: 30, y: 380}];
var coordenadasPuntuacion1= [{x: 480, y: 10}, {x: 460, y: 10}, {x: 440, y: 10}, {x:420, y:10}, {x:400, y:10}, {x:380, y:10}];
var coordenadasCorazon= [{x:10, y:10}];
//como minimo tiene que haber 1 vida, como maximo las que quepan en pantalla en cuanto a corazones

var OBJECT_PLAYER = 1,
    OBJECT_DRINK = 2,
    OBJECT_DEADZONE = 4,
    OBJECT_CLIENT = 8,
    OBJECT_PROPINA = 16;

var canvas;
var nivelSeleccionado = "nivel1";
//en caso de no asignarse bien, al menos cargará los datos del nivel 1 por defecto

var audio_principal = new Audio('sounds/musica_fondo.mp3'); 
audio_principal.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

//---------------------------------------------------------------------------------------------------------------------------------

var startGame = function() {
    
  reproduceSonido('comienzo');
  Game.setBoard(3,new TitleScreen("Mini Tapper",
                                  "Pulsa 1, 2 ó 3 para elegir un nivel",
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

}

var reproduceSonido = function(nombreSonido){
  var audio = new Audio('sounds/' + nombreSonido + '.mp3');
  audio.play();
}

var reproduceAudioPrincipal = function(play){
  if(play){
    audio_principal.play();
  }else{
    audio_principal.pause();
    audio_principal.currentTime = 0;
  }
}

var configuraVidas = function(){
  for(i = 1; i < niveles[nivelSeleccionado].vidas; ++i){ //i=1 porque siempre habra 1 vida como minimo
    coordenadasCorazon[i] = {x: coordenadasCorazon[i-1].x+30, y: 10};
  }
}

var configuraSpawners = function(board1){
  var retardo;
  var numClientes;
  var frecuenciaCreacion;
  
  //Configura el Spawner de cada barra
  for(i = 0; i < 4; ++i){
    retardo = ((Math.random() * niveles[nivelSeleccionado].maxRetardo)+niveles[nivelSeleccionado].minRetardo);//para generar un retardo (entre un minimo y maximo dado) con decimales
    numClientes = numeroAleatorio(niveles[nivelSeleccionado].minClientesBarra,niveles[nivelSeleccionado].maxClientesBarra);//para generar un numero de clientes (entre un minimo y maximo dado)
    frecuenciaCreacion = (Math.random() * niveles[nivelSeleccionado].maxFrecuenciaCreacion) + niveles[nivelSeleccionado].minFrecuenciaCreacion;
    
    board1.add(new Spawner(i,numClientes,frecuenciaCreacion,retardo));
  }
}

var playGame = function(){

  if(Game.keys['1']) nivelSeleccionado = "nivel1";
  else if(Game.keys['2']) nivelSeleccionado = "nivel2";
  else if(Game.keys['3']) nivelSeleccionado = "nivel3";

  Game.keys['space'] = false;
  Game.keys['1'] = false;
  Game.keys['2'] = false;
  Game.keys['3'] = false;

  /*Para debugueo
  console.log("nivel elegido = " + nivelSeleccionado);
  */

  configuraVidas();
  GameManager.numTotalClientes = 0;
  GameManager.vidasDisponibles = niveles[nivelSeleccionado].vidas;
  reproduceAudioPrincipal(true);
  Game.desactivarBoard(3);

  /******************************************************************************************************/
  /*                                        CAPA 0                                                      */
  /******************************************************************************************************/
  var board = new GameBoard();
  board.add(new EscenarioFondo());
  Game.setBoard(0,board);
  /******************************************************************************************************/
  /*                                        CAPA 1                                                      */
  /******************************************************************************************************/
  var board1 = new GameBoard();
  board1.add(new Player());

  configuraSpawners(board1);
  generaDeadzones(board1);
  Game.setBoard(1,board1);
  /******************************************************************************************************/
  /*                                        CAPA 2                                                      */
  /******************************************************************************************************/
  var board2 = new GameBoard();
  board2.add(new EscenarioFondo2());
  board2.add(new Salud());
  board2.add(new Puntuacion());
  Game.setBoard(2,board2);

};//playGame


var reiniciarDatos = function(){
  GameManager.numTotalClientes = -1;
  GameManager.numJarrasGeneradas = 0;
  GameManager.numClientesServidos = 0;
  GameManager.vidasDisponibles = niveles[nivelSeleccionado].vidas;
  
}

var acabaPartida = function(mensaje, nombreSonido) {
  reiniciarDatos();
  Game.desactivarBoard(1);

  reproduceAudioPrincipal(false);
  reproduceSonido(nombreSonido);

  Game.setBoard(3,new Temporizador(1000, function(){
                                  GameManager.puntuacionActual = 0;
                                  Game.setBoard(3, new MiTitleScreen(mensaje, 
                                  "Pulsa espacio para otra partida",
                                  playGame));
                                }));
};

//---------------------------------------------------------------------------------------------------------------------------------

var EscenarioFondo = function(){
  this.setup('fondoPrincipal', {x:0, y:0});
  this.step = function(dt) { };
}//EscenarioFondo

EscenarioFondo.prototype = new Sprite();

//---------------------------------------------------------------------------------------------------------------------------------

var EscenarioFondo2 = function(){
  this.setup('paredIzquierda', {x:0, y:0});
  this.step = function(dt) { };
}//EscenarioFondo

EscenarioFondo2.prototype = new Sprite();

//---------------------------------------------------------------------------------------------------------------------------------

var Beer = function(x, y, vx, estadoBoolean){
  /*
  Hace que una cerveza llena se mueva de derecha a izquierda. 
  Crea esta clase de modo que puedas iniciarla en distintas posiciones 
  y que se mueva a distinta velocidad.
  Puede estar en dos estados: llena o vacía. 
  Cada estado tiene un aspecto y sentido de la velocidad diferentes.
  */

  //el sprite necesita saber unas coordenadas donde dibujarse de primeras
  this.x = x;
  this.y = y;
  this.llena = estadoBoolean;

  if(this.llena){
    this.setup('bebidaLlena');
    this.vx = vx*-1;
  }else{
    this.setup('bebidaVacia');
    this.vx = vx;
  }

  
  this.step = function(dt){
    this.x += this.vx * dt;
    var objetoColisionado = this.board.collide(this,OBJECT_DEADZONE);
    if(objetoColisionado) {
      GameManager.jarraPerdida();
      /*Para debugueo
        console.log("deadzone choca contra cerveza")
        collision.hit(this.damage); -> esto borra la deadzone (lo que ha detectado que colisiona con cerveza)
        si la borrasemos tras la primera colision, las bebidas que no se eliminarian
        donde estaba antes ese deadzone
      */
      
      this.board.remove(this); //esto borra la cerveza
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

  this.posicionesIzq = [{x:100, y:90},
                    {x:90, y:185},
                    {x:80, y:281},
                    {x:70, y:377}];

  //el sprite necesita saber unas coordenadas donde dibujarse de primeras
  this.x = this.posiciones[0].x;
  this.y = this.posiciones[0].y;
  this.posicionActual = 0;
  this.listoParaServir = true;

  this.setup('camarero');

  /*
    Hace que el camarero se mueva en cuatro posiciones fijas de manera discreta, 
    es decir, moviéndose exactamente una posición en la dirección indicada por el jugador.  
    El movimiento ha de ser cíclico, de modo que al llegar a la parte superior 
    vuelve a aparecer por la inferior y viceversa.
  */
  this.step = function(dt) { 

    var seHaMovido = false;

    if(Game.keys['up']) { 

      seHaMovido = true;
 
      if(this.posicionActual == 0){ //si está en la barra de arriba del todo

        this.x = this.posiciones[this.posiciones.length-1].x;
        this.y = this.posiciones[this.posiciones.length-1].y;
        this.posicionActual = this.posiciones.length-1;
        
      }else{
        
        this.x = this.posiciones[this.posicionActual-1].x;
        this.y = this.posiciones[this.posicionActual-1].y;
        this.posicionActual = this.posicionActual-1;
      }

      this.listoParaServir = true;

      Game.keys['up'] = false;
       
    }
    else if(Game.keys['down']) { 

      seHaMovido = true;

      if(this.posicionActual == this.posiciones.length-1){ //si está en la barra de abajo del todo

        this.x = this.posiciones[0].x;
        this.y = this.posiciones[0].y;
        this.posicionActual = 0;
      }else{
        
        this.x = this.posiciones[this.posicionActual+1].x;
        this.y = this.posiciones[this.posicionActual+1].y;
        this.posicionActual++;
      }

      this.listoParaServir = true;

      Game.keys['down'] = false;
    }else if(Game.keys['left']) { 

      if(this.listoParaServir){
        this.listoParaServir = false;
      }

      if( (this.posicionActual == 0 && this.x > 100) ||
          (this.posicionActual == 1 && this.x > 70) ||
          (this.posicionActual == 2 && this.x > 40) ||
          (this.posicionActual == 3 && this.x > 8) ){
            this.x += (-niveles[nivelSeleccionado].velocidadLateralCamarero); 
            //dejamos que vaya para la izquierda si, en su respectiva barra, no se ha pasado de cierta coordenada x
      }
     
      Game.keys['left'] = false;
    }else if(Game.keys['right']) { 
      
      if( (this.posicionActual == 0 && this.x < this.posiciones[0].x) ||
          (this.posicionActual == 1 && this.x < this.posiciones[1].x) ||
          (this.posicionActual == 2 && this.x < this.posiciones[2].x) ||
          (this.posicionActual == 3 && this.x < this.posiciones[3].x) ){
            this.x += (niveles[nivelSeleccionado].velocidadLateralCamarero); 
            //dejamos que vaya para la derecha si, en su respectiva barra, no se ha pasado de cierta coordenada x
      }
      else{
        //si no dejo que se haya movido a la derecha en el if, es porque aqui en el else
        //significa que, esté en la barra que esté, ha vuelto a llegar a su posicion de servir
        this.listoParaServir = true;
      }

      Game.keys['right'] = false;

    }else if(Game.keys['space']){

      Game.keys['space'] = false;

      if(this.listoParaServir){
        this.board.add(new Beer(this.x-12, this.y+10, niveles[nivelSeleccionado].velocidadCrearBebida, true));

        reproduceSonido('sirve_cerveza');
        GameManager.numJarrasGeneradas++;
      }
      
    }

    if(seHaMovido){
      reproduceSonido('movimiento_camarero');
    }

    var objetoColisionado = this.board.collide(this,OBJECT_DRINK);
    if(objetoColisionado && this.listoParaServir) {
      //el camarero solo puede recoger bebidas vacias estando bien colocado

      /*Para debugueo
      console.log("cerveza es colisionada por camarero") //para comprobar que la colision es correcta
      */

      objetoColisionado.hit(); 
      //esto borra la bebida (lo que ha detectado que colisiona con el camarero)

      reproduceSonido('recoge_cerveza');
      
      //this.board.remove(this); //esto borraria al camarero, pero no queremos eso!

      GameManager.numJarrasGeneradas--;
      GameManager.puntuacionActual += niveles[nivelSeleccionado].puntuacionBebidaVacia;
    }

    var objetoColisionado = this.board.collide(this,OBJECT_PROPINA);
    if(objetoColisionado) {
      objetoColisionado.hit(); 
      GameManager.puntuacionActual += niveles[nivelSeleccionado].puntuacionPropina;
      reproduceSonido('propina_recogida');
    }

  };//step de Player

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

    Al colocar las DeadZone tenemos cuidado 
    y comprobamos que cuando el Player crea una cerveza, 
    ésta no se destruye inmediatamente.
  */

  this.x = x;
  this.y = y;

  this.setup('deadzone');

  this.draw = function(dt){
    //ESTO ES UNICAMENTE PARA DEPURAR, vemos asi las deadzones dibujadas
    //Game.ctx.fillRect(this.x, this.y, 5, 70);
  }

  this.step = function(dt){ }

}//DeadZone

DeadZone.prototype = new Sprite();
DeadZone.prototype.type = OBJECT_DEADZONE;


//---------------------------------------------------------------------------------------------------------------------------------
/*
El juego no termina inmediatamente cuando un cliente llega al final de la barra
o una bebida (llena o vacía) se cae, sino que el jugador tiene de varias vidas. 
Cada vez que muere, el nivel se reinicia.
*/
var Salud = function(){
  
  this.draw = function(dt){ 
    var s = SpriteSheet.map['corazon'];
    for(var i =0; i < GameManager.vidasDisponibles;i++){
      this.x = coordenadasCorazon[i].x;
      this.y = coordenadasCorazon[i].y;
      Game.ctx.drawImage(SpriteSheet.image, s.sx + 0 * s.w, s.sy, s.w, s.h, this.x, this.y, s.w, s.h);
    }
 }

  this.step = function(dt){ }

}//Salud

//---------------------------------------------------------------------------------------------------------------------------------
/*
El jugador gana ciertos puntos (segun el nivel que esté jugando) 
cada vez que sirve a un cliente y tambien gana puntos extra 
cuando recoge una bebida vacía. 
El menú principal muestra la máxima puntuación conseguida en una sesión de juego.
*/
var Puntuacion = function(){
   
  this.draw = function(dt){ 
    var puntuacionAct = GameManager.puntuacionActual.toString();
    
    for(var i = 0; i < puntuacionAct.length;i++){
      var s = SpriteSheet.map[puntuacionAct[i]];
      this.x = coordenadasPuntuacion1[puntuacionAct.length - i - 1].x;
      this.y = coordenadasPuntuacion1[puntuacionAct.length - i - 1].y;
      Game.ctx.drawImage(SpriteSheet.image, s.sx + 0 * s.w, s.sy, s.w, s.h, this.x, this.y, s.w, s.h);
    }
 }

  this.step = function(dt){ }

}//Puntuacion

//---------------------------------------------------------------------------------------------------------------------------------

var Client = function(x, y, vx, nombreSprite){
  /*
  Hace que un cliente se mueva de izquierda a derecha. 
  Al igual que la cerveza, crea esta clase de modo 
  que puedas iniciarla en distintas posiciones, con distintos sprites
  y que se mueva a distinta velocidad.

  Cuando un cliente "recibe" una bebida, se mueve hacia atrás 
  en la barra durante unos segundos (está bebiendo). 
  Si en ese movimiento sale por la puerta de la izquierda 
  entonces se considera que el cliente ha sido servido. 
  Si no llega a salir por la puerta durante el tiempo en que bebe,
  entonces se detiene y vuelve a moverse hacia la derecha de la barra. 
  Cuando el cliente está bebiendo no cogerá las cervezas llenas que le lleguen.
  */

  //el sprite necesita saber unas coordenadas donde dibujarse de primeras
  this.x = x;
  this.y = y;
  this.vx = vx; 
  this.dejaraPropina = numeroAleatorio(0,1);

  this.bebiendo = false;
  const TIEMPO_PARA_BEBER = niveles[nivelSeleccionado].segundosClienteBebiendo;
  this.horaParaDejarDeBeber = 0;

  this.setup(nombreSprite);

  this.cambioDeSentido = function(){
    this.vx *= (-1);
    if(this.vx <= 0){//si esta retrocediendo, es porque esta bebiendo
      this.bebiendo = true;
      this.horaParaDejarDeBeber = new Date().getTime() + TIEMPO_PARA_BEBER;
    }
    else{
      this.bebiendo = false;
      this.horaParaDejarDeBeber = 0;
    }
  }

  this.step = function(dt){
    //el cliente siempre se crea con vx positiva

    //quiero comprobar que si esta bebiendo y si ha pasado su tiempo de beber, que vuelva a avanzar
    if(this.bebiendo){
      var horaActual = new Date().getTime();
      if(horaActual >= this.horaParaDejarDeBeber){
        this.cambioDeSentido();
      }
    }

    this.x += this.vx * dt; //el cliente se mueve (en un sentido o en el otro segun vx)

    var objetoColisionado = this.board.collide(this,6); 
    //el 6 es resultado de hacer OR entre 4 y 2, o sea, deadzone y bebida:  100 or 010 = 110

    if(objetoColisionado) {

      if(objetoColisionado instanceof Beer){

        if(!this.bebiendo){ //solo si no está bebiendo es cuando puede reaccionar con una bebida llena
          this.cambioDeSentido();
          objetoColisionado.hit(); 
          //esto borra la bebida (lo que ha detectado que colisiona con el cliente)
          //GameManager.numJarrasGeneradas--; //esto cuenta solo cuando lo recoge el camarero
          this.board.add(new Beer(objetoColisionado.x, objetoColisionado.y, -this.vx, false));
        }
        //si está "bebiendo" y se choca con una cerveza, no pasa nada y la cerveza sigue por la barra

        
        
        //this.board.remove(this); //y esto borraría al cliente cuando colisiona con cerveza, pero ya no queremos que la cerveza borre al cliente
        
      }else if(objetoColisionado instanceof DeadZone){
        /*Para debugueo
          console.log("cliente choca contra deadzone");
          collision.hit(this.damage); //esto borraria la deadzone (lo que ha detectado que colisiona con el cliente)
        */
        
        this.board.remove(this); //esto borra al cliente


        //nos aseguramos de que pasen cosas bonitas solo si choca con alguna deadzone
        //pero de la izquierda, porque si es de una de la derecha no mola :P

        var esDeadzoneIzq = false;
        for(i = 0; i < posicionesDeadzoneIzq.length && !esDeadzoneIzq; i++){
          if(objetoColisionado.x == posicionesDeadzoneIzq[i].x){
            esDeadzoneIzq = true;
          }
        }

        if(esDeadzoneIzq){ //el cliente desaparece y queda servido del todo
          GameManager.servir();
          GameManager.puntuacionActual += niveles[nivelSeleccionado].puntuacionClienteServido;
          reproduceSonido('cliente_servido');
          if(this.dejaraPropina==1){
            this.board.add(new Propina(this.x+40, objetoColisionado.y+50));
            reproduceSonido('aparece_propina');
          }
        }
        else{
          GameManager.clientePerdido();
        }

      }//colision con alguna deadzone

    }//if cliente ha colisionado con algo

  }//step de Client

}//Client

Client.prototype = new Sprite();
Client.prototype.type = OBJECT_CLIENT;

//---------------------------------------------------------------------------------------------------------------------------------
/*
Clientes aleatorios pueden dejar propina al final de la barra al ser servidos. 
Esto implica que el camarero ha de ir a recoger la propina para ganar 
los puntos extras que proporciona. 
El jugador puede moverse a izquierda y derecha de una barra 
pero no puede servir cervezas en ese momento. 
Si pulsamos arriba o abajo volvemos al comportamiento normal de movimiento.
*/
var Propina = function(mix, miy){

  this.setup('propina', {x:mix, y:miy});

  this.step = function(dt){}

}//Propina

Propina.prototype = new Sprite();
Propina.prototype.type = OBJECT_PROPINA;

//---------------------------------------------------------------------------------------------------------------------------------

/*
Con esta clase tenemos una forma de crear distintos comportamientos
para cada barra: una a una le indicamos la lógica de como tiene que crear los clientes.
Se puede configurar para que se generen un número concreto de clientes
de un determinado tipo, a una frecuencia de creación fija
y con un determinado retardo con respecto a la creación del primer cliente
(para que no salgan clientes en todas las barras a la vez).
*/
var Spawner = function(numBarra, numClientes, frecuenciaCreacion, retardo){
  this.primero=false;//para ver cuando se crea el primer cliente
  this.tiempo = 0; //empezamos en tiempo 0
  this.retardo = retardo;
  this.frecuenciaCreacion = frecuenciaCreacion;
  this.numClientes = numClientes;
  /*Para debugueo
    console.log("La barra " + numBarra + " tiene de clientes " + this.numClientes);
  */
  var spriteClienteAleatorio = spritesClientes[numeroAleatorio(0, spritesClientes.length-1)];
  var velocidadAleatoria = numeroAleatorio(niveles[nivelSeleccionado].minVelocidadCliente, niveles[nivelSeleccionado].maxVelocidadCliente)
  GameManager.sumarClientes(this.numClientes);

  this.step = function(dt){
    if(this.primero){
      this.tiempo = this.tiempo + dt;
      if(this.numClientes > 0 && this.tiempo >= this.frecuenciaCreacion){
        this.tiempo = 0;
        //console.log("Crea otro cliente de la barra " + numBarra);
        this.board.add(new Client(coordenadasInicioBarras[numBarra].x, coordenadasInicioBarras[numBarra].y, velocidadAleatoria, spriteClienteAleatorio));
        this.numClientes--;
      }
    }
    else { //aqui entra la primera vez
      
      if(this.tiempo > this.retardo && this.numClientes > 0){
        this.primero = true;
        this.tiempo = 0;
        //console.log("Crea primer cliente de la barra " + numBarra);
        this.board.add(new Client(coordenadasInicioBarras[numBarra].x, coordenadasInicioBarras[numBarra].y, velocidadAleatoria, spriteClienteAleatorio));
        this.numClientes--;
      }
      else
        this.tiempo = this.tiempo + dt;
    }
  }//step de Spawner

  this.draw = function(){}
}//Spawner


//--------------------------------------------------------------------------------------------------------------------------

var GameManager = new function(){ 
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
  
  */

  this.numTotalClientes; //Cada spawner al comenzar el juego ira sumando cantidad a esta variable
  this.numJarrasGeneradas = 0; //esto va aumentando cuando avisan a GameManager
  this.numClientesServidos = 0; //igual
  this.vidasDisponibles;// = niveles[nivelSeleccionado].vidas; al ser GameManager un singleton no consigue pillar el valor de esto... se lo doy tras invocar a la funcion configuraVidas()
  this.puntuacionActual = 0;
  this.puntuacionMaxima = 0;

  this.compruebaEstado = function(){
    
    if(this.puntuacionActual >= this.puntuacionMaxima){
      this.puntuacionMaxima = this.puntuacionActual;
    }
   
    if(this.vidasDisponibles == 0){
      acabaPartida("¡Has perdido!", "game_over");
    }

    //si no quedan clientes pendientes de servir y no quedan jarras vacias por recoger, ganamos
    if(this.numClientesServidos == this.numTotalClientes && this.numJarrasGeneradas === 0) {
      acabaPartida("¡Has ganado!", "comienzo");
    }

  }//compruebaEstado

  this.sumarClientes = function(clientes){
    this.numTotalClientes += clientes;
  }

  this.servir = function(){
    this.numClientesServidos++;
  }

  this.clientePerdido = function(){
    this.numClientesServidos++;
    this.vidasDisponibles--;
    reproduceSonido('pierde_vida');
  }

  this.jarraPerdida = function(){
    this.numJarrasGeneradas--;
    this.vidasDisponibles--;
    reproduceSonido('pierde_vida');
  }

};//GameManager

//---------------------------------------------------------------------------------------------------------------------------------

window.addEventListener("load", function() {
  //Por aquí pasa solo una vez al arrancar el juego.
  Game.initialize("game",sprites,startGame);
});
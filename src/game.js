/**
 * DVI Practica 2 - GII - UCM Curso 2017/2018
 * Alumnos:
 * Cesar Godino Rodriguez
 * Carmen Lopez Gonzalo 
 */

const sprites = {
 fondoPrincipal: {sx: 0, sy: 480, w: 512, h: 480,frames: 1},
 paredIzquierda: {sx: 0, sy: 0, w: 132, h: 480, frames: 1},
 camarero: { sx: 510, sy: 0, w: 55, h: 64, frames: 1 },
 cliente: { sx: 510, sy: 66, w: 32, h: 32, frames: 1 },
 cliente2: { sx: 512, sy: 164, w: 32, h: 32, frames: 1 },
 cliente3: { sx: 512, sy: 197, w: 32, h: 32, frames: 1 },
 cliente4: { sx: 512, sy: 230, w: 32, h: 32, frames: 1 },
 deadzone: { sx: 512, sy: 235, w: 5, h: 70, frames: 1 }, 
 //deadzone coge un trozo de imagen sin nada dibujado, es un sprite "invisible".
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
};//Los sprites que usamos.

const spritesClientes = ["cliente", "cliente2", "cliente3", "cliente4"];

const posicionesDeadzoneIzq = [{x:90, y:50}, {x:60, y:160}, {x: 30, y: 250}, {x: -2, y: 350}];
const posicionesDeadzoneDer = [{x:335, y:60}, {x:365, y:160}, {x: 395, y: 260}, {x: 430, y: 350}];
const coordenadasInicioBarras = [{x:100, y:90}, {x:80, y:190}, {x: 60, y: 290}, {x: 30, y: 380}];
const coordenadasPuntuacion= [{x: 480, y: 10}, {x: 460, y: 10}, {x: 440, y: 10}, {x:420, y:10}, {x:400, y:10}, {x:380, y:10}];
var coordenadasCorazon= [{x:10, y:10}];
//Como mínimo tiene que haber siempre una vida y, como máximo, las que quepan en pantalla en cuanto a dimensiones de cada corazón.

const OBJECT_PLAYER = 1,
      OBJECT_DRINK = 2,
      OBJECT_DEADZONE = 4,
      OBJECT_CLIENT = 8,
      OBJECT_PROPINA = 16;

var nivelSeleccionado = "nivel1";
//En caso de no asignarse bien, al menos cargará los datos del nivel 1 por defecto.

const audio_principal = new Audio('sounds/musica_fondo.mp3'); 
audio_principal.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

//---------------------------------------------------------------------------------------------------------------------------------

/**
 * Se llama a startGame desde SpriteSheet.load(...) cuando tiene listo el "canvas" vacío.
 * Este método reproduce un sonido de bienvenida 
 * y deja preparada la primera TitleScreen para iniciar una partida.
 */
var startGame = function() {
    
  reproduceSonido('comienzo');
  Game.setBoard(3,new TitleScreen("Mini Tapper",
                                  "Pulsa 1, 2 ó 3 para elegir un nivel",
                                  playGame));
};//startGame

/**
 * Función que devuelve un numero entero aleatorio dentro del intervalo dado [min, max].
 * @param {number} min Número entero más pequeño que marca el comienzo del intervalo.
 * @param {number} max Número entero más grande que marca el final del intervalo.
 * @return {number} El número entero aleatorio generado.
 */
var numeroAleatorio = function(min, max){
  return Math.floor(Math.random() * (max-min+1)) + min;
}//numeroAleatorio

/**
 * Método que añade a la capa board las deadzones, en coordenadas concretas,
 * para la colisión de ciertos sprites.
 * @param {GameBoard} board La capa del tablero de juego que tendrá las deadzones.
 */
var generaDeadzones = function(board){

  for(var i = 0; i < posicionesDeadzoneIzq.length; i++){
    board.add(new DeadZone(posicionesDeadzoneIzq[i].x, posicionesDeadzoneIzq[i].y));
  }

  for(var i = 0; i < posicionesDeadzoneDer.length; i++){
    board.add(new DeadZone(posicionesDeadzoneDer[i].x, posicionesDeadzoneDer[i].y));
  }

}//generaDeadzones

/**
 * Método que crea un objeto de la clase Audio y reproduce su sonido.
 * @param {string} nombreSonido Nombre del fichero de sonido que se quiere reproducir.
 */
var reproduceSonido = function(nombreSonido){
  var audio = new Audio('sounds/' + nombreSonido + '.mp3');
  audio.play();
}//reproduceSonido

/**
 * Método que comienza o detiene la reproducción del audio principal del juego.
 * @param {boolean} play Booleano que a true comienza a reproducir el audio. A false, lo detiene.
 */
var reproduceAudioPrincipal = function(play){
  if(play){
    audio_principal.play();
  }else{
    audio_principal.pause();
    audio_principal.currentTime = 0;
  }
}//reproduceAudioPrincipal

/**
 * Método que deja configurada la variable global coordenadasCorazon 
 * según el número de vidas del nivel que se haya elegido.
*/
var configuraVidas = function(){
  for(i = 1; i < niveles[nivelSeleccionado].vidas; ++i){ //i=1 porque siempre habra 1 vida como minimo
    coordenadasCorazon[i] = {x: coordenadasCorazon[i-1].x+30, y: 10};
  }
}//configuraVidas

/**
 * Método que configura el spawner de cada barra y lo agrega a su capa correspondiente.
 * @param {GameBoard} board La capa del tablero de juego a la que se agregarán los spawners.
 */
var configuraSpawners = function(board){
  var retardo;
  var numClientes;
  var frecuenciaCreacion;
  
  for(i = 0; i < coordenadasInicioBarras.length; ++i){
    retardo = ((Math.random() * niveles[nivelSeleccionado].maxRetardo)+niveles[nivelSeleccionado].minRetardo);//para generar un retardo (entre un minimo y maximo dado) con decimales
    numClientes = numeroAleatorio(niveles[nivelSeleccionado].minClientesBarra,niveles[nivelSeleccionado].maxClientesBarra);//para generar un numero de clientes (entre un minimo y maximo dado)
    frecuenciaCreacion = (Math.random() * niveles[nivelSeleccionado].maxFrecuenciaCreacion) + niveles[nivelSeleccionado].minFrecuenciaCreacion;
    
    board.add(new Spawner(i,numClientes,frecuenciaCreacion,retardo));
  }
}//configuraSpawners

/**
 * Método que prepara el juego tanto en la primera partida como en los posteriores intentos.
 * Prepara e inicializa valores (algunos dados por los datos del nivel elegido),
 * así como tambien comienza a reproducir el sonido principal de la partida
 * y deja cada una de las capas del juego configuradas y añadidas al tablero.
 */
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
  board.add(new EscenarioFondo('fondoPrincipal'));
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
  board2.add(new EscenarioFondo('paredIzquierda'));
  board2.add(new Salud());
  board2.add(new Puntuacion());
  Game.setBoard(2,board2);

};//playGame

/**
 * Método que vuelve a poner un valor inicial a las variables
 * que controla GameManager por cada vez que se decide volver a intentar jugar un nivel.
 */
var reiniciarDatos = function(){
  GameManager.numTotalClientes = -1;
  GameManager.numJarrasGeneradas = 0;
  GameManager.numClientesServidos = 0;
  GameManager.vidasDisponibles = niveles[nivelSeleccionado].vidas;
}//reiniciarDatos

/**
 * Método que prepara el fin del juego al detener su actividad, reiniciar ciertos valores
 * en caso de volver a intentar una partida y mostrar la pantalla de victoria o derrota.
 * @param {string} mensaje Cadena de texto con el mensaje de victoria o de derrota para la pantalla.
 * @param {string} nombreSonido Nombre del fichero con el sonido que se quiere reproducir al ganar o perder la partida.
 */
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
};//acabaPartida

//---------------------------------------------------------------------------------------------------------------------------------

/**
 * Constructora del sprite del escenario de fondo, el principal para el canvas del juego. 
 * @param {string} nombreSprite Nombre del sprite que puede ser el escenario de fondo
 * o la pared de la izquierda.
 */
var EscenarioFondo = function(nombreSprite){
  this.setup(nombreSprite, {x:0, y:0});
  this.step = function(dt) { };
}//EscenarioFondo

EscenarioFondo.prototype = new Sprite();

//---------------------------------------------------------------------------------------------------------------------------------

/**
 * Constructora del sprite de la bebida, 
 * que deja inicializados los atributos que definen su comportamiento e implementa su método step. 
 * @param {number} x Coordenada del eje x como número entero donde empieza a pintarse el sprite en nuestro tablero.
 * @param {number} y Coordenada del eje y como número entero donde empieza a pintarse el sprite en nuestro tablero.
 * @param {number} vx Velocidad sobre el eje x (pixeles/segundo) a la que se desplazará el sprite.
 * @param {boolean} estado True indica que la bebida se crea llena, a false hace que se cree vacía.
 */
var Beer = function(x, y, vx, estado){

  this.x = x;
  this.y = y;
  this.llena = estado;

  if(this.llena){
    this.setup('bebidaLlena');
    this.vx = vx*-1;
  }else{
    this.setup('bebidaVacia');
    this.vx = vx;
  }

  /** 
   * Método que hace que una bebida se "mueva" (vaya actualizando su posición) sobre el eje x. 
   * Detectará si colisiona con un sprite de tipo deadzone, avisará a GameManager
   * para que actualice los datos correspondientes del juego y borrará el sprite del tablero.
   * @param {number} dt Delta de T, numero decimal representa la variación del tiempo 
   * (cada cuántos segundos se produce el refresco y pintado de los elementos del canvas).
   */
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

/**
 * Constructora del sprite del jugador (el camarero), 
 * que deja inicializados los atributos que establecen sus posibles posiciones, su comportamiento
 * e implementa su método step. 
 */
var Player = function(){

  this.posiciones = [{x:325, y:90},
                    {x:357, y:185},
                    {x:389, y:281},
                    {x:421, y:377}];

  this.posicionesIzq = [{x:100, y:90},
                    {x:90, y:185},
                    {x:80, y:281},
                    {x:70, y:377}];

  this.x = this.posiciones[0].x;
  this.y = this.posiciones[0].y;
  this.barraActual = 0;
  this.listoParaServir = true;

  this.setup('camarero');

  /**
   * Método que controla el movimiento y comportamiento del jugador (camarero).
   * Permite cambiar (verticalmente) entre las barras disponibles de forma cíclica, 
   * también desplazarse horizontalmente por cada una de ellas.  
   * Le permite generar bebidas exactamente al final de cada barra
   * y detecta cuándo puede recoger también al final de cada barra una bebida vacía
   * o bien una propina al otro extremo.
   * @param {number} dt Delta de T, numero decimal representa la variación del tiempo 
   * (cada cuántos segundos se produce el refresco y pintado de los elementos del canvas).
   */
  this.step = function(dt) { 

    var seHaMovido = false;

    if(Game.keys['up']) { 

      seHaMovido = true;
 
      if(this.barraActual == 0){ 
        //si está en la barra de arriba del todo

        this.x = this.posiciones[this.posiciones.length-1].x;
        this.y = this.posiciones[this.posiciones.length-1].y;
        this.barraActual = this.posiciones.length-1;
        
      }else{
        
        this.x = this.posiciones[this.barraActual-1].x;
        this.y = this.posiciones[this.barraActual-1].y;
        this.barraActual = this.barraActual-1;
      }

      this.listoParaServir = true;

      Game.keys['up'] = false;
       
    }
    else if(Game.keys['down']) { 

      seHaMovido = true;

      if(this.barraActual == this.posiciones.length-1){ 
        //si está en la barra de abajo del todo

        this.x = this.posiciones[0].x;
        this.y = this.posiciones[0].y;
        this.barraActual = 0;
      }else{
        
        this.x = this.posiciones[this.barraActual+1].x;
        this.y = this.posiciones[this.barraActual+1].y;
        this.barraActual++;
      }

      this.listoParaServir = true;

      Game.keys['down'] = false;
    }else if(Game.keys['left']) { 

      if(this.listoParaServir){
        this.listoParaServir = false;
      }

      if( (this.barraActual == 0 && this.x > 100) ||
          (this.barraActual == 1 && this.x > 70) ||
          (this.barraActual == 2 && this.x > 40) ||
          (this.barraActual == 3 && this.x > 8) ){
            this.x += (-niveles[nivelSeleccionado].velocidadLateralCamarero); 
            //dejamos que vaya para la izquierda si, en su respectiva barra, no se ha pasado de cierta coordenada x
      }
     
      Game.keys['left'] = false;
    }else if(Game.keys['right']) { 
      
      if( (this.barraActual == 0 && this.x < this.posiciones[0].x) ||
          (this.barraActual == 1 && this.x < this.posiciones[1].x) ||
          (this.barraActual == 2 && this.x < this.posiciones[2].x) ||
          (this.barraActual == 3 && this.x < this.posiciones[3].x) ){
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
      //el camarero sólo puede recoger bebidas vacías estando bien posicionado

      /*Para debugueo
      console.log("cerveza es colisionada por camarero") //para comprobar que la colision es correcta
      */

      objetoColisionado.hit(); 
      //esto borra la bebida (el sprite que se ha detectado que colisiona con el camarero)

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

/**
 * Constructora del sprite de una deadzone, 
 * que deja inicializados los atributos de posicion
 * y permite representarlos en pantalla en caso de querer realizar comprobaciones. 
 * Hace que clientes, jarras vacías y llenas sean destruidas 
 * al colisionar con ello en un extremo u otro de cada barra.
 * @param {number} x Coordenada del eje x como número entero donde empieza a pintarse la deadzone en nuestro tablero.
 * @param {number} y Coordenada del eje y como número entero donde empieza a pintarse la deadzone en nuestro tablero.
 */
var DeadZone = function(x, y){

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

/**
 * Constructora del sprite del corazon que indica las vidas restantes. 
 * El juego no termina inmediatamente cuando un cliente llega al final de la barra
 * o una bebida (llena o vacía) se cae, sino que el jugador tiene de varias vidas. 
 * Si se agotan, el nivel puede reiniciarse y volverse a jugar.
 */
var Salud = function(){

  /**
   * Método que dibuja en el tablero la cantidad de vidas (en forma de corazones)
   * que le quedan al jugador durante la partida en curso.
   * @param {number} dt Delta de T, numero decimal representa la variación del tiempo 
   * (cada cuántos segundos se produce el refresco y pintado de los elementos del canvas).
   */
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

/**
 * Constructora de los sprites de los numeros que marcan la puntuacion del jugador 
 * durante la partia en curso.
 * El jugador gana ciertos puntos (segun el nivel que esté jugando) 
 * cada vez que sirve a un cliente y tambien gana puntos extra 
 * cuando recoge una bebida vacía o una propina.
 */
var Puntuacion = function(){
   
  /**
   * Método que dibuja en el tablero digito por digito la puntuación
   * que el jugador lleva durante la partida en curso.
   * @param {number} dt Delta de T, numero decimal representa la variación del tiempo 
   * (cada cuántos segundos se produce el refresco y pintado de los elementos del canvas).
   */
  this.draw = function(dt){ 
    var puntuacionAct = GameManager.puntuacionActual.toString();
    
    for(var i = 0; i < puntuacionAct.length;i++){
      var s = SpriteSheet.map[puntuacionAct[i]];
      this.x = coordenadasPuntuacion[puntuacionAct.length - i - 1].x;
      this.y = coordenadasPuntuacion[puntuacionAct.length - i - 1].y;
      Game.ctx.drawImage(SpriteSheet.image, s.sx + 0 * s.w, s.sy, s.w, s.h, this.x, this.y, s.w, s.h);
    }
  }

  this.step = function(dt){ }

}//Puntuacion

//---------------------------------------------------------------------------------------------------------------------------------

/**
 * Constructora del sprite del cliente, 
 * que deja inicializados los atributos que establecen sus posibles posiciones de inicio, velocidad, 
 * su comportamiento e implementa su método step. 
 * @param {number} x Coordenada del eje x como número entero donde empieza a pintarse el sprite en nuestro tablero.
 * @param {number} y Coordenada del eje y como número entero donde empieza a pintarse el sprite en nuestro tablero.
 * @param {number} vx Velocidad sobre el eje x (pixeles/segundo) a la que se desplazará el sprite.
 * @param {string} nombreSprite Indica el sprite específico con el que queremos representar a ese cliente.
 */
var Client = function(x, y, vx, nombreSprite){
  
  this.x = x;
  this.y = y;
  this.vx = vx; 
  this.dejaraPropina = numeroAleatorio(0,1);
  this.bebiendo = false;
  const TIEMPO_PARA_BEBER = niveles[nivelSeleccionado].segundosClienteBebiendo;
  this.horaParaDejarDeBeber = 0;

  this.setup(nombreSprite);

  /**
   * Método que cambia el sentido de la velocidad a la que el cliente se mueve por el eje x, 
   * dependiendo de si ha cogido una bebida o no.
   */
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
  }//cambioDeSentido

  /**
   * Función con la que comprobamos si el cliente ha chocado
   * con alguna deadzone pero de la izquierda.
   * @param {DeadZone} objetoColisionado La deadzone cualquiera con la que ha chocado un cliente.
   * @return {boolean} esIzq true si se trataba de una deadzone de la izquierda, false si era de la derecha.
   */
  this.esDeadzoneIzq = function(objetoColisionado){
    var esIzq = false;

    for(i = 0; i < posicionesDeadzoneIzq.length && !esIzq; i++){
      if(objetoColisionado.x == posicionesDeadzoneIzq[i].x){
        esIzq = true;
      }
    }

    return esIzq;
  }

  /**
   * Método que aporta al cliente la lógica de su movimiento por cualquiera de las barras (velocidad y sentido de su paso).
   * Detecta también si el cliente choca con una bebida o una deadzone, procediendo acorde a las reglas del juego.
   * Cuando un cliente "recibe" una bebida, se mueve hacia atrás 
   * en la barra durante unos segundos (está bebiendo). 
   * Si en ese movimiento sale por la puerta de la izquierda 
   * entonces se considera que el cliente ha sido servido. 
   * Si no llega a salir por la puerta durante el tiempo en que bebe,
   * entonces se detiene y vuelve a moverse hacia la derecha de la barra. 
   * Cuando el cliente está bebiendo no cogerá las cervezas llenas que le lleguen.
   * @param {number} dt Delta de T, numero decimal representa la variación del tiempo 
   * (cada cuántos segundos se produce el refresco y pintado de los elementos del canvas).
   */
  this.step = function(dt){
    //el cliente debe crearse con vx positiva por defecto.

    //compruebo que si esta bebiendo y si ha pasado su tiempo de beber, que vuelva a avanzar
    if(this.bebiendo){
      var horaActual = new Date().getTime();
      if(horaActual >= this.horaParaDejarDeBeber){
        this.cambioDeSentido();
      }
    }

    this.x += this.vx * dt;

    var objetoColisionado = this.board.collide(this,6); 
    //el 6 es resultado de hacer OR entre 4 y 2, o sea, deadzone y bebida:  100 or 010 = 110

    if(objetoColisionado) {

      if(objetoColisionado instanceof Beer){ //si choca contra un sprite de bebida

        if(!this.bebiendo){ //solo si no está bebiendo es cuando puede reaccionar con una bebida llena
          this.cambioDeSentido();
          objetoColisionado.hit(); 
          //esto borra la bebida (lo que ha detectado que colisiona con el cliente)
          //GameManager.numJarrasGeneradas--; //esto cuenta solo cuando lo recoge el camarero
          this.board.add(new Beer(objetoColisionado.x, objetoColisionado.y, -this.vx, false));
        }
        //y si está "bebiendo" y se choca con una cerveza, no pasa nada y la cerveza sigue por la barra

        //this.board.remove(this); //y esto borraría al cliente cuando colisiona con cerveza, pero ya no queremos que la cerveza borre al cliente
        
      }else if(objetoColisionado instanceof DeadZone){ //si choca contra un sprite de deadzone
        /*Para debugueo
          console.log("cliente choca contra deadzone");
          collision.hit(this.damage); //esto borraria la deadzone (lo que ha detectado que colisiona con el cliente)
        */
        
        this.board.remove(this); //esto borra al cliente

        /*
          Controlamos que se actualicen los datos del juego, 
          que si tiene propina que la deje y que se borre del tablero (cliente servido).
        */
        if(this.esDeadzoneIzq(objetoColisionado)){ //el cliente desaparece y queda servido del todo
          GameManager.servir();
          GameManager.puntuacionActual += niveles[nivelSeleccionado].puntuacionClienteServido;
          reproduceSonido('cliente_servido');
          if(this.dejaraPropina==1){
            this.board.add(new Propina(this.x+40, objetoColisionado.y+50));
            reproduceSonido('aparece_propina');
          }
        }//if esDeadzoneIzq()
        else{ //Si choca con una deadzone de la derecha, hemos perdido al cliente.
          GameManager.clientePerdido();
        }

      }//colision con alguna deadzone

    }//if cliente ha colisionado con algo

  }//step de Client

}//Client

Client.prototype = new Sprite();
Client.prototype.type = OBJECT_CLIENT;

//---------------------------------------------------------------------------------------------------------------------------------

/**
 * Constructora del sprite de una propina, 
 * que deja inicializados sus atributos de posicion
 * Clientes pueden dejar propina al final de la barra, de forma aleatoria, al ser servidos. 
 * Esto implica que el camarero ha de ir a recoger la propina para ganar 
 * los puntos extras que proporciona. 
 * @param {number} x Coordenada del eje x como número entero donde empieza a pintarse la propina en nuestro tablero.
 * @param {number} y Coordenada del eje y como número entero donde empieza a pintarse la propina en nuestro tablero.
 */
var Propina = function(x, y){

  this.setup('propina', {x: x, y: y});
  this.step = function(dt){}

}//Propina

Propina.prototype = new Sprite();
Propina.prototype.type = OBJECT_PROPINA;

//---------------------------------------------------------------------------------------------------------------------------------

/**
 * Constructora de spawner, que inicializa sus atributos e implementa su método step.
 * Con esta clase, tenemos una forma de crear distintos comportamientos
 * para cada barra: una a una le indicamos la lógica de como tiene que crear los clientes.
 * Se puede configurar para que se generen un número concreto de clientes
 * de un determinado tipo, a una frecuencia de creación fija
 * y con un determinado retardo con respecto a la creación del primer cliente
 * (para que no salgan clientes en todas las barras a la vez).
 * @param {number} numBarra Un numero entero comprendido en el intervalo [0, coordenadasInicioBarras.length-1] 
 * para indicar a qué barra se le asigna el spawner a configurar.
 * @param {number} numClientes Un numero entero a partir de 0 para indicar la cantidad de clientes que creará el spawner.
 * @param {number} frecuenciaCreacion Un numero entero mayor que 0 para indicar la rapidez con la que se generará cada cliente.
 * @param {number} retardo Un numero entero mayor que 0 para indicar cuánto tiempo pasa desde el comienzo de la partida hasta que comienza el spawner.
 */
var Spawner = function(numBarra, numClientes, frecuenciaCreacion, retardo){
  this.primero = false; //para ver cuándo se crea el primer cliente
  this.tiempo = 0;
  this.retardo = retardo;
  this.frecuenciaCreacion = frecuenciaCreacion;
  this.numClientes = numClientes;
  /*Para debugueo
    console.log("La barra " + numBarra + " tiene de clientes " + this.numClientes);
  */
  var spriteClienteAleatorio = spritesClientes[numeroAleatorio(0, spritesClientes.length-1)];
  var velocidadAleatoria = numeroAleatorio(niveles[nivelSeleccionado].minVelocidadCliente, niveles[nivelSeleccionado].maxVelocidadCliente)
  GameManager.sumarClientes(this.numClientes);

  /**
   * Método con el que cada spawner genera su primer cliente y luego los demas
   * siguiendo la logica del tiempo impuesta por los atributos de dicho spawner.
   * @param {number} dt Delta de T, numero decimal representa la variación del tiempo 
   * (cada cuántos segundos se produce el refresco y pintado de los elementos del canvas).
   */
  this.step = function(dt){
    if(this.primero){
      this.tiempo = this.tiempo + dt;
      if(this.numClientes > 0 && this.tiempo >= this.frecuenciaCreacion){
        this.tiempo = 0;
        this.board.add(new Client(coordenadasInicioBarras[numBarra].x, coordenadasInicioBarras[numBarra].y, velocidadAleatoria, spriteClienteAleatorio));
        this.numClientes--;
      }
    }
    else { //aqui entra la primera vez
      
      if(this.tiempo > this.retardo && this.numClientes > 0){
        this.primero = true;
        this.tiempo = 0;
        this.board.add(new Client(coordenadasInicioBarras[numBarra].x, coordenadasInicioBarras[numBarra].y, velocidadAleatoria, spriteClienteAleatorio));
        this.numClientes--;
      }
      else
        this.tiempo = this.tiempo + dt;
    }//primer cliente spawner

  }//step de Spawner

  this.draw = function(){}

}//Spawner


//--------------------------------------------------------------------------------------------------------------------------

/**
 * Constructora del singleton GameManager, 
 * que inicializa alguno de sus atributos e implementa sus métodos.
 * Centraliza toda la información del juego y, por tanto, 
 * controla y decide cuándo se termina (porque se ha ganado o se ha perdido).
 * Cada spawner, al comenzar el juego, irá sumando o restando cantidades a sus atributos.
 */
var GameManager = new function(){ 

  this.numTotalClientes;
  this.vidasDisponibles;
  this.numJarrasGeneradas = 0;
  this.numClientesServidos = 0;
  this.puntuacionActual = 0;
  this.puntuacionMaxima = 0;

  /**
   * Método que se encargará de comprobar el estado en el que se encuentra el juego 
   * y de decidir si hemos ganado o perdido.
   */
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

  /**
   * Método que actualiza el total de clientes que habrá durante la partida
   * a medida que se van creando los spawners de cada barra.
   * @param {number} clientes Numero de clientes de un spawner que se le suma al total de la partida.
   */
  this.sumarClientes = function(clientes){
    this.numTotalClientes += clientes;
  }

  /**
   * Método que aumenta en uno el número de clientes servidos.
   */
  this.servir = function(){
    this.numClientesServidos++;
  }

  /**
   * Método que reduce en uno el número de vidas que le quedan al jugador.
   */
  this.restaVida = function(){
    this.vidasDisponibles--;
    reproduceSonido('pierde_vida');
  }

  /**
   * Método que, cuando se pierde un cliente porque no se le ha atendido,
   * aumenta en uno el número de clientes servidos para mantener una coherencia con los datos
   * de la partida. Así, permite al jugador seguir la partida pero a cambio de perder una vida.
   */
  this.clientePerdido = function(){
    this.numClientesServidos++;
    this.restaVida();
  }

  /**
   * Método que, cuando se ha desperdiciado una bebida, 
   * reduce en uno el número de bebidas que ha generado el jugador para mantener una coherencia con los datos
   * de la partida. Así, permite al jugador seguir la partida pero a cambio de perder una vida.
   */
  this.jarraPerdida = function(){
    this.numJarrasGeneradas--;
    this.restaVida();
  }

};//GameManager

//---------------------------------------------------------------------------------------------------------------------------------

/**
 * Estas son las primeras líneas de código JavaScript que ejecuta nuestra práctica.
 * Por aquí se pasa sólo una vez al arrancar el juego.
 * Al cargarse la ventana del explorador se llama a a función initialize(...) de Game.
 */
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
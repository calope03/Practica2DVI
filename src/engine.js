/**
 * DVI Practica 2 - GII - UCM Curso 2017/2018
 * Alumnos:
 * Cesar Godino Rodriguez
 * Carmen Lopez Gonzalo 
 */

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

//---------------------------------------------------------------------------------------------------------------------------------
  
var Metrics = new function(){

  this.startTime = 0; //desde cuando empezamos a contar
  this.frameNumber = 0; //los frames que llevamos
  this.last = 0;
  this.elapsed = 0;

  this.drawFPS = function(ctx, looptime){
    ++this.frameNumber;
    var d = new Date().getTime(); //cogemos hora actual
    //veremos cuanto ha pasado desde la ultima vez que lo llamamos
    currentTime = (d-this.startTime)/1000;
    result = Math.floor(this.frameNumber/currentTime); //floor redondea
    if(currentTime >1){ //si se ha pasado de 1 segundo
      this.startTime = new Date().getTime();
      this.frameNumber = 0;
    }

    this.elapsed = this.elapsed*0.9 + 0.1*(d - this.last - looptime);
    this.last = d;

    Game.ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.font = "15px monospace";
    ctx.fillText("fps: " + result, 0, 460);
    ctx.fillText("compTime: " + this.elapsed.toFixed(2), 0, 475);
    //usando toFixed hay casos donde puede no redondear
    //de forma muy precisa como con 1,5550, que da 1,55 en vez de 1,56
  }
}//Metrics

//---------------------------------------------------------------------------------------------------------------------------------


var Game = new function() {                                                                 
  var boards = [];

  // Game Initialization
  this.initialize = function(canvasElementId,sprite_data,callback) {
    this.canvas = document.getElementById(canvasElementId);

    this.playerOffset = 10;
    this.canvasMultiplier= 1;
    this.setupMobile();

    this.width = this.canvas.width;
    this.height= this.canvas.height;

    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if(!this.ctx) { return alert("Please upgrade your browser to play"); }

    this.setupInput();

    this.loop(); 

    if(this.mobile) {
      this.setBoard(4,new TouchControls());
    }

    SpriteSheet.load(sprite_data,callback);
  };//initialize
  

  // Handle Input
  var KEY_CODES = { 38:'up', 40:'down', 32 :'space', 37:'left', 39:'right', 49:'1', 50:'2', 51:'3'};
  this.keys = {};

  this.setupInput = function() {
    window.addEventListener('keydown',function(e) {
      if(KEY_CODES[e.keyCode]) {
       Game.keys[KEY_CODES[e.keyCode]] = true;
       e.preventDefault();
      }
    },false);

    window.addEventListener('keyup',function(e) {
      if(KEY_CODES[e.keyCode]) {
       Game.keys[KEY_CODES[e.keyCode]] = false; 
       e.preventDefault();
      }
    },false);
  };//setupInput


  var lastTime = new Date().getTime();
  var maxTime = 1/30;

  // Game Loop, el corazón del juego
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
  };//loop
  
  // Change an active game board
  this.setBoard = function(num,board) { boards[num] = board; boards[num].activada = true; };

  this.desactivarBoard = function(num){boards[num].activada = false;}

  this.setupMobile = function() {
    var container = document.getElementById("container"),
        hasTouch =  !!('ontouchstart' in window),
        w = window.innerWidth, h = window.innerHeight;
      
    if(hasTouch) { this.mobile = true; }

    if(screen.width >= 1280 || !hasTouch) { return false; }

    if(w > h) {
      alert("Please rotate the device and then click OK");
      w = window.innerWidth; h = window.innerHeight;
    }

    container.style.height = h*2 + "px";
    window.scrollTo(0,1);

    h = window.innerHeight + 2;
    container.style.height = h + "px";
    container.style.width = w + "px";
    container.style.padding = 0;

    if(h >= this.canvas.height * 1.75 || w >= this.canvas.height * 1.75) {
      this.canvasMultiplier = 2;
      this.canvas.width = w / 2;
      this.canvas.height = h / 2;
      this.canvas.style.width = w + "px";
      this.canvas.style.height = h + "px";
    } else {
      this.canvas.width = w;
      this.canvas.height = h;
    }

    this.canvas.style.position='absolute';
    this.canvas.style.left="0px";
    this.canvas.style.top="0px";

  };//setupMobile

};//Game

//---------------------------------------------------------------------------------------------------------------------------------

/**
 * Constructora de SpriteSheet. 
 * Básicamente se encarga de cargar, con load, el archivo fuente de todos los sprites que usaremos
 * y, con draw, los dibuja a partir de las coordenadas indicadas en dicha fuente.
 * @return {SpriteSheet} el objeto creado por la constructora.
 */
var SpriteSheet = new function() {
  this.map = { }; 

  this.load = function(spriteData,callback) { 
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'img/spritesTapperAlternativos3.png';
  };

  this.draw = function(ctx,sprite,x,y,frame) {
    var s = this.map[sprite];
    if(!frame) frame = 0;
    ctx.drawImage(this.image,
                     s.sx + frame * s.w, 
                     s.sy, 
                     s.w, s.h, 
                     Math.floor(x), Math.floor(y),
                     s.w, s.h);
  };//draw

  return this;

};//SpriteSheet

//---------------------------------------------------------------------------------------------------------------------------------
/**
 * Desde startGame se crea así la pantalla de títulos inicial con el título del juego 
 * y nos indica con qué teclas se puede empezar. 
 * Al acabar, llama a callback que es playGame actualmente. 
 */
var TitleScreen = function TitleScreen(title,subtitle,callback) {
  var up = false;

  this.step = function(dt) {
    
    if(!Game.keys['1'] || !Game.keys['2'] || !Game.keys['3']) up = true;

    /*Para debugueo
    if(Game.keys['1']) console.log("pulsado 1 en titlescreen");
    else if(Game.keys['2']) console.log("pulsado 2 en titlescreen");
    else if(Game.keys['3']) console.log("pulsado 3 en titlescreen");
    */
    
    if(up && (Game.keys['1'] || Game.keys['2'] || Game.keys['3']) && callback){
      callback();
    }
  };//step de TitleScreen

  this.draw = function(ctx) {

    // Background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, Game.width, Game.height);

    // Foreground
    ctx.fillStyle = "#FFFFFF";

    ctx.font = "70px 'Rye'";
    var measure = ctx.measureText(title);  
    ctx.fillText(title,Game.width/2 - measure.width/2,Game.height/2);

    ctx.font = "20px 'Rye'";
    var measure2 = ctx.measureText(subtitle);
    ctx.fillText(subtitle,Game.width/2 - measure2.width/2,Game.height/2 + 50);
  };//draw de TitleScreen

};//TitleScreen

//---------------------------------------------------------------------------------------------------------------------------------
/**
 * Con esta pantalla de títulos se muestra el final del juego
 * cuando hemos perdido o ganado la partida.
 * Desde esta pantalla se puede volver a comenzar una nueva partida. 
 * Antes de crear esta pantalla ya tenemos todas las capas (GameBoard) creadas 
 * y las podamos activar y desactivar cuando es necesario (con GameManager, desde compruebaEstado())
 * De ese modo, no ejecutarań ni su método step ni su método draw.
 */
var MiTitleScreen = function MiTitleScreen(title,subtitle,callback) {
  var up = false;

  this.step = function(dt) {
    if(!Game.keys['space']) up = true;

    /*Para debugueo
    if(Game.keys['space']) console.log("pulsado espacio en titlescreen")
    */
    
    if(up && Game.keys['space'] && callback){ 
      callback();
    } 
  };//step

  this.draw = function(ctx) {
  
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, Game.width, Game.height);

    // Foreground
    ctx.fillStyle = "#FFFFFF";

    ctx.font = "68px 'Rye'";
    var measure = ctx.measureText(title);  
    ctx.fillText(title,Game.width/2 - measure.width/2,Game.height/2);

    ctx.font = "20px 'Rye'";
    var measure2 = ctx.measureText(subtitle);
    ctx.fillText(subtitle,Game.width/2 - measure2.width/2,Game.height/2 + 50);

    var puntuacionMax = GameManager.puntuacionMaxima.toString();
    var tupuntuacion  = "Tu puntuación máxima es: " + puntuacionMax;
    ctx.font = "20px 'Rye'";
    var measure3 = ctx.measureText(tupuntuacion);
    ctx.fillText(tupuntuacion,Game.width/2 - measure3.width/2,Game.height/2 + 100);
  };//draw

};//MiTitleScreen

//---------------------------------------------------------------------------------------------------------------------------------


var Temporizador = function Temporizador(tiempoAEsperar,callback) {
  var currTime = new Date().getTime();
  var tiempoEspera = currTime+tiempoAEsperar;

  this.step = function(dt) {
    if(currTime >= tiempoEspera){
      callback();
    }else{
      currTime = new Date().getTime();
    }
  }; //step de Temporizador

  this.draw = function(ctx) {};

};//Temporizador

//---------------------------------------------------------------------------------------------------------------------------------


var GameBoard = function() {
  var board = this;
  this.activada = true;

  // The current list of objects
  this.objects = [];
  this.cnt = {};

  // Add a new object to the object list
  this.add = function(obj) { 
    obj.board=this; //Así cada sprite tiene a board como atributo
    this.objects.push(obj); 
    this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
    return obj; 
  };

  // Mark an object for removal
  this.remove = function(obj) { 
    var idx = this.removed.indexOf(obj);
    if(idx == -1) {
      this.removed.push(obj); 
      return true;
    } else {
      return false;
    }
  };//remove

  // Reset the list of removed objects
  this.resetRemoved = function() { this.removed = []; };

  // Removed an objects marked for removal from the list
  this.finalizeRemoved = function() {
    for(var i=0,len=this.removed.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed[i]);
      if(idx != -1) {
        this.cnt[this.removed[i].type]--;
        this.objects.splice(idx,1);
      }
    }
  };

  // Call the same method on all current objects 
  this.iterate = function(funcName) {
     var args = Array.prototype.slice.call(arguments,1);
     for(var i=0,len=this.objects.length;i<len;i++) {
       var obj = this.objects[i];
       obj[funcName].apply(obj,args);
     }
  };

  // Find the first object for which func is true
  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  // Call step on all objects and them delete
  // any object that have been marked for removal
  this.step = function(dt) { 
    if(this.activada){
      this.resetRemoved();
      this.iterate('step',dt);
      this.finalizeRemoved();
    }
  };//step

  // Draw all the objects
  this.draw= function(ctx) {
    if(this.activada) this.iterate('draw',ctx);
  };

  // Check for a collision between the 
  // bounding rects of two objects
  this.overlap = function(o1,o2) {
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  // Find the first object that collides with obj
  // match against an optional type
  this.collide = function(obj,type) {
    return this.detect(function() {
      if(obj != this) {
       var col = (!type || this.type & type) && board.overlap(obj,this);
       return col ? this : false;
      }
    });
  };//collide


};//GameBoard

//---------------------------------------------------------------------------------------------------------------------------------

var Sprite = function() { };

Sprite.prototype.setup = function(sprite,props) {
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map[sprite].w;
  this.h =  SpriteSheet.map[sprite].h;
};

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
};

Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
};

Sprite.prototype.hit = function() {
  this.board.remove(this);
};

//Sprite

//---------------------------------------------------------------------------------------------------------------------------------
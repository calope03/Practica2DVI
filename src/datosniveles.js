/*
DVI Practica 2 - GII - UCM Curso 2017/2018
Alumnos:
Cesar Godino Rodriguez
Carmen Lopez Gonzalo 
*/

/*
Definimos aqui distintos niveles con distintos patrones de comportamiento 
para los generadores de clientes. 
*/

const niveles = {

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
    segundosClienteBebiendo: 3000, //en milisegundos, asi que equivale a 3 segundos
    velocidadLateralCamarero: 10,
    puntuacionBebidaVacia: 50,
    puntuacionPropina: 1500,
    puntuacionClienteServido: 50,
    velocidadCrearBebida: 250
  },
  nivel2 : {
  	minVelocidadCliente: 30,
  	maxVelocidadCliente: 60,
  	minClientesBarra: 2,
  	maxClientesBarra: 4,
  	minRetardo: 1,
  	maxRetardo: 3,
  	minFrecuenciaCreacion: 3,
  	maxFrecuenciaCreacion: 7.5,
    vidas: 3,
    segundosClienteBebiendo: 2000,
    velocidadLateralCamarero: 20,
    puntuacionBebidaVacia: 100,
    puntuacionPropina: 2000,
    puntuacionClienteServido: 200,
    velocidadCrearBebida: 150
  },
  nivel3 : {
  	minVelocidadCliente: 45,
  	maxVelocidadCliente: 80,
  	minClientesBarra: 4,
  	maxClientesBarra: 6,
  	minRetardo: 1,
  	maxRetardo: 1.5,
  	minFrecuenciaCreacion: 5,
  	maxFrecuenciaCreacion: 10,
    vidas: 5,
    segundosClienteBebiendo: 1000,
    velocidadLateralCamarero: 35,
    puntuacionBebidaVacia: 300,
    puntuacionPropina: 3000,
    puntuacionClienteServido: 500,
    velocidadCrearBebida: 100
  }

};
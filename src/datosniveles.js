/*
Definimos aqui distintos niveles con distintos patrones de comportamiento 
para los generadores de clientes. 
*/

/*
ideas: velocidad a la que puede ir hacia la izq el camarero, 
	   el numero de vidas,
	   velocidad de vuelta para la bebida vacia
	   cantidad de tiempo que retrocede el cliente
	   valor de las propinas
	   puntuacion por cada cliente servido
*/

var niveles = {

  nivel1 : {
  	minVelocidadCliente: 30,
  	maxVelocidadCliente: 45,
  	minClientesBarra: 1,
  	maxClientesBarra: 2,
  	minRetardo: 1,
  	maxRetardo: 5,
  	minFrecuenciaCreacion: 1,
  	maxFrecuenciaCreacion: 5
  },
  nivel2 : {
  	minVelocidadCliente: 30,
  	maxVelocidadCliente: 45,
  	minClientesBarra: 1,
  	maxClientesBarra: 2,
  	minRetardo: 1,
  	maxRetardo: 5,
  	minFrecuenciaCreacion: 1,
  	maxFrecuenciaCreacion: 5
  },
  nivel3 : {
  	minVelocidadCliente: 30,
  	maxVelocidadCliente: 45,
  	minClientesBarra: 1,
  	maxClientesBarra: 2,
  	minRetardo: 1,
  	maxRetardo: 5,
  	minFrecuenciaCreacion: 1,
  	maxFrecuenciaCreacion: 5
  }

};
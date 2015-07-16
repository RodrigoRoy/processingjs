/* Diffusion Limited Aggregation
  Implementación con Javascript y Processing.js
  @author Rodrigo Rivera
  @version 14.10.02
*/

// Definición de la clase Particula
function Particula(x, y){
	this.x = x || 0;
	this.y = y || 0;
};

// Representación en cadena que muestra su posición (x,y)
Particula.prototype.toString = function(){
	return "(" + this.x + ", " + this.y + ")";
};

// Clase que define la clase Diffusion Limited Aggregation
function DLA(width, height, size){
	this.width = width || 100; // ancho (en celdas) del area de dibujo
	this.height = height || 100; // alto (en celdas) del area de dibujo
	this.size = size || 8; // tamaño de cada celda
	this.array = [[]]; // Arreglo bidimensional de celdas (mundo)
	this.particula = new Particula(); // Particula que se mueve en el mundo
	
	this.init(); // Inicialización
};

// Inicialización del arreglo, posición aleatoria de la particula y marcar solo
// una casilla al centro del mundo.
DLA.prototype.init = function(){
	for(var i=0; i<this.height; i++){ // Inicializacion del mundo, todas las celdas en falso.
		this.array[i] = [];
		for(var j=0; j<this.width; j++)
			this.array[i][j] = false;
	}
	this.particula.x = randomInt(0,this.width-1); // Posicion aleatoria (x,y)
	this.particula.y = randomInt(0,this.height-1);
	this.array[Math.ceil(this.height/2)][Math.ceil(this.width/2)] = true; // Marcar la casilla del centro
};

// Mueve la partícula a una nueva posición libre.
DLA.prototype.launch = function(){
	do{
		this.particula.x = randomInt(0,this.width-1);
		this.particula.y = randomInt(0,this.height-1);
	}
	while(this.array[this.particula.y][this.particula.x]); // Si está marcada la casilla.
};

// Representación en cadena de un objeto DLA
DLA.prototype.toString = function(){
	var texto = "(" + this.width + ", " + this.height + ")";
	
	for(var i=0; i<this.height; i++)
		for(var j=0; j<this.width; j++)
			if(this.array[i][j])
				texto += "\n[" + j + ", " + i + "]";
	return texto;
};

// Auxiliar para generar un numero entero en el rango [min, max]
function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


var dla; // variable global para ejecutar la simulacion
var canvasNameHTML = "dla-canvas"; // Id del div contenedor en HTML para Processing.js

// Funcion que engloba el comportamiento de Processing
function sketchProc(processing){
	//dla = new DLA(parseInt($("#dla-width").val()), parseInt($("#dla-height").val()), parseInt($("#dla-pixels").val()));
	dla = new DLA();
	
	// Cómo dibujar la clase DLA con ayuda de las funciones en Processing
	DLA.prototype.draw = function(){
		processing.background(250); // Repintar el fondo
		
		processing.noFill(); // Dibujar las lineas de la cuadricula
		processing.stroke(255,120,0, 50);
		for(var i=0; i<=this.width; i++)
			processing.line(i*this.size, 0, i*this.size, this.height*this.size);
		for(var i=0; i<=this.height; i++)
			processing.line(0, i*this.size, this.height*this.size, i*this.size);
		
		processing.fill(120); // Dibujar todas las particulas "pegadas" (las celdas marcadas con true)
		processing.noStroke();
		for(var i=0; i<this.height; i++)
			for(var j=0; j<this.width; j++)
				if(this.array[i][j])
					processing.rect(j*this.size, i*this.size, this.size, this.size);
	};
	
	// Mueve la partícula aleatoriamente hasta que se "pegue" o encuentre una celda marcada
	DLA.prototype.rapidStep = function(){
		var oldX;
		var oldY;
		do{
			oldX = this.particula.x; // Recordar la posicion anterior para marcar cuando se "pega"
			oldY = this.particula.y;
			this.particula.x = (randomInt(-1,1) + this.particula.x + this.width) % this.width; // Mueve la particula aleatoriamente
			this.particula.y = (randomInt(-1,1) + this.particula.y + this.height) % this.height;
		}
		while(!this.array[this.particula.y][this.particula.x]); // Mientras no se "pegue"
		
		this.array[oldY][oldX] = true; // Marcar la casilla
		processing.rect(oldX*this.size, oldY*this.size, this.size, this.size); // Pintar en pantalla
		this.launch(); // Reiniciar la posicion de la partícula
	};
	
	// --- Setup de Processing ---
	processing.setup = function(){
		processing.frameRate(120);
		processing.size((dla.width*dla.size)+1, (dla.height*dla.size)+1); // Asignar el tamaño de area de dibujo
		document.getElementById(canvasNameHTML).width = (parseInt(dla.width) * parseInt(dla.size)) +1; // Ajustar el canvas al tamanio del DLA
		document.getElementById(canvasNameHTML).height = (parseInt(dla.height) * parseInt(dla.size)) +1;
		dla.draw(); // Dibujar DLA en pantalla
		processing.noLoop(); // Iniciar en pausa
	};
		
	// --- Draw de Processing ---
	processing.draw = function(){
		dla.rapidStep(); // Iterar y lanzar otra particula
	};
	
	// Permite la iteracion de la función draw
	processing.play = function(){
		processing.loop();
	};
	
	// Detine la iteracion de la función draw
	processing.pause = function(){
		processing.noLoop();
	};
	
	// Realiza solo un paso la simulación y se detiene la simulación
	processing.step = function(){
		processing.loop();
		dla.rapidStep();
		processing.noLoop();
	};
	
	// Reinicia la simulación
	processing.reset = function(){
		dla.init(); // Vuelve a establecer el mundo con solo una celda marcada
		dla.draw(); // Para mostrar el resultado de manera inmediata
	};
	
	// Cambia los parametros de ancho, alto y tamaño de celda del objeto "dla"
	processing.redimension = function(width, height, size){
		dla.width = width || 100;
		dla.height = height || 100;
		dla.size = size || 8;
		processing.size((dla.width*dla.size)+1, (dla.height*dla.size)+1); // Ajusta el area de dibujo
		processing.reset(); // Reinicia la simulación debido al cambio de dimensiones
	};
};

var canvas = document.getElementById(canvasNameHTML); // Obtener el canvas de Processing
var p = new Processing(canvas, sketchProc); // Adjunta la funcionalidad al canvas

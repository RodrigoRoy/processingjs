// Definicion de la clase Punto
function Punto(x, y, color){
	this.x = x || 0;
	this.y = y || 0;
	this.color = color;
};

// Representacion de un punto en formato "(x,y)"
Punto.prototype.toString = function(){
	return "(" + this.x + "," + this.y + ")";
};

// Definicion de la clase Kmeans
function Kmeans(width, height, totalMeans){
	this.width = width || 100; // ancho y alto del espacio
	this.height = height || 100;
	this.totalMeans = totalMeans || 5;
	this.puntos = []; // los puntos u observaciones
	this.means = []; // los puntos centroides de cada cluster
	this.backgroundColor = 0 // Color de fondo
};

// Muestra todos los puntos y los centroides
Kmeans.prototype.toString = function(){
	var texto = "Observaciones: ";
	for(var i in this.puntos)
		texto += "\n" + this.puntos[i].toString();
	texto += "\nCentroides (means): ";
	for(var i in this.means)
		texto += "\n" + this.means[i].toString();
	return texto;
};

// Auxiliar para generar un numero entero en el rango [min, max]
function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Auxiliar para obtener el promedio de un conjunto de puntos
function promedio(puntos){
	var resultado = [];
	var x = 0, y = 0;
	for(var i in puntos){
		x += parseInt(puntos[i].x);
		y += parseInt(puntos[i].y);
	}
	resultado[0] = Math.ceil(x/puntos.length);
	resultado[1] = Math.ceil(y/puntos.length);
	return resultado;
};


//Desde este punto es como trabajar con ambiente Processing

var kmean; // Objeto Kmean para representar el algoritmo
var play = false; // Pausa el algoritmo (noLoop() para Processing)
var canvasName = "kmeans-canvas"; // Id del canvas de HTML para dibujar
var addPoints = [false, false] // Indicadores para agregar Puntos y Centroides.

// Manera simple de adjuntar javascript al elemento canvas es usando una funcion
function sketchProc(processing){
	kmean = new Kmeans(document.getElementById(canvasName).getContext("2d").canvas.width, document.getElementById(canvasName).getContext("2d").canvas.height); // ancho y alto segun el canvas
	
	// Agregar funciones a la clase Kmeans, es conveniente aqui porque se
	// requiere de la variable "processing" (para loadStrings y color)
	
	Punto.prototype.equalsColor = function(punto){
		//return processing.red(this.color) == processing.red(punto.color) && processing.green(this.color) == processing.green(punto.color) && processing.blue(this.color) == processing.blue(punto.color)
		return this.color == punto.color;
	};
	
	// Cargar puntos desde un archivo de texto
	Kmeans.prototype.loadFile = function(filename){
		var lines = processing.loadStrings(filename); // Cargar lineas de archivo en un arreglo
		for(var i in lines){
			var coordenadas = processing.split(lines[i], "\t"); // Separar coordenadas
			this.puntos.push(new Punto(coordenadas[0], coordenadas[1], processing.color(255))); // Agregar punto
		}
	};
	
	// Inicializar n centroides aleatoriamente
	Kmeans.prototype.inicializacion = function(centroides){
		this.means = [];
		for(var i=0; i < centroides; i++)
			this.means.push(new Punto(randomInt(0, this.width), randomInt(0, this.height), processing.color(randomInt(0,255), randomInt(0,255), randomInt(0,255)))); // Agregar centroide con color aleatorio
	};
	
	// Asigna a cada punto el color del centroide mas cercano
	Kmeans.prototype.asignacion = function(){
		var centroide;
		for(var i in this.puntos){
			centroide = this.means[0];
			for(var j in this.means){
				if(processing.dist(this.puntos[i].x, this.puntos[i].y, this.means[j].x, this.means[j].y) < processing.dist(this.puntos[i].x, this.puntos[i].y, centroide.x, centroide.y))
					centroide = this.means[j];
			}
			this.puntos[i].color = centroide.color;
		}
	};
	
	// Asigna nuevas coordenadas de cada centroide segun el promedio de los
	// puntos del mismo color/categoria
	Kmeans.prototype.actualizacion = function(){
		var subconjunto;
		var coordenadas;
		for(var i in this.means){
			subconjunto = [];
			for(var j in this.puntos){
				if(this.means[i].equalsColor(this.puntos[j]))
					subconjunto.push(this.puntos[j]);
			}
			console.log(i + ": " + subconjunto.length);
			coordenadas = promedio(subconjunto);
			//console.log("   " + coordenadas[0] + ", " + coordenadas[1]);
			this.means[i].x = coordenadas[0];
			this.means[i].y = coordenadas[1];
		}
	};
	
	
	
	// ---Setup de processing---
	processing.setup = function(){
		var ctx = document.getElementById(canvasName).getContext("2d");
		processing.size(ctx.canvas.width, ctx.canvas.height); // tamanio de processing igual al canvas
		kmean.loadFile("data/observaciones.txt");
		kmean.inicializacion($("#kmeans-total-means").val());
		//console.log(kmean.toString()); -- Debug and testing
	};
	
	// ---Draw de processing---
	processing.draw = function(){
		processing.background(kmean.backgroundColor); // fondo negro por default
		
		for(i in kmean.puntos){ // dibujar puntos
			processing.stroke(kmean.puntos[i].color);
			processing.point(kmean.puntos[i].x, kmean.puntos[i].y);
		}
		
		for(i in kmean.means){ // dibujar centroides
			processing.noStroke();
			processing.fill(kmean.means[i].color);
			processing.ellipse(kmean.means[i].x, kmean.means[i].y, 10, 10);
		}
		
		if(play){
			kmean.asignacion();
			kmean.actualizacion();
		}
	};
	
	// ---Presionar mouse---
	processing.mousePressed = function(){
		//kmean.asignacion();
		//kmean.actualizacion();
		if(addPoints[0])
			kmean.puntos.push(new Punto(processing.mouseX, processing.mouseY, processing.color(255))); // Agregar punto
		else if(addPoints[1])
			kmean.means.push(new Punto(processing.mouseX, processing.mouseY, processing.color(randomInt(0,255), randomInt(0,255), randomInt(0,255)))); // Agregar centroide con color aleatorio
	};
	
	
	
	// Correr la simulación
	processing.play = function(){
		play = true;
	};
	
	// Pausar la simulación
	processing.pause = function(){
		play = false;
	};
	
	// Pausar y ejecutar solo un paso de la simulación
	processing.step = function(){
		processing.pause();
		kmean.asignacion();
		kmean.actualizacion();
	};
	
	// Establece nuevas posiciones a los centroides
	processing.reset = function(){
		processing.background(kmean.backgroundColor);
		kmean.inicializacion($("#kmeans-total-means").val());
	};
	
	// Establece la bandera para agregar puntos (en addPoints[0] y el resto en false)
	processing.addPoint = function(){
		for(var i in addPoints)
			addPoints[i] = false;
		addPoints[0] = true;
	};
	
	// Establece la bandera para agregar puntos (en addPoints[1] y el resto en false)
	processing.addMean = function(){
		for(var i in addPoints)
			addPoints[i] = false;
		addPoints[1] = true;
	};
	
	// Establecer el color de fondo a partir de un color hexadecimal (se obtiene del HTML)
	processing.setBackgroundColor = function(hex, transparency){
		var hex = hex.substring(1); // Quita el símbolo # del parametro hex (número hexadecimal)
		kmean.backgroundColor = processing.color(parseInt(hex.substring(0,2), 16), parseInt(hex.substring(2,4), 16), parseInt(hex.substring(4,6), 16), parseInt(transparency)); // parse a color de Processing
	};
}

var canvas = document.getElementById(canvasName);
// adjuntar la funcion 'sketchProc' al canvas
var p = new Processing(canvas, sketchProc);

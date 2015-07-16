function Celda(x,y,visitado){
	this.x = x;
	this.y = y;
	this.visitado = visitado || false;
};

Celda.prototype.toString = function(){
	return "(" + this.x + ", " + this.y + ", " + this.visitado + ")";
}

function Laberinto(ancho, alto, tamanio){
	this.ancho = ancho || 50;
	this.alto = alto || 50;
	this.tamanio = tamanio || 8;
	
	this.mundo = [];
	this.lineasH = [];
	this.lineasV = [];
	this.stack = [];
	
	/*this.colorBackground = 0;
	this.colorBackground2 = 0;
	this.colorPosActual = 0;
	this.colorLinea = 0;*/
	this.terminado = false;
	
	this.init();
};

Laberinto.prototype.init = function(){
	this.mundo = [];
	this.lineasH = [];
	this.lineasV = [];
	this.stack = [];
	this.terminado = false;
	
	for(var i = 0; i < this.alto; i++){
		this.mundo[i] = [];
		for(var j = 0; j < this.ancho; j++)
			this.mundo[i][j] = new Celda(j, i);
	}
	
	for(var i = 0; i <= this.alto; i++){
		this.lineasH[i] = [];
		this.lineasV[i] = [];
		for(var j = 0; j <= this.ancho; j++){
			this.lineasH[i][j] = true;
			this.lineasV[i][j] = true;
		}
	}
	
	this.posActual = this.mundo[randomInt(0, this.alto-1)][randomInt(0, this.ancho-1)];
};

Laberinto.prototype.sigDireccion = function(paramCelda){
	auxiliar = [];
	if(paramCelda.y > 0)
		if(!this.mundo[paramCelda.y-1][paramCelda.x].visitado)
			auxiliar.push(0);
	if(paramCelda.x < this.ancho-1)
		if(!this.mundo[paramCelda.y][paramCelda.x+1].visitado)
			auxiliar.push(1);
	if(paramCelda.y < this.alto-1)
		if(!this.mundo[paramCelda.y+1][paramCelda.x].visitado)
			auxiliar.push(2);
	if(paramCelda.x > 0)
		if(!this.mundo[paramCelda.y][paramCelda.x-1].visitado)
			auxiliar.push(3);
	
	if(auxiliar.length == 0)
		return 4;
	return auxiliar[randomInt(0,auxiliar.length-1)];
};

Laberinto.prototype.moverPosicion = function(){
	switch(this.sigDireccion(this.posActual)){
		case 0:
			this.mundo[this.posActual.y][this.posActual.x].visitado = true;
			this.stack.push(this.mundo[this.posActual.y][this.posActual.x]);
			this.lineasH[this.posActual.y][this.posActual.x] = false;
			this.posActual = this.mundo[this.posActual.y-1][this.posActual.x];
			break;
		case 1:
			this.mundo[this.posActual.y][this.posActual.x].visitado = true;
			this.stack.push(this.mundo[this.posActual.y][this.posActual.x]);
			this.lineasV[this.posActual.y][this.posActual.x+1] = false;
			this.posActual = this.mundo[this.posActual.y][this.posActual.x+1];
			break;
		case 2:
			this.mundo[this.posActual.y][this.posActual.x].visitado = true;
			this.stack.push(this.mundo[this.posActual.y][this.posActual.x]);
			this.lineasH[this.posActual.y+1][this.posActual.x] = false;
			this.posActual = this.mundo[this.posActual.y+1][this.posActual.x];
			break;
		case 3:
			this.mundo[this.posActual.y][this.posActual.x].visitado = true;
			this.stack.push(this.mundo[this.posActual.y][this.posActual.x]);
			this.lineasV[this.posActual.y][this.posActual.x] = false;
			this.posActual = this.mundo[this.posActual.y][this.posActual.x-1];
			break;
		case 4:
			if(!this.stack.length == 0){
				this.mundo[this.posActual.y][this.posActual.x].visitado = true;
				this.posActual = this.stack.pop();
			}
			else
				this.terminado = true;
			break;
	}
};

Laberinto.prototype.toString = function(){
	result = "";
	result += "[" + this.ancho + ", " + this.alto + "] (" + this.tamanio + ")\n";
	result += "Mundo: " + this.mundo + "\n";
	result += "Stack: " + this.stack + "\n";
	result += "PosActual: " + this.posActual;
	return result;
};

// Auxiliar para generar un numero entero en el rango [min, max]
function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
};


/*var ancho = 10;
var alto = 10;
var tamCelda = 32;*/
var maze;
var canvasName = "maze-canvas"; // Id del canvas de HTML para dibujar
var play = false;

function sketchProc(processing){
	Laberinto.prototype.draw = function(){
		// Pintar las celdas ya visitadas.
		for(var i = 0; i < this.alto; i++)
			for(var j = 0; j < this.ancho; j++)
				if(this.mundo[i][j].visitado){
					processing.fill(255, 0, 0, 50);
					processing.noStroke();
					processing.rect(j*this.tamanio, i*this.tamanio, this.tamanio, this.tamanio);
				}
		
		// Pintar las celdas del stack.
		for(var i in this.stack){
			processing.fill(0, 0, 255, 50);
			processing.noStroke();
			processing.rect(this.stack[i].x*this.tamanio, this.stack[i].y*this.tamanio, this.tamanio, this.tamanio);
		}
		
		// Pintar las lineas horizontales del laberinto.
		for(var i = 0; i <= this.alto; i++)
			for(var j = 0; j < this.ancho; j++)
				if(this.lineasH[i][j]){
					processing.stroke(0);
					processing.line(j*this.tamanio, i*this.tamanio, (j*this.tamanio)+this.tamanio, i*this.tamanio);
				}
		// Pintar las lineas horizontales del laberinto.  
		for(var i = 0; i < this.alto; i++)
			for(var j = 0; j <= this.ancho; j++)
				if(this.lineasV[i][j]){
					processing.stroke(0);
					processing.line(j*this.tamanio, i*this.tamanio, j*this.tamanio, (i*this.tamanio)+this.tamanio);
				}
		
		// Mientras no termine de dibujarse el laberinto pintar la posicion actual.
		if(!this.terminado){
			processing.fill(200, 200, 200);
			processing.noStroke();
			processing.rect(this.posActual.x*this.tamanio, this.posActual.y*this.tamanio, this.tamanio, this.tamanio);
			//this.moverPosicion();
		}
		// Cuando termina, dejamos de actualizar y pintar.
		//else
			//processing.noLoop();
	};
	
	// ---Setup de processing---
	processing.setup = function(){
		processing.frameRate(60);
		maze = new Laberinto($("#maze-width").val(), $("#maze-height").val(), $("#maze-pixels").val());
		processing.size((maze.ancho*maze.tamanio)+1, (maze.alto*maze.tamanio)+1);
	};
	
	// ---Draw de processing---
	processing.draw = function(){
		processing.background(255);
		maze.draw();
		
		if(play){
			if(!maze.terminado)
				maze.moverPosicion();
		}
	};
	
	
	// Correr la simulación
	processing.play = function(){
		play = true;
	};
	
	// Pausar la simulación
	processing.pause = function(){
		play = false;
	};
	
	// Pausar y ejecutar solo un paso de la creacion
	processing.step = function(){
		//processing.pause();
		if(!maze.terminado)
			maze.moverPosicion();
	};
	
	// Establece nuevas posiciones a los centroides
	processing.reset = function(){
		processing.background(255);
		maze.init();
		processing.size((maze.ancho*maze.tamanio)+1, (maze.alto*maze.tamanio)+1);
	};
	
	// Establece nuevas dimensiones del laberinto
	processing.redimension = function(width, height, size){
		maze.width = parseInt(width);
		maze.height = parseInt(height);
		maze.tamanio = parseInt(size);
	};
	
	processing.hex2Color = function(htmlColorHex){
		var htmlColorHex = htmlColorHex.substring(1); // Quitar el símbolo #
		return processing.color(parseInt(hex.substring(0,2), 16), parseInt(hex.substring(2,4), 16), parseInt(hex.substring(4,6), 16)); // Processing color
	};
	
	processing.setHexColors = function(hexBg, hexBg2, hexActual, hexLinea){
		maze.colorBackground = processing.hex2Color(hexBg);
		maze.colorBackground2 = processing.hex2Color(hexBg2);
		maze.colorPosActual = processing.hex2Color(hexActual);
		maze.colorLinea = processing.hex2Color(hexLinea);
	};
};

var canvas = document.getElementById(canvasName);
// adjuntar la funcion 'sketchProc' al canvas
var p = new Processing(canvas, sketchProc);
/* Cell Automaton (Wolfram)
  Implementación con Javascript y Processing.js
*/

// Definicion de un autómata celular unidimensional
function CellAutomaton(width, size, ruleNumber, limit){
	this.width = width || 50; // Cantidad de celdas a lo ancho
	this.size = size || 8; // Tamaño en pixeles de cada celda (cuadrada)
	this.limit = limit || 100; // Cantidad de celdas a lo largo
	this.ruleNumber = ruleNumber || 22; // Regla con notación Wolfram (rango: [0,255])
	this.rules = []; // Regla en notación binaria (ejemplo para 22: [0,0,0,1,0,1,1,0])
	
	this.actualState = []; // Arreglo actual de celular vivas o muestras (ejemplo: [1,0,0,1,...])
	this.nextState = []; // Arreglo auxiliar calcular la siguiente generación
	this.generation = 0; // Contador de generaciones
	this.randomInit = 0.5; // Proporción aleatoria para crear una celula viva (en 0.5 tiene 50% de estar viva)
	
	this.liveColor = 0;	// Color de célula viva
	this.deadColor = 255; // Color de célula muerta
	this.lineColor = 140; // Color de linea
	
	this.parseRule(this.ruleNumber); // Asignación de la regla a this.rules implicitamente
	this.init2(); //init=random, init2=center_unique
};

// Inicialización del arreglo actualState de manera aleatoria
// también se inicializa nextState vacio (necesario). El contador de generaciones se inicializa en 0
CellAutomaton.prototype.init = function(){
	for(var i=0; i<this.width; i++){
		if(Math.random() < this.randomInit)
			this.actualState[i] = 1;
		else
			this.actualState[i] = 0;
		this.nextState[i] = 0;
	}
	this.generation = 0;
};

// Similar a init() pero unicamente mantiene viva una célula (al centro)
// No utiliza aleatoreidad y es especialmente útil para la regla 22.
CellAutomaton.prototype.init2 = function(){
	for(var i=0; i<this.width; i++){
		this.actualState[i] = 0;
		this.nextState[i] = 0;
	}
	this.actualState[Math.ceil(this.width/2)] = 1;
	this.generation = 0;
};

// Recibe un número decimal en el rango [0,255], lo convierte en binario
// y asigna cada digito binario al arreglo this.rules
CellAutomaton.prototype.parseRule = function(ruleNum){
	var binRule = parseInt(ruleNum, 10).toString(2); // conversion binaria
	while(binRule.length < 8) // rellenar con ceros si es necesario
		binRule = "0" + binRule;
	console.log(binRule, binRule.length);
	for(var i=0; i<binRule.length; i++) // asignar al arreglo de reglas(this.rules)
		this.rules[binRule.length-1-i] = parseInt(binRule.charAt(i));
	console.log(this.rules);
};

// Aplica la regla del autómata celular unidimensiona a una sola célula (en la posición i)
// La vecindad es de tamaño 1 para determinar el estado de la célula en la siguiente generación
CellAutomaton.prototype.applyRules = function(i){
	var back = (i==0) && this.actualState[this.width-1].toString() || this.actualState[i-1].toString();
	var center = this.actualState[i].toString();
	var front = this.actualState[(i+1)%this.width].toString();
	var binary = back + center + front; // ejemplo: 101
	return this.rules[parseInt(binary,2)]; // ejemplo: 101 := 5 => rules[5] := {1,0}
};

// Aplica la regla para todas las celulas de la generación actual
CellAutomaton.prototype.nextGeneration = function(){
	for(var i=0; i<this.width; i++)
		this.nextState[i] = this.applyRules(i); // Nuevos estados
	//this.actualState = this.nextState; // This replace the next two lines?
	for(var i=0; i<this.width; i++)
		this.actualState[i] = this.nextState[i]; // Copiamos nuevos estados a los actuales
	this.generation += 1;
};

// Muesta la generación actual en forma de cadena (ceros y unos)
CellAutomaton.prototype.toString = function(){
	return this.actualState.toString();
};


// ----- Agregar processing.js -----
var wolfram; // variable global para ejecutar la simulacion
var canvasNameHTML = "canvas-wolfram"; // Id del div contenedor en HTML para Processing.js

// Manera simple de adjuntar javascript al elemento canvas es usando una funcion
function sketchProc(processing){
	//wolfram = new CellAutomaton(50,8,22,50); // (width,size,rule,limit)
	//wolfram = new CellAutomaton(parseInt(document.getElementById("wolfram-width").value), parseInt(document.getElementById("wolfram-pixels").value), parseInt(document.getElementById("wolfram-rule").value), parseInt(document.getElementById("wolfram-limit").value)); // This not work using Angular
	wolfram = new CellAutomaton(); // Con valores por default
	
	// Dibuja la generación actual del autómata celular en el area de dibujo de Processing
	CellAutomaton.prototype.draw = function(){
		processing.stroke(this.lineColor);
		for(var i=0; i<this.width; i++){
			if(this.actualState[i] == 1) // Color de celula viva o muerta?
				processing.fill(this.liveColor);
			else
				processing.fill(this.deadColor);
			processing.rect(i*this.size, (this.generation%this.limit)*this.size, this.size, this.size); // Dibujar célula
		}
		processing.stroke(255,0,0); // Dibujar linea roja para visualizar posición de la generación actual
		processing.line(0, ((this.generation+1)%this.limit)*this.size, this.width*this.size, ((this.generation+1)%this.limit)*this.size);
	};
		
	// ---Processing setup---
	processing.setup = function(){
		processing.frameRate(15); // Alentar la simulación
		processing.size(wolfram.width*wolfram.size, wolfram.limit*wolfram.size); // Asignar tamaño del area de dibujado
		processing.background(255, 100);
		processing.noLoop(); // Iniciar en pausa
	};
	
	// ---Processing draw---
	processing.draw = function(){
		wolfram.draw(); // Dibuja la generación actual en pantalla
		wolfram.nextGeneration(); // Calcula la siguiente generación
	};
	
	/* Las siguientes funciones permiten comunicación externa con otros scripts (app.js) para el ambiente Processing */

	// Asigna nueva regla (no reinicia al autómata)
	processing.setRule = function(ruleNumber){
		wolfram.parseRule(ruleNumber);
	};
	
	// // Permite la iteracion de la función draw
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
		processing.draw();
		processing.noLoop();
	};
	
	// Reinicia la simulación
	processing.reset = function(){
		processing.background(255, 100); // Limpia el espacio
		wolfram.init2(); // Inicializa la primer generación
		wolfram.draw();
	};
	
	// Cambia los parametros de ancho, alto (limit) y tamaño de celda del autómata celular
	processing.redimension = function(width, limit, size){
		wolfram.width = width;
		wolfram.limit = limit;
		wolfram.size = size;
		processing.size((wolfram.width * wolfram.size) + 1, (wolfram.limit * wolfram.size) + 1); // Actualiza el tamaño del espacio de Processing
	};
	
	// Asigna nuevo color para la celula viva
	// Recibe un color hexadecimal, lo convierte un primitiva de color y la asigna al autómata celular
	processing.setHexLiveColor = function(hex){
		var hex = hex.substring(1);
		wolfram.liveColor = processing.color(parseInt(hex.substring(0,2), 16), parseInt(hex.substring(2,4), 16), parseInt(hex.substring(4,6), 16));
	};
	
	// Asigna nuevo color para la celula muerta
	// Recibe un color hexadecimal, lo convierte un primitiva de color y la asigna al autómata celular
	processing.setHexDeadColor = function(hex){
		var hex = hex.substring(1);
		wolfram.deadColor = processing.color(parseInt(hex.substring(0,2), 16), parseInt(hex.substring(2,4), 16), parseInt(hex.substring(4,6), 16));
	};
	
	// Asigna nuevo color la linea de contorno de cada célula
	// Recibe un color hexadecimal, lo convierte un primitiva de color y la asigna al autómata celular
	processing.setHexLineColor = function(hex){
		var hex = hex.substring(1);
		wolfram.lineColor = processing.color(parseInt(hex.substring(0,2), 16), parseInt(hex.substring(2,4), 16), parseInt(hex.substring(4,6), 16));
	};
	
	// Asigna nueva regla al autómata celular
	processing.setRule = function(rule){
		wolfram.parseRule(rule);
	};
}

var canvas = document.getElementById(canvasNameHTML);
var p = new Processing(canvas, sketchProc);

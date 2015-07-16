function CellAutomaton(width, size, ruleNumber, limit){
	this.width = width || 50;
	this.size = size || 8;
	this.limit = limit || 100;
	this.ruleNumber = ruleNumber || 22;
	this.rules = [];
	
	this.actualState = [];
	this.nextState = [];
	this.generation = 0;		// Contador de generaciones
	this.randomInit = 0.5;
	//this.play = false;			// Auxiliar para indicar que se calcule la siguiente generación
	
	this.liveColor = 0;			// Color de célula viva
	this.deadColor = 255;		// Color de célula muerta
	this.lineColor = 140;		// Color de linea
	
	this.parseRule(this.ruleNumber);
	this.init2(); //init=random, init2=center_unique
};

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

CellAutomaton.prototype.init2 = function(){
	for(var i=0; i<this.width; i++){
		this.actualState[i] = 0;
		this.nextState[i] = 0;
	}
	this.actualState[Math.ceil(this.width/2)] = 1;
	this.generation = 0;
};

CellAutomaton.prototype.parseRule = function(ruleNum){
	var binRule = parseInt(ruleNum, 10).toString(2); // conversion binaria
	//console.log(binRule, binRule.length);
	while(binRule.length < 8) // rellenar con ceros si es necesario
		binRule = "0" + binRule;
	console.log(binRule, binRule.length);
	for(var i=0; i<binRule.length; i++) // asignar al arreglo de reglas(this.rules)
		this.rules[binRule.length-1-i] = parseInt(binRule.charAt(i));
	console.log(this.rules);
};

CellAutomaton.prototype.applyRules = function(i){
	var back = (i==0) && this.actualState[this.width-1].toString() || this.actualState[i-1].toString();
	var center = this.actualState[i].toString();
	var front = this.actualState[(i+1)%this.width].toString();
	var binary = back + center + front;
	//console.log(binary);
	return this.rules[parseInt(binary,2)];
};

CellAutomaton.prototype.nextGeneration = function(){
	for(var i=0; i<this.width; i++)
		this.nextState[i] = this.applyRules(i);
	//this.actualState = this.nextState;
	for(var i=0; i<this.width; i++)
		this.actualState[i] = this.nextState[i];
	this.generation += 1;
};

CellAutomaton.prototype.toString = function(){
	//return "Rule " + this.ruleNumber.toString() + "\n" + this.actualState.toString();
	return this.actualState.toString();
};


// ----- Agregar processing.js -----
var wolfram;
var canvasNameHTML = "canvas-wolfram"; // Id del div contenedor en HTML para Processing.js

// Manera simple de adjuntar javascript al elemento canvas es usando una funcion
function sketchProc(processing){
	//wolfram = new CellAutomaton(50,8,22,50); // (width,size,rule,limit)
	//wolfram = new CellAutomaton(parseInt(document.getElementById("wolfram-width").value), parseInt(document.getElementById("wolfram-pixels").value), parseInt(document.getElementById("wolfram-rule").value), parseInt(document.getElementById("wolfram-limit").value));
	wolfram = new CellAutomaton();
	
	CellAutomaton.prototype.draw = function(){
		processing.stroke(this.lineColor);
		for(var i=0; i<this.width; i++){
			if(this.actualState[i] == 1)
				processing.fill(this.liveColor);
			else
				processing.fill(this.deadColor);
			processing.rect(i*this.size, (this.generation%this.limit)*this.size, this.size, this.size);
			processing.stroke(255,0,0);
			processing.line(0, ((this.generation+1)%this.limit)*this.size, this.width*this.size, ((this.generation+1)%this.limit)*this.size);
			processing.stroke(this.lineColor);
		}
	};
		
	// ---Processing setup---
	processing.setup = function(){
		processing.frameRate(15);
		//processing.size($("#canvas-wolfram").width(), $("#canvas-wolfram").height());
		//processing.size(($("#wolfram-width").val() * $("#wolfram-pixels").val()) + 1, ($("#wolfram-limit").val() * $("#wolfram-pixels").val()) + 1);
		processing.size(wolfram.width*wolfram.size, wolfram.limit*wolfram.size);
		document.getElementById(canvasNameHTML).width = processing.width +1; // Ajustar el canvas al tamanio del DLA
		document.getElementById(canvasNameHTML).height = processing.height +1;
		processing.background(255, 100);
		processing.noLoop(); // Iniciar en pausa
		console.log(wolfram.toString());
	};
	
	// ---Processing draw---
	processing.draw = function(){
		wolfram.draw();
		wolfram.nextGeneration();
	};
	
	processing.setRule = function(ruleNumber){
		wolfram.parseRule(ruleNumber);
	};
	
	processing.play = function(){
		processing.loop();
	};
	
	processing.pause = function(){
		processing.noLoop();
	};
	
	processing.step = function(){
		processing.loop();
		processing.draw();
		processing.noLoop();
	};
	
	processing.reset = function(){
		processing.background(255, 100);
		wolfram.init2();
		wolfram.draw();
	};
	
	processing.redimension = function(width, limit, size){
		wolfram.width = width;
		wolfram.limit = limit;
		wolfram.size = size;
		processing.size((wolfram.width * wolfram.size) + 1, (wolfram.limit * wolfram.size) + 1);
	};
	
	processing.setHexLiveColor = function(hex){
		var hex = hex.substring(1);
		wolfram.liveColor = processing.color(parseInt(hex.substring(0,2), 16), parseInt(hex.substring(2,4), 16), parseInt(hex.substring(4,6), 16));
	};
	
	processing.setHexDeadColor = function(hex){
		var hex = hex.substring(1);
		wolfram.deadColor = processing.color(parseInt(hex.substring(0,2), 16), parseInt(hex.substring(2,4), 16), parseInt(hex.substring(4,6), 16));
	};
	
	processing.setHexLineColor = function(hex){
		var hex = hex.substring(1);
		wolfram.lineColor = processing.color(parseInt(hex.substring(0,2), 16), parseInt(hex.substring(2,4), 16), parseInt(hex.substring(4,6), 16));
	};
	
	processing.setRule = function(rule){
		wolfram.parseRule(rule);
	};
}

var canvas = document.getElementById("canvas-wolfram");
// adjuntar la funcion 'sketchProc' al canvas
var p = new Processing(canvas, sketchProc);

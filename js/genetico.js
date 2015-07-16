/*
Definicion de un algoritmo genetico para resolver el problema de las N-reinas
	autor: Rodrigo Colin Rivera
	version: 14.09.22
*/

// Definicion de la clase Individuo (tablero)
function Individuo(tamanio, genotipo){
	if(genotipo===undefined) // Si no se proporciona segundo parametro
		//this.genotipo = this.genotipoAleatorio(tamanio); // Representacion genomica (aleatoria)
		this.genotipo = this.permutacion(tamanio); // Representacion genomica (permutacion)
	else
		this.genotipo = this.copiaGenotipo(genotipo) // Representacion genomica (copia)
	this.fitness = this.setFitness(); // Valor de aptitud
};

// Auxiliar para crear individuos aleatorios
Individuo.prototype.genotipoAleatorio = function(tamanio){
	var genotipo = [];
	for(var i=0; i < tamanio; i++)
		genotipo[i] = randomInt(0, tamanio-1);
	return genotipo;
};

// Devuelve un arreglo de permutacion de numeros en el rango [1,longitud]
// Nota: Se usa la funcion auxiliar "randomInt()" al final de este codigo
Individuo.prototype.permutacion = function(longitud){
	var genes = [];
	var permutacion = [];
	for(var i=0; i < longitud; i++)
		genes[i] = i;
	for(var i=0; i < longitud; i++)
		permutacion.push(genes.splice(randomInt(0, genes.length-1), 1)[0])
	return permutacion
};

// Auxiliar para asignar un genotipo de copia
Individuo.prototype.copiaGenotipo = function(genotipo){
	var copia = [];
	for(var i in genotipo)
		copia[i] = genotipo[i];
	return copia;
};

// Auxiliar para contar la cantidad de ataques entre reinas del tablero
Individuo.prototype.ataques = function(){
	var ataques = 0;
	for(var i=0; i < this.genotipo.length-1; i++)
		for(var j=i+1; j < this.genotipo.length; j++){
			if(this.genotipo[i] == this.genotipo[j])
				ataques += 1;
			if(this.genotipo[i] == this.genotipo[j]-(j-i))
				ataques += 1;
			if(this.genotipo[i] == this.genotipo[j]+(j-i))
				ataques += 1;
		}
	return ataques;
};

// Calcula el fitness del individuo basado en la cantidad de ataques
Individuo.prototype.setFitness = function(){
	this.fitness = 1.0 / (1.0+this.ataques());
	return this.fitness;
};

// Operacion de recombinacion
/*Individuo.prototype.recombinacion = function(individuo, ptoCorte){
	var corte = ptoCorte || randomInt(1, this.genotipo.length-2); // Para evitar cortes no intermedios
	var genotipo = [];
	for(var i in this.genotipo){
		if(i < corte)
			genotipo[i] = this.genotipo[i];
		else if(i >= corte)
			genotipo[i] = individuo.genotipo[i];
	}
	return new Individuo(genotipo.length, genotipo);
};*/

// Operador de recombinacion que mantiene permutaciones
Individuo.prototype.recombinacion = function(individuo, ptoCorte){
	var corte = ptoCorte || randomInt(1, this.genotipo.length-2); // Para evitar cortes no intermedios
	var genotipo = []; // Nuevo genotipo resultado de la recombinacion
	for(i=0; i < corte; i++)
		genotipo.push(this.genotipo[i]); //genotipo[i] = this.genotipo[i];
	// Construir resto del genotipo
	var agregar = false;
	for(var i in individuo.genotipo){
		for(var j in genotipo){
			if(individuo.genotipo[i] == genotipo[j]){ // si el numero ya se encuentra en genotipo
				agregar = false;
				break; // termina la ejecucion del for mas interno
			}
			else
				agregar = true;
		} // solo para evitar confusion de lectura
		if(agregar)
			genotipo.push(individuo.genotipo[i]);
	}
	return new Individuo(genotipo.length, genotipo);
};
	
// Operacion de mutacion
/*Individuo.prototype.mutacion = function(probabilidad){
	for(var i in this.genotipo)
		if(Math.random() <= probabilidad)
			this.genotipo[i] = randomInt(0,this.genotipo.length-1);
	//this.setFitness();
};*/

// Operacion de mutacion que mantiene permutacion
Individuo.prototype.mutacion = function(probabilidad){
	for(var i in this.genotipo)
		if(Math.random() <= probabilidad){
			do{
				var swap = randomInt(0, this.genotipo.length-1) // indice aleatorio para permutar
			}
			while(swap == i); // evitar que sea el mismo indice
			// Swap de genes
			var aux = this.genotipo[i];
			this.genotipo[i] = this.genotipo[swap];
			this.genotipo[swap] = aux;
		}
};

// Dos individuos son iguales si tienen misma representacion genomica.
Individuo.prototype.equals = function(individuo){
	for(var i in this.genotipo)
		if(this.genotipo[i] != individuo.genotipo[i])
			return false;
	return true;
};

// Es óptimo cuando su fitness es 1 (ya que la funcion fitness es:
// 1 / (1 + cantidadDeAtaques)
Individuo.prototype.esSolucion = function(){
	return this.fitness == 1;
};

// Describe un individuo como arreglo de numeros y su valor fitness
Individuo.prototype.toString = function(){
	var genotipo = "";
	for(var i in this.genotipo)
		genotipo += this.genotipo[i] + " ";
	return genotipo + "\t[Fitness: " + this.fitness + "]\t[Ataques: " + this.ataques() + "]";
};

// Definicion de la clase Genetico que determina un algoritmo genetico para
// trabajar con individuo que resuelven el problema de las N-reinas
function Genetico(cantidadPoblacion, pMutacion, elitismo, limite, tamanio, pixels){
	this.poblacion = []; // poblacion de individuos
	this.cantidad = cantidadPoblacion; // cantidad de individuos en la poblacion
	this.pMutacion = pMutacion; // probabilidad de mutacion
	this.elitismo = elitismo; // cantidad de individuos con elitismo por generacion
	this.limite = limite; // cantidad limite de iteraciones
	this.tamanio = tamanio; // tamanio del tablero (comunmente 8)
	this.totalFitness = 0; // auxiliar para el conteo total de fitness
	this.pixels = pixels || 32; // auxiliar para la visualización
	this.comparador = function(ind1, ind2){ // comparador para ordenar poblacion por fitness
		return ind2.fitness - ind1.fitness;
	};
	this.agLog = "";
};

// Agrega la cantidad de individuo a la poblacion y ordena por fitness
Genetico.prototype.init = function(){
	this.totalFitness = 0;
	var nuevoIndividuo;
	for(var i=0; i < this.cantidad; i++){
		nuevoIndividuo = new Individuo(this.tamanio)
		this.totalFitness += nuevoIndividuo.fitness;
		this.poblacion.push(nuevoIndividuo);
	};
	this.poblacion.sort(this.comparador);
};

// Representacion de la poblacion en una iteracion del algoritmo
// Muestra cada individuo y el promedio fitness de la poblacion
Genetico.prototype.toString = function(){
	var poblacion = "";
	for(var i in this.poblacion)
		poblacion += this.poblacion[i].toString() + "\n";
	poblacion += "Promedio: " + this.totalFitness/this.cantidad + "\n";
	return poblacion;
};

// Selecciona un individuo de la poblacion mediante seleccion proporcional o ruleta
Genetico.prototype.seleccionRuleta = function(){
	var seleccion = Math.random();
	var acumulado = 0;
	for(var i in this.poblacion){
		acumulado += this.poblacion[i].fitness / this.totalFitness;
		if(seleccion < acumulado)
			return this.poblacion[i];
	}
};

// Crea una nueva poblacion aplicando elitismo, recombinacion y mutacion
Genetico.prototype.generacion = function(){
	var nuevaPoblacion = [];
	var nuevoFitnessTotal = 0;
	var temporal; // individuos auxiliares
	var nuevo;
	
	for(var i=0; i < this.elitismo; i++){ // Aplicar elitismo
		nuevaPoblacion.push(this.poblacion[i]);
		nuevoFitnessTotal += this.poblacion[i].fitness;
	}
	
	while(nuevaPoblacion.length < this.poblacion.length){
		temporal = this.seleccionRuleta();
		nuevo = temporal.recombinacion(this.seleccionRuleta()); // individuo "hijo"
		nuevo.mutacion(this.pMutacion);
		nuevo.setFitness();
		nuevaPoblacion.push(nuevo); // agregarlo a la poblacion
		nuevoFitnessTotal += nuevo.fitness;
	}
	
	this.poblacion = nuevaPoblacion; // actualizar la poblacion
	this.totalFitness = nuevoFitnessTotal; // asignar el fitness total de la nueva poblacion
	this.poblacion.sort(this.comparador); // ordenar por fitness
};

// Aplica varias generaciones hasta encontrar el optimo o alcanzar el limite de iteraciones
Genetico.prototype.resuelve = function(){
	this.init();
	//var agLog = "Log: \n";
	this.agLog = "<strong>Log:</strong> <br>";
	//console.log("Log:");
	for(var i=0; i < this.limite; i++){
		this.generacion();
		if(i%50 == 0)
			//console.log("Mejor en iteracion " + i + ": " + this.poblacion[0].toString());
			//agLog += "Mejor en iteracion " + i + ": " + this.poblacion[0].toString() + "\n"
			this.agLog += "Mejor en iteracion " + i + ": " + this.poblacion[0].toString() + "<br>"
		if(this.poblacion[0].esSolucion()){
			//console.log("Optimo encontrado en generacion " + i + ": " + this.poblacion[0].toString());
			//return;
			//return agLog + "Optimo encontrado en generacion " + i + ": " + this.poblacion[0].toString() + "\n";
			this.agLog += "<strong>Optimo encontrado en generacion " + i + ": " + this.poblacion[0].toString() + "</strong><br>";
			return;
		}
	}
	//console.log("Optimo no encontrado, mejor individuo: " + this.poblacion[0].toString());
	this.agLog += "Optimo no encontrado, <em>mejor individuo</em>: " + this.poblacion[0].toString();
};


// Auxiliar para generar un numero entero en el rango [min, max]
function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



/*var poblacion = $("#genetico-poblacion").val(); // cantidad de individuos en la poblacion
var mutacion = $("#genetico-mutacion").val(); // probabilidad de mutacion
var elitismo = $("#genetico-elitismo").val(); // cantidad de elitismo
var iteraciones = $("#genetico-iteraciones").val(); // maximo numero de iteraciones*/
//var tablero = $("#genetico-queen").val(); // tamanio del tablero
//var size = $("#genetico-pixels").val(); // tamanio de cada celda del tablero
var ag;
var solucion;
//var agLog = "";
var canvasName = "genetico-canvas"; // Id del canvas de HTML para dibujar

function sketchProc(processing){
	Genetico.prototype.draw = function(){
		processing.fill(255, 0, 0, 120); // Color de la reinas
		for(var i = 0; i < this.tamanio; i++) // Dibujar la posicion de las reinas
			processing.rect(i*this.pixels, solucion[i]*this.pixels, this.pixels, this.pixels);
		for(var i = 0; i <= solucion.length; i++){ // Dibujar las lineas del tablero
			processing.line(i*this.pixels, 0, i*this.pixels, this.pixels*(this.pixels));
			processing.line(0, i*this.pixels, this.pixels*(this.pixels), i*this.pixels);
		}
	};

	// ---Setup de processing---
	processing.setup = function(){
		//processing.frameRate(60);
		//ag = new Genetico(poblacion, mutacion, elitismo, iteraciones, tablero); // Crear objeto
		ag = new Genetico($("#genetico-poblacion").val(), $("#genetico-mutacion").val(), $("#genetico-elitismo").val(), $("#genetico-iteraciones").val(), $("#genetico-queen").val());
		processing.size(($("#genetico-queen").val()*$("#genetico-pixels").val())+1, ($("#genetico-queen").val()*$("#genetico-pixels").val())+1); // reinas * tamanio de celda
		ag.resuelve(); // Encontrar optimo con el algoritmo genetico
		//agLog = ag.resuelve();
		console.log(ag.agLog);
		//console.log(ag.poblacion[0].toString(), ag.poblacion[0].ataques()); // Mostrar en consola el mejor individuo
		solucion = ag.poblacion[0].genotipo; // Representacion del mejor individuo para mostrar graficamente
	};
	
	
	// ---Draw de processing---
	processing.draw = function(){
		processing.background(255);
		ag.draw();
	};
	
	processing.reset = function(){
		ag = new Genetico($("#genetico-poblacion").val(), $("#genetico-mutacion").val(), $("#genetico-elitismo").val(), $("#genetico-iteraciones").val(), $("#genetico-queen").val());
		ag.resuelve();
		solucion = ag.poblacion[0].genotipo;
	};
	
	processing.setPixels = function(pixels, width, height){
		ag.pixels = pixels;
		processing.size(width, height);
	};
	
	processing.getLog = function(){
		return ag.agLog;
	};
};

var canvas = document.getElementById(canvasName);
// adjuntar la funcion 'sketchProc' al canvas
var p = new Processing(canvas, sketchProc);

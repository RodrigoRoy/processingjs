var pjs;

$(document).ready(function(){
	getPjsInstance();
	setCanvasSize();
	
	$("#maze-play").click(function(){
		pjs.play();
		$(this).hide();
		$("#maze-pause").show();
	});
	
	$("#maze-pause").click(function(){
		pjs.pause();
		$(this).hide();
		$("#maze-play").show();
	});
	
	$("#maze-step").click(function(){
		pjs.pause();
		pjs.step();
		$("#maze-pause").hide();
		$("#maze-play").show();
	});
	
	$("#maze-reset").click(function(){
		pjs.reset();
	});
	
	$(".maze-dimension").change(setCanvasSize);
	
	//$(".maze-color").change(setColors);
});

function getPjsInstance(){
	pjs = Processing.getInstanceById("maze-canvas");
	if(pjs == null)
		setTimeout(getPjsInstance, 250);
};

function setCanvasSize(){
	var width = $("#maze-width").val();
	var height = $("#maze-height").val();
	var size = $("#maze-pixels").val();
	pjs.redimension(width, height, size);
	
	$("#maze-canvas").attr({
		"width" : (width * size) + 1,
		"height" : (height * size) + 1
	});
	
	console.log((width * size) + 1, (height * size) + 1);
	pjs.reset();
};

/*function setColors(){
	var colorBg = $("#maze-background-color").val();
	var colorBg2 = $("#maze-background2-color").val();
	var colorActual = $("#maze-posActual-color").val();
	var colorLinea = $("#maze-line-color").val();
	pjs.setHexColors(colorBg, colorBg2, colorActual, colorLinea);
};*/
var pjs;

$(document).ready(function(){
	getPjsInstance();
	
	$("#wolfram-test").click(function(){
		//console.log(":)");
		pjs.test();
	});
	
	$("#wolfram-run").click(function(){
		pjs.play();
		$(this).hide();
		$("#wolfram-pause").show();
	});
	
	$("#wolfram-pause").click(function(){
		pjs.pause();
		$(this).hide();
		$("#wolfram-run").show();
	});
	
	$("#wolfram-step").click(function(){
		pjs.step();
	});
	
	$("#wolfram-reset").click(function(){
		pjs.reset();
	});
	
	$(".wolfram-dimension").change(function(){
		var width = $("#wolfram-width").val(), limit = $("#wolfram-limit").val(), size = $("#wolfram-pixels").val();
		pjs.redimension(width, limit, size);
		$("#canvas-wolfram").attr({
			"width" : (width * size) + 1,
			"height" : (limit * size) + 1
		});
		pjs.reset();
	});
	
	$("#wolfram-live-color").change(function(){
		pjs.setHexLiveColor($("#wolfram-live-color").val());
	});
	
	$("#wolfram-dead-color").change(function(){
		pjs.setHexDeadColor($("#wolfram-dead-color").val());
	});
	
	$("#wolfram-line-color").change(function(){
		pjs.setHexLineColor($("#wolfram-line-color").val());
	});
	
	$("#wolfram-rule").change(function(){
		pjs.setRule($("#wolfram-rule").val());
	});
});

function getPjsInstance(){
	pjs = Processing.getInstanceById("canvas-wolfram");
	if(pjs == null)
		setTimeout(getPjsInstance, 250);
};

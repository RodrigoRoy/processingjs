var pjs;

$(document).ready(function(){
	getPjsInstance();
	$("#genetico-log").html(pjs.getLog());
	$("#probabilidad-text").text("Probabilidad de mutación (" + $("#genetico-mutacion").val() + ")");
	
	$("#genetico-reset").click(function(){
		pjs.reset();
		$("#genetico-log").html(pjs.getLog());
	});
	
	$("#genetico-queen").change(function(){
		pjs.reset();
		pjs.setPixels($("#genetico-pixels").val(), ($("#genetico-queen").val() * $("#genetico-pixels").val()) + 1, ($("#genetico-queen").val() * $("#genetico-pixels").val()) + 1);
		$("#genetico-log").html(pjs.getLog());
	});
	
	$("#genetico-pixels").change(function(){
		pjs.setPixels($("#genetico-pixels").val(), ($("#genetico-queen").val() * $("#genetico-pixels").val()) + 1, ($("#genetico-queen").val() * $("#genetico-pixels").val()) + 1);
	});
	
	$("#genetico-mutacion").change(function(){
		$("#probabilidad-text").text("Probabilidad de mutación (" + $("#genetico-mutacion").val() + "%)");
	});
});

function getPjsInstance(){
	pjs = Processing.getInstanceById("genetico-canvas");
	if(pjs == null)
		setTimeout(getPjsInstance, 250);
};

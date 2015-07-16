var pjs;

$(document).ready(function(){
	getPjsInstance();
	
	$("#kmeans-run").click(function(){
		pjs.play();
		$(this).hide();
		$("#kmeans-pause").show();
	});
	
	$("#kmeans-pause").click(function(){
		pjs.pause();
		$(this).hide();
		$("#kmeans-run").show();
	});
	
	$("#kmeans-step").click(function(){
		pjs.step();
	});
	
	$("#kmeans-reset").click(function(){
		pjs.reset();
	});
	
	$("#kmeans-total-means").change(function(){
		pjs.reset();
	});
	
	$("#kmeans-add-point").click(function(){
		pjs.addPoint();
	});
	
	$("#kmeans-add-mean").click(function(){
		pjs.addMean();
	});
	
	//$("#kmeans-background-color").change(function(){
	$(".kmeans-color").change(function(){
		pjs.setBackgroundColor($("#kmeans-background-color").val(), $("#kmeans-background-transparency").val());
	});
	
});

function getPjsInstance(){
	pjs = Processing.getInstanceById("kmeans-canvas");
	if(pjs == null)
		setTimeout(getPjsInstance, 250);
};

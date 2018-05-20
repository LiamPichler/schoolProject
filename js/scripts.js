$(document).ready(function(){

	// Start the game
	$("#start").on("click",function () {
	    $("#splashScreen").toggle();
	    main();
	});

	$("#replay").on("click",function () {
		location.reload();
	});

});

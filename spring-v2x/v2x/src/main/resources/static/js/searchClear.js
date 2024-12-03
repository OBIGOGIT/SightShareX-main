$(document).ready(function() {

	$("#btn_clear").click(function(){
		$.goUrl($(location).attr('pathname'));
	});

});
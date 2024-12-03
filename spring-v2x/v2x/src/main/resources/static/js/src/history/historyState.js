var obigoHistory = (function() {
	
	var page = 0;
	var title = '';
	var url = '';
	var init = true;
	
	function initHistory(pageNo,t,u) {
		
		var data = { 'page': pageNo};
		title = t;
		url  = u;
		history.pushState(data,t, u);
	}
	
	function backHistory(fuc,arg) {
		mergeFunction = fuc;
		$(window).bind("popstate", function(event) {
		    var data = event.originalEvent.state;
		    if(data){ 
		    	mergeFunction(arg);
//		    	event.originalEvent.state = null;
		    }
		    else{
		        $(location).attr('href', "/");
		    }
		})
	}
	
	function mergeFunction() {}
	
	
	return {
		"init" : initHistory,
		"back":backHistory
	}
	
	
	
})();
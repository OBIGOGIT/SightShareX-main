	//-----------------------------------------------
	// AJAX
	var ajax = {};
	ajax.x = function () {
	    if (typeof XMLHttpRequest !== 'undefined') {
	        return new XMLHttpRequest();
	    }
	    var versions = [
	        "MSXML2.XmlHttp.6.0",
	        "MSXML2.XmlHttp.5.0",
	        "MSXML2.XmlHttp.4.0",
	        "MSXML2.XmlHttp.3.0",
	        "MSXML2.XmlHttp.2.0",
	        "Microsoft.XmlHttp"
	    ];
	
	    var xhr;
	    for (var i = 0; i < versions.length; i++) {
	        try {
	            xhr = new ActiveXObject(versions[i]);
	            break;
	        } catch (e) {
	        }
	    }
	    return xhr;
	};
	
	ajax.send = function (url, callback, method, data, async, loader_id) {
	    if ( async === undefined ) {
	        async = true;
	    }
	    
	    if ( async && loader_id !== undefined ) {
	    	document.getElementById(loader_id).style.display = 'block';
	    }
	    
	    var x = ajax.x();
	    x.open(method, url, async);
	    x.onreadystatechange = function () {
	        if ( x.readyState == 4 ) {
	            callback(x.responseText)
	            
			    if ( async && loader_id !== undefined ) {
			    	document.getElementById(loader_id).style.display = 'none';
			    }
	        }
	    };
	    
	    if ( method == 'POST' ) {
	        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	    }
	    else if ( method == 'GET_REST' ) {
	    	//x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	    	
	        x.setRequestHeader( "Access-Control-Allow-Origin", "*" );
	        x.setRequestHeader( "Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS" );
	        x.setRequestHeader( "Access-Control-Max-Age", "3628800");
	        x.setRequestHeader( "Access-Control-Allow-Headers", "Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization" );	    	
	    }
	    	    
	    
	    x.send(data)
	};
	
	ajax.get = function (url, data, callback, async, loader_id) {
	    var query = [];
	    for (var key in data) {
	        //query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key])); // URL 인코딩
	        query.push( key + '=' + data[key] );
	    }
	    
	    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async, loader_id)
	};
	
	ajax.getRest = function (url, data, callback, async, loader_id) {
	    var query = [];
	    for (var key in data) {
	        //query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key])); // URL 인코딩
	        query.push( key + '=' + data[key] );
	    }
	    
	    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET_REST', null, async, loader_id)
	};	
	
	ajax.post = function (url, data, callback, async, loader_id) {
	    var query = [];
	    
	    for ( var key in data ) {
	        //query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key])); // URL 인코딩
	        query.push( key + '=' + data[key] );
	    }
	    
	    queryString = query.join('&');
	    console.log( queryString );
	    ajax.send(url, callback, 'POST', queryString, async, loader_id)
	};
	/* ria : csrf code append */

	$.ajaxSetup({
	    beforeSend: function(xhr) {
	    	xhr.setRequestHeader(document.head.querySelector("[name=_csrf_header]").content, document.head.querySelector("[name=_csrf]").content);
	    }
	});


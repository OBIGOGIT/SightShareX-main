/* document-ready */
$(document).ready(function() {
	//document.oncontextmenu = new Function('return false'); 	// context menu 막기
	document.ondragstart = new Function('return false');	// drag and drop 막기
	//document.onselectstart = new Function('return false');	// 문자 선택 막기

	/*
	var agent = navigator.userAgent.toLowerCase();
	var name = navigator.appName;
	if ( (name == 'Netscape' && agent.search("trident") != -1) || (agent.indexOf("msie") != -1) || agent.indexOf('edge/') != -1 ) { // browser 막기 
	// if (agent.indexOf("msie") != -1 ) {
		alert('Current browser is not supported.\nPlease, try Chrome, Safiri, Firefox browser.');
		top.window.opener = top;
		top.window.open('','_parent', '');
		top.window.close();
	}
	*/
});

$.goUrl = function(url) {
	$("#dim").fadeIn();
	$(location).attr('href', url);
};

// bootstrp datepicker info url : https://programmer93.tistory.com/5
// datePicker
$.getdatepicker = function(id) {
	$( "#"+id ).datepicker({
		format: "yyyy-mm-dd",// 텍스트 필드에 입력되는 날짜 형식.
		autoclose: true,
		todayHighlight : true,
	});
	$( "#"+id ).datepicker('show');
};

// getdatetimepicker
$.getdatetimepicker = function(id) {
    $( "#"+id ).datetimepicker({
    	format: "yyyy-mm-dd hh:ii"
	});
	$( "#"+id ).datetimepicker('show');
};

$.detailUrl= function(url) {
	var urlparts= url.split('?');
	var listUrl =   $(location).attr('pathname')+$(location).attr('search');
	var backUrl = "backUrl="+encodeURIComponent(listUrl);

    if (urlparts.length>=2) {
    	return url + "&" + backUrl;
    } else {
    	return url + "?" + backUrl
    }
}

$.subDetailUrl = function(url) {
	var urlparts = url.split('?');
	var listUrl  = $(location).attr('pathname')+$(location).attr('search');
	var subBackUrl = "subBackUrl="+encodeURIComponent(listUrl);
	var backUrl = "backUrl="+$.getUrlParameter("backUrl");

    if ( urlparts.length >= 2 ) {
    	return url + "&" + backUrl + "&" + subBackUrl;
    } else {
    	return url + "?" + backUrl + "&" + subBackUrl;
    }
}

$.getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL =$(location).attr('search').substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if ( sParameterName[0] == sParam ) {
            return sParameterName[1];
        }
    }
};

$.getRemoveParams= function(url, parameters) {
    var urlparts= url.split('?');
    if ( urlparts.length >= 2 ) {

    	var pars = urlparts[1].split(/[&;]/g);
    	for ( var j = 0 ; j < parameters.length ; j++ ) {
	        var prefix= encodeURIComponent(parameters[j])+'=';

	        //reverse iteration as may be destructive
	        for ( var i = pars.length ; i-- > 0 ; ) {
	            //idiom for string.startsWith
	            if ( pars[i].lastIndexOf(prefix, 0) !== -1 ) {
	                pars.splice(i, 1);
	            }
	        }
    	}
    	
    	if ( $.isBlank(pars.join('&')) ) {
    		url = "";
    	} else {
    		url = urlparts[0]+'?'+pars.join('&');
    	}
        return url;
    } else {
        return url;
    }
};

$.isBlank = function(obj){
	return(!obj || $.trim(obj) == "");
};


$.custom_alert = function( title, msg ) {

	$("#myModal").modal({
		"backdrop"  : "static",
		"keyboard"  : true,
		"show"      : true
	});

	$("#myModalLabel").text(title);
	$("#modalMsgArea").text(msg);
	$("#btnModalOk").remove();
}

$.showKeyCode = function(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;

	console.log(keyID);

	if ( ( keyID >=48 && keyID <= 57 ) || ( keyID >=96 && keyID <= 105 )
		 || (keyID == 190) || (keyID == 110) || (keyID == 13) || (keyID == 86) || (keyID == 8) ) {
		return;
	}
	else {
		return false;
	}
}

/*
 *
 * 같은 값이 있는 열을 병합함
 *
 * 사용법 : $('#테이블 ID').rowspan(0);
 *
 */
$.fn.rowspan = function(colIdx, isStats) {
    return this.each(function(){
        var that;
        $('tr', this).each(function(row) {
            $('td',this).eq(colIdx).filter(':visible').each(function(col) {

                if ($(this).html() == $(that).html()
                    && (!isStats
                            || isStats && $(this).prev().html() == $(that).prev().html()
                            )
                    ) {
                    rowspan = $(that).attr("rowspan") || 1;
                    rowspan = Number(rowspan)+1;

                    $(that).attr("rowspan",rowspan);

                    // do your action for the colspan cell here
                    $(this).hide();

                    //$(this).remove();
                    // do your action for the old cell here

                } else {
                    that = this;
                }

                // set the that if not already set
                that = (that == null) ? this : that;
            });
        });
    });
};


/*
 *
 * 같은 값이 있는 행을 병합함
 *
 * 사용법 : $('#테이블 ID').colspan (0);
 *
 */
$.fn.colspan = function(rowIdx) {
	return this.each(function() {
		var that;
		$('tr', this).filter(":eq("+rowIdx+")").each(function(row) {
			$(this).find('td').filter(':visible').each(function(col) {
				if ( $(this).html() == $(that).html() ) {
					colspan = $(that).attr("colSpan");
					if ( colspan == undefined ) {
						$(that).attr("colSpan",1);
						colspan = $(that).attr("colSpan");
					}
					colspan = Number(colspan) + 1;
					$(that).attr("colSpan",colspan);
					$(this).hide(); // .remove();
				} else {
			        that = this;
				}
			      
			      that = (that == null) ? this : that; // set the that if not already set
			});
		});
	});
}

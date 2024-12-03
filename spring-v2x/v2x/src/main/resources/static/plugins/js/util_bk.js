var Log = {
	debug : true,

	/*
	 * Log.d(logData1, logData2, ...)
	 *  --> console.log( getLogHead(), logData1, logData2, ...)
	 * 
	 * @comment Using bind and property accesser
	 * @see http://ejohn.org/blog/javascript-getters-and-setters/
	 */
	get d() {
		if ( !this.debug ) return this._emptyFunc;
		return console.log.bind( console, this._getLogHeader() );
	},

	/*
	 * output error info
	 */
	get e() { 
		return console.error.bind( console, this._getLogHeader() );
	},

	/**
	 * get current time in 01/31 23:59:59.999 format
	 */
	_getLogHeader : function () {

		var millisec = Date.now();
		this._dtNow.setTime( millisec );
		//toLocaleString is 2013/01/31 23:59:59
		return '[' + this._dtNow.toLocaleString().slice( 5 ) + '.' + ('000' + millisec).slice( -3 ) + '] ';
		//return this._dtNow.toLocaleString() + '.' + ('000' + millisec).slice( -3 ) + ' ';
	},
	_dtNow: new Date(),
	_emptyFunc: function() {}
};

function getVal( id ) {
	if ( typeof id !== 'string' || !id instanceof String ) {
		//console.log( arguments.callee.name + " : 문자열이 아닙니다." );
		//console.log( arguments.callee.caller.toString() );
		return "";
	}
	// test
	return document.getElementById(id).value.trim();
}

function getID( id ) {
	if ( typeof id !== 'string' || !id instanceof String ) {
		//console.log( arguments.callee.name + " : 문자열이 아닙니다." );
		return null;
	}
	return document.getElementById(id);
}

function getCLS( cls ) {
	if ( typeof cls !== 'string' || !cls instanceof String ) {
		//console.log( arguments.callee.name + " : 문자열이 아닙니다." );
		return null;
	}
	return document.getElementsByClassName(cls);
}

function mvNew( strUrl ) {
	window.open(strUrl, '_blank');
}

function mv( url ) {
	window.location.href = url;	
}

// 체크 박스 모두 선택/선택해제
function selectAll( objSource, strTargetTagName ) {
	checkboxes = document.getElementsByName( strTargetTagName );
	for ( var i = 0 ; i < checkboxes.length ; i++ ) {
		if ( !checkboxes[i].disabled )
			checkboxes[i].checked = objSource.checked;
	}
}

// 현재 체크 박스가 모두 선택되었는지 확인
function monitorSelectAll( strChkItemName, strChkAllID ) {
	event.stopPropagation(); // 이벤트 전파를 차단한다.
	console.log('monitorSelectAll() -> ' + strChkItemName + ", " + strChkAllID );
	
	checkboxes = document.getElementsByName( strChkItemName );
	var iChkCount = 0;
	var iChkDisabledCount = 0;
	for ( var i = 0 ; i < checkboxes.length ; i++ ) {
		//console.log(checkboxes[i].checked)
		if ( checkboxes[i].checked && !checkboxes[i].disabled )
			iChkCount++;
		
		if ( checkboxes[i].disabled ) {
			iChkDisabledCount++;
		}
	}
	console.log('monitorSelectAll() -> iChkCount : ' + iChkCount );
	var target = document.getElementById( strChkAllID );
	console.log('monitorSelectAll() -> target : ' + target.checked );
	if ( iChkCount == 0 ) {
		target.checked = false;
	}
	else if ( iChkCount == (checkboxes.length - iChkDisabledCount) ) {
		target.checked = true;
	}
}

function anchor_disable( objAnchor, bStatus ) {
	if ( bStatus == true ) {
		objAnchor.style.pointerEvents = "none";
		objAnchor.style.cursor = "default";
		objAnchor.style.opacity = "0.5";
		objAnchor.disabled = true; // for IE
	}
	else {
		objAnchor.style.pointerEvents = "auto";
		objAnchor.style.cursor = "pointer";
		objAnchor.style.opacity = "1";
		objAnchor.disabled = false;  // for IE
	}
}

function parentWidth( obj ) {
	return obj.parentElement.clientWidth;
}

// Popup.js 의존
function createPopup(strTitle, objSourceDiv) {
	var popup = new Popup();
	popup.autoHide = false;
	popup.title = strTitle;
	popup.ref = popup.ref;
	//popup.content = 'This DIV will not close automatically!<br><br><a href="#" onclick="'+popup.ref+'.hide();return false;">Click here to close</a>';
	popup.objSource = objSourceDiv;
	//popup.width = iWidth;
	//popup.height = iHeight;
	popup.style = {
		'border': '1px solid darkgray',
		'backgroundColor': '#eeeeee',
		'padding': '0px',
		'margin': '0px',
		'border-radius': '4px',
		'box-shadow': '0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)',
	};
	popup.titleBgColor = '#97b7d9';
	
	popup.show({'screenColor':'gray','screenOpacity':.6}, true);
	
	return popup;
}

function createLoginPopup(strTitle, objSourceDiv) {
	var popup = new Popup();
	popup.autoHide = false;
	popup.title = strTitle;
	popup.ref = null; // close 버튼 사용하지 않겠다.
	popup.objSource = objSourceDiv;
	popup.style = {
		'border': '1px solid darkgray',
		'backgroundColor': '#ffffff',
		'padding': '0px',
		'margin': '0px',
		'border-radius': '4px',
		'box-shadow': '0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)',
	};
	popup.titleBgColor = '#94a3b0';
	
	popup.show({'screenColor':'#edf3f8','screenOpacity':1}, true);
	//popup.show({'screenColor':'#ff0000','screenOpacity': 1}, true);
	
	return popup;
}

// 월 증가 / 감소한 날짜 구하기
function getMonthOffsetDate_Str( iMonth ) {
	var today = new Date();
    
	var month = '' + (today.getMonth() +1 + iMonth),
    day = '' + today.getDate(),
    year = today.getFullYear();
	
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;	
    
	return [year, month, day].join('-');
}

function getMonthOffsetDate( iMonth ) {
	var today = new Date();
    
	var month = '' + (today.getMonth() + iMonth),
    day = '' + today.getDate(),
    year = today.getFullYear();
	    
	return new Date(year, month, day);
}

function checkEmail( email ) {
	if ( email == "" )
		return false;
	
	var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	return re.test(email);
}

function checkNumber( number ) {
	if ( number == "" )
		return true;
	
	var re = /^\d+$/;
	return re.test(number); 
}

// cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}
/*
var getSuffix = function(sep, input) {
	return input.split(sep).pop( -1 );
};

var getPreFix = function(sep, input) {
	return input.split(sep, 1);
};
*/

var getTimeStamp = function () {
	let leadingZeros = function(n, digits) {
		var zero = '';
		n = n.toString();

		if ( n.length < digits ) {
			for (i = 0; i < digits - n.length; i++)
				zero += '0';
		}
  		return zero + n;
	}
	
	var d = new Date();

	var s =
	leadingZeros(d.getFullYear(), 4) + '-' +
	leadingZeros(d.getMonth() + 1, 2) + '-' +
	leadingZeros(d.getDate(), 2) + ' ' +
	
	leadingZeros(d.getHours(), 2) + ':' +
	leadingZeros(d.getMinutes(), 2) + ':' +
	leadingZeros(d.getSeconds(), 2);

	return s;
};

let showHide = function(id, bShowHide) {
	let val = '';
	if ( !bShowHide ) val = 'none' 
	document.getElementById(id).style.display = val;
};

let rmOpt = function (id) {
    let select = document.getElementById(id);
    select.options[select.selectedIndex] = null;
};

let setSelectItem = function(id, v) {
    let s = document.getElementById(id);
    s.options[s.selectedIndex].innerText = v;
};

let rmSelectedOpts = function (id) {
    let select = document.getElementById(id);
    let len = select.options.length;
    while ( len-- ) {
    	if ( select.options[len].selected ) {
    		select.options[len] = null;
    	}
    }
};

let selectToArray = function (id) {
	let r = []; // {text: '', value: ''}
    let select = document.getElementById(id);
    
    let len = select.options.length;
    for ( let i = 0 ; i < len ; i++ ) {
    	r.push({value: select.options[i].value, text: select.options[i].innerText});
    }
    return r;
};

let rmAllOpts = function (id) {
    var select = document.getElementById(id);
    select.options.length = 0;
};

let getSelectedText = function(id) {
    var elt = document.getElementById(id);

    if ( elt.selectedIndex == -1 )
        return null;

    return elt.options[elt.selectedIndex].text;
};

let selectCount = function ( id ) {
	return  document.getElementById(id).options.length;
};

let isSelectVal = function ( strSelectID, val ) {
	let IsExists = false;
	let ddloption =  document.getElementById(strSelectID).options;
	let len = ddloption.length;
	for ( let i = 0 ; i < len ; i++ ) {
		if ( ddloption[i].value === val ) {
			IsExists = true;
			break;
		}
	}
	return IsExists;
};

let isSelectTxt = function ( strSelectID, val ) {
	let IsExists = false;
	let ddloption =  document.getElementById(strSelectID).options;
	let len = ddloption.length;
	for ( let i = 0 ; i < len ; i++ ) {
		if ( ddloption[i].innerText === val ) {
			IsExists = true;
			break;
		}
	}
	return IsExists;
};

let queryString = function (name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

let leadingZeros = function(n, digits) {
	var zero = '';
	n = n.toString();

	if ( n.length < digits ) {
		for (i = 0; i < digits - n.length; i++)
			zero += '0';
	}
	  return zero + n;
};

//return format : YYYY-MM-DD hh:mm:ss
let utcToLoc = function ( strDateTime ) {
  	let d = new Date(strDateTime); // utc -> local
	// var d = new Date();

	let s =
	leadingZeros(d.getFullYear(), 4) + '-' +
	leadingZeros(d.getMonth() + 1, 2) + '-' +
	leadingZeros(d.getDate(), 2) + ' ' +
	
	leadingZeros(d.getHours(), 2) + ':' +
	leadingZeros(d.getMinutes(), 2) + ':' +
	leadingZeros(d.getSeconds(), 2);

	return s;
};

let utcToLocDate = function ( strDateTime ) {
	let d = new Date(strDateTime); // utc -> local
	let s =	leadingZeros(d.getFullYear(), 4) + '-' +
	leadingZeros(d.getMonth() + 1, 2) + '-' +
	leadingZeros(d.getDate(), 2);
	
	return s;
};

/*
let dt = strToDatetime("22/03/2016 14:03:01", "dd/mm/yyyy hh:ii:ss");
let dt = strToDatetime("2016-03-29 18:30:00", "yyyy-mm-dd hh:ii:ss");
*/
let strToDatetime = function(strInput, format) { 
	let normalized      = strInput.replace(/[^a-zA-Z0-9]/g, '-');
	let normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
	let formatItems     = normalizedFormat.split('-');
	let dateItems       = normalized.split('-');
	
	let monthIndex  = formatItems.indexOf("mm");
	let dayIndex    = formatItems.indexOf("dd");
	let yearIndex   = formatItems.indexOf("yyyy");
	let hourIndex     = formatItems.indexOf("hh");
	let minutesIndex  = formatItems.indexOf("ii");
	let secondsIndex  = formatItems.indexOf("ss");
	
	let today = new Date();
	
	let year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
	let month = monthIndex>-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
	let day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();
	
	let hour    = hourIndex>-1      ? dateItems[hourIndex]    : today.getHours();
	let minute  = minutesIndex>-1   ? dateItems[minutesIndex] : today.getMinutes();
	let second  = secondsIndex>-1   ? dateItems[secondsIndex] : today.getSeconds();
	
	return new Date(year, month, day, hour, minute, second);
};

var timestampToStr = function( ts ){
	let a = new Date(ts);
	let year = a.getFullYear();
	let month = a.getMonth()+1;
	let d = a.getDate();
	let h = a.getHours();
	let m = a.getMinutes();
	let s = a.getSeconds();
	//let time = d + ' ' + month + ' ' + year + ' ' + h + ':' + m + ':' + s;
	let time = year + '-' + month + '-' + d + ' ' + h + ':' + m + ':' + s;
	return time;
}

let locToUtc = function (strLocalDateTime) {
	if ( strLocalDateTime == "" )
		return "";
	return strToDatetime(strLocalDateTime, "yyyy-mm-dd hh:ii:ss").toISOString();
};

let hFS = function ( bytes ) {
	var si = true;
    var thresh = si ? 1000 : 1024;
    if ( Math.abs(bytes) < thresh ) {
        return bytes + ' B';
    }
    var units = si
    ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
    : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    
    return bytes.toFixed(1)+' '+units[u];
};

let sha256 = function (ascii) {
	if (ascii == '') return '';
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j;
    var result = ''
    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    ascii += '\x80'
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00'
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return;
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)    
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16);
        var oldHash = hash;
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            var w15 = w[i - 15], w2 = w[i - 2];
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                + ((e&hash[5])^((~e)&hash[6]))
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3))
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10))
                    )|0
                );
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
            
            hash = [(temp1 + temp2)|0].concat(hash);
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

var modalAlert = function(ct) {
	bootbox.alert({
		title: 'Information !',
	    message: ct,
	    size: 'small', 
	    buttons: {
	    	ok: {
	    		label: 'OK',
	    		className: 'btn-primary'
	    	}
	    },
	    callback: function(result) {
	    	console.log('msg result:' + result);
	    }
	});
};

var modalAlertLink = function(ct, link) {
	bootbox.alert({
		title: 'Information !',
	    message: ct,
	    size: 'small', 
	    buttons: {
	    	ok: {
	    		label: 'OK',
	    		className: 'btn-primary'
	    	}
	    },
	    callback: function(result) {
	    	// console.log('msg result:' + result);
	    	mv(link);
	    }
	});
};
var scrollSave=function(id){localStorage.setItem(id,document.documentElement.scrollTop);};
var scrollRestore=function(id){var p=localStorage.getItem(id,0);if(p)document.documentElement.scrollTop=p;};

var syntaxHighlight = function( strJson ) {
	try {
		strJson = JSON.stringify( JSON.parse( strJson ), undefined, 2 ); // 들여 쓰기 처리
		
		strJson = strJson.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
	    return strJson.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
	        var cls = 'number';
	        if (/^"/.test(match)) {
	            if (/:$/.test(match)) {
	                cls = 'key';
	            } else {
	                cls = 'string';
	            }
	        } else if (/true|false/.test(match)) {
	            cls = 'boolean';
	        } else if (/null/.test(match)) {
	            cls = 'null';
	        }
	        return '<span class="' + cls + '">' + match + '</span>';
	    });
	} catch (e) {
		alert(e);
		
		return "";
	}
};

var validJSON = function(input) {
	try {
		JSON.parse( input );
	} catch (e) {
		modalAlert('JSON is invalid format.');
		return false;
	}	
	return true;
};

let guid=function() {function s4() {return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);}
return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();};

let getTimestampBySec=function(){return Math.floor(+ new Date()/1000);}
let getTimestamp=function(){return Math.floor(+ new Date());}

//this is for IE
if ( !window.URLSearchParams ) {
    window.URLSearchParams = function URLSearchParams() {
        this.params = {};
    };
    window.URLSearchParams.prototype = {
        set: function (key, value) {
            this.params[key] = value;
        },
        append: function (key, value) {
            this.params[key] = value;
        },        
        get: function (key) {
            return this.params[key];
        },
        has: function (key) {
            return this.params.hasOwnProperty(key);
        },
        delete: function (key) {
            delete this.params[key];
        },
        toString: function () {
            return Object.keys(this.params).map(function (param) {
                return param + '=' + encodeURIComponent(this.params[param]);
            }, this).join('&');
        },
    };
}

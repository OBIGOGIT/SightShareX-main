var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.Symbol=function(){var a=0;return function(b){return $jscomp.SYMBOL_PREFIX+(b||"")+a++}}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};
$jscomp.initSymbolAsyncIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.asyncIterator;a||(a=$jscomp.global.Symbol.asyncIterator=$jscomp.global.Symbol("asyncIterator"));$jscomp.initSymbolAsyncIterator=function(){}};$jscomp.arrayIterator=function(a){var b=0;return $jscomp.iteratorPrototype(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.iteratorFromArray=function(a,b){$jscomp.initSymbolIterator();a instanceof String&&(a+="");var c=0,e={next:function(){if(c<a.length){var d=c++;return{value:b(d,a[d]),done:!1}}e.next=function(){return{done:!0,value:void 0}};return e.next()}};e[Symbol.iterator]=function(){return e};return e};
$jscomp.polyfill=function(a,b,c,e){if(b){c=$jscomp.global;a=a.split(".");for(e=0;e<a.length-1;e++){var d=a[e];d in c||(c[d]={});c=c[d]}a=a[a.length-1];e=c[a];b=b(e);b!=e&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};$jscomp.polyfill("Array.prototype.keys",function(a){return a?a:function(){return $jscomp.iteratorFromArray(this,function(a){return a})}},"es6","es3");
var Log={debug:0,get d(){return this.debug?console.log.bind(console,this._getLogHeader()):this._emptyFunc},get e(){return console.error.bind(console,this._getLogHeader())},_getLogHeader:function(){var a=Date.now();this._dtNow.setTime(a);return"["+this._dtNow.toLocaleString().slice(5)+"."+("000"+a).slice(-3)+"] "},_dtNow:new Date,_emptyFunc:function(){}};
window.URLSearchParams||(window.URLSearchParams=function(){this.params={}},window.URLSearchParams.prototype={set:function(a,b){this.params[a]=b},append:function(a,b){this.params[a]=b},get:function(a){return this.params[a]},has:function(a){return this.params.hasOwnProperty(a)},delete:function(a){delete this.params[a]},toString:function(){return Object.keys(this.params).map(function(a){return a+"="+encodeURIComponent(this.params[a])},this).join("&")}});
function getVal(a){return"string"!==typeof a||!a instanceof String?"":document.getElementById(a).value.trim()}function getID(a){return"string"!==typeof a||!a instanceof String?null:document.getElementById(a)}function getCLS(a){return"string"!==typeof a||!a instanceof String?null:document.getElementsByClassName(a)}function mvNew(a){window.open(a,"_blank")}function mv(a){window.location.href=a}
function selectAll(a,b){checkboxes=document.getElementsByName(b);for(b=0;b<checkboxes.length;b++)checkboxes[b].disabled||(checkboxes[b].checked=a.checked)}
function monitorSelectAll(a,b){event.stopPropagation();console.log("monitorSelectAll() -> "+a+", "+b);checkboxes=document.getElementsByName(a);for(var c=a=0,e=0;e<checkboxes.length;e++)checkboxes[e].checked&&!checkboxes[e].disabled&&a++,checkboxes[e].disabled&&c++;console.log("monitorSelectAll() -> iChkCount : "+a);b=document.getElementById(b);console.log("monitorSelectAll() -> target : "+b.checked);0==a?b.checked=!1:a==checkboxes.length-c&&(b.checked=!0)}
function anchor_disable(a,b){1==b?(a.style.pointerEvents="none",a.style.cursor="default",a.style.opacity="0.5",a.disabled=!0):(a.style.pointerEvents="auto",a.style.cursor="pointer",a.style.opacity="1",a.disabled=!1)}function parentWidth(a){return a.parentElement.clientWidth}
function createPopup(a,b){var c=new Popup;c.autoHide=!1;c.title=a;c.ref=c.ref;c.objSource=b;c.style={border:"1px solid darkgray",backgroundColor:"#eeeeee",padding:"0px",margin:"0px","border-radius":"4px","box-shadow":"0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)"};c.titleBgColor="#97b7d9";c.show({screenColor:"gray",screenOpacity:.6},!0);return c}
function createLoginPopup(a,b){var c=new Popup;c.autoHide=!1;c.title=a;c.ref=null;c.objSource=b;c.style={border:"1px solid darkgray",backgroundColor:"#ffffff",padding:"0px",margin:"0px","border-radius":"4px","box-shadow":"0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)"};c.titleBgColor="#94a3b0";c.show({screenColor:"#edf3f8",screenOpacity:1},!0);return c}
function getMonthOffsetDate_Str(a){var b=new Date;a=""+(b.getMonth()+1+a);var c=""+b.getDate();b=b.getFullYear();2>a.length&&(a="0"+a);2>c.length&&(c="0"+c);return[b,a,c].join("-")}function getMonthOffsetDate(a){var b=new Date;a=""+(b.getMonth()+a);var c=""+b.getDate();b=b.getFullYear();return new Date(b,a,c)}function checkEmail(a){return""==a?!1:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)}
function checkNumber(a){return""==a?!0:/^\d+$/.test(a)}function setCookie(a,b,c){var e=new Date;e.setTime(e.getTime()+864E5*c);c="expires="+e.toUTCString();document.cookie=a+"="+b+";"+c+";path=/"}function getCookie(a){a+="=";for(var b=document.cookie.split(";"),c=0;c<b.length;c++){for(var e=b[c];" "==e.charAt(0);)e=e.substring(1);if(0==e.indexOf(a))return e.substring(a.length,e.length)}return""}
function checkCookie(){var a=getCookie("username");""!=a?alert("Welcome again "+a):(a=prompt("Please enter your name:",""),""!=a&&null!=a&&setCookie("username",a,365))}
var getSuffix=function(a,b){return b.split(a).pop(-1)},getPreFix=function(a,b){return b.split(a,1)},getTimeStamp=function(){var a=function(a,b){var c="";a=a.toString();if(a.length<b)for(i=0;i<b-a.length;i++)c+="0";return c+a},b=new Date;return a(b.getFullYear(),4)+"-"+a(b.getMonth()+1,2)+"-"+a(b.getDate(),2)+" "+a(b.getHours(),2)+":"+a(b.getMinutes(),2)+":"+a(b.getSeconds(),2)},showHide=function(a,b){var c="";b||(c="none");document.getElementById(a).style.display=c},rmOpt=function(a){a=document.getElementById(a);
a.options[a.selectedIndex]=null},setSelectItem=function(a,b){a=document.getElementById(a);a.options[a.selectedIndex].innerText=b},rmSelectedOpts=function(a){a=document.getElementById(a);for(var b=a.options.length;b--;)a.options[b].selected&&(a.options[b]=null)},selectToArray=function(a){var b=[];a=document.getElementById(a);for(var c=a.options.length,e=0;e<c;e++)b.push({value:a.options[e].value,text:a.options[e].innerText});return b},rmAllOpts=function(a){document.getElementById(a).options.length=
0},getSelectedText=function(a){a=document.getElementById(a);return-1==a.selectedIndex?null:a.options[a.selectedIndex].text},selectCount=function(a){return document.getElementById(a).options.length},isSelectVal=function(a,b){var c=!1;a=document.getElementById(a).options;for(var e=a.length,d=0;d<e;d++)if(a[d].value===b){c=!0;break}return c},isSelectTxt=function(a,b){var c=!1;a=document.getElementById(a).options;for(var e=a.length,d=0;d<e;d++)if(a[d].innerText===b){c=!0;break}return c},queryString=function(a){return(a=
RegExp("[?&]"+a+"=([^&]*)").exec(window.location.search))&&decodeURIComponent(a[1].replace(/\+/g," "))},leadingZeros=function(a,b){var c="";a=a.toString();if(a.length<b)for(i=0;i<b-a.length;i++)c+="0";return c+a},utcToLoc=function(a){a=new Date(a);return leadingZeros(a.getFullYear(),4)+"-"+leadingZeros(a.getMonth()+1,2)+"-"+leadingZeros(a.getDate(),2)+" "+leadingZeros(a.getHours(),2)+":"+leadingZeros(a.getMinutes(),2)+":"+leadingZeros(a.getSeconds(),2)},utcToLocDate=function(a){a=new Date(a);return leadingZeros(a.getFullYear(),
4)+"-"+leadingZeros(a.getMonth()+1,2)+"-"+leadingZeros(a.getDate(),2)},strToDatetime=function(a,b){a=a.replace(/[^a-zA-Z0-9]/g,"-");var c=b.toLowerCase().replace(/[^a-zA-Z0-9]/g,"-").split("-");b=a.split("-");var e=c.indexOf("mm"),d=c.indexOf("dd"),m=c.indexOf("yyyy"),h=c.indexOf("hh");a=c.indexOf("ii");c=c.indexOf("ss");var g=new Date;m=-1<m?b[m]:g.getFullYear();e=-1<e?b[e]-1:g.getMonth()-1;d=-1<d?b[d]:g.getDate();h=-1<h?b[h]:g.getHours();a=-1<a?b[a]:g.getMinutes();b=-1<c?b[c]:g.getSeconds();return new Date(m,
e,d,h,a,b)},locToUtc=function(a){return""==a?"":strToDatetime(a,"yyyy-mm-dd hh:ii:ss").toISOString()},hFS=function(a){if(1E3>Math.abs(a))return a+" B";var b="kB MB GB TB PB EB ZB YB".split(" "),c=-1;do a/=1E3,++c;while(1E3<=Math.abs(a)&&c<b.length-1);return a.toFixed(1)+" "+b[c]},sha256=function(a){function b(a,b){return a>>>b|a<<32-b}if(""==a)return"";for(var c=Math.pow,e=c(2,32),d,m="",h=[],g=8*a.length,f=sha256.h=sha256.h||[],p=sha256.k=sha256.k||[],l=p.length,n={},k=2;64>l;k++)if(!n[k]){for(d=
0;313>d;d+=k)n[d]=k;f[l]=c(k,.5)*e|0;p[l++]=c(k,1/3)*e|0}for(a+="\u0080";a.length%64-56;)a+="\x00";for(d=0;d<a.length;d++){c=a.charCodeAt(d);if(c>>8)return;h[d>>2]|=c<<(3-d)%4*8}h[h.length]=g/e|0;h[h.length]=g;for(c=0;c<h.length;){a=h.slice(c,c+=16);e=f;f=f.slice(0,8);for(d=0;64>d;d++)l=a[d-15],n=a[d-2],g=f[0],k=f[4],l=f[7]+(b(k,6)^b(k,11)^b(k,25))+(k&f[5]^~k&f[6])+p[d]+(a[d]=16>d?a[d]:a[d-16]+(b(l,7)^b(l,18)^l>>>3)+a[d-7]+(b(n,17)^b(n,19)^n>>>10)|0),g=(b(g,2)^b(g,13)^b(g,22))+(g&f[1]^g&f[2]^f[1]&
f[2]),f=[l+g|0].concat(f),f[4]=f[4]+l|0;for(d=0;8>d;d++)f[d]=f[d]+e[d]|0}for(d=0;8>d;d++)for(c=3;c+1;c--)h=f[d]>>8*c&255,m+=(16>h?0:"")+h.toString(16);return m},modalAlert=function(a){bootbox.alert({title:"Information !",message:a,size:"small",buttons:{ok:{label:"OK",className:"btn-primary"}},callback:function(a){console.log("msg result:"+a)}})},modalAlertLink=function(a,b){bootbox.alert({title:"Information !",message:a,size:"small",buttons:{ok:{label:"OK",className:"btn-primary"}},callback:function(a){mv(b)}})},
scrollSave=function(a){localStorage.setItem(a,document.documentElement.scrollTop)},scrollRestore=function(a){if(a=localStorage.getItem(a,0))document.documentElement.scrollTop=a};

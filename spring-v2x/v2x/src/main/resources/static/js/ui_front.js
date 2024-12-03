// 레이어 팝업
var popup = {
	open : function(elem){
		elem.show();
	},
	close : function(elem){
		elem.hide();
	}
};

// 클래스 추가
function eventAddClass(el, className){
	el.addClass(className);
}
// 클래스 삭제
function eventRemoveClass(el, className){
	el.removeClass(className);
}
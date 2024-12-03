/**
 * 
 * detail page 이동시 리스트 위치 기억
 * 
 */

var page_session = (function() {
	
	
	function getPageListNum() {
		return localStorage.getItem('pageNum');
	}
	
	function setPageListNum(pageNum) {
		localStorage.setItem('pageNum', pageNum);

	}
	function removePageListNum() {
		localStorage.removeItem('pageNum');
	}
	
	
	return {
		
		"getPage":getPageListNum,
		"setPage":setPageListNum,
		"removePage":removePageListNum
	}
	
	
})();
 
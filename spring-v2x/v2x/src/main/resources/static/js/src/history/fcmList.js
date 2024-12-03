const COL_START = 3;

var pageChange = function(p, s) {
    Log.d("pageChange() -> page : ", p, " size: ", s);
    historyList(p);
};

var showJson = function(c) {
	let ret = syntaxHighlight(c);
	if ( ret == "" ) return;
	getID('hist-content').innerHTML = ret; 
	$("#ldModal").modal();
}

var showToken = function(c) {
	getID('hist-content').innerHTML = c;
	$("#ldModal").modal();
}

var historyList = function(page) {
	getID('table-list-body').innerHTML = ''; // clear body data
	
	let params = new URLSearchParams();	
	if (getVal('txtStart').length > 0)
		params.append('start', locToUtc(getVal('txtStart') + ' 00:00:00'));
	else params.append('start', '');
	
	if (getVal('txtEnd').length > 0)
		params.append('end', locToUtc(getVal('txtEnd') + ' 23:59:59'));
	else params.append('end', '');
		
	params.append('curPage', page);  // 1 페이지
	params.append('pageUnit', PAGE_UNIT); // 5 개씩
	
	let target = '/history/fcm/list';
	
	//-----------------------------------------------------
	showHide('table-list', false);
	scrollSave('my-scroll-pos'); // scroll 저장
	
	axios.post(target, params)
	.then( function(response) {
		Log.d('response.data : ', response.data);
		if ( response.data.length <= 0 )
			return;
		
		let result = response.data;
		getID('total-count').innerHTML = result[0].totalcnt;
		//---------------------------------------
		// 1. 테이블 header 만들기 : 처음에 한번만 만들기.
		if ( getID('table-list-head').innerHTML == "" ) {
			let key = Object.getOwnPropertyNames( result[0] );
			// Log.d( key );
			// <tr><th>%s</th></tr>
			let tr = '';
			let th = '';
			for ( let i = COL_START ; i < key.length ; i++ ) {
				//Log.d('key', key[i] );
				if (i==COL_START)
					th += '<th style="text-align: center;">%s</th>'.sprintf(key[i]);
				else
					th += '<th>%s</th>'.sprintf(key[i]);
			}
			tr = '<tr>%s</tr>'.sprintf(th);
			// Log.d( 'header : ', tr );
			getID('table-list-head').innerHTML = tr;
		}

		//---------------------------------------
		// 2. 테이블 body 만들기
		let tr = '';
		let td = '';
		let len = result.length;
		
		for ( let i = 0 ; i < len ; i++ ) {
			let key = Object.getOwnPropertyNames( result[0] );
			for ( let k = COL_START ; k < key.length ; k++ ) {
				// Log.d(result[i][key[k]]);
				if ( k == COL_START ) {
					td += '<td align="center">%s</td>'.sprintf( result[i][key[k]] );
				} else if ( k == key.length-1 ) {
					td += '<td>%s</td>'.sprintf( utcToLoc(result[i][key[k]]) );
				} else if ( key[k] == 'Token' ) {
					td += "<td class='col-xs-2 text' title='%s' onclick='showToken(%s);'><span style='cursor: pointer;'>%s</span></td>".sprintf( result[i][key[k]], JSON.stringify(result[i][key[k]]), result[i][key[k]] );
				} else if ( key[k] == 'Req Body' ) {
					td += "<td class='col-xs-2 text' title='%s' onclick='showJson(%s);'><span style='cursor: pointer;'>%s</span></td>".sprintf( result[i][key[k]], JSON.stringify(result[i][key[k]]), result[i][key[k]] );
				} else if ( key[k] == 'Res Body' ) {
					td += "<td class='col-xs-4 text' title='%s' onclick='showJson(%s);'><span style='cursor: pointer;'>%s</span></td>".sprintf( result[i][key[k]], JSON.stringify(result[i][key[k]]), result[i][key[k]] );
				} else {
					td += '<td>%s</td>'.sprintf( result[i][key[k]] );
				}
			}
			tr += '<tr>%s</tr>'.sprintf(td);
			td = ''; // reset
		}
		getID('table-list-body').innerHTML = tr;
		
		//---------------------------------------
		// 3. 페이지 처리
		let curPage = result[0].page;
		let pageCount = Math.ceil(result[0].totalcnt/PAGE_UNIT);
		Log.d( 'curPage : ', curPage );
		Log.d( 'pageCount : ', pageCount );
		
		if ( typeof Pagination != "undefined" )  {
		    Pagination._pageNum = pageCount; // from server
		    Pagination._initPage = curPage;
		    
	        Pagination.Init(document.getElementById('pagination'), {
	            size: Pagination._pageNum,  // pages size ( 총 페이지 수 )
	            page: Pagination._initPage, // selected page ( 처음 시직시 선택 페이지 번호 )
	            step: 3          // pages before and after current ( 선택 페이지 기준으로 전 후 몇개 까지 표시 할까 )
	        });
		}
		// Log.d( 'Pagination : ', Pagination );
		//-----------------------------------------------------		
		scrollRestore('my-scroll-pos');
		showHide('table-list', true);		
	}).catch(function (error) {
    	Log.d('fcmList() -> error : ', error);
    });
}

//----------------------------------------------------------
// event handler
window.addEventListener('DOMContentLoaded', function() {
    Log.d('DOMContentLoaded() called...');
    historyList( 1 );    
});

getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    historyList( 1 );
};

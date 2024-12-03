const COL_START = 4;

var pageChange = function(p, s) {
    Log.d("pageChange() -> page : ", p, " size: ", s);
    noticeList(p);
};

var noticeD = function(Id) {
	Log.d("noticeD() -> Id : ", Id);
	mv( '/notice/detail.do?seq_no=' + Id );
}

var noticeList = function(page) {
	getID('table-list-body').innerHTML = ''; // clear body data
	
	let params = new URLSearchParams();
	params.append('type', getVal('selNoticeType'));
	
	if ( getID('selStatus') != null )
		params.append('status', getVal('selStatus'));
	
	if ( getID('selCompany') != null )
		params.append('company_id', getVal('selCompany'));	
	
	if (getVal('txtStart').length > 0)
		params.append('startDate', locToUtc(getVal('txtStart') + ' 00:00:00'));
	else params.append('startDate', '');
	
	if (getVal('txtEnd').length > 0)
		params.append('endDate', locToUtc(getVal('txtEnd') + ' 23:59:59'));
	else params.append('endDate', '');
		
	params.append('curPage', page);  // 1 페이지
	params.append('pageUnit', PAGE_UNIT); // 5 개씩
	
	//-----------------------------------------------------
	showHide('table-list', false);
	scrollSave('my-scroll-pos'); // scroll 저장
	
	axios.post('/notice/list', params)
	.then( function(response) {
		Log.d('response.data : ', response.data);
		if ( response.data.length <= 0 )
			return;
		
		let result = response.data;
		//추가
		if ( result.length > 0 )
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
				if (i==COL_START||key[i]=="Status")
					 th += '<th style="text-align: center;">%s</th>'.sprintf(key[i]);
				else th += '<th>%s</th>'.sprintf(key[i]);
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
				
				if ( key[k] == "No" ) { // row
					td += '<td align="center">%s</td>'.sprintf( result[i][key[k]] );
				} else if ( key[k] == "Status" ) { // status
					td += '<td align="center">%s</td>'.sprintf( result[i][key[k]] == '1' ? '<span class="label label-success">active</span>' : '<span class="label label-warning">inactive</span>' );
				} else if ( key[k] == "Subject" ) { // subject
					td += '<td class="col-xs-2 text"><span>%s</span></td>'.sprintf(result[i][key[k]]);															
				} else if ( key[k] == "Content" ) { // content
					td += '<td class="col-xs-4 text"><span>%s</span></td>'.sprintf(result[i][key[k]]);										
				} else if ( key[k] == "Updated date" ) { // updated date
					td += '<td><span>%s</span></td>'.sprintf( utcToLoc(result[i][key[k]]) );
				} else {
					td += '<td><span>%s</span></td>'.sprintf( result[i][key[k]] );
				}
			}
			tr += '<tr style="cursor: pointer;" onclick="noticeD(\'%s\')">%s</tr>'.sprintf(result[i].seq_no, td);
			td = ''; // reset
		}
		getID('table-list-body').innerHTML = tr;
		
		//---------------------------------------
		// 3. 페이지 처리
		let curPage = result[0].page;
		let pageCount = Math.ceil(result[0].totalcnt/PAGE_UNIT);
		Log.d( 'curPage : ', curPage );
		Log.d( 'pageCount : ', pageCount );
		
		if ( typeof Pagination != "undefined" ) {
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
		showHide('table-list', true);
		scrollRestore('my-scroll-pos');
	})
    .catch(function (error) {
    	Log.d(error);
    });
}

var noticeTypes = function() {
	Log.d( 'noticeTypes() called...' );
	
	axios.post('/notice/type/clist.do')
	.then( function(response) {
		let data = response.data;
		let len = data.length;
		Log.d( 'noticeTypes() -> data : ', data );
		
		// <option value="">test</option>
		let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'
				   .sprintf(data[i].id, data[i].type);
		}
		getID('selNoticeType').innerHTML += opt; 
	})
    .catch( function( error ) {
    	Log.d('noticeTypes() -> error=', error);
    });
};

var companies = function() {
	Log.d( 'companies() called...' );
	
	axios.post('/common/company/clist')
	.then( function(response) {
		let data = response.data;
		let len = data.length;
		Log.d( 'companies() -> data : ', data );
		
		// <option value="">test</option>
		let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'
				   .sprintf(data[i].company_id, data[i].company_name);
		}
		getID('selCompany').innerHTML += opt;		
	})
    .catch( function( error ) {
    	Log.d('companies() -> error=', error);
    });
};

//--------------------------------------기능 추가
const setParam = function(page){
    params = {}
    params['curPage'] = page
    params['pageUnit'] = PAGE_UNIT
 
    params['type'] = getVal('selNoticeType')
    
	if ( getID('selStatus') != null )
		params['status'] = getVal('selStatus')
	
	if ( getID('selCompany') != null )
		params['company_id'] = getVal('selCompany')
	
    if (getVal('txtStart').length > 0)
        params['startDate'] = getVal('txtStart') + ' 00:00:00'
    else
        params['startDate'] = ''

    if (getVal('txtEnd').length > 0)
        params['endDate'] = getVal('txtEnd') + ' 23:59:59'
    else
        params['endDate'] = ''
}
//dataTable 셋팅
const noticeTable = function(page) {
    table = $('#table-list').DataTable({
        ajax : {
            url : '/notice/list',
            type : 'POST',
            data : function (d) { //보낼 데이터
                return  $.extend(d, params); // params reload
            },
            dataType : 'json',
            dataSrc : 'data', //data 받는 key이름 (기본 : "" => data)
        },
        columns : [
            { title:"",data: "page"},
            { title:"",data: "totalcnt" },
            { title:"",data: "seq_no" },
            { title:"",data: "Fixed" },
            { title:getVal("valNo"),data: "No",className: "text-center"},
            { render : function(status, type, row, meta) {
            	return status == '1' ? '<span class="label label-success">'+getVal('valActive')+'</span>' : '<span class="label label-warning">'+getVal('valInactive')+'</span>';
            	}, title: getVal("valStatus"), data: "Status" ,className: "text-center" },
            { title:getVal("valType"),data: "Type" },
            { render :function (data, type, row) {return '<span>'+row['Subject']+'</span>';},title:getVal("valSubject"), data: "Subject" ,className: "col-xs-2 text"},
            { render :function (data, type, row) {return '<span>'+row['Content']+'</span>';},title:getVal("valContent"),data: "Content" ,className: "col-xs-4 text"},
            { title:getVal("valUser"),data: "User name" },
            {render :function (data, type, row) {return utcToLoc(row['Updated date']);},title : getVal("valUpdated"),data : "Updated date"},
        ],
        columnDefs: [
            { targets: [0,1,2,3], visible: false }, //0~2 까지 안보이게
        ]
    });
}
//클릭했을 때
$('#table-list tbody').on('click', 'tr', function () {
    var data = table.row( this ).data() //row data
    mv( '/notice/detail.do?seq_no=' + data.seq_no );
});

//----------------------------------------------------------
// event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
    Log.d('DOMContentLoaded() called...');
   /* noticeList( 1 );*/
    noticeTypes();
    companies();
    setParam(1);
    noticeTable(1);
});

getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    /*noticeList( 1 );*/
    setParam(1);
    table.ajax.reload();
};

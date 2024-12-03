const COL_START = 3;

var pageChange = function(p, s) {
    Log.d("pageChange() -> page : ", p, " size: ", s);
    qnaList(p);
};

var qnaDetailView = function(Id) {
	Log.d("qnaD() -> Id : ", Id);
	mv( '/qna/detail.do?qnaId=' + Id );
};

var qnaList = function(page) {
	getID('table-list-body').innerHTML = ''; // clear body data
	
	let params = new URLSearchParams();
	if ( getID('selCompany') != null )
		params.append('companyId', getVal('selCompany'));
	// params.append('productType', getVal('selProductType'));
	params.append('subject', getVal('txtSubject'));
	params.append('content', getVal('txtContent'));
	params.append('user', getVal('txtUser'));
	
	if (getVal('txtStart').length > 0)
		params.append('start', locToUtc(getVal('txtStart') + ' 00:00:00'));
	else params.append('start', '');
	
	if (getVal('txtEnd').length > 0)
		params.append('end', locToUtc(getVal('txtEnd') + ' 23:59:59'));
	else params.append('end', '');
	
	params.append('curPage', page);  // 1 페이지
	params.append('pageUnit', PAGE_UNIT); // 5 개씩
	
	//-----------------------------------------------------
	showHide('table-list', false);
	scrollSave('my-scroll-pos'); // scroll 저장
	
	axios.post('/qna/list', params)
	.then( function(response) {
		Log.d('response.data : ', response.data);
		if ( response.data.length <= 0 )
			return;
		
		let result = response.data;
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
				if (i == COL_START)
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

				if ( k == 9 ) {
					td += '<td><span>%s</span></td>'.sprintf( utcToLoc(result[i][key[k]]) );
				} else if ( k == 3 ) { // Row 
					td += '<td align="center"><span>%s</span></td>'.sprintf( result[i][key[k]] );
				} else if ( k == 6 ) { // Subject
					td += '<td class="col-xs-2 text"><span>%s</span></td>'.sprintf( result[i][key[k]] );
				} else if ( k == 7 ) { // Content
					td += '<td class="col-xs-4 text"><span>%s</span></td>'.sprintf( result[i][key[k]] );
				} else {
					td += '<td><span>%s</span></td>'.sprintf( result[i][key[k]] );
				}
			}
			tr += '<tr style="cursor: pointer;" onclick="qnaDetailView(\'%s\')">%s</tr>'.sprintf(result[i].id, td);
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
	})
    .catch(function (error) {
    	Log.d('qnaList() -> error : ', error);
    });
};

/*var productTypes = function() {
	Log.d( 'productTypes() called...' );
		
	axios.post('/qna/producttype/clist')
	.then( function(response) {
		let data = response.data;
		let len = data.length;
		Log.d( 'productTypes() -> data : ', data );
		
		// <option value="">test</option>
		let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'
				   .sprintf(data[i].product_type, data[i].product_value);
		}
		getID('selProductType').innerHTML += opt; 
	})
    .catch( function( error ) {
    	Log.d('productTypes() -> error=', error);
    });
};*/

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
    
    if ( getID('selCompany') != null )
		params['companyId'] = getVal('selCompany')
    
	// params['productType'] = getVal('selProductType')
    params['subject'] = getVal('txtSubject')
    params['content'] = getVal('txtContent')
    params['user'] = getVal('txtUser')
    
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
const qnaTable = function(page) {
    table = $('#table-list').DataTable({
        ajax : {
            url : '/qna/list',
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
            { title:"",data: "id" },
            { title:getVal("valNo"),data: "No",className: "text-center"},
            { title:getVal("valCompany"),data: "Company" },
            // { title:getVal("valProductType"),data: "Product type" },
            { render :function (data, type, row) {return '<span>'+row['Subject']+'</span>';},title:getVal("valSubject"), data: "Subject" ,className: "col-xs-2 text"},
            { render :function (data, type, row) {return '<span>'+row['Content']+'</span>';},title:getVal("valContent"),data: "Content" ,className: "col-xs-4 text"},
            { title:getVal("valUserName"),data: "User name" },
            {render :function (data, type, row) {return utcToLoc(row['Updated date']);},title : getVal("valUpdated"),data : "Updated date"},
        ],
        columnDefs: [
            { targets: [0,1,2], visible: false }, //0~2 까지 안보이게
        ]
    });
}
//클릭했을 때
$('#table-list tbody').on('click', 'tr', function () {
    var data = table.row( this ).data() //row data
    mv( '/qna/detail.do?qnaId=' + data.id );
});


//----------------------------------------------------------
// event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
    Log.d('DOMContentLoaded() called...');
    setParam(1);
    qnaTable(1);
    companies();
    // productTypes();
});

getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    setParam(1);
    table.ajax.reload();
};

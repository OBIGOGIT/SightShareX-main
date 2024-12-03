let pageChange = function(p, s) {
	Log.d("pageChange() -> page : ", p, " size: ", s);
	productList( p );
};

var productDetail = function(id) {
	Log.d('productDetail() -> id : ', id);
	mv( '/product/detail.do?productId='+ id +'&productType=' + queryString('productType') + '&productName=' + queryString('productName') );
};

var openHelp = function(input) {
	mvNew(input);
	this.event.stopPropagation(); // tr 전파 막기
};

var attachFileDown = function(id, path, file) {
	this.event.stopPropagation(); // tr 전파 막기
	let uri = '/file/fileD.do?filePath=%s&fileName=%s&productId=%s&productType=%s'.sprintf( path, file, id, queryString('productType') );
	mv( uri );
};

var productList = function(page) {
	getID('table-list-body').innerHTML = ''; // clear list
	let params = new URLSearchParams();
	
	if ( getVal('hdnCompanyId') == '0' ) { // obigo
		if ( getID('selCompany') != null )
			params.append('companyId', getVal('selCompany'));		
	} else { // customer
		params.append('companyId', getVal('hdnCompanyId'));
	}
	
	if ( queryString('productType') != null )
		params.append('productType', queryString('productType'));
	params.append('name', getVal('txtName'));
	params.append('version', getVal('txtVersion'));
	params.append('description', getVal('txtDesc'));

	if (getVal('txtStartDate').length > 0)
		params.append('start', locToUtc(getVal('txtStartDate') + ' 00:00:00'));
	else params.append('start', '');
	
	if (getVal('txtEndDate').length > 0)
		params.append('end', locToUtc(getVal('txtEndDate') + ' 23:59:59'));
	else params.append('end', '');
	
	if ( getID('selStatus') != null )
		params.append('active', getVal('selStatus'));
	
	
	// ext_type, col_value_id
	let cls = getCLS('ext_type')
	let clsLen = cls.length;
	let extTypes = [];
	for ( let idx = 0 ; idx < clsLen ; idx++ ) {
		let ext_value = getSuffix('_', cls[idx].id);
		let col_value = '';
		if ( getVal(cls[idx].id) != '' )
			col_value = getSelectedText(cls[idx].id);
	    Log.d('ext_value : ', ext_value, 'col_value : ', col_value);
		extTypes.push({ext_value: ext_value, col_value: col_value});
	}
	Log.d('extTypes : ', extTypes);
	params.append('extTypes', JSON.stringify(extTypes));
	
	params.append('curPage', page);  // 1 페이지
	params.append('pageUnit', PAGE_UNIT); // 5 개씩
	
	//-----------------------------------------------------
	showHide('table-list', false);
	scrollSave('my-scroll-pos'); // scroll 저장
	
	axios.post('/product/list', params)
	.then( function( response ) {
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
			
			for ( let i = 0 ; i < key.length ; i++ ) {
				if ( i == 0 || i == 1 || i == 3 || i == 4 || i == 5 || i == 6 )  // invisible column
					continue;
				
				//Log.d('key', key[i] );
				if(key[i]=='No'||key[i]=='Help link')
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
			for ( let k = 0 ; k < key.length ; k++ ) {
				if ( k == 0 || k == 1 || k == 3 || k == 4 || k == 5 || k == 6 ) // invisible column
					continue;
				
				// Log.d(result[i][key[k]]);
				if ( key[k] == 'Updated date' ) { // utc -> local time
					td += '<td>%s</td>'.sprintf( utcToLoc(result[i][key[k]]) );
				} else if ( key[k] == 'Help link' ) {
					if ( result[i][key[k]] == 'None' ) {
						td += '<td align="center">%s</td>'.sprintf(result[i][key[k]]);
					} else if ( result[i][key[k]] == 'unzip' ) {
						td += '<td align="center"><span class="glyphicon glyphicon-refresh" title="In processing"></span></td>';
					} else {
						if ( result[i][key[4]] == "1" )
							td += '<td style="color: #3c8dbc;" align="center" onclick="openHelp(\'%s\')" title="Help link"><span class="glyphicon glyphicon-link"></span></td>'.sprintf(result[i][key[k]]);
						else
							td += '<td align="center"><span class="glyphicon glyphicon-link"></span></td>';
					}
				} else if ( key[k] == 'Name' ) {
					if ( result[i][key[6]] != "None" && result[i][key[4]] == "1" )
						td += '<td style="color: #3c8dbc;" onclick="attachFileDown(\'%s\', \'%s\', \'%s\');" title="Product download">%s&nbsp;<i class="fa fa-fw fa-cloud-download"></i></td>'.sprintf(result[i].productid, result[i][key[5]], result[i][key[6]], result[i][key[k]]);
					else 
						td += '<td>%s</td>'.sprintf(result[i][key[k]]);
				} else if ( key[k] == 'No' ) {
					td += '<td align="center">%s</td>'.sprintf( result[i][key[k]] );
				} else if ( key[k] == 'Description' ) {
					td += '<td class="col-xs-2 text" title="%s"><span>%s</span></td>'.sprintf( result[i][key[k]], result[i][key[k]] );
				} else {
					td += '<td>%s</td>'.sprintf( result[i][key[k]] );
				}
			}
			
			if ( result[i][key[4]] == "1" ) { // active
				tr += '<tr style="cursor: pointer;" onclick="productDetail(\'%s\')">%s</tr>'.sprintf(result[i].productid, td);
			} else { // inactive
				tr += '<tr style="cursor: pointer; color: lightgray;" onclick="productDetail(\'%s\')">%s</tr>'.sprintf(result[i].productid, td);
			}
				
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
    .catch( function (error) {
    	Log.d( 'error=', error );
    });	
};

var makeDynamicSearchItem = function() {
	getID('ext-col-container').innerHTML = ''; // clear container
	
	let params = new URLSearchParams();
	params.append('productType', queryString('productType'));
	
	axios.post('/product/extfield/flist', params)
	.then( function( response ) {
		let r = response.data;
		let len = r.length; 
		if ( len <= 0 ){
			productL(1);
			return;
		}
		//list colunms 추가
		var columnIndex = 9;
		for ( let i = 0 ; i < len ; i++ ) {
			columns.splice(columnIndex, 0, {title:r[i].ext_value,data:r[i].ext_value});
			columnIndex++;
		}
		productL(1);
		
		Log.d('makeDynamicSearchItem() -> r : ', r);
		let item = 
		'<div class="col-md-6">\
			<div class="form-group-sm">\
				<label for="ext_type_%s" class="col-sm-3 control-label">%s</label>\
					<div class="col-sm-9">\
						<select id="ext_type_%s" class="form-control select2 ext_type">\
							<option value="">'+getVal("valSelect")+'</option>\
						</select>\
					</div>\
			 </div>\
		</div>'; // 3 개
		
		let items = '';
		for ( let i = 0 ; i < len ; i++ ) {
			items += item.sprintf(r[i].ext_value, r[i].ext_value, r[i].ext_value);
		}
		getID('ext-col-container').innerHTML = items;
		
		for ( let k = 0 ; k < len ; k++ ) {
			getExtColVal( r[k].ext_value, r[k].ext_type );
		}
	})
    .catch( function (error) {
    	Log.d( 'makeDynamicSearchItem() -> error=', error );
    });
};

var getExtColVal = function(ext_value, ext_type) {
	// Log.d( 'getExtColVal() -> ext_value=', ext_value );
	// Log.d( 'getExtColVal() -> ext_type=', ext_type ); // arg
	let sel = 'ext_type_%s'.sprintf(ext_value);
	// getID(sel).innerHTML = '';
		
	let params = new URLSearchParams();
	params.append('extType', ext_type);
	
	axios.post('/product/extfield/clist', params)
	.then( function( response ) {
		let r = response.data;
		let len = r.length; 
		if ( len <= 0 )
			return;
		
		Log.d('getExtColVal() -> r : ', r);
		let item = '<option value="%s">%s</option>';
		
		for ( let i = 0 ; i < len ; i++ ) {
			getID(sel).innerHTML += item.sprintf(r[i].col_value_id, r[i].col_value);
		}
	})
    .catch( function (error) {
    	Log.d( 'error=', error );
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
//----------------------------------------------------------
//dataTables
const setParam = function(page){
    params = {}
    params['curPage'] = page
    params['pageUnit'] = PAGE_UNIT
 
    if ( getVal('hdnCompanyId') == '0' ) { // obigo
		if ( getID('selCompany') != null )
			params['companyId'] = getVal('selCompany');
	} else { // customer
		params['companyId'] = getVal('hdnCompanyId');
	}
    
    if ( queryString('productType') != null )
    	params['productType'] = queryString('productType');
    params['name'] = getVal('txtName');
    params['version'] = getVal('txtVersion');
    params['description'] = getVal('txtDesc');
 
    if (getVal('txtStartDate').length > 0)
        params['startDate'] = getVal('txtStartDate') + ' 00:00:00'
    else
        params['startDate'] = ''
 
    if (getVal('txtEndDate').length > 0)
        params['endDate'] = getVal('txtEndDate') + ' 23:59:59'
    else
        params['endDate'] = ''
    	
   if ( getID('selStatus') != null )
	   params['active'] = getVal('selStatus');
    	
	// ext_type, col_value_id
	let cls = getCLS('ext_type')
	let clsLen = cls.length;
	let extTypes = [];
	for ( let idx = 0 ; idx < clsLen ; idx++ ) {
		let ext_value = getSuffix('_', cls[idx].id);
		let col_value = '';
		if ( getVal(cls[idx].id) != '' )
			col_value = getSelectedText(cls[idx].id);
	    Log.d('ext_value : ', ext_value, 'col_value : ', col_value);
		extTypes.push({ext_value: ext_value, col_value: col_value});
	}
	Log.d('extTypes : ', extTypes);
	params['extTypes'] = JSON.stringify(extTypes);
}
var columns = [
	{ title:"",data: "page"},
    { title:"",data: "totalcnt" },
    { title:getVal("valNo"),data: "No",className: "text-center"},
    { render :function (data, type, row) {
    	var html = '';
    	if ( row['filename'] != "None" && row['active'] == 1 )
    		html = '<span style="color: #3c8dbc;" onclick="attachFileDown(\'%s\', \'%s\', \'%s\');" title="Product download">%s&nbsp;<i class="fa fa-fw fa-cloud-download"></i></span>'.sprintf(row['productid'], row['filepath'], row['filename'], data);
		else 
			html = data;
    	return html;
    	},title:getVal("valName"),data:"Name"},
    { title:"", data: "productid" },
    { title:"", data: "active" },
    { title:"", data: "filepath" },
    { title:"", data: "filename" },
    { title:getVal("valVersion"),data: "Version" },
    { render :function (data, type, row) {return '<span title="'+data+'">'+data+'</span>';},title:getVal("valDescription"), data: "Description" ,className: "col-xs-2 text"},
    { render :function (data, type, row) {return utcToLoc(row['Updated date']);},title : getVal("valUpdated"),data : "Updated date"},
    { render :function (data, type, row) {
    	var html = '';
    	if ( data == 'None' ) {
    		html = data
		} else if ( data == 'unzip' ) {
			html = '<span class="glyphicon glyphicon-refresh" title="In processing"></span>';
		} else {
			if ( row['active'] == 1 )
				html = '<span class="glyphicon glyphicon-link" style="color: #3c8dbc;" onclick="openHelp(\'%s\')" title="Help link"></span>'.sprintf(data);
			else
				html = '<span class="glyphicon glyphicon-link"></span>';
		}
    	return html;
    	},title:getVal("valHelp"),data: "Help link" ,className: "text-center"},
]
const productL = function(page) {
	
    table = $('#table-list').DataTable({
        ajax : {
            url : '/product/list',
            type : 'POST',
            data : function ( d ) { //보낼 데이터
                return  $.extend(d, params); // params reload
            },
            dataType : 'json',
            dataSrc : 'list', //data 받는 key이름 (기본 : "" => data)
            },
        columns : columns,
        columnDefs: [
            { targets: [0,1,4,5,6,7], visible: false }, //0~2 까지 안보이게
        ]
    });
}
//클릭했을 때
$('#table-list tbody').on('click', 'tr', function () {
    var data = table.row( this ).data() //row data
    mv( '/product/detail.do?productId='+ data.productid +'&productType=' + queryString('productType') + '&productName=' + queryString('productName') );
});
//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('DOMContentLoaded() called...');
	//productList( 1 );
	setParam(1);
	makeDynamicSearchItem();
	companies();
});

getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    //productList( 1 );
    setParam(1);
    table.ajax.reload();
};

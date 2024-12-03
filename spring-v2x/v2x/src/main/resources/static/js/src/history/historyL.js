const COL_START = 3;


//--------------------------------------기능 추가
const setParam = function(page){
	params = {}
    params['curPage'] = page
    params['pageUnit'] = PAGE_UNIT
    
	switch(queryString('type')) {
	case '5': // email
		params['to'] = getVal('txtTo')
	    params['from'] = getVal('txtFrom')
	    params['content_type'] = getVal('txtContentType')
		break;
	default:
		params['action'] = getVal('txtAction')
		params['email'] = getVal('txtEmail')
		params['ip_addr'] = getVal('txtIp')
		params['detail'] = getVal('txtDetail')
		break;
	}

	params['htype'] = getVal('htype')
	
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
const historyList = function(page) {
	let target = '/history/list'; // default
	let targetData = [
        { title:"",data: "page"},
        { title:"",data: "totalcnt" },
        { title:"",data: "seq_no" },
        { title:getVal("valNo"),data: "No",className: "text-center"},
        { title:getVal("valAction"),data: "Action" },
        { title:getVal("valEmail"),data: "Email" },
        { title:getVal("valIp"),data: "IP Addr" },
        { title:getVal("valDetail"),data: "Detail" },
        {render :function (data, type, row) {return utcToLoc(row['Created Date']);},title : getVal("valCreated"),data : "Created Date"}
    ]

    if ( queryString('type') == '5' ) {
        targetData = [
            { title:"",data: "page"},
            { title:"",data: "totalcnt" },
            { title:"",data: "seq_no" },
            { title:getVal("valNo"),data: "No",className: "text-center"},
            { title:getVal("valTo"),data: "To" },
            { title:getVal("valRequestedBy"), data: "Requested By" },
            { title:getVal("valType"),data: "Type" },
            {render :function (data, type, row) {return utcToLoc(row['Created Date']);},title : getVal("valCreated"),data : "Created Date"}
        ]
    }

	/*switch(queryString('type')) {
	case '1': // user
		target = '/history/user/list';
		targetData = [
	        { title:"",data: "page"},
	        { title:"",data: "totalcnt" },
	        { title:"",data: "seq_no" },
	        { title:getVal("valNo"),data: "No",className: "text-center"},
	        { title:getVal("valAction"),data: "Action" },
	        { title:getVal("valCompany"), data: "Company" },
	        { title:getVal("valName"),data: "Name" },
	        { title:getVal("valEmail"),data: "Email" },
	        { title:getVal("valIp"),data: "IP Addr" },
	        { title:getVal("valDetail"),data: "Detail" },
	        {render :function (data, type, row) {return utcToLoc(row['Created Date']);},title : getVal("valCreated"),data : "Created Date"}
	    ]
		break;
	case '2': // system
		target = '/history/system/list';
		targetData = [
	        { title:"",data: "page"},
	        { title:"",data: "totalcnt" },
	        { title:"",data: "seq_no" },
	        { title:getVal("valNo"),data: "No",className: "text-center"},
	        { title:getVal("valAction"),data: "Action" },
	        { title:getVal("valEmail"),data: "Email" },
	        { title:getVal("valIp"),data: "IP Addr" },
	        { title:getVal("valDetail"),data: "Detail" },
	        { title:getVal("valProductType"),data: "Product Type" },
	        { title:getVal("valProduct"),data: "Product" },
	        {render :function (data, type, row) {return utcToLoc(row['Created Date']);},title : getVal("valCreated"),data : "Created Date"}
	    ]
		break;
	case '3': // product
		target = '/history/product/list';
		targetData = [
	        { title:"",data: "page"},
	        { title:"",data: "totalcnt" },
	        { title:"",data: "seq_no" },
	        { title:getVal("valNo"),data: "No",className: "text-center"},
	        { title:getVal("valAction"),data: "Action" },
	        { title:getVal("valEmail"),data: "Email" },
	        { title:getVal("valIp"),data: "IP Addr" },
	        { title:getVal("valProductType"),data: "Product Type" },
	        { title:getVal("valProduct"),data: "Product" },
	        {render :function (data, type, row) {return utcToLoc(row['Created Date']);},title : getVal("valCreated"),data : "Created Date"}
	    ]
		break;
	case '4': // email
		target = '/history/email/list';
		targetData = [
	        { title:"",data: "page"},
	        { title:"",data: "totalcnt" },
	        { title:"",data: "seq_no" },
	        { title:getVal("valNo"),data: "No",className: "text-center"},
	        { title:getVal("valTo"),data: "To" },
	        { title:getVal("valRequestedBy"), data: "Requested By" },
	        { title:getVal("valType"),data: "Type" },
	        { title:getVal("valProduct"),data: "Product" },
	        {render :function (data, type, row) {return utcToLoc(row['Created Date']);},title : getVal("valCreated"),data : "Created Date"}
	    ]
		break;
	case '5': // app
		target = '/history/apps/list';
		targetData = [
	        { title:"",data: "page"},
	        { title:"",data: "totalcnt" },
	        { title:"",data: "seq_no" },
	        { title:getVal("valNo"),data: "No",className: "text-center"},
	        { title:getVal("valAction"),data: "Action" },
	        { title:getVal("valEmail"),data: "Email" },
	        { title:getVal("valIp"),data: "IP Addr" },
	        { title:getVal("valApp"),data: "App" },
	        { title:getVal("valVersion"),data: "Version" },
	        {render :function (data, type, row) {return utcToLoc(row['Created Date']);},title : getVal("valCreated"),data : "Created Date"}
	    ]
		break;
	default:
		break;
	}*/
	
    table = $('#table-list').DataTable({
        ajax : {
            url : target,
            type : 'POST',
            data : function (d) { //보낼 데이터
                return  $.extend(d, params); // params reload
            },
            dataType : 'json',
            dataSrc : 'list', //data 받는 key이름 (기본 : "" => data)
        },
        columns : targetData,
        columnDefs: [
            { targets: [0,1,2], visible: false }, //0~2 까지 안보이게
        ]
    });
}

//----------------------------------------------------------
// event handler
window.addEventListener('DOMContentLoaded', function() {
    Log.d('DOMContentLoaded() called...');
	setParam(1);
	historyList(1);
    
	// switch(queryString('type')) {
	// case '1': // user
	// 	companies();
	// 	break;
	// case '2':
	// case '3':
	// 	producttypesall();
	// 	break;
	// default:
	// 	break;
	// }
});

getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    setParam(1);
    table.ajax.reload();
};

const COL_START = 3;

const STATUS = {
	INACTIVE: 0,
	ACTIVE: 1,
	BLOCKED: 2,
};

let pageChange = function(p, s) {
    Log.d("pageChange() -> page : ", p, " size: ", s);
    accountList( p );
};



var roles = function() {
	Log.d( 'roles() called...' );
	
	axios.post('/common/role/clist')
	.then( function(response) {
		let data = response.data;
		let len = data.length;
		Log.d( 'roles() -> data : ', data );
		
		// <option value="">test</option>
		let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'
				   .sprintf(data[i].role_id, data[i].role_name);
		}
		getID('selRole').innerHTML += opt;
	})
    .catch( function( error ) {
    	Log.d('roles() -> error=', error);
    });
};


//--------------------------------------기능 추가
const setParam = function(page){
    params = {}
    params['curPage'] = page
    params['pageUnit'] = PAGE_UNIT
 
    params['email'] = getVal('txtEmail')
    params['name'] = getVal('txtName')
    params['company_id'] = getVal('selCompany')
    params['role_id'] = getVal('selRole')
    params['status_id'] = getVal('selActive')
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
const accountList = function(page) {
    table = $('#table-list').DataTable({
        ajax : {
            url : '/manage/account/list',
            type : 'POST',
            data : function (d) { //보낼 데이터
                return  $.extend(d, params); // params reload
            },
            dataType : 'json',
            dataSrc : 'list', //data 받는 key이름 (기본 : "" => data)
        },
        columns : [
            { title:"",data: "page"},
            { title:"",data: "totalcnt" },
            { title:"",data: "accountseq" },
            { title:getVal("valNo"),data: "No",className: "text-center"},
            { title:getVal("valUserEmail"),data: "User email" },
            { title:getVal("valName"),data: "Name" },
            { title:getVal("valCompanyName"), data: "Company name" },
            { title:getVal("valRole"),data: "Role" },
            { render :
                function (data, type, row) {
            		var html = '';
            		switch(row.Status) {
	            		case STATUS.INACTIVE:
	        				html += '<span class="label label-warning">%s</span>'.sprintf(getVal("valInactive"));
	        				break;					
	        			case STATUS.ACTIVE:
	        				html += '<span class="label label-success">%s</span>'.sprintf(getVal("valActive"));
	        				break;
	        			case STATUS.BLOCKED:
	        				html += '<span class="label label-danger">%s</span>'.sprintf(getVal("valBlocked"));
	        				break;
            		}
                    return html;
                    },
               title:getVal("valStatus"), className: "text-center"
            },
            { title:getVal("valLoginFail"),data: "Login fail",className: "text-center"},
            { title:getVal("valUpdatedUser"),data: "Update email" },
            {render :function (data, type, row) {return utcToLoc(row['Updated date']);},title : getVal("valUpdated"),data : "Updated date"}
        ],
        columnDefs: [
            { targets: [0,1,2], visible: false }, //0~2 까지 안보이게
        ]
    });
}

//클릭했을 때
$('#table-list tbody').on('click', 'tr', function () {
    var data = table.row( this ).data() //row data
    mv( '/manage/account/detail.do?accountSeq=' + data.accountseq );
});

//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('DOMContentLoaded() called...');
	$.fn.companies();
	roles();
	setParam(1);
	accountList(1);
});

getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
	setParam(1);
    table.ajax.reload();
};

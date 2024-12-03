const COL_START = 3;

var pageChange = function(p, s) {
    Log.d("pageChange() -> page : ", p, " size: ", s);
    companyList(p);
};

// var companyTypes = function() {
// 	Log.d( 'companyTypes() called...' );
//
// 	axios.post('/manage/company/types')
// 	.then( function(response) {
// 		let data = response.data;
// 		let len = data.length;
// 		Log.d( 'companyTypes() -> data : ', data );
//
// 		// <option value="">test</option>
// 		let opt = '';
// 		for ( let i = 0 ; i < len ; i++ ) {
// 			opt += '<option value="%s">%s</option>'
// 				   .sprintf(data[i].company_type_id, data[i].company_type_value);
// 		}
// 		getID('selCompanyType').innerHTML += opt;
// 	})
//     .catch( function( error ) {
//     	Log.d('companyTypes() -> error=', error);
//     });
// };

//--------------------------------------기능 추가
const setParam = function(page){
    params = {}
    params['curPage'] = page
    params['pageUnit'] = PAGE_UNIT
 
    params['companyName'] = getVal('txtCompanyName')
    // params['companyType'] = getVal('selCompanyType')
    params['active'] = getVal('selActive')
}

//dataTable 셋팅
const companyList = function(page) {
    table = $('#table-list').DataTable({
        ajax : {
            url : '/manage/company/datalist',
            type : 'POST',
            contentType: "application/json",
            data : function (d) {
                return  JSON.stringify($.extend(d, params));
            },
            dataType : 'json',
            dataSrc : 'list', //data 받는 key이름 (기본 : "" => data)
        },
        columns : [
            { title:"",data: "page"},
            { title:"",data: "totalcnt" },
            { title:"",data: "companyId" },
            { title:getVal("valNo"),data: "no",className: "text-center"},
            { title:getVal("valCompanyName"),data: "name" },
            { title:getVal("valDomain"),data: "domain" },
            { title:getVal("valEmail"), data: "email" },
            // { title:"Address", data: "Address" },
            { render :
                function (data, type, row) {
	        		var html = '';
	        		switch(row.status) {
	            		case 0:
	        				html += '<span class="label label-warning">%s</span>'.sprintf(getVal("valInactive"));
	        				break;
	        			case 1:
	        				html += '<span class="label label-success">%s</span>'.sprintf(getVal("valActive"));
	        				break;
	        		}
	                return html;
            	},
                title:getVal("valStatus"), className: "text-center"
            },
            {render :function (data, type, row) {return utcToLoc(row['updateDate']);},title : getVal("valUpdated"),data : "updateDate"},
            {render :function (data, type, row) {return utcToLoc(row['createDate']);},title : getVal("valCreated"),data : "createDate"}
        ],
        columnDefs: [
            { targets: [0,1,2], visible: false }, //0~2 까지 안보이게
        ]
    });
}
//클릭했을 때
$('#table-list tbody').on('click', 'tr', function () {
    var data = table.row( this ).data() //row data
    // console.log("data : ", data)
    mv( '/manage/company/detail.do?companyId=' + data.companyId );
});

//----------------------------------------------------------
// event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
    Log.d('DOMContentLoaded() called...');
    // companyTypes();
    setParam(1);
    companyList(1);
});

getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    setParam(1);
    table.ajax.reload();
};

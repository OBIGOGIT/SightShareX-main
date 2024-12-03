const COL_START = 3;

let pageChange = function(p, s) {
    Log.d("pageChange() -> page : ", p, " size: ", s);
    productTypeList( p );
};

//--------------------------------------기능 추가
const setParam = function(page){
    params = {}
    params['curPage'] = page
    params['pageUnit'] = PAGE_UNIT
 
    params['productName'] = getVal('txtProductName')
    params['description'] = getVal('txtDescription')
    params['extType'] = getVal('txtExtType')
    if (getVal('txtStartDate').length > 0)
        params['startDate'] = getVal('txtStartDate') + ' 00:00:00'
    else
        params['startDate'] = ''
 
    if (getVal('txtEndDate').length > 0)
        params['endDate'] = getVal('txtEndDate') + ' 23:59:59'
    else
        params['endDate'] = ''
    
}

//dataTable 셋팅
const productTypeList = function(page) {
    table = $('#table-list').DataTable({
        ajax : {
            url : '/manage/producttype/list',
            type : 'POST',
            data : function (d) { //보낼 데이터
            	console.log(params)
                return  $.extend(d, params); // params reload
            },
            dataType : 'json',
            dataSrc : 'list', //data 받는 key이름 (기본 : "" => data)
        },
        columns : [
            { title:"",data: "page"},
            { title:"",data: "totalcnt" },
            { title:"",data: "producttype" },
            { title:getVal("valNo"),data: "No",className: "text-center"},
            { render :function (data, type, row) {return '<span>'+row['Product Name']+'</span>';},title:getVal("valProductName"),data: "Product Name" ,className: "col-xs-2 text"},
            { render :function (data, type, row) {return '<span>'+row['Description']+'</span>';},title:getVal("valDescription"),data: "Description" ,className: "col-xs-4 text"},
            { title:getVal("valExtType"), data: "Ext Type" },
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
    mv( '/manage/producttype/modifyform.do?producttype' + data.type );
});


//----------------------------------------------------------
// event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('DOMContentLoaded() called...');
	setParam(1);
	productTypeList(1);
});

getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    setParam(1);
    table.ajax.reload();
};

let pageChange = function(p, s) {
	Log.d("pageChange() -> page : ", p, " size: ", s);
	guideList( p );
};

//--------------------------------------기능 추가
const setParam = function(page){
    params = {}
    params['curPage'] = page
    params['pageUnit'] = PAGE_UNIT
 
    params['name'] = getVal('txtName')
    params['version'] = getVal('txtVersion')
    params['description'] = getVal('txtDesc')
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
const guideList = function(page) {
    table = $('#table-list').DataTable({
        ajax : {
            url : '/guide/list',
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
            { title:getVal("valNo"),data: "No",className: "text-center"},
            { title:getVal("valProductType"),data: "Product type" },
            { title:getVal("valName"),data: "Name" },
            { title:getVal("valVersion"),data: "Version" },
            { render :function (data, type, row) {return '<span title="'+row['Description']+'">'+row['Description']+'</span>';},title:getVal("valDescription"), data: "Description" ,className: "col-xs-2 text"},
            {render :function (data, type, row) {return utcToLoc(row['Updated date']);},title : getVal("valUpdated"),data : "Updated date"},
            { title:"Help Link",data: "Help Link" }
        ],
        columnDefs: [
            { targets: [0,1,8], visible: false }, //0~2 까지 안보이게
        ]
    });
}

//클릭했을 때
$('#table-list tbody').on('click', 'tr', function () {
    var data = table.row( this ).data() //row data
    console.log(data["Help Link"]);
    mvNew(data["Help Link"]);
});

//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('DOMContentLoaded() called...');
	setParam(1);
	guideList(1);
});

getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    setParam(1);
    table.ajax.reload();
};

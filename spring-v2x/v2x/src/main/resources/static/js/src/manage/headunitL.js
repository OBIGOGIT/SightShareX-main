const setParam = function(page) {
    params = {}
    params['curPage'] = page
    params['pageUnit'] = PAGE_UNIT

    if (getVal('txtRegionOemId').length > 0)
        params['regionOemId'] = getVal('txtRegionOemId')

    if (getVal('txtProductionVehicleModelCode').length > 0)
        params['productionVehicleModelCode'] = getVal('txtProductionVehicleModelCode')

    if (getVal('txtHeadunitModelCode').length > 0)
        params['headunitModelCode'] = getVal('txtHeadunitModelCode')

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
const headunitList = function(page) {
    table = $('#table-list').DataTable({
        ajax : {
            url : '/manage/headunit/list',
            type : 'GET',
            data : function(d) { //보낼 데이터
                return $.extend(d, params); // params reload
            },
            dataSrc : function(d) {
                if (d.result == 'redirect') {
                    mv('/login/login.do');
                    return [];
                }
                return d.list
            },
            error: function(xhr) {
                Log.d('xhr :', xhr);
                confirmLogoutCode(xhr.status);
            }
        },
        columns : [ {
            title : getVal("valNo"),
            data : "rowNo",
            className : "text-center"
        }, {
            title : "headunitSeq",
            data : "headunitSeq"
        }, {
            title : getVal("valRegionOemId"),
            data : "regionOemId"
        }, {
            title : getVal("valProductionVehicleModelCode"),
            data : "productionVehicleModelCode"
        }, {
            title : getVal("valHeadunitModelCode"),
            data : "headunitModelCode"
        }, {
            render : function(data, type, row) {
                return utcToLoc(row['created']);
            },
            title : getVal("valCreated"),
            data : "created"
        }, {
            render : function(data, type, row) {
                return utcToLoc(row['updated']);
            },
            title : getVal("valUpdated"),
            data : "updated"
        }
            , {
                title : "totalCnt",
                data : "totalCnt"
            }, ],
        columnDefs : [ {
            targets : [1,7],
            visible : false
        } ]
    });

}

// $('#table-list tbody').on('click', 'tr', function() {
//     var data = table.row(this).data()
//     mv('/headunit/detail.do?headunitSeq=' + data.headunitSeq);
// })

// if(${level} >= 5){
/*if([[${level}]] >= 5) {
    getID("btnRefreshHu").onclick = function(e) {
        getID('overlayUpload').style.display=''
        //Store에서 headunit 정보 받아오기
        axios.post('/manage/headunit/refresh').then( function (response) {
            let data = response.data;
            Log.d( 'headunit/refresh -> data : ', data );
            mv('/manage/headunit/list.do')
        }).catch( function (err) {
            Log.d('headunit/refresh -> err=', err);
            confirmLogout(err);
        });
        //로딩 아이콘  추가
    };
}*/

window.addEventListener('DOMContentLoaded', function() { //실행될 코드
    Log.d('DOMContentLoaded() called...');
    setParam(1);
    headunitList(1);
});
getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    setParam(1);
    table.ajax.reload();
};
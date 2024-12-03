var roleComboList = function() {

    Log.d( 'roleComboList() called...' );
    axios.post('/common/role/clist', {
        responseType: 'json',
        responseEncoding: 'utf8'
    })
        .then( function(response) {
            let data = response.data;
            let len = data.length;
            Log.d( 'roleComboList() -> data : ', data );

            // <option value="">test</option>
            let opt = '';
            for ( let i = 0 ; i < len ; i++ ) {
                opt += '<option value="%s">%s</option>'
                    .sprintf(data[i].role_id, data[i].role_name);
            }
            getID('selRole').innerHTML += opt;
        })
        .catch( function( error ) {
            Log.d('roleComboList() -> error=', error);
        });
};

var dash = {};
dash.datas = [];
dash.bChanged = false;
dash.getSelectRole = function() {
    // showHide('table-list', false);

    console.log("getVal('selRole') : ", getID('selRole').value)
    let params = {
        'role_id' : getVal('selRole')
    };

    axios.post('/manage/dashmenu/list', JSON.stringify(params), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then( function (response) {
            Log.d( 'getSelectRole -> response.data : ', response.data );

            let data = response.data;
            let len = data.length;
            if ( len <= 0 )
                return;

            let msgMod = getVal('msgMod');

            var groups = {};
            data.forEach(function(item) {
                if(item.menuSeq !== 0) { // menu_seq가 0이 아닌 항목만 추가
                    if (!groups[item.menu]) {
                        groups[item.menu] = [];
                    }
                    groups[item.menu].push(item);
                }
            });

            var html = '';
            Object.keys(groups).forEach(function(menu, index) {
                html += '<div class="col-md-6">';
                html += '<div class="form-group">';
                html += '<label>' + menu + '</label>';
                html += '<div class="table-responsive">';
                html += '<table class="table table-bordered table-hover">';
                html += '<thead>';
                html += '<tr>';
                html += '<th><input type="checkbox" id="selectAll' + index + '" onchange="toggleCheckboxes(this)"></th>';
                html += '<th>Sub menu</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                groups[menu].forEach(function(item) {
                    html += '<tr>';
                    html += '<td><input type="checkbox" id="' + item.dashMenuId + '" ' + (item.chk == 1 ? 'checked' : '') + '></td>';
                    html += '<td for="' + item.dashMenu_id + '">' + (msgMod === 'ko' ? item.menuDes : item.subMenu) + '</td>';
                    html += '</tr>';
                });
                html += '</tbody>';
                html += '</table>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                if (index % 2 == 1) {
                    html += '</div><div class="row">';
                }
            });
            document.querySelector('.dashmenu').innerHTML = html;






            // //-------------------------------------------
            // // 선택 table 만들기
            // roles.setDatas( r );
            //
            // //--------------------------------------------
            // // getSelectedRole
            // roles.getSelectedRole( getVal('selRole') );
            //
            // showHide('table-list', true);
        })
        .catch(function(error) {
            Log.d('error=', error);
        });
};

function toggleCheckboxes(element) {
    let checkboxes = element.parentElement.parentElement.parentElement.parentElement.querySelectorAll("input[type=checkbox]");
    for(let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = element.checked;
    }
}

dash.updateSelectedDashMenu = function() {

    if( getVal('selRole') == null || getVal('selRole') == "" ) {
        modalAlert('Please select a role');
        return null;
    }

    let params = {
        'roleId' : getVal('selRole'),
        dashMenuIdList : getCheckedDashMenuIds()
    };

    axios.post('/manage/dashmenu/modify', params)
        .then(function(response) {
            Log.d( 'response.data : ', response.data );
            if ( response.data.result == 'ok' ) {
                Log.d('저장 성공!');
                modalAlert('Saving success!');
            } else if ( response.data.result == 'failed'
                    && response.data.desc != null) {
                modalAlert(response.data.desc);
            } else {
                modalAlert('Saving failed!');
            }
        })
        .catch(function(error) {
            Log.d('roles.updateSelectedRole -> error=', error);
        });
};

function getCheckedDashMenuIds() {
    var checkboxes = document.querySelectorAll("input[type=checkbox]");
    var checkedDashMenuIds = [];
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            checkedDashMenuIds.push(checkbox.id);
        }
    });
    return checkedDashMenuIds;
}

window.addEventListener('DOMContentLoaded', function() { //실행될 코드
    Log.d('DOMContentLoaded() called...');
    // dash.getSelectRole();
    roleComboList();
    dash.getSelectRole();
});

getID('selRole').onchange = function(e) {
    Log.d('selRole() -> e : ', e);
    dash.getSelectRole();
};

getID('btnSave').onclick = function(e) {
    Log.d('btnSave() -> e : ', e);

    dash.updateSelectedDashMenu();
};
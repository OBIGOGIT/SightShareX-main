var roleComboList = function() {

	Log.d( 'roleComboList() called...' );
	axios.post('/common/role/clist')
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

//---------------------------------------------------------------------
//company 관련
var roles = {};
roles.datas = [];
roles.bChanged = false;
roles.getSelectRole = function() {
	showHide('table-list', false);

	axios.post('/manage/role/resource/list')
		.then( function (response) {
			Log.d( 'getSelectRole -> response.data : ', response.data );

			let r = response.data;
			let len = r.length;
			if ( len <= 0 )
				return;

			//-------------------------------------------
			// 선택 table 만들기
			roles.setDatas( r );

			//--------------------------------------------
			// getSelectedRole
			roles.getSelectedRole( getVal('selRole') );

			showHide('table-list', true);
		})
		.catch(function(error) {
			Log.d('error=', error);
		});
};

roles.setDatas = function(data) {
	// set data
	roles.datas = []; // clear data

	let len = data.length;
	if ( len <= 0 )
		return;

	let tr = '';
	for ( let i = 0 ; i < len ; i++ ) {
		roles.datas.push( {select: false, // default false
			res_id: data[i].res_id,
			menu: data[i].menu,
			sub_menu: data[i].sub_menu,
			res_name: data[i].res_name,
			res_url: data[i].res_url} );
	}

	Log.d('roles.datas=', roles.datas);

	roles.setUI();
};

roles.changeSelect = function(res_id, chk) {
	Log.d('roles.changeSelect() -> res_id=', res_id, 'chk.checked', chk.checked);
	for ( let i = 0 ; i < this.datas.length ; i++ ) {
		if ( this.datas[i].res_id == res_id ) {
			this.datas[i].select = chk.checked;
			this.bChanged = true; // 수정 flag on
			break;
		}
	}

	// Log.d('roles.changeSelect() -> this.datas=', this.datas);
};

roles.setUI = function() {
	getID('table-list-body').innerHTML = ''; // clear ui

	let trs = "";
	let tds = "";
	for ( let k = 0 ; k < roles.datas.length ; k++ ) {
		tds += roles.datas[k].select ?
			"<td><label class='ob-customcheck'><input type='checkbox' onclick='roles.changeSelect(%s, this)' style='display: none;' checked><span class='ob-checkmark'></span></label></td>".sprintf(roles.datas[k].res_id) :
			"<td><label class='ob-customcheck'><input type='checkbox' onclick='roles.changeSelect(%s, this)' style='display: none;'><span class='ob-checkmark'></span></label></td>".sprintf(roles.datas[k].res_id);
		tds += "<td>%s</td>".sprintf(roles.datas[k].menu);
		tds += "<td>%s</td>".sprintf(roles.datas[k].sub_menu);
		tds += "<td>%s</td>".sprintf(roles.datas[k].res_name);
		tds += "<td>%s</td>".sprintf(roles.datas[k].res_url);

		trs += "<tr>%s</tr>".sprintf(tds);
		tds = "";
	}
	getID('table-list-body').innerHTML = trs;
};

roles.getSelectedRole = function( role_id ) {

	if ( role_id == '' ) {
		Log.d('getSelectedRole() -> role_id : ', role_id);
		return;
	}

	let params = new URLSearchParams();
	params.append('role_id', role_id);
	// Log.d('params : ', params);

	axios.post('/manage/role/resource/selected', params)
		.then(function(response) {
			Log.d( 'selectedcompany.do -> response.data : ', response.data );
			let selected = response.data;
			let len = selected.length;
			if ( selected.length <= 0 )
				return;

			for ( let i = 0 ; i < roles.datas.length ; i++ ) {
				for ( let k = 0 ; k < len ; k++ ) {
					if ( roles.datas[i].res_id == selected[k].res_id ) {
						roles.datas[i].select = true;
					}
				}
			}

			roles.setUI(); // UI 갱신
		})
		.catch(function(error) {
			Log.d('roles.getSelectedRole() -> error=', error);
		});
};

roles.updateSelectedRole = function() {
	let params = new URLSearchParams();
	params.append('role_id', getVal('selRole'));
	params.append('curRoles', JSON.stringify(this.datas));
	// Log.d('roles.updateSelectedRole() -> params : ', params);

	axios.post('/manage/role/modify', params)
		.then(function(response) {
			Log.d( 'response.data : ', response.data );
			if ( response.data.result == 'ok' ) {
				Log.d('저장 성공!');
				modalAlert('Saving success!');
			} else {
				modalAlert('Saving failed!');
			}
		})
		.catch(function(error) {
			Log.d('roles.updateSelectedRole -> error=', error);
		});
};

//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('DOMContentLoaded() called...');
	roles.getSelectRole();
	roleComboList();
});

getID('selRole').onchange = function(e) {
	Log.d('selRole() -> e : ', e);
	roles.getSelectRole();
};

getID('btnSave').onclick = function(e) {
	Log.d('btnSave() -> e : ', e);
	roles.updateSelectedRole();
};

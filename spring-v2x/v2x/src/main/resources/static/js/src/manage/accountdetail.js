var initPage = function() {
	companies();

	// let curCom = getID('selCompany').value;
	var select = document.getElementById("selCompany");
	var selectedValue = select.value;
	Log.d("curCom : ",selectedValue);

	roles();
	
	let pw = getID('txtPw'); // pw flag init
	pw.lowChk = false;
	pw.upChk = false;
	pw.numChk = false;
	pw.lenChk = false;
};

let NPM_STATUS = 0;
let companyData = [];

var companies = function() {
	Log.d( 'companies() called...' );
	
	axios.post('/common/company/active/clist')
	.then( function(response) {
		let data = response.data;
		companyData = data;
		let len = data.length;
		Log.d( 'companies() -> data : ', data );
		
		// <option value="">test</option>
		let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'
				   .sprintf(data[i].company_id, data[i].company_name);
		}
		getID('seldefaultCompany').innerHTML += opt;
		getID('selCompany').innerHTML += opt;
	})
    .catch( function( error ) {
    	Log.d('companies() -> error=', error);
    });
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
		
		if ( queryString('mode') != 'I' ) { // 수정 모드
			accountDetailInfo();
		}
	})
    .catch( function( error ) {
    	Log.d('roles() -> error=', error);
    });
};

if ( queryString('mode') != 'I' ) { // 수정시
var accountDetailInfo = function() {
	Log.d('accountDetailInfo() called...');


	let params = {
		'accountSeq' : queryString('accountSeq')
	};

	Log.d('params : ', params);
	
	axios.post('/manage/account/detail', JSON.stringify(params), {
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then( function (response) {
		let data = response.data;
		Log.d( 'accountDetailInfo() -> data : ', data );
		Log.d( 'accountDetailInfo() -> data[0] : ', data[0] );

		if ( data.length > 0 ) { // 있으면...
			getID('txtEmail').value = data[0].email;
			getID('txtName').value = data[0].name;
			getID('seldefaultCompany').value = data[0].companyId;
			// getID('selCompany').value = data[0].companyId;
			getID('selRole').value = data[0].roleId;
			getID('selActive').value = data[0].statusId;
			// getID('selHiddenMenuLevel').value = data[0].hidden_menu_role;

			// data[0].emailNoti == "0" ?	getID('chkNotify').checked = false
			// : getID('chkNotify').checked = true;

			getID('txtLoginFailCnt').value = data[0].loginFailCount;
			getID('txtUpdatedEmail').value = data[0].updateEmail;
			getID('txtCreatedDate').value = utcToLoc(data[0].created);
			getID('txtUpdatedDate').value = utcToLoc(data[0].updated);

			// 'selCompany' id를 가진 <select> 요소 가져오기
			var selCompany = getID('selCompany')

			console.debug("data[0].companyIds : ", data[0].companyIds);
			if( data[0].companyIds != undefined ) {
				// companyId에 해당하는 option을 선택 상태로 만들기
				for (var i = 0; i < selCompany.options.length; i++) {
					if (data[0].companyIds.includes(parseInt(selCompany.options[i].value))) {
						selCompany.options[i].selected = true;
					}
				}
			}

		}
	})
	.catch( function (error) {
		Log.d('accountDetailInfo() -> error=', error);
	});
};
}

getID('selCompany').onchange = (e) => {
	let findCompany = companyData.find(com => {
		return com.company_id == e.target.value;
	});

	// if (typeof findCompany !== 'undefined') {
	// 	getID('selHiddenMenuLevel').value = findCompany.hidden_menu_role;
	// }
}

//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('accountdetail.js -> DOMContentLoaded() called...');
	initPage();
});

if ( getID('btnSave') != null )
getID('btnSave').onclick = function(e) {
	Log.d('accountdetail.js -> btnSave() called...');
	
	if ( getID('chkRegNpm') != null 
		 && getID('chkRegNpm').checked 
		 && NPM_STATUS == 0 ) {
		modalAlert('You have to check NPM ID registration.');
		return;
	}
	
	//-----------------------------------------------
	// valid check
	let email = getVal('txtEmail').toLowerCase();
	
	if ( queryString('mode') == 'I' ) { // 입력 모드
		if ( !checkEmail(email) ) {
			modalAlert('Email is required.');
			getID('txtEmail').focus();
			return;
		}
		
		if ( getID('spEmailStatus').style.display == 'none' ) {
			modalAlert('Email duplication check is required.');
			return;
		}
	}	
	
	let name = getVal('txtName');
	if ( name.trim() == '' ) {
		modalAlert('User name is required.');
		getID('txtName').focus();
		return;
	}
	
	if ( queryString('mode') == 'I' ) { // 입력 모드			
		if ( getID('spPwStatus').innerText != getVal("valValid")
			 || getID('spCfPwStatus').innerText != getVal("valValid") ) {
			modalAlert('Password validation check is required.');
			return;
		}
	} else { // 수정 모드
		if ( getVal('txtPw').length > 0 ) { // 비번수정 했을때만...
			if ( getID('spPwStatus').innerText != getVal("valValid")
				 || getID('spCfPwStatus').innerText != getVal("valValid") ) {
				modalAlert('Password validation check is required.');
				return;
			}
		}
	}
	// company TBD 체크
	if ( getVal('selCompany') == '-1' ) {
		modalAlert('Please select Current Company.');
		return;
	}

	if ( getVal('seldefaultCompany') == '-1' ) {
		modalAlert('Please select company.');
		return;
	}
	
	//-----------------------------------------
	// let params = new URLSearchParams();
	// params.append('accountSeq', queryString('accountSeq'));
	// params.append('mode', queryString('mode'));
	// params.append('email', email);
	// params.append('name', name);
	// params.append('pw', sha256(getVal('txtPw')) );
	// params.append('companyId', getVal('seldefaultCompany'));
	// params.append('companyIds', getVal('selCompany'));
	// params.append('roleId', getVal('selRole'));
	// params.append('statusId', getVal('selActive'));
	// params.append('hiddenMenuRole', getVal('selHiddenMenuLevel'));
	// TODO 밑에 로직 확인 필요
	// getID('chkNotify').checked ? params.append('emailNoti', '1') : params.append('emailNoti', '0');


	console.log("getVal('selCompany') : ", getVal('selCompany'))
	let params = {
		'accountSeq' : queryString('accountSeq'),
		'mode' : queryString('mode'),
		'email' : email,
		'name' : name,
		'pw' : getVal('txtPw'),
		// 'pw' : sha256(getVal('txtPw')),
		'companyId' : getVal('seldefaultCompany'),
		'roleId' : getVal('selRole'),
		'statusId' : getVal('selActive')
	};

	var selCompanyId = document.getElementById('selCompany');
	var selCompanyIds = Array.from(selCompanyId.selectedOptions).map(option => option.value);
	params.companyIds = selCompanyIds;

	console.log("selCompanyIds : ", selCompanyIds)

	params.emailNoti = 0;
	// if( getID('chkNotify').checked ) {
	// 	params.emailNoti = 1;
	// } else {
	// 	params.emailNoti = 0;
	// }
	// getID('chkNotify').checked ? params.emailNoti =  1 : params.emailNoti = 0;

	if ( queryString('mode') != 'I' ) { // 수정 모드
		// params.append('loginFailCnt', getVal('txtLoginFailCnt'));
		params.loginFailCount = getVal('txtLoginFailCnt');
	}

	console.log("account btnSave() -> params : ", params)
	//Log.d('btnSave() -> params : ', params);
	
	let target = '/manage/account/modify'; // insert, update 통합
	axios.post(target, JSON.stringify(params), {
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then( function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'failed' ) {
			modalAlert('Processing failed.');
			return;
		} else if ( response.data.result == 'redirect' ) {
			mv(response.data.cmd);
			return;
		}
		
		Log.d(target + ' : 처리 성공');
		// alert('처리 성공');
		// 리스트 이동
		mv('/manage/account/list.do');
	})
	.catch( function(error) {
		Log.d('btnSave() -> error=', error);
	});
};

if ( getID('chkRegNpm') != null )
getID('chkRegNpm').onchange = function(e) {
	Log.d('chkRegNpm() -> e.target.checked : ', e.target.checked);
	
	getID('npm-container').style.display=''
	if (e.target.checked) {
		if ( getID('selNpmRole').innerHTML == '' )
			npmRoles();
		getID('txtNpmId').value = getPreFix('@', getVal('txtEmail'));
		getID('txtNpmPw').value = getID('txtNpmId').value;
		getID('txtConfirmNpmPw').value = getID('txtNpmId').value;
		
		getID('npm-container').style.display=''
	} else {
		getID('txtNpmId').value = '';
		getID('txtNpmPw').value = '';
		getID('txtConfirmNpmPw').value = '';
		
		getID('npm-container').style.display='none'
	}
	checkNpmPw();
};

var checkNpmPw = function() {
	if ( getID('txtNpmPw').value == getID('txtConfirmNpmPw').value ) {
		if (getID('txtConfirmNpmPw').value == '') { // Karin : 비밀번호 미입력시 valid 표시되는 오류 해결
			getID('spCfNpmPwStatus').innerText = '';
			return;
		}
		getID('spCfNpmPwStatus').classList.add('label-success');
		getID('spCfNpmPwStatus').classList.remove('label-danger');
		getID('spCfNpmPwStatus').innerText = getVal('valValid');
	} else {
		getID('spCfNpmPwStatus').classList.add('label-danger');
		getID('spCfNpmPwStatus').classList.remove('label-success');
		getID('spCfNpmPwStatus').innerText = getVal('valInvalid');
	}	
};

if ( getID('txtConfirmNpmPw') != null )
getID('txtConfirmNpmPw').onkeyup = function() {
	Log.d('accountdetail.js -> txtConfirmNpmPw() called...');
	checkNpmPw();
};

if ( getID('btnNpmChk') != null )
getID('btnNpmChk').onclick = function(e) {
	Log.d('accountdetail.js -> btnNpmChk() called...');
	
	let npmId = getVal('txtNpmId');
	if ( npmId == '' ) {
		modalAlert('"NPM ID" is required.');
		getID('txtNpmId').focus();
		return;
	}
	
	//-----------------------------------------
	let params = new URLSearchParams();
	params.append('id', npmId);
	
	let target = '/npm/checkid';
	axios.post(target, params)
	.then( function(response) {
		// Log.d( 'response.data.name : ', response.data.name );
		let result = JSON.parse(response.data.result);
		Log.d( 'result : ', result );
		if ( result == null ) {
			getID('spNpmIdStatus').classList.remove('label-danger');
			getID('spNpmIdStatus').classList.add('label-success');		
			getID('spNpmIdStatus').innerHTML = getVal("valAvailable");
		} else {
			getID('spNpmIdStatus').classList.remove('label-success');
			getID('spNpmIdStatus').classList.add('label-danger');
			getID('spNpmIdStatus').innerHTML = getVal("valExist");
			let msg = '';
			msg = 'NPM ID : %s<br />email : %s<br />role : %s'
			   .sprintf(result.userId, result.emailAddress, result.roles[0].roleId);
			modalAlert( msg );
		}
	})
	.catch( function(error) {
		Log.d('btnNpmChk() -> error=', error);
	});
};

var npmRoles = function() {
	Log.d( 'npmRoles() called...' );
	
	axios.post('/npm/roles')
	.then( function(response) {
		let result = JSON.parse(response.data.result);
		let len = 0;
		if ( result.length > 0 )
			len = result.length;
		
		Log.d( 'result : ', result );
		Log.d( 'len : ', len );
				
		// <option value="">test</option>
		let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'
				   .sprintf(result[i].roleId, result[i].roleId);
		}
		getID('selNpmRole').innerHTML = opt;
		getID('selNpmRole').value = 'nx-anonymous'; // default select
	})
    .catch( function( error ) {
    	Log.d('npmRoles() -> error=', error);
    });
};

if ( getID('btnInsertNpm') != null )
getID('btnInsertNpm').onclick = function(e) {
	Log.d('accountdetail.js -> btnInsertNpm() called...');
	
	if ( getID('spNpmIdStatus').innerHTML != getVal("valAvailable") ) {
		modalAlert('Check "NPM ID".');
		getID('txtNpmId').focus();
		return;
	}
	
	if ( getVal('txtEmail') == '' ) {
		modalAlert('Email is required.');
		getID('txtEmail').focus();
		return;
	}

	if (getVal('txtNpmPw').length==0||getVal('txtConfirmNpmPw').length==0){
		modalAlert('Check "NPM password is empty."');
		getID('txtNpmPw').focus();
		return;
	}
	
	if (getVal('txtNpmPw') != getVal('txtConfirmNpmPw')){
		modalAlert('Check "NPM password is incorrect."');
		getID('txtNpmPw').focus();		
		return;
	}
			
	//-----------------------------------------
	let npmId = getVal('txtNpmId');
	let email = getVal('txtEmail');
	let pw = getVal('txtNpmPw');
	let npmRole = getVal('selNpmRole');
	let content = {
		id: npmId,
	    first_name: npmId,
	    last_name: npmId,
	    email: email,
	    password: pw,
	    roles:  [npmRole]
	};
	let params = new URLSearchParams();
	params.append('content', JSON.stringify(content));
	
	let target = '/npm/insert';
	axios.post(target, params)
	.then( function(response) {
		Log.d( 'response.data.result : ', response.data.result );
		let result = response.data.result;
		if ( result.toLowerCase().indexOf("orecordduplicatedexception") != -1 ) {
			modalAlert('Duplicated NPM ID.');
			return;
		}
		modalAlert('"'+npmId+'" registered successfully.');
		NPM_STATUS = 1;
	})
	.catch( function(error) {
		Log.d('btnInsertNpm() -> error=', error);
	});
};

getID('btnList').onclick = function(e) {
	Log.d('accountdetail.js -> btnList() called...');
	mv('/manage/account/list.do');
};

getID('txtConfirmPw').onkeyup = function() {
	Log.d('accountdetail.js -> txtConfirmPw() called...');
	if ( getID('spPwStatus').innerText == getVal("valValid")
		 && getID('txtPw').value == getID('txtConfirmPw').value ) {
		getID('spCfPwStatus').classList.add('label-success');
		getID('spCfPwStatus').classList.remove('label-danger');
		getID('spCfPwStatus').innerText = getVal("valValid");
	} else {
		getID('spCfPwStatus').classList.add('label-danger');
		getID('spCfPwStatus').classList.remove('label-success');
		getID('spCfPwStatus').innerText = getVal("valInvalid");
	}
};

if ( queryString('mode') == 'I' ) { // 입력 모드
getID('btnEmailChk').onclick = function(e) {
	Log.d('btnEmailChk() called...');

	let email = getVal('txtEmail').toLowerCase();
	if ( !checkEmail(email) ) {
		modalAlert('Email validation check is required.');
		getID('txtEmail').focus();
		return;
	}
	
	let params = new URLSearchParams();
	params.append('email', email);
	
	axios.post('/manage/account/checkemail', params)
	.then( function(response) {
		Log.d('response.data : ', response.data);
		let r = response.data;
		
		if ( r[0].count == 0 ) {
			getID('spEmailStatus').style.display = '';
			getID('hdnEmail').value = getVal('txtEmail').toLowerCase();
		} else {
			getID('spEmailStatus').style.display = 'none';
			getID('txtEmail').value = '';
			modalAlert('This email is already in use.');
		}
	})
    .catch( function(error) {
    	Log.d('btnCheckDupProduct() -> error=', error);
    });
};
}

//----------------------------------------------
// pw valid check
getID('txtPw').onkeyup = function() {
	if ( this.value.length <= 0 ) {
		getID('spPwStatus').innerText = getVal("valInvalid");;
		getID('spPwStatus').classList.remove('label-danger');
		getID('spPwStatus').classList.remove('label-success');
		
		getID('spCfPwStatus').innerText = getVal("varInValid");
		getID('spCfPwStatus').classList.remove('label-danger');
		getID('spCfPwStatus').classList.remove('label-success');		
		return;
	}
	
	getID('txtConfirmPw').onkeyup();
	
	// Validate lowercase letters
	var lows = /[a-z]/g;
	if ( this.value.match(lows) ) {
		this.lowChk = true;
	} else {
		this.lowChk = false;
	}

	// Validate capital letters
	var ups = /[A-Z]/g;
	if ( this.value.match(ups) ) {
		this.upChk = true;
	} else {
		this.upChk = false;
	}

	// Validate numbers
	var numbers = /[0-9]/g;
	if ( this.value.match(numbers) ) {
		this.numChk = true;
	} else {
		this.numChk = false;
	}

	// Validate length
	if ( this.value.length >= 8 ) { // min
		this.lenChk = true;
		if ( this.value.length > 256 ) // max
			this.lenChk = false;
	} else {
		this.lenChk = false;
	}
	
	if ( this.lowChk 
		 && this.upChk
		 && this.numChk
		 && this.lenChk ) {
		getID('spPwStatus').classList.add('label-success');
		getID('spPwStatus').classList.remove('label-danger');
		getID('spPwStatus').innerText = getVal("valValid");
	} else {
		getID('spPwStatus').classList.add('label-danger');
		getID('spPwStatus').classList.remove('label-success');
		getID('spPwStatus').innerText = getVal("valInvalid");
	}
};

if ( queryString('mode') == 'I' ) { // 입력 모드
getID('txtEmail').onkeyup = function() {
	if ( getID('spEmailStatus').style.display == '' ) {
		if ( getID('txtEmail').value.toLowerCase() != getID('hdnEmail').value ) {
			getID('spEmailStatus').style.display = 'none';
		} 
	}
};
}

getID('selActive').onchange = function() {
	if ( this.value == "1" && getID('txtLoginFailCnt') ) {
		getID('txtLoginFailCnt').value = '0';
	}
};

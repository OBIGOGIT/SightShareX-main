
var companies = function() {
	return new Promise((resolve, reject) => {
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
			getID('selCompany').innerHTML = ''; // 기존 옵션 제거

			getID('selCompany').innerHTML += opt;

			// if ( queryString('mode') != 'I' ) { // 수정 모드
			// 	appDetailInfo();
			// }

			// getSelVehicle();
			resolve();
		})
		.catch( function( error ) {
			Log.e('companies() -> error=', error);
			reject(error);
		});
	});
};

var appDetailInfo = function() {
	Log.d('appDetailInfo() called...');


	let params = {
		'appSeq' : queryString('appSeq')
	};

	Log.d('params : ', params);

	axios.post('/manage/app/detail', JSON.stringify(params), {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then( function (response) {
			let data = response.data;
			Log.d( 'appDetailInfo() -> data : ', data );
			Log.d( 'appDetailInfo() -> data name : ', data.name );

			if ( data != null ) { // 있으면...
				// getID('txtEmail').value = data[0].email;
				getID('txtName').value = data.name;
				getID('txtAppId').value = data.code;
				getID('txtImgUrl').value = data.imgUrl;
				// getID('txtAppId').value = data.imgUrl;
				getID('txtUpdatedEmail').value = data.updateEmail;
				getID('txtCreatedDate').value = utcToLoc(data.created);
				getID('txtUpdatedDate').value = utcToLoc(data.updated);

				companies().then(function () {
					selSetting(data.companyId, data.vehicleCode, data.headunitCode);
					getSelVehicle().then(function() {
						selSetting(data.companyId, data.vehicleCode, data.headunitCode);
						getSelHeadunit().then(function() {
							selSetting(data.companyId, data.vehicleCode, data.headunitCode);
						});
					});
				});


				// selSetting(data.companyId, data.vehicleCode, data.headunitCode);

				// if ( queryString('mode') != 'I' ) { // 수정 모드
				// 	selSetting(data.companyId, data.vehicleCode, data.headunitCode);
				// }



			}
		})
		.catch( function (error) {
			Log.d('accountDetailInfo() -> error=', error);
		});
};

var selSetting = function (companyId, vehicleCode, headunitCode) {
	var selCompany = getID('selCompany')
	//
	console.debug("data.companyId : ", companyId);
	if( companyId != "" ) {
		// companyId에 해당하는 option을 선택 상태로 만들기
		// console.log("selCompany.options : ", selCompany.options)
		// console.log("selCompany.options.length : ", selCompany.options.length)
		// console.log("selCompany.options[i].value : ", selCompany.options[0])

		for (let i = 0; i < selCompany.options.length; i++) {
			// console.log("company test : ", selCompany.options[i].value);
			// console.log("company test2 : ", companyId.includes(parseInt(selCompany.options[i].value)));
			console.log("companyId : %s  selCompany.options[i].value) : %s  eq %s ", companyId, selCompany.options[i].value, ( companyId == selCompany.options[i].value ) )
			console.log("company test : ", companyId == (parseInt(selCompany.options[i].value)));
			if (companyId == (parseInt(selCompany.options[i].value))) {
				console.log("com true")
				selCompany.options[i].selected = true;
				console.log("selCompany.options[i].value : ", selCompany.options[i].value)

			}

		}

		let selVehicle = getID('selVehicleModel');
		console.log("getID('selVehicleModel').value : ", getID('selVehicleModel').value);
		console.log("selVehicle.options.length : ", selVehicle.options.length)
		for ( let i = 0; i < selVehicle.options.length; i++ ) {
			console.log("vehicleCode : %s  selVehicle.options[i].value) : %s  eq %s ", vehicleCode, selVehicle.options[i].value, ( vehicleCode == selVehicle.options[i].value ) )
			if(vehicleCode == selVehicle.options[i].value) {
				selVehicle.options[i].selected = true;

			}

		}

		let selHeadunit = getID('selHeadunit');
		console.log("selHeadunit : ", selHeadunit.options.length)
		for ( let i = 0; i < selHeadunit.options.length; i++ ) {
			console.log("headunitCode == selHeadunit.options[i].value : ", headunitCode == selHeadunit.options[i].value)
			if(headunitCode == selHeadunit.options[i].value) {
				selHeadunit.options[i].selected = true;
			}

		}

	}

}

var getSelVehicle = function() {
	return new Promise(function(resolve, reject) {
		console.log("getSelVehicle ::: getVal('selCompany') : ", getVal('selCompany'))
		let selCompanyVal = getVal('selCompany')

		let params = {
			// 'companyId' : selCompanyVal
			'companyId' : getVal('selCompany')
		};

		axios.post('/manage/dashboard/vehicleList', JSON.stringify(params), {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (response) {
				let data = response.data;
				let len = data.length;

				console.log("vehicleList data : ", data)
				// if (len <= 0) return;

				let opt = '';

				// if (len > 0) {
					for (let i = 0; i < len; i++) { // 첫 번째 옵션은 건너뛰고 반복문 시작
						opt += '<option value="%s">%s</option>'
							.sprintf(data[i].code, data[i].name);
					}

					let selVehicleModel = getID('selVehicleModel');
					selVehicleModel.innerHTML = ''; // 기존 옵션 제거

					selVehicleModel.innerHTML += opt; // 새로운 옵션 추가

				// }

				resolve();
			})
			.catch(function(error) {
				Log.d('error=', error);
				reject(error);
			});
	});
};


var getSelHeadunit = function() {
	return new Promise(function(resolve, reject) {
	console.log("getSelHeadunit ::: getVal('selVehicleModel') : ", getVal('selVehicleModel'))

	let params = {
		'companyId' : getVal('selCompany'),
		'vehicleCode' : getVal('selVehicleModel')
	};


	axios.post('/manage/app/headunitList', JSON.stringify(params), {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(function (response) {
			let data = response.data;
			let len = data.length;
			// if (len <= 0) return;

			console.log("headunitList data : ", data)

			let opt = '';

			// if (len > 0) {
				for (let i = 0; i < len; i++) { // 첫 번째 옵션은 건너뛰고 반복문 시작
					opt += '<option value="%s">%s</option>'
						.sprintf(data[i].code, data[i].name);
				}

				let selHeadunit = getID('selHeadunit');
				selHeadunit.innerHTML = ''; // 기존 옵션 제거

				selHeadunit.innerHTML += opt; // 새로운 옵션 추가

			// }
			resolve();

		})
		.catch(function(error) {
			Log.d('error=', error);
		});
	});
};

var checkAppName = function (oemVal, vehicleVal, headunitVal, appName) {

	console.log("checkAppName call");

	let params = {
		'appSeq' : queryString('appSeq'),
		'mode' : queryString('mode'),
		'name' : appName,
		'companyId' : oemVal,
		'vehicleCode' : vehicleVal,
		'headunitCode' : headunitVal
	};


	axios.post('/manage/app/checkAppName', JSON.stringify(params), {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(function (response) {
			let data = response.data;
			console.log("chkApp : ", data)
			let r = response.data.result;

			if ( response.data.result == 'ok' ) {
				getID('spNameStatus').style.display = '';
			} else {
				getID('spNameStatus').style.display = 'none';
				getID('txtName').value = '';
				modalAlert('This name is already in use.');
			}
			// if ( data != null ) {
			// 	getID('spNameStatus').style.display = '';
			// } else {
			// 	getID('spNameStatus').style.display = 'none';
			// 	getID('txtName').value = '';
			// 	modalAlert('This name is already in use.');
			// }



		})
		.catch(function(error) {
			Log.d('error=', error);
		});
}


getID('selCompany').onchange = function(e) {
	Log.d('selCompany() -> e : ', e);
	getSelVehicle().then(getSelHeadunit)
};

getID('selVehicleModel').onchange = function(e) {
	Log.d('selVehicleModel() -> e : ', e);
	getSelHeadunit();
};

getID('btnList').onclick = function(e) {
	Log.d('appDetail.js -> btnList() called...');
	mv('/manage/app/list.do');
};

getID('btnAppNameChk').onclick = function(e) {
	let appId = getVal('txtAppId');
	let oemVal = getVal('selCompany');
	let vehicleVal = getVal('selVehicleModel');
	let headunitVal  = getVal('selHeadunit');
	let appName = getVal('txtName').trim();


	if(appName == "") {
		if ( appName == "" ) {
			modalAlert('Please enter the app name.');
			return;
		}
	}

	if ( oemVal == "" ) {
		modalAlert('Please select Current OEM.');
		return;
	}

	if ( vehicleVal == "" ) {
		modalAlert('Please select Current Vehicle.');
		return;
	}

	if ( headunitVal == "" ) {
		modalAlert('Please select Current Headunit.');
		return;
	}

	Log.d("btnAppNameChk ::: oemVal : ", oemVal)
	checkAppName(oemVal, vehicleVal, headunitVal, appName);

	// if ( !checkAppName(oemVal, vehicleVal, headunitVal, appName) ) {
	// 	modalAlert('Name is required.');
	// 	getID('txtName').focus();
	// 	return;
	// }

};

if ( getID('btnSave') != null ) {
	getID('btnSave').onclick = function(e) {
		Log.d('appdetail.js -> btnSave() called...');

		// if ( getID('chkRegNpm') != null
		// 	&& getID('chkRegNpm').checked
		// 	&& NPM_STATUS == 0 ) {
		// 	modalAlert('You have to check NPM ID registration.');
		// 	return;
		// }

		//-----------------------------------------------
		// valid check
		let appId = getVal('txtAppId');
		if ( appId.trim() == '' ) {
			modalAlert('App Id is required.');
			getID('txtAppId').focus();
			return;
		}

		let imgUrl = getVal('txtImgUrl');
		if ( imgUrl.trim() == '' ) {
			modalAlert('Image Url is required.');
			getID('txtImgUrl').focus();
			return;
		}


		// oem 체크
		let oemVal = getVal('selCompany');
		if ( oemVal == "" ) {
			modalAlert('Please select Current OEM.');
			return;
		}

		let vehicleVal = getVal('selVehicleModel');
		if ( vehicleVal == "" ) {
			modalAlert('Please select Current Vehicle.');
			return;
		}

		let headunitVal  = getVal('selHeadunit');
		if ( headunitVal == "" ) {
			modalAlert('Please select Current Headunit.');
			return;
		}

		let appName = getVal('txtName');
		if ( queryString('mode') == 'I' ) { // 입력 모드
			// if ( !checkAppName(oemVal, vehicleVal, headunitVal, appName) ) {
			// 	modalAlert('Name is required.');
			// 	getID('txtName').focus();
			// 	return;
			// }

			if ( getID('spNameStatus').style.display == 'none' ) {
				modalAlert('name duplication check is required.');
				return;
			}
		}

		let params = {
			'appSeq' : queryString('appSeq'),
			'mode' : queryString('mode'),
			'code' : appId,
			'name' : appName,
			'imgUrl' : imgUrl,
			'companyId' : getVal('selCompany'),
			'vehicleCode' : getVal('selVehicleModel'),
			'headunitCode' : getVal('selHeadunit')
		};

		console.log("app btnSave() -> params : ", params)
		//Log.d('btnSave() -> params : ', params);

		let target = '/manage/app/modify'; // insert, update 통합
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
				mv('/manage/app/list.do');
			})
			.catch( function(error) {
				Log.d('btnSave() -> error=', error);
			});
	};
}


if ( getID('btnDelete') != null && queryString('mode') != 'I' ) {
	getID('btnDelete').onclick = function(e) {
		Log.d('appdetail.js -> btnDelete() called...');

		if (confirm("Do you want to delete the app?")) {
			let params = {
				'appSeq' : queryString('appSeq'),
				'mode' : queryString('mode')
			};

			console.log("app btnDelete() -> params : ", params)

			let target = '/manage/app/delete';
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
					mv('/manage/app/list.do');
				})
				.catch( function(error) {
					Log.d('btnSave() -> error=', error);
				});
		}
	};
}


window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('appDetail.js -> DOMContentLoaded() called...');
	// $.fn.companies();
	// companies();
	if ( queryString('mode') != 'I' ) { // 수정 모드
		appDetailInfo();
	} else {
		companies().then(function () {
			// selSetting(data.companyId, data.vehicleCode, data.headunitCode);
			getSelVehicle().then(function() {
				// selSetting(data.companyId, data.vehicleCode, data.headunitCode);
				getSelHeadunit().then(function() {
					// selSetting(data.companyId, data.vehicleCode, data.headunitCode);
				});
			});
		});
	}
});
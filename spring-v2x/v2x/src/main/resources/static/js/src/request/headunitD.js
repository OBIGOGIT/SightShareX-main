//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('headunitD.js -> DOMContentLoaded() called...');
	headunitDetailInfo();
});


var headunitDetailInfo = function() {
	Log.d('headunitDetailInfo() called...');
	
	let params = new URLSearchParams();
	params.append('requestId', queryString('requestId'));
	Log.d('params : ', params);
	
	axios.post('/request/headunit/detail', params)
	.then( function (response) {
		let data = response.data;
		Log.d( 'headunitDetailInfo() -> data : ', data );
		
		if (data == null)
			return;

		getID('txtManufacturer').value = data.manufacturer;
		getID('txtModel').value = data.model;
		getID('txtCreated').value = utcToLoc(data.created);
		getID('txtUpdated').value = utcToLoc(data.updated);
		getID('txtUser').value = data.createdUser;
		getID('hdnCreateId').value = data.createdUser;
		getID('selStatus').value = data.status;
	})
	.catch( function (error) {
		Log.d('headunitDetailInfo() -> error=', error);
	});    		
};

getID('btnSave').onclick = function(e) {
	Log.d('headunitD.js -> btnSave() called...');
	
	let requestId = '';
	
	let manufacturer = getVal('txtManufacturer');
	if (manufacturer == "") {
		modalAlert('Manufacturer is required.');
		return;
	}
	
	let model = getVal('txtModel');
	if (model == "") {
		modalAlert('Model is required.');
		return;
	}

	let params = new URLSearchParams();
	params.append('manufacturer', manufacturer);
	params.append('model', model);
	
	let target = '';
	if ( queryString('mode') == 'I' ) {
		target = '/request/headunit/add';
	} else {
		requestId = queryString('requestId');
		params.append('requestId', requestId);
		params.append('status', getVal('selStatus'));
		target = '/request/headunit/modify';
	}
	
	axios.post(target, params)
	.then( function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'failed' ) {
			if (response.data.desc != null) {
				modalAlert(response.data.desc);
			} else {
				modalAlert('Processing failed.');
			}
			return;
		} else if ( response.data.result == 'redirect' ) {
			mv(response.data.cmd);
			return;
		}
		
		Log.d('headunitD.js -> btnSave() ok');
		mv('/request/headunit/list.do');
	})
	.catch( function(error) {
		Log.d('btnSave() -> error=', error);
	});
};

getID('btnList').onclick = function(e) {
	Log.d('headunitD.js -> btnList() called...');
	mv('/request/headunit/list.do');
};

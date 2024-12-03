// let pageChange = function(p, s) {
//     Log.d("pageChange() -> page : ", p, " size: ", s);
//     products.getSelectProductType(p);
// };

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
//
// 		if ( queryString('mode') != 'I' ) { // 수정시
// 			companyDetailInfo();
// 		}
// 	})
//     .catch( function( error ) {
//     	Log.d('companyTypes() -> error=', error);
//     });
// };

var companyDetailInfo = function() {
	Log.d('companyDetailInfo() called...');
	
	let params = new URLSearchParams();
	params.append('companyId', queryString('companyId'));
	Log.d('params : ', params);
	
	axios.post('/manage/company/detail', params)
	.then( function (response) {
		let data = response.data;
		Log.d( 'companyDetailInfo() -> data : ', data );
		
		if ( data.length > 0 ) { // 있으면...
			getID('txtCompanyName').value = data[0].company_name;
			// getID('selCompanyType').value = data[0].company_type_id;
			getID('txtDomain').value = data[0].domain;
			getID('txtEmail').value = data[0].email;
			getID('txtAddress').value = data[0].address;
			getID('selActive').value = data[0].is_active;
			getID('txtDesc').value = data[0].description;
			getID('txtCode').value = data[0].company_code;
			getID('txtCreateId').value = data[0].create_id;
			getID('txtUpdateId').value = data[0].update_id;
			getID('txtCreatedDate').value = utcToLoc(data[0].created);
			getID('txtUpdatedDate').value = utcToLoc(data[0].updated);
		}
	})
	.catch( function (error) {
		Log.d('companyDetailInfo() -> error=', error);
	});    		
};

//---------------------------------------------------------------------
// product 관련
var products = {};
products.datas = [];
products.bChanged = false;
products.setUI = function() {
	getID('select-products').innerHTML = ''; // clear ui
	let trs = "";
	let tds = "";
	for ( let k = 0 ; k < products.datas.length ; k++ ) {
		tds += products.datas[k].select ? 
			   "<td><label class='ob-customcheck'><input type='checkbox' onclick='products.changeSelect(%s, this)' style='display: none;' checked><span class='ob-checkmark'></span></label></td>".sprintf(products.datas[k].producttype) : 
			   "<td><label class='ob-customcheck'><input type='checkbox' onclick='products.changeSelect(%s, this)' style='display: none;'><span class='ob-checkmark'></span></label></td>".sprintf(products.datas[k].producttype);
		tds += "<td>%s</td>".sprintf(products.datas[k].productname);
		tds += "<td>%s</td>".sprintf(products.datas[k].description);
		tds += "<td>%s</td>".sprintf(products.datas[k].useremail);
		tds += "<td>%s</td>".sprintf(products.datas[k].updated);
		
		trs += "<tr>%s</tr>".sprintf(tds);
		tds = "";
	}
	getID('select-products').innerHTML = trs;
};

products.changeSelect = function(producttype, chk) {
	// Log.d('products.changeSelect() -> producttype=', producttype, 'chk.checked', chk.checked);
	for ( let i = 0 ; i < this.datas.length ; i++ ) {
		if ( this.datas[i].producttype == producttype ) {
			this.datas[i].select = chk.checked;
			this.bChanged = true; // 수정 flag on
			break;
		}
	}
	// Log.d('products.changeSelect() -> this.datas=', this.datas);
};

products.setDatas = function(data) {
	// set data
	products.datas = []; // clear data

	let len = data.length;
	if ( len <= 0 )
		return;
	
	let tr = '';
	for ( let i = 0 ; i < len ; i++ ) {
		products.datas.push( {select: false, // default false
			producttype: data[i].producttype,
			productname: data[i].productname,
			description: data[i].description,
			useremail: data[i].useremail,
			updated: utcToLoc(data[i].updated)} );
	}
	
	Log.d('products.makeSelectProducts() -> products.datas=', products.datas);
	
	this.setUI();
};

products.updateSelectedProduct = function(companyId) {
	Log.d( 'products.updateSelectedProduct() called...' );
	
	let params = new URLSearchParams();
	params.append('companyId', companyId);
	params.append('curProductTypes', JSON.stringify(this.datas));
	Log.d('products.updateSelectedProduct() -> params : ', params);

	axios.post('/manage/company/producttype/selected/modify', params)
	.then( function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'ok' ) {
			// modalAlert('처리 성공2');
			Log.d('처리 성공2');
			mv('/manage/company/list.do');
		}
	})
    .catch( function(error) {
    	Log.d('products.updateSelectedProduct() -> error=', error);
    });
};

//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('companyDetail.js -> DOMContentLoaded() called...');
	// companyTypes();
	// products.getSelectProductType( 1 );

	if ( queryString('mode') != 'I' ) {
		getID('txtCode').readOnly = true;
		companyDetailInfo();
	}

});

window.onload = function(e) {
	Log.d('companyDetail.js -> window.onload called...', e);
}

if(getID('btnSave')!=null)
getID('btnSave').onclick = function(e) {
	Log.d('companyDetail.js -> btnSave() called...');
	
	if ( getVal('txtCompanyName') == '' ) {
		modalAlert('Company name is required.');
		return;
	}

	// if ( getVal('selCompanyType') == '' ) {
	// 	modalAlert('Company type is required.');
	// 	return;
	// }
	
	if ( getVal('txtDomain') == '' ) {
		modalAlert('Domain is required.');
		return;
	}
	
	if ( getVal('txtEmail') == '' ) {
		modalAlert('Email is required.');
		return;
	}
	
	if ( getVal('txtAddress') == '' ) {
		modalAlert('Address is required.');
		return;
	}

	if ( getVal('txtCode') == '' ) {
		modalAlert('Company code is required.');
		return;
	}
	
	// let params = new URLSearchParams();
	// params.append('companyId', queryString('companyId'));
	// params.append('companyName', getVal('txtCompanyName'));
	// params.append('companyType', getVal('selCompanyType'));
	// params.append('domain', getVal('txtDomain'));
	// params.append('email', getVal('txtEmail'));
	// params.append('address', getVal('txtAddress'));
	// params.append('active', getVal('selActive'));
	// params.append('description', getVal('txtDesc'));
	// params.append('companyCode', getVal('txtCode').toUpperCase());

	let params = {
		'companyId': queryString('companyId'),
		'name': getVal('txtCompanyName'),
		// 'companyType': getVal('selCompanyType'),
		'domain': getVal('txtDomain'),
		'email': getVal('txtEmail'),
		'address': getVal('txtAddress'),
		'active': getVal('selActive'),
		'description': getVal('txtDesc'),
		'companyCode': getVal('txtCode').toUpperCase()
	};



	Log.d('btnSave() -> params : ', params);
	
	let target = '';
	if ( queryString('mode') == 'I' ) {
		target = '/manage/company/add';
	} else {
		target = '/manage/company/modify';
	}
	
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
		
		//-------------------------------------------
		let companyId = '';		
		if ( queryString('mode') == 'I' ) {
			companyId = response.data.desc;
		}
		
		//--------------------------------------------
		// products 선택은 변경이 있을때만 처리
		if ( products.bChanged == false ) {
			// modalAlert('처리 성공1');
			Log.d('처리 성공1');
			mv('/manage/company/list.do');
			return;
		}

		if ( queryString('mode') == 'I' ) { // 추가
			products.updateSelectedProduct( companyId );
		} else { // 수정
			products.updateSelectedProduct( queryString('companyId') );
		}
	})
	.catch( function(error) {
		Log.d('btnSave() -> error=', error);
	});
};

getID('btnList').onclick = function(e) {
	Log.d('companyDetail.js -> btnList() called...');
	mv('/manage/company/list.do');
};

getID('selectAll').onchange = function(e) {
	Log.d('selectAll() -> e.target.checked : ', e.target.checked);

	for ( let i = 0 ; i < products.datas.length ; i++ ) {
		products.datas[i].select = e.target.checked;
		products.bChanged = true; // 수정 flag on
	}
	
	products.setUI();
};

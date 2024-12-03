const PAGE_UNIT = 5;
const COL_START = 3;

var pageChange = function(p, s) {
    Log.d("pageChange() -> page : ", p, " size: ", s);
    customFieldList( p );
};

var customFields = function() {
	Log.d( 'customFields() called...' );
	
	getID('selCustomfield').innerHTML = '<option value="">= Select Field =</option>'; // reset
	
	axios.post('/manage/producttype/extfield/selected/list')
	.then( function(response) {
		let data = response.data;
		let len = data.length;
		Log.d( 'customFields() -> data : ', data );
		
		let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'
				   .sprintf(data[i].ext_type, data[i].ext_value);
		}
		getID('selCustomfield').innerHTML += opt;
		
		//---------------------------------------
		if ( queryString('mode') != 'I' ) { // 수정 모드
			productTypeDetail();
		}
	})
    .catch( function( error ) {
    	Log.d('customFields() -> error=', error);
    });
};

var customFieldDetail = function(ext_type) {
	Log.d('customFieldDetail() -> ext_type=', ext_type);
	let params = new URLSearchParams();
	params.append('ext_type', ext_type);
	
	params.append('curPage', '1');
	params.append('pageUnit', PAGE_UNIT);
	
	axios.post('/manage/producttype/extfield/list', params)
	.then( function(response) {
		Log.d('response.data : ', response.data);
		if ( response.data.length <= 0 )
			return;
		
		let result = response.data;
		Log.d('customFieldDetail() -> result=', result);
		getID('hdnExtTypeU').value = ext_type;
		getID('hdnCustomFieldU').value = result[0]['Field Name'];
		getID('txtCustomFieldU').value = result[0]['Field Name'];
		getID('txtCustomFieldDescU').value = result[0]['Description'];
		
		customFieldValues(ext_type);
		showHide('bgCustomFieldStatusU', false);
	})
    .catch(function (error) {
    	Log.d(error);
    });
}

var customFieldValues = function(ext_type) {
	Log.d('customFieldValues() -> ext_type=', ext_type);
	getID('selAddedFieldValuesU').innerHTML = ''; // reset
	let params = new URLSearchParams();
	params.append('ext_type', ext_type);
	
	axios.post('/manage/producttype/extfield/detail', params)
	.then( function(response) {
		Log.d('response.data : ', response.data);
		if ( response.data.length <= 0 )
			return;
		
		let result = response.data;
		let len = result.length;
		Log.d('customFieldValues() -> result=', result);

		let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'
				   .sprintf(result[i].col_value_id, result[i].col_value);
		}
		getID('selAddedFieldValuesU').innerHTML = opt;
	})
    .catch(function (error) {
    	Log.d(error);
    });
}

var customFieldList = function(page) {
	getID('table-list-body').innerHTML = ''; // clear body data
	
	let params = new URLSearchParams();
	params.append('customFieldName', getVal('txtCustomFieldName'));
	params.append('description', getVal('txtCustomFieldDescForSearch'));
	
	params.append('curPage', page);  // 1 페이지
	params.append('pageUnit', PAGE_UNIT);
	
	axios.post('/manage/producttype/extfield/list', params)
	.then( function(response) {
		Log.d('response.data : ', response.data);
		if ( response.data.length <= 0 )
			return;
		
		let result = response.data;
		//---------------------------------------
		// 1. 테이블 header 만들기 : 처음에 한번만 만들기.
		if ( getID('table-list-head').innerHTML == "" ) {
			let key = Object.getOwnPropertyNames( result[0] );
			// Log.d( key );
			// <tr><th>%s</th></tr>
			let tr = '';
			let th = '';
			for ( let i = COL_START ; i < key.length ; i++ ) {
				//Log.d('key', key[i] );
				th += '<th>%s</th>'.sprintf(key[i]);
			}
			tr = '<tr>%s</tr>'.sprintf(th);
			// Log.d( 'header : ', tr );
			getID('table-list-head').innerHTML = tr;
		}

		//---------------------------------------
		// 2. 테이블 body 만들기
		let tr = '';
		let td = '';		
		let len = result.length;
		
		for ( let i = 0 ; i < len ; i++ ) {
			let key = Object.getOwnPropertyNames( result[0] );
			for ( let k = COL_START ; k < key.length ; k++ ) {
				// Log.d(result[i][key[k]]);
				if ( k == 8 ) { // Active
					if ( result[i][key[k]] == '1' )
						td += '<td>On</td>';
					else
						td += '<td>Off</td>';
				} else {
					td += '<td>%s</td>'.sprintf(result[i][key[k]]);
				}
			}
			tr += '<tr style="cursor: pointer;" onclick="customFieldDetail(\'%s\')">%s</tr>'.sprintf(result[i].ext_type, td);
			td = ''; // reset
		}
		getID('table-list-body').innerHTML = tr;
		
		//---------------------------------------
		// 3. 페이지 처리
		let curPage = result[0].page;
		let pageCount = Math.ceil(result[0].totalcnt/PAGE_UNIT);
		Log.d( 'curPage : ', curPage );
		Log.d( 'pageCount : ', pageCount );
		
		if ( typeof Pagination != "undefined" )  {
		    Pagination._pageNum = pageCount; // from server
		    Pagination._initPage = curPage;
		    
	        Pagination.Init(document.getElementById('pagination'), {
	            size: Pagination._pageNum,  // pages size ( 총 페이지 수 )
	            page: Pagination._initPage, // selected page ( 처음 시직시 선택 페이지 번호 )
	            step: 3          // pages before and after current ( 선택 페이지 기준으로 전 후 몇개 까지 표시 할까 )
	        });
		}
		// Log.d( 'Pagination : ', Pagination );
	})
    .catch(function (error) {
    	Log.d(error);
    });
}

var productTypeDetail = function() {
	let productType = queryString('producttype');
	Log.d('productTypeDetail() -> productType : ', productType);
	
	let params = new URLSearchParams();
	params.append('productType', productType);
	
	axios.post('/manage/producttype/detail', params)
	.then( function(response) {
		Log.d('response.data : ', response.data);
		if ( response.data.length <= 0 )
			return;
		
		let r = response.data;
		
		getID('hdnProductType').value = productType;
		getID('txtProductValue').value = r[0].product_value;
		getID('hdnProductValue').value = r[0].product_value;
		getID('txtDesc').value = r[0].description;
		getID('txtUserEmail').value = r[0].user_email;
		getID('txtUpdated').value = utcToLoc(r[0].updated);
		
		getExts(productType);
	})
    .catch(function (error) {
    	Log.d('productTypeDetail() -> error : ', error);
    });
};

var getExts = function(productType) {
	Log.d('getExts() -> productType : ', productType);
	
	let params = new URLSearchParams();
	params.append('productType', productType);
	
	axios.post('/manage/producttype/extfield/flist', params)
	.then( function(response) {
		Log.d('getExts() -> response.data : ', response.data);
		if ( response.data.length <= 0 )
			return;
		
		let r = response.data;
		let len = r.length;
		let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'.sprintf(r[i].extType, r[i].extValue);
		}
		getID('selSelectedFieldValue').innerHTML = opt;
	})
    .catch(function (error) {
    	Log.d('getExts() -> error : ', error);
    });	
}

//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('DOMContentLoaded() called...');
	customFields();
	customFieldList( 1 );
});

getID('btnSearch').onclick = function(e) {
    Log.d('btnSearch() called...');
    customFieldList( 1 );
};

getID('btnCheckDupProduct').onclick = function(e) {
	Log.d('btnCheckDupProduct() called...');

	let productVal = getVal('txtProductValue');
	if ( productVal == "" ) {
		showHide('bgProductNameStatus', false);
		modalAlert('Product type name is required.');
		return;
	}
	
	if ( queryString('mode') != 'I' ) { // 수정 모드
		if ( getVal('hdnProductValue') == productVal ) {
			showHide('bgProductNameStatus', true);
			return;
		}
	}
	
	axios.post('/manage/producttype/duplicate')
	.then( function(response) {
		// Log.d('response.data : ', response.data);
		let arr = response.data;
		for ( var i in arr ) {
			if ( arr[i].product_value == productVal ) {
				if ( queryString('mode') != 'I' ) { // 수정 모드
					getID('txtProductValue').value = getVal('hdnProductValue');// 원본 값.
				} else {
					getID('txtProductValue').value = '';
				}
				showHide('bgProductNameStatus', false);
				
				modalAlert(productVal + ' is already registered.');
				return;
			}
		}
		
		//alert('사용 가능합니다.');
		showHide('bgProductNameStatus', true);
	})
    .catch( function(error) {
    	Log.d('btnCheckDupProduct() -> error=', error);
    });
};

getID('btnAddCustomField').onclick = function(e) {
	Log.d('btnAddCustomField() -> e : ', e);
	const MAX_CNT = 3;
	let val = getID('selCustomfield').value;
	let txt = getSelectedText('selCustomfield');
	
	if ( selectCount('selSelectedFieldValue') >= MAX_CNT ) {
		modalAlert('Up to ' + MAX_CNT + ' user-defined columns are allowed.');
		return;
	}
	
	if ( isSelectTxt('selSelectedFieldValue', txt) ) {
		modalAlert('This column is already added.');
		return;
	}
	
	let opt = '<option value="%s">%s</option>'.sprintf(val, txt);
	getID('selSelectedFieldValue').innerHTML += opt;	
};

getID('btnRemoveCustomField').onclick = function(e) {
	Log.d('btnRemoveCustomField() -> e : ', e);
	rmSelectedOpts('selSelectedFieldValue'); // 선택된 모든 항목 삭제
};

getID('btnCheckDupFieldU').onclick = function(e) {
	let customField = getVal('txtCustomFieldU');
	let orCustomField = getVal('hdnCustomFieldU');
	
	if ( orCustomField == customField ) {
		Log.d('btnCheckDupFieldU() 중복체크 필요 없음.');
		showHide('bgCustomFieldStatusU', true);
		return;
	}
	
	if ( customField == "" ) {
		showHide('bgCustomFieldStatusU', false);
		modalAlert('The user-defined column is blank.');
		return;
	}
	
	axios.post('/manage/producttype/extfield/selected/list')
	.then( function(response) {
		// Log.d('response.data : ', response.data);
		let arr = response.data;
		for ( var i in arr ) {
			if ( arr[i].ext_value == customField ) {
				modalAlert(customField + ' is already registered.');
				getID('txtCustomFieldU').value = getID('hdnCustomFieldU').value;
				showHide('bgCustomFieldStatusU', false);
				return;
			}
		}
		
		//alert('사용 가능합니다.');
		showHide('bgCustomFieldStatusU', true);
	})
    .catch( function(error) {
    	Log.d('btnCheckDupField() -> error=', error);
    });	
};

getID('btnCheckDupField').onclick = function(e) {
	let customField = getVal('txtCustomField');
	if ( customField == "" ) {
		showHide('bgCustomFieldStatus', false);
		modalAlert('The user-defined column is blank.');
		return;
	}
	
	axios.post('/manage/producttype/extfield/selected/list')
	.then( function(response) {
		// Log.d('response.data : ', response.data);
		let arr = response.data;
		for ( var i in arr ) {
			if ( arr[i].ext_value == customField ) {
				modalAlert(customField + ' is already registered.');
				getID('txtCustomField').value = '';
				showHide('bgCustomFieldStatus', false);
				return;
			}
		}
		
		//alert('사용 가능합니다.');
		showHide('bgCustomFieldStatus', true);
	})
    .catch( function(error) {
    	Log.d('btnCheckDupField() -> error=', error);
    });	
};

getID('btnAddFieldItemU').onclick = function(e) {
	Log.d('btnAddFieldItemU()');
	
	let val = getID('txtFieldValueU').value;
		
	if ( isSelectTxt('selAddedFieldValuesU', val) ) {
		modalAlert('User-defined column value is already registered.');
		return;
	}
	
	let opt = '<option value="">%s</option>'.sprintf(val);
	getID('selAddedFieldValuesU').innerHTML += opt;
};

getID('btnRemoveFieldItemU').onclick = function(e) {
	Log.d('btnRemoveFieldItemU()');
	
	rmSelectedOpts('selAddedFieldValuesU'); // 선택된 모든 항목 삭제	
};

getID('btnAddFieldItem').onclick = function(e) {
	Log.d('btnAddFieldItem()');
	
	let val = getID('txtFieldValue').value;
		
	if ( isSelectTxt('selAddedFieldValues', val) ) {
		modalAlert('User-defined column value is already registered.');
		return;
	}
	
	let opt = '<option value="%s">%s</option>'.sprintf(val, val);
	getID('selAddedFieldValues').innerHTML += opt;
};

getID('btnRemoveFieldItem').onclick = function(e) {
	Log.d('btnRemoveFieldItem()');
	rmSelectedOpts('selAddedFieldValues');
};

if(getID('btnUpdateCustomField')!=null)
getID('btnUpdateCustomField').onclick = function(e) {
	Log.d('btnUpdateCustomField()');
	if ( getVal('hdnCustomFieldU') == "" ) {
		modalAlert( 'It can be modified after selection.' );
		return;
	}
	
	if ( getID('bgCustomFieldStatusU').style.display == 'none' ) {
		modalAlert( 'A duplicate check is required.' );
		return;
	}
	
	Log.d('제약 조건 통과...');
	
	let params = new URLSearchParams();
	params.append('extType', getVal('hdnExtTypeU'));
	params.append('customField', getVal('txtCustomFieldU'));
	params.append('description', getVal('txtCustomFieldDescU'));
	params.append('fieldValues', JSON.stringify(selectToArray('selAddedFieldValuesU')));
	Log.d('params : ', params);

	axios.post('/manage/producttype/extfield/selected/modify', params)
	.then(function (response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'ok' ) {
			customFields();
			showHide('bgCustomFieldStatusU', false);
			Log.d('Processing success.');
			location.reload();
		} else {
			modalAlert('Processing failed.');
		}
	})
    .catch(function (error) {
    	Log.d('btnUpdateCustomField() -> error=', error);
    });
    
};

if(getID('btnInsertCustomField')!=null)
getID('btnInsertCustomField').onclick = function(e) {
	Log.d('btnInsertCustomField()');
	
	let params = new URLSearchParams();
	params.append('customField', getVal('txtCustomField'));
	params.append('description', getVal('txtCustomFieldDesc'));
	params.append('fieldValues', JSON.stringify(selectToArray('selAddedFieldValues')));
	Log.d('params : ', params);

	axios.post('/manage/producttype/extfield/selected/add', params)
	.then(function (response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'ok' ) {
			customFields();
			Log.d('Processing success.');
			location.reload();
		} else {
			modalAlert('Processing failed.');
		}
	})
    .catch(function (error) {
    	Log.d('btnInsertCustomField() -> error=', error);
    });
};

if(getID('btnSaveProduct')!=null)
getID('btnSaveProduct').onclick = function(e) {
	Log.d( 'btnSaveProduct() -> e:', e);
	
	if ( getID('bgProductNameStatus').style.display == 'none' ) {
		modalAlert( 'A duplicate check is required.' );
		return;
	}

	let params = new URLSearchParams();
	// uri 설정
	let uri = '';
	if ( queryString('mode') == 'I' ) { // 추가시
		uri = '/manage/producttype/add';
	} else { // 수정시
		uri = '/manage/producttype/modify';
		params.append('productType', getVal('hdnProductType'));
	}
	
	// param 설정
	params.append('productValue', getVal('txtProductValue'));
	params.append('description', getVal('txtDesc'));
	params.append('fieldValues', JSON.stringify(selectToArray('selSelectedFieldValue')));
	// Log.d('params : ', params);

	axios.post(uri, params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'ok' ) {
			Log.d(uri + ' : 처리 성공');
			mv('/manage/producttype/list.do');
		} else {
			modalAlert('Processing failed.');
		}
	})
    .catch(function(error) {
    	Log.d('btnSaveProduct() -> error=', error);
    });
};

if (getID('btnDeleteProduct') != null && queryString('mode') != 'I') {
var deleteProduct = function() {
	let params = new URLSearchParams();
	params.append('productType', getVal('hdnProductType'));
	// Log.d('params : ', params);
				
	axios.post('/manage/producttype/delete', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'ok' ) {
			Log.d('처리 성공');
			// alert('처리 성공');
			mv('/manage/producttype/list.do');
		} else {
			modalAlert('Processing failed.');
		}
	})
    .catch(function(error) {
    	Log.d('btnDeleteProduct() -> error=', error);
    });
};

getID('btnDeleteProduct').onclick = function(e) {
	Log.d( 'btnDeleteProduct() -> e:', e);
		
//    if ( confirm("Do you really want to delete this item ?") == false ) {
//    	return;
//    }
	
	bootbox.confirm({
		title: 'Confirmation',
	    message: "Do you really want to delete this item ?",
	    buttons: {
	        confirm: {
	            label: 'Yes',
	            className: 'btn-primary'
	        },
	        cancel: {
	            label: 'No',
	            className: 'btn-primary'
	        }
	    },
	    callback: function (r) {
	    	Log.d('callback -> r:' + r);
	    	if (r) {
	    		deleteProduct();	    		
	    	}
	    }
	});
};
}

getID('btnList').onclick = function(e) {
	mv('/manage/producttype/list.do');
};

getID('selAddedFieldValuesU').onclick = function(e) {
	// Log.d('selAddedFieldValuesU() -> e.target.innerText : ', e.target.innerText);
	getID('txtFieldValueU').value = e.target.innerText;
};

getID('btnModifyFieldItemU').onclick = function(e) {
	let modifyData = getVal('txtFieldValueU');
	Log.d('btnModifyFieldItemU() -> modifyData : ', modifyData);
	
	setSelectItem('selAddedFieldValuesU', modifyData);	
};

getID('txtProductValue').onkeyup = function(e) {
	showHide('bgProductNameStatus', false);
};
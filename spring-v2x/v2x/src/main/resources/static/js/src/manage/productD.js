const PAGE_UNIT = 5;

const UPLOAD = {
	READY: 0,
	PROGRESS: 1,
	FINISH: 2,
};

var initPage = function() {
	getID('pgUpload').uploadStatus = UPLOAD.READY;
};

var pageChange = function(p, s) {
	Log.d("pageChange() -> page : ", p, " size: ", s);
	companies.getSelectCompany( p );
};

var makeDynamicColumn = function() {
	getID('ext-col-container').innerHTML = ''; // clear container
	
	let params = new URLSearchParams();
	params.append('productType', queryString('productType'));
	
	axios.post('/product/extfield/flist', params)
	.then( function( response ) {
		let r = response.data;
		let len = r.length; 
		if ( len <= 0 )
			return;
		
		Log.d('makeDynamicColumn() -> r : ', r);
		let item = 
		'<div class="col-md-6">\
			<div class="form-group">\
				<label>%s</label>\
				<select id="ext_type_%s" class="form-control select2 ext_type">\
				</select>\
			</div>\
		 </div>'; // 2개
		
		let items = '';
		for ( let i = 0 ; i < len ; i++ ) {
			items += item.sprintf(r[i].ext_value, r[i].ext_type);
		}
		getID('ext-col-container').innerHTML = items;
		
		for ( let k = 0 ; k < len ; k++ ) {
			getExtColVal( r[k].ext_value, r[k].ext_type );
		}
	})
    .catch( function (error) {
    	Log.d( 'makeDynamicColumn() -> error=', error );
    });
};

var getExtColVal = function(ext_value, ext_type) {
	// Log.d( 'getExtColVal() -> ext_value=', ext_value );
	// Log.d( 'getExtColVal() -> ext_type=', ext_type ); // arg
	
	let sel = 'ext_type_%s'.sprintf(ext_type);
	// getID(sel).innerHTML = '';
		
	let params = new URLSearchParams();
	params.append('extType', ext_type);
	
	axios.post('/product/extfield/clist', params)
	.then( function( response ) {
		let r = response.data;
		let len = r.length; 
		if ( len <= 0 )
			return;
		
		Log.d('getExtColVal() -> r : ', r);
		let item = '<option value="%s">%s</option>';
		
		for ( let i = 0 ; i < len ; i++ ) {
			getID(sel).innerHTML += item.sprintf(r[i].col_value_id, r[i].col_value);
		}
		
		getSelectExtVal(sel, queryString('productId'), ext_type);
	})
    .catch( function (error) {
    	Log.d( 'error=', error );
    });
};

// 값 설정
var getSelectExtVal = function(sel, productId, extType) {
	Log.d( 'getSelectExtVal() -> productId : ', productId, 'extType : ', extType, 'sel : ', sel);
	
	let params = new URLSearchParams();
	params.append('productId', productId);
	params.append('extType', extType);
	
	axios.post('/product/extfield/selected', params)
	.then( function( response ) {
		let r = response.data;
		let len = r.length; 
		if ( len <= 0 )
			return;
		
		Log.d('getSelectExtVal() -> r : ', r);
		getID(sel).value = r[0].col_value_id;
	})
    .catch( function (error) {
    	Log.d( 'error=', error );
    });
};

var productDetail = function() {
	Log.d('productDetail() called...');
	let params = new URLSearchParams();
	params.append('productId', queryString('productId'));
	
	axios.post('/manage/ajaxProductD.do', params)
	.then(function(response) {
		// Log.d( 'response.data : ', response.data );
		if ( response.data.length > 0 ) { // 있으면...
			Log.d('productDetail() -> response.data : ', response.data);
			getID('txtProductName').value = response.data[0].name;
			getID('txtVersion').value = response.data[0].version;
			getID('txtDesc').value = response.data[0].description;
			getID('selStatus').value = response.data[0].active;
			getID('txtEmail').value = response.data[0].user_email;
			getID('txtCreated').value = utcToLoc(response.data[0].created);
			getID('txtUpdated').value = utcToLoc(response.data[0].updated);
			if ( response.data[0].size !== undefined ) {
				getID('hdnFileSize').value = response.data[0].size;
				getID('txtFileSize').value = hFS(response.data[0].size);
			}
			if (response.data[0].filename !== undefined ) {
				getID('hdnFilename').value = response.data[0].filename;
				getID('hdnOldFilename').value = response.data[0].filename;
				getID('spFilename').innerText = response.data[0].filename;
			}
			if (response.data[0].filepath !== undefined ) {
				getID('hdnOldFilepath').value = response.data[0].filepath;
			}
			if (response.data[0].product_file_id !== undefined ) {
				getID('hdnProductFileId').value = response.data[0].product_file_id;
			}
			if (response.data[0].help_fullpath !== undefined ) {
				getID('spHelpFileFullPath').innerText = response.data[0].help_fullpath;
			}
		}
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

var unzipHelpFile = function(productId, dirName, fileName) {
	let params = new URLSearchParams();
	params.append('productId', productId);
	params.append('dirName', dirName);
	params.append('fileName', fileName);
	
	axios.post('/file/fileHelpExtract.do', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'ok' ) {
			alert('unzip 처리 성공');
		} else {
			alert('unzip 처리 실패');
			return;
		}		
	})
	.catch(function(error) {
		Log.d('unzipHelpFile() -> error=', error);
	});
};

var sendEmail = function(productId) {
	if ( !getID('chkNotify').checked )
		return;
	
	let eTitle = getVal('txtEmailTitle');
	let eContent = getVal('txtEmailContent');
	
	let params = new URLSearchParams();
	params.append('product_id', productId);
	if ( eTitle.length > 0 ) {
		params.append('notice_type', 'custom'); // custom(subject,content)
		params.append('subject', eTitle);
		params.append('content', eContent);
	} else {
		params.append('notice_type', 'release'); // release
	}
	
	
	axios.post('/product/email', params)
	.then(function(response) {
		Log.d( 'sendEmail() -> response.data : ', response.data );
	})
	.catch(function(error) {
		Log.d('sendEmail() -> error=', error);
	});
};

//---------------------------------------------------------------------
// company 관련
var companies = {};
companies.datas = [];
companies.bChanged = false;
companies.getSelectCompany = function(page) {
	let params = new URLSearchParams();
	params.append('curPage', page);  		// 1 페이지
	params.append('pageUnit', PAGE_UNIT); 	// 5 개씩
	Log.d('params : ', params);

	axios.post('/manage/company/list', params)
	.then( function (response) {
		Log.d( 'ajaxcompanyL.do -> response.data : ', response.data );
		
		let r = response.data;
		let len = r.length;
		if ( len <= 0 )
			return;
		
		//-------------------------------------------
		// 선택 table 만들기
		companies.setDatas( r );
				
		//-------------------------------------------
		// 페이지 처리
		let curPage = r[0].page;
		let pageCount = Math.ceil(r[0].totalcnt/PAGE_UNIT);
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
		
		//--------------------------------------------
		// getSelectedCompany
		if ( queryString('mode') != 'I' ) { // 수정시
			companies.getSelectedCompany( queryString('productId') );
		}
	})
    .catch(function(error) {
    	Log.d('error=', error);
    });
};

companies.setDatas = function(data) {
	// set data
	companies.datas = []; // clear data

	let len = data.length;
	if ( len <= 0 )
		return;
	
	let tr = '';
	for ( let i = 0 ; i < len ; i++ ) {
		companies.datas.push( {select: false, // default false
			companyId: data[i].companyid, 
			companyName: data[i]["Company Name"],
			domain: data[i].Domain,
			updated: data[i]["Updated Date"]} );
	}	
	
	Log.d('companies.datas=', companies.datas);
	
	companies.setUI();
};

companies.changeSelect = function(companyId, chk) {
	// Log.d('companies.changeSelect() -> companyId=', companyId, 'chk.checked', chk.checked);
	for ( let i = 0 ; i < this.datas.length ; i++ ) {
		if ( this.datas[i].companyId == companyId ) {
			this.datas[i].select = chk.checked;
			this.bChanged = true; // 수정 flag on
			break;
		}
	}
	// Log.d('companies.changeSelect() -> this.datas=', this.datas);
};

companies.setUI = function() {
	getID('select-companies').innerHTML = ''; // clear ui
	let trs = "";
	let tds = "";
	for ( let k = 0 ; k < companies.datas.length ; k++ ) {
		tds += companies.datas[k].select ? 
			   "<td><label class='ob-customcheck'><input type='checkbox' onclick='companies.changeSelect(%s, this)' style='display: none;' checked><span class='ob-checkmark'></span></label></td>".sprintf(companies.datas[k].companyId) : 
			   "<td><label class='ob-customcheck'><input type='checkbox' onclick='companies.changeSelect(%s, this)' style='display: none;'><span class='ob-checkmark'></span></label></td>".sprintf(companies.datas[k].companyId);
		tds += "<td>%s</td>".sprintf(companies.datas[k].companyName);
		tds += "<td>%s</td>".sprintf(companies.datas[k].domain);
		tds += "<td>%s</td>".sprintf(companies.datas[k].updated);
		
		trs += "<tr>%s</tr>".sprintf(tds);
		tds = "";
	}
	getID('select-companies').innerHTML = trs;
};

companies.getSelectedCompany = function( productId ) {
	let params = new URLSearchParams();
	params.append('productId', productId);
	Log.d('params : ', params);
				
	axios.post('/manage/ajaxSelectedCompany.do', params)
	.then(function(response) {
		Log.d( 'ajaxSelectedCompany.do -> response.data : ', response.data );
		let selected = response.data;
		let len = selected.length;
		if ( selected.length <= 0 )
			return;
			
		for ( let i = 0 ; i < companies.datas.length ; i++ ) {
			for ( let k = 0 ; k < len ; k++ ) {
				if ( companies.datas[i].companyId == selected[k].companyid ) {
					companies.datas[i].select = true;
				}
			}
		}
		
		companies.setUI(); // UI 갱신
	})
    .catch(function(error) {
    	 Log.d('companies.getSelectedCompany() -> error=', error);
    });
};

companies.updateSelectedCompany = function(productId) {
	Log.d( 'updateSelectedCompany() -> productId:', productId);
	if ( productId == null || productId == "" ) {
		alert('updateSelectedCompany() -> productId required.');
		return;
	}
	
	let params = new URLSearchParams();

	params.append('productId', productId);
	params.append('productType', queryString('productType'));
	params.append('curCompanys', JSON.stringify(this.datas));
	Log.d('companies.updateSelectedCompany() -> params : ', params);
				
	axios.post('/manage/ajaxUpdateSelectedCompany.do', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'ok' ) {
			// 통지 이메일 보내기
			sendEmail( productId );
			alert('처리 성공2');
		}
	})
    .catch(function(error) {
    	Log.d('companies.updateSelectedCompany() -> error=', error);
    });
};

//----------------------------------------------------------
//event handler

window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('productD.js -> DOMContentLoaded() called...');
	initPage();
	makeDynamicColumn();
	
	if ( queryString('mode') != 'I' ) { // 수정시
		productDetail();
	}
	
	companies.getSelectCompany( 1 );
});

window.onload = function(e) {
	Log.d('productD.js -> window.onload() -> e :', e);
}

getID('btnSave').onclick = function(e) {
	Log.d('productD.js -> btnSave() called...');
	let pgBar = getID('pgUpload');

	//----------------------------------------------
	// 제약 코드
	if ( getID('txtProductName').value == "" ) {
		alert('Product Name 필수입력입니다.');
		return;
	}
	
	if ( getID('txtVersion').value == "" ) {
		alert('Version 필수입력입니다.');
		return;
	}
	
	if ( queryString('mode') == 'I' ) { // 입력 모드
		if ( pgBar.uploadStatus != UPLOAD.FINISH ) {
			alert('파일업드가 필요합니다.');
			return;
		}
	} else { // 수정 모드
		if ( pgBar.uploadStatus == UPLOAD.PROGRESS ) {
			alert('파일업드가 진행 중입니다.');
			return;
		}
	}
	
	//----------------------------------------------
	let productId = null;
	productId = queryString('productId');
	
	let params = new URLSearchParams();
	if ( productId != null )
		params.append('productId', productId);
	if ( queryString('productType') != null )
		params.append('productType', queryString('productType'));	
	params.append('productName', getVal('txtProductName'));
	params.append('version', getVal('txtVersion'));
	params.append('description', getVal('txtDesc'));
	params.append('active', getVal('selStatus'));
	
	if ( pgBar.uploadStatus == UPLOAD.FINISH ) {
		params.append('isUpload', '1');
		params.append('fileName', getVal('hdnFilename'));
		params.append('fileSize', getVal('hdnFileSize'));
		params.append('filePath', 'product_type_' + queryString('productType'));
		
		params.append('OldFileName', getVal('hdnOldFilename'));
		params.append('OldFilePath', getVal('hdnOldFilepath'));
		params.append('productFileId', getVal('hdnProductFileId'));
	} else {
		params.append('isUpload', '0');
		params.append('fileName', '');
		params.append('fileSize', '');
		params.append('filePath', '');
		
		params.append('OldFileName', '');
		params.append('OldFilePath', '');
		params.append('productFileId', '');
	}
	
	// ext_type, col_value_id
	let cls = getCLS('ext_type')
	let clsLen = cls.length;
	let extTypes = [];
	for ( let idx = 0 ; idx < clsLen ; idx++ ) {
		let ext_type = getSuffix('_', cls[idx].id);
		let col_value_id = '';
		if ( getVal(cls[idx].id) != '' )
			col_value_id = getVal(cls[idx].id);
	    Log.d('ext_type : ', ext_type, 'col_value_id : ', col_value_id);
		extTypes.push({ext_type: ext_type, col_value_id: col_value_id});
	}
	Log.d('extTypes : ', extTypes);
	params.append('extTypes', JSON.stringify(extTypes));
	
	Log.d('params : ', params);

	let target = '';
	if ( queryString('mode') == 'I' ) {
		target = '/manage/ajaxInsertProduct.do';
	} else {
		target = '/manage/ajaxUpdateProduct.do';
	}
	
	axios.post(target, params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'ok' ) {
			alert('처리 성공');
		} else {
			alert('처리 실패');
			return;
		}
		
		// 2 Select Company
		if ( queryString('mode') == 'I' ) {
			productId = response.data.desc;
		} 
		
		Log.d('btnSave() -> companies.bChanged : ', companies.bChanged, 'productId:', productId);
		if ( getID('hdnHelpFilename').value != "" ) {
			let dirName = 'product_type_' + queryString('productType');
			unzipHelpFile(productId, dirName, getID('hdnHelpFilename').value); // help 파일 업로드 된 상태이면, 압축 풀기
		}
		
		if ( !companies.bChanged ) {
			// 통지 이메일 보내기
			sendEmail(productId);
			return;
		}		
		companies.updateSelectedCompany( productId ); // 선택된 회사에 변경을 적용한다.
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

getID('btnList').onclick = function(e) {
	Log.d('btnList() called...');
	mv('/product/list.do?productType=' + queryString('productType'));
};

getID('attachfile').onchange = function(e) {
	Log.d('attachfile() -> e : ', e);
	let uploadedFiles = e.target.files;
	Log.d('attachfile() -> uploadedFiles : ', uploadedFiles);

	//---------------------------------------------------
	// single
	getID('hdnFileSize').value = uploadedFiles[0].size;
	getID('txtFileSize').value = hFS( Number(uploadedFiles[0].size) );

//	//---------------------------------------------------
//	// multiple 에서 사용
//	for ( let i = 0 ; i < uploadedFiles.length ; i++ ) {
//		Log.d('attachfile() -> name : ', uploadedFiles[i].name);
//		Log.d('attachfile() -> size : ', uploadedFiles[i].size);
//		Log.d('attachfile() -> type : ', uploadedFiles[i].type);
//	}
};

getID('btnFileUpload').onclick = function(e) {
	let files = getID('attachfile').files;
	if ( files.length <= 0 ) {
		alert('선택된 파일이 없습니다.');
		return;
	}
	
	let pgBar = getID('pgUpload');
	pgBar.uploadStatus = UPLOAD.PROGRESS;
	
	Log.d('btnFileUpload() -> files: ', files);
	
	let dirName = '';
	
	if ( queryString('productType') != null ) 
		dirName = 'product_type_' + queryString('productType')
		
	// 1. form Data만들기
	let formData = new FormData();
	
	for ( let i = 0 ; i < files.length ; i++ ) {
		let file = files[i];
		formData.append('files[' + i + ']', file);
	}

    // 2. http header에 csrf 적용
	// let csrf_header = document.head.querySelector("[name=_csrf_header]").content;
	// let csrf = document.head.querySelector("[name=_csrf]").content;
    
    // 3. 파일 전송
    axios.post( '/file/fileR.do',
		formData, {
		    headers: {
		    	'Content-Type': 'multipart/form-data',
		    	'Dir-Name': dirName,
		    	// csrf_header: csrf,
		    },
			onUploadProgress: function(pg) {
				let percent = Math.round( (pg.loaded * 100) / pg.total );
				pgBar.style.width = percent + '%';
				pgBar.innerHTML = percent + '%';
				Log.d('btnFileUpload() -> percent : ', percent);
			},
		}
    )
    .then(function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == "ok" ) {
			getID('hdnFilename').value = response.data.desc;
			getID('spFilename').innerText = response.data.desc;
			Log.d( 'SUCCESS!! -> Uploaded filename :', response.data.desc );
			pgBar.uploadStatus = UPLOAD.FINISH;
		}
	})
    .catch(function(error) {
		Log.d( 'error=', error );
		Log.d( 'FAILED!!' );
	});
};

if ( queryString('mode') != 'I' ) { // 수정시
	getID('spFileDownload').onclick = function(e) {
		Log.d('spFileDownload() called...');
		let file = getID('hdnFilename').value;
		let productType = queryString('productType');
		let uri = '/file/fileD.do?filePath=product_type_%s&fileName=%s'.sprintf(productType, file);
		mv( uri );
	};
}

getID('attachhelpfile').onchange = function(e) {
	Log.d('attachhelpfile() -> e : ', e);
	let uploadedFiles = e.target.files;
	Log.d('attachhelpfile() -> uploadedFiles : ', uploadedFiles);

	//---------------------------------------------------
	// single
	getID('hdnHelpFileSize').value = uploadedFiles[0].size;
	getID('txtHelpFileSize').value = hFS( Number(uploadedFiles[0].size) );
};

getID('btnHelpFileUpload').onclick = function(e) {
	let files = getID('attachhelpfile').files;
	if ( files.length <= 0 ) {
		alert('선택된 파일이 없습니다.');
		return;
	}
	
	let pgBar = getID('pgHelpUpload');
	getID('bgHelpFileUploadStatus').style.display = 'none';
	pgBar.uploadStatus = UPLOAD.PROGRESS;
	
	Log.d('btnHelpFileUpload() -> files: ', files);
	
	let dirName = '';
	
	if ( queryString('productType') != null ) 
		dirName = 'product_type_' + queryString('productType')
	Log.d('btnHelpFileUpload() -> dirName: ', dirName);
		
	// 1. form Data만들기
	let formData = new FormData();
	
	for ( let i = 0 ; i < files.length ; i++ ) {
		let file = files[i];
		formData.append('files[' + i + ']', file);
	}

    // 2. http header에 csrf 적용
	let csrf_header = document.head.querySelector("[name=_csrf_header]").content;
	let csrf = document.head.querySelector("[name=_csrf]").content;
    
    // 3. 파일 전송
    axios.post( '/file/fileHelpR.do',
		formData, {
		    headers: {
		    	'Content-Type': 'multipart/form-data',
		    	'Dir-Name': dirName,
		    	csrf_header: csrf,
		    },
			onUploadProgress: function(pg) {
				let percent = Math.round( (pg.loaded * 100) / pg.total );
				pgBar.style.width = percent + '%';
				pgBar.innerHTML = percent + '%';
				Log.d('btnHelpFileUpload() -> percent : ', percent);
			},
		}
    )
    .then(function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == "ok" ) {
			getID('hdnHelpFilename').value = response.data.desc;
			Log.d( 'SUCCESS!! -> Uploaded Help filename :', response.data.desc );
			getID('bgHelpFileUploadStatus').style.display = '';
			pgBar.uploadStatus = UPLOAD.FINISH;
		}
	})
    .catch(function(error) {
		Log.d( 'error=', error );
		Log.d( 'FAILED!!' );
	});
};

if ( queryString('mode') != 'I' ) { // 수정시
	getID('spHelpFileLink').onclick = function(e) {
		// Log.d('spHelpFileLink() -> e : ', e);
		mvNew( getID('spHelpFileFullPath').innerText );
	};
}

getID('chkNotify').onchange = function(e) {
	Log.d('chkNotify() -> e.target.checked : ', e.target.checked);
	
	getID('email-container').style.display=''
	e.target.checked ? getID('email-container').style.display='' : getID('email-container').style.display='none';
};
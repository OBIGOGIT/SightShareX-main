var pageChange = function(p, s) {
	Log.d("pageChange() -> page : ", p, " size: ", s);
	companies.getSelectCompany( p );
};

var noticeTypes = function() {
	Log.d( 'noticeTypes() called...' );
	
	axios.post('/notice/type/clist.do')
	.then( function(response) {
		let data = response.data;
		let len = data.length;
		Log.d( 'noticeTypes() -> data : ', data );
		
		// <option value="">test</option>
		let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'
				   .sprintf(data[i].id, data[i].type);
		}
		getID('selNoticeType').innerHTML += opt;
		
		if ( queryString('mode') != 'I' ) { // 수정시
			noticeDetailInfo();
		}
	})
    .catch( function( error ) {
    	Log.d('noticeTypes() -> error=', error);
    });
};

var noticeDetailInfo = function() {
	Log.d('noticeDetailInfo() called...');
	
	let params = new URLSearchParams();
	params.append('seq_no', queryString('seq_no'));
	Log.d('params : ', params);
	
	axios.post('/notice/detail', params)
	.then( function (response) {
		let data = response.data;
		if (data == null)
			return;		
		Log.d( 'noticeDetailInfo() -> data : ', data );

		getID('txtSubject').value = data.subject;
		getID('selNoticeType').value = data.type;
		getID('txtContent').value = data.content;
		getID('selStatus').value = data.status;
		data.fixed == '0' ? getID('chkFixed').checked=false:getID('chkFixed').checked=true;
		getID('txtCreatedUser').value = data.created_user;
		getID('txtUpdatedUser').value = data.updated_user;
		getID('txtCreatedDate').value = utcToLoc(data.created_date);
		getID('txtUpdatedDate').value = utcToLoc(data.modified_date);
	})
	.catch( function (error) {
		Log.d('noticeDetailInfo() -> error=', error);
	});    		
};

//---------------------------------------------------------------------
//company 관련
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
			companies.getSelectedCompany( queryString('seq_no') );
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
			updated: utcToLoc(data[i]["Updated Date"])} );
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

companies.getSelectedCompany = function( seq_no ) {
	let params = new URLSearchParams();
	params.append('seq_no', seq_no);
	Log.d('params : ', params);
				
	axios.post('/notice/company/selected', params)
	.then(function(response) {
		Log.d( 'selectedcompany.do -> response.data : ', response.data );
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

companies.updateSelectedCompany = function(seqNo) {
	Log.d( 'updateSelectedCompany() -> seqNo:', seqNo);
	if ( seqNo == null || seqNo == "" ) {
		Log.d('updateSelectedCompany() -> notice seqNo required.');
		modalAlert('Notice ID is required.');
		return;
	}
	
	let params = new URLSearchParams();

	params.append('seqNo', seqNo);
	params.append('curCompanys', JSON.stringify(this.datas));
	Log.d('companies.updateSelectedCompany() -> params : ', params);
				
	axios.post('/notice/company/selected/modify', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'ok' ) {
			Log.d('companies.updateSelectedCompany() -> ok2');
			// 리스트 이동
			mv('/notice/list.do');
		}
	})
 .catch(function(error) {
 	Log.d('companies.updateSelectedCompany() -> error=', error);
 });
};
//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('noticeD.js -> DOMContentLoaded() called...');
	noticeTypes();
	companies.getSelectCompany( 1 );
});

if (getID('btnSave') != null)
getID('btnSave').onclick = function(e) {
	Log.d('noticeD.js -> btnSave() called...');
	
	let seqNo = '';
	
	let subject = getVal('txtSubject');
	if (subject == "") {
		modalAlert('Subject is required.');
		return;
	}
	
	let content = getVal('txtContent');
	if (content == "") {
		modalAlert('Content is required.');
		return;
	}

	let params = new URLSearchParams();
	params.append('subject', subject);
	params.append('content', content);
	params.append('type', getVal('selNoticeType'));
	params.append('status', getVal('selStatus'));
	getID('chkFixed').checked ? params.append('fixed', '1') : params.append('fixed', '0');
	
	// Log.d('btnSave() -> params : ', params);
	
	let target = '';
	if ( queryString('mode') == 'I' ) {
		target = '/notice/add';
	} else {
		seqNo = queryString('seq_no');
		params.append('seq_no', seqNo);
		target = '/notice/modify';
	}
	
	axios.post(target, params)
	.then( function(response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'failed' ) {
			modalAlert('Processing failed.');
			return;
		} else if ( response.data.result == 'redirect' ) {
			mv(response.data.cmd);
			return;
		}
		
		Log.d('noticeD.js -> btnSave() ok');
		
		// 2 Select Company
		if ( queryString('mode') == 'I' ) {
			seqNo = response.data.desc;
		} 
		
		Log.d('btnSave() -> companies.bChanged : ', companies.bChanged, 'seqNo:', seqNo);			
		if ( !companies.bChanged ) {
			// 리스트로 이동
			mv('/notice/list.do');
			return;
		}
		companies.updateSelectedCompany( seqNo ); // 선택된 회사에 변경을 적용한다.
	})
	.catch( function(error) {
		Log.d('btnSave() -> error=', error);
	});
};

getID('btnList').onclick = function(e) {
	Log.d('noticeD.js -> btnList() called...');
	mv('/notice/list.do');
};

getID('selectAll').onchange = function(e) {
	Log.d('selectAll() -> e.target.checked : ', e.target.checked);

	for ( let i = 0 ; i < companies.datas.length ; i++ ) {
		companies.datas[i].select = e.target.checked;
		companies.bChanged = true; // 수정 flag on
	}
	
	companies.setUI();
};

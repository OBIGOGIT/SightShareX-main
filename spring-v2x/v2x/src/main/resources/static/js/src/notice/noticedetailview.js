
var noticeDetail = function() {
	Log.d('noticeDetail() called...');
	let params = new URLSearchParams();
	params.append('seq_no', queryString('seq_no'));
	
	axios.post('/notice/detail', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		
		let data = response.data;
		if ( data != null ) { // 있으면...
			getID('hTitle').innerText = data.subject;
			getID('ddType').innerText = data.notice_type;
			getID('ddUser').innerText = data.created_user;
			getID('ddCreated').innerText = utcToLoc(data.created_date);
			getID('ddUpdated').innerText = utcToLoc(data.modified_date);
			getID('ddContent').innerText = data.content;
		}
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('noticedetailview.js -> DOMContentLoaded() called...');
	noticeDetail();
});

if ( getID('btnEdit') != null )
getID('btnEdit').onclick = function(e) {
	Log.d('noticedetailview.js -> btnEdit() called...');
	mv( '/notice/modifyform.do?seq_no='+ queryString('seq_no') );
};

getID('btnList').onclick = function(e) {
	Log.d('btnList() called...');
	mv('/notice/list.do');
};

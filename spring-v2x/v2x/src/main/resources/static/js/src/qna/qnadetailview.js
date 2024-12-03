const COMMENT = '\
	<div id="bx-comment-%s" class="box-comment">\
		<img class="img-circle img-sm" src="/images/role/%s.png" title="User Image"><!-- role -->\
		<div class="comment-text">\
			<span class="username">\
				<span>%s</span> <!-- user name -->\
				<span style="padding-left: 10px; display: %s;">\
					<button onclick="uComment(\'%s\');" class="btn btn-obigo btn-xs" data-toggle="tooltip" title="Reply edit"><i class="fa fa-fw fa-pencil"></i></button>\
					<button onclick="dComment(\'%s\')" class="btn btn-obigo btn-xs" data-toggle="tooltip" title="Reply delete"><i class="fa fa-fw fa-trash"></i></button>\
				</span>\
				<span class="text-muted pull-right">%s</span> <!-- updated date -->\
			</span>\
			<span id="sp-content-%s">%s</span> <!-- content -->\
			<div id="dv-content-%s" class="input-group input-group-sm img-push" style="display: none;">\
				<textarea style="height: 80px;" id="txt-content-%s" class="form-control" rows="3"></textarea>\
				<span class="input-group-btn">\
					<button onclick="uCommentSave(\'%s\');" class="btn btn-obigo btn-flat">Save</button>\
				</span>\
			</div>\
		</div>\
	</div>';

var qnaDetail = function() {
	Log.d('qnaDetail() called...');
	let params = new URLSearchParams();
	params.append('qnaId', queryString('qnaId'));
	
	axios.post('/qna/detail', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		
		let data = response.data;
		if ( data != null ) { // 있으면...
			getID('hTitle').innerText = data.subject;
			// getID('ddProductType').innerText = data.product_type_name;
			getID('ddUser').innerText = data.name;
			getID('ddCreated').innerText = utcToLoc(data.created);
			getID('ddUpdated').innerText = utcToLoc(data.updated);
			getID('ddContent').innerText = data.content;
		}
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

var qnaComments = function() {
	Log.d('qnaComments() called...');
	getID('comment-result').innerHTML = ''; // reset
	
	let params = new URLSearchParams();
	params.append('qnaId', queryString('qnaId'));
	
	axios.post('/qna/comment/list', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		let data = response.data;
		//Log.d( 'data : ', data );
		
		if ( data == null || data.length == null ) return;
		let len = data.length;
		let r = '';
		
		if ( data.length > 0 ) {
			for(let i=0;i<len;i++) {
				r += COMMENT.sprintf(data[i].id, data[i].role_id, data[i].name, (USER_ID == data[i].account_seq) ? '' : 'none',
									 data[i].id, data[i].id, utcToLoc(data[i].modified_date), 
						             data[i].id, data[i].content.replace(/\n/g, "<br />"), data[i].id, data[i].id, data[i].id);
			}
			getID('comment-result').innerHTML = r;
		}
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

var uComment = function(id) {
	Log.d('uComment() -> id=', id);
	let dv = 'dv-content-'+id;
	let sp = 'sp-content-'+id;
	let txt = 'txt-content-'+id;
	
	if ( getID(sp).style.display == '' ) {
		getID(sp).style.display = 'none';
		getID(dv).style.display = '';
		getID(txt).value = getID(sp).innerText;
	} else {
		getID(sp).style.display = '';
		getID(dv).style.display = 'none';
	}
};

var uCommentSave = function(id) {
	Log.d('uCommentSave() -> id=', id);
	let txt = 'txt-content-'+id;
	let content = getVal(txt);
	if (content == "") {
		modalAlert('Comments are required.');
		return;
	}
	
	let params = new URLSearchParams();
	params.append('commentId', id);
	params.append('content', content);
	
	axios.post('/qna/comment/modify', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		
		// 댓글 리스트 새로 가져오기
		qnaComments();
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

var dComment = function(id) {
	var deleteComment = function() {
		let params = new URLSearchParams();
		params.append('commentId', id);
		
		axios.post('/qna/comment/delete', params)
		.then(function(response) {
			Log.d( 'response.data : ', response.data );
			
			// 댓글 리스트 새로 가져오기
			qnaComments();
		})
		.catch(function(error) {
			Log.d('error=', error);
		});
	};
	
	Log.d('dComment() -> id=', id);
    //if ( confirm("Do you really want to delete this item ?") == false ) {
    //	return;
    //}
    
	bootbox.confirm({
		title: 'Confirmation',
	    message: "Do you really want to delete this reply ?",
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
	    		deleteComment();
	    	}
	    }
	});
};

//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('qnadetailview.js -> DOMContentLoaded() called...');
	qnaDetail();
	qnaComments();
});

getID('btnEdit').onclick = function(e) {
	Log.d('qnadetailview.js -> btnEdit() called...');
	mv( '/qna/modifyform.do?qnaId='+ queryString('qnaId') );
};

getID('btnList').onclick = function(e) {
	Log.d('btnList() called...');
	mv('/qna/list.do');
};

getID('btnReply').onclick = function(e) {
	Log.d('qnadetailview.js -> btnReply() called...');
	let content = getVal('txtReply');
	if ( content == "" ) {
		modalAlert('Comments are required.');
		return;
	} else {
		getID('txtReply').value = '';
	}
	
	let params = new URLSearchParams();
	params.append('qnaId', queryString('qnaId'));
	params.append('content', content);
	
	axios.post('/qna/comment/add', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );	
		
		// 댓글 리스트 새로 가져오기
		qnaComments();
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

const COMMENT = '\
	<div id="bx-comment-%s" class="box-comment">\
		<img class="img-circle img-sm" src="/images/role/%s.png" title="User Image"><!-- role -->\
		<div class="comment-text">\
			<span class="username">\
				<span>%s</span> <!-- user name -->\
				<span style="padding-left: 10px; display: %s;">\
					<i class="fa fa-fw fa-pencil" onclick="uComment(\'%s\');" style="cursor: pointer;"></i></button>\
					<i class="fa fa-fw fa-trash" onclick="dComment(\'%s\')" style="cursor: pointer;"></i></button>\
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

var headunitDetail = function() {
	Log.d('headunitDetail() called...');
	let params = new URLSearchParams();
	params.append('requestId', queryString('requestId'));
	
	axios.post('/request/headunit/detail', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		
		let data = response.data;
		if ( data != null ) { // 있으면...
			// getID('hTitle').innerText = data.subject;
			// getID('ddProductType').innerText = data.product_type_name;
			getID('ddManufacturer').innerText = data.manufacturer;
			getID('ddModel').innerText = data.model;

			let statusMsg = "";
			switch (data.status) {
				case 0:
					statusMsg = "<span class='label label-primary'>%s</span>".sprintf("등록요청");
					break;
				case 1:
					statusMsg = "<span class='label label-success'>%s</span>".sprintf("등록완료");
					break;
				case 2:
					statusMsg = "<span class='label label-danger'>%s</span>".sprintf("반려");
					break;
			}
			Log.d("status : ", statusMsg);
			getID('ddStatus').innerHTML = statusMsg;
			getID('ddCreatedUser').innerHTML = data.createdUser;

			getID('ddCreated').innerText = utcToLoc(data.created);
			getID('ddUpdated').innerText = utcToLoc(data.updated);
		}
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

var getComments = function() {
	Log.d('getComments() called...');
	getID('comment-result').innerHTML = ''; // reset
	
	let params = new URLSearchParams();
	params.append('requestId', queryString('requestId'));
	
	axios.post('/request/headunit/comment/list', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		let data = response.data;

		if ( data == null || data.length == null ) return;
		let len = data.length;
		let r = '';
		
		if ( data.length > 0 ) {
			for(let i=0;i<len;i++) {
				r += COMMENT.sprintf(data[i].commentSeq, data[i].roleId, data[i].name, (USER_ID == data[i].accountSeq) ? '' : 'none',
									 data[i].commentSeq, data[i].commentSeq, data[i].updated,
						             data[i].commentSeq, data[i].content.replace(/\n/g, "<br />"), data[i].commentSeq, data[i].commentSeq, data[i].commentSeq);
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

	Log.d('content : ', content)
	
	axios.post('/request/headunit/comment/modify', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );
		
		// 댓글 리스트 새로 가져오기
		getComments();
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

var dComment = function(id) {
	var deleteComment = function() {
		let params = new URLSearchParams();
		params.append('commentId', id);
		
		axios.post('/request/headunit/comment/delete', params)
		.then(function(response) {
			Log.d( 'response.data : ', response.data );
			
			// 댓글 리스트 새로 가져오기
			getComments();
		})
		.catch(function(error) {
			Log.d('error=', error);
		});
	};
	
	Log.d('dComment() -> id=', id);

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
	headunitDetail();
	getComments();
});

getID('btnList').onclick = function (e) {
	Log.d('btnList() called...');
	mv('/request/headunit/list.do');
};
getID('btnReply').onclick = function(e) {
	Log.d('headunitdetailview.js -> btnReply() called...');
	let content = getVal('txtReply');
	if ( content == "" ) {
		modalAlert('Comments are required.');
		return;
	} else {
		getID('txtReply').value = '';
	}
	
	let params = new URLSearchParams();
	params.append('requestId', queryString('requestId'));
	params.append('content', content);
	
	axios.post('/request/headunit/comment/add', params)
	.then(function(response) {
		Log.d( 'response.data : ', response.data );	
		
		// 댓글 리스트 새로 가져오기
		getComments();
	})
	.catch(function(error) {
		Log.d('error=', error);
	});
};

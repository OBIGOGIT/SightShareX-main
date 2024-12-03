var productTypes = function() {
	Log.d( 'productTypes() called...' );
		
	axios.post('/qna/producttype/clist')
	.then( function(response) {
		let data = response.data;
		let len = data.length;
		Log.d( 'productTypes() -> data : ', data );
		
		// <option value="">test</option>
		// selProductType 삭제
		/*let opt = '';
		for ( let i = 0 ; i < len ; i++ ) {
			opt += '<option value="%s">%s</option>'
				   .sprintf(data[i].product_type, data[i].product_value);
		}
		getID('selProductType').innerHTML += opt; */
		
		if ( queryString('mode') != 'I' ) { // 수정시
			qnaDetailInfo();
		}
	})
    .catch( function( error ) {
    	Log.d('productTypes() -> error=', error);
    });
};

var qnaDetailInfo = function() {
	Log.d('qnaDetailInfo() called...');
	
	let params = new URLSearchParams();
	params.append('qnaId', queryString('qnaId'));
	Log.d('params : ', params);
	
	axios.post('/qna/detail', params)
	.then( function (response) {
		let data = response.data;
		Log.d( 'qnaDetailInfo() -> data : ', data );
		
		if (data == null)
			return;

		// getID('selProductType').value = data.product_type_id;
		getID('txtSubject').value = data.subject;
		getID('txtContent').value = data.content;
		getID('txtCreated').value = utcToLoc(data.created);
		getID('txtUpdated').value = utcToLoc(data.updated);
		getID('txtUser').value = data.name;
		getID('hdnCreateId').value = data.create_id;
	})
	.catch( function (error) {
		Log.d('qnaDetailInfo() -> error=', error);
	});    		
};

//----------------------------------------------------------
//event handler
window.addEventListener('DOMContentLoaded', function() { //실행될 코드
	Log.d('qnaD.js -> DOMContentLoaded() called...');
	productTypes();
});

getID('btnSave').onclick = function(e) {
	Log.d('qnaD.js -> btnSave() called...');
	
	let qnaId = '';
	
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
	// params.append('productType', getVal('selProductType'));
	
	// Log.d('btnSave() -> params : ', params);
	
	let target = '';
	if ( queryString('mode') == 'I' ) {
		target = '/qna/add';
	} else {
		qnaId = queryString('qnaId');
		params.append('qnaId', qnaId);
		params.append('createId', getVal('hdnCreateId'));
		target = '/qna/modify';
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
		
		Log.d('qnaD.js -> btnSave() ok');
		mv('/qna/list.do');
	})
	.catch( function(error) {
		Log.d('btnSave() -> error=', error);
	});
};

getID('btnList').onclick = function(e) {
	Log.d('qnaD.js -> btnList() called...');
	mv('/qna/list.do');
};

if ( queryString('mode') != 'I' ) { // 수정시
	var deleteQna = function() {
		let params = new URLSearchParams();
		params.append('qnaId', queryString('qnaId'));
		Log.d('params : ', params);
		
		axios.post('/qna/delete', params)
		.then( function (response) {
			let data = response.data;
			Log.d( 'deleteQna() -> data : ', data );

			if ( response.data.result == 'ok' ) {
				Log.d('qnaD.js -> btnDelete() ok');
				mv('/qna/list.do');
			}
		})
		.catch( function (error) {
			Log.d('deleteQna() -> error=', error);
		});
	};
	
	getID('btnDelete').onclick = function(e) {
		Log.d('qnaD.js -> btnDelete() called...');
		
//	    if ( confirm("Do you really want to delete this item ?") == false ) {
//	    	return;
//	    }
		
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
		    		deleteQna();	    		
		    	}
		    }
		});
	};
}
$('.btn').on('click', function() {
    var $this = $(this);
  $this.button('loading');
    setTimeout(function() {
       $this.button('reset');
   }, 8000);
});

var sendEmail = function() {
	getID('email-m').innerText = '';

	let params = {
		'email' : getVal('email').toLowerCase()
	};

	var btnSend = $(getID('btnSend'));
	btnSend.button('loading');
	
	axios.post( '/login/tmppasswd', JSON.stringify(params), {
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then( function (response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'failed' ) {
			getID('email-m').innerText = response.data.desc;
			getID('email-m').style.color = '#C0392B';
			return;
		}
		
		if ( response.data.result == 'ok' ) {
			// getID('forget-title').innerHTML = '<b>Password reset success.</b>';
			// getID('forget-title').style.color = 'orange';
			getID('email-m').innerText = response.data.desc;
			getID('email-m').style.color = '#2E86C1';
			getID('email').style.display = 'none';
			getID('email-icon').style.display = 'none';
			getID('btnSend').style.display = 'none';
			
			btnSend.button('reset');
		}
	})
    .catch( function (error) {
    	 Log.d('doRegister() -> error=', error);
    });
};

getID('email').onkeyup = function(e) {
	if ( this.value.length <= 0 ) {
		getID('email-w').style.display = '';
		return;
	}
	
	if ( !checkEmail(this.value.toLowerCase()) ) {
		getID('email-w').style.display = '';
		return;
	} else {
		getID('email-w').style.display = 'none';
		return;
	}
};

getID('btnSend').onclick = function(e) {
	// Log.d('btnRegister() -> e=', e);
	//----------------------------------
	// 입력 체크
	if ( getVal('email').length <= 0 ) {
		modalAlert('Email is required.');
		return;
	}
	
	//----------------------------------
	// 제약 조건 체크
    if ( getID('email-w').style.display != 'none' ) {
    	modalAlert('Check email requriements.');
    	return;
    }
		
	//-------------------------------------------
	sendEmail();
};

var initPage = function() {	
	let pw = getID('pw'); // pw flag init
	pw.lowChk = false;
	pw.upChk = false;
	pw.numChk = false;
	pw.lenChk = false;
};

var doRegister = function() {

	let params = {
		'email' : getVal('email').toLowerCase(),
		'name' :  getVal('name'),
		'pw' : getVal('pw')
		// 'pw' : sha256(getVal('pw'))
	};


	axios.post( '/login/account/add', JSON.stringify(params), {
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then( function (response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'failed' ) {
			modalAlert( response.data.desc );
			return;
		}
		modalAlertLink('Please wait for confirmation email from admin.', '/login/login.do');
	})
    .catch( function (error) {
    	 Log.d('doRegister() -> error=', error);
    });
};

getID('pw').onkeyup = function() {
	pwConfirmChk();
	
	if ( this.value.length <= 0 ) {
		getID('pw-w').style.display = '';
		return;
	}
	
	// Validate lowercase letters
	var lows = /[a-z]/g;
	if ( this.value.match(lows) ) {
		this.lowChk = true;
	} else {
		this.lowChk = false;
	}

	// Validate capital letters
	var ups = /[A-Z]/g;
	if ( this.value.match(ups) ) {
		this.upChk = true;
	} else {
		this.upChk = false;
	}

	// Validate numbers
	var numbers = /[0-9]/g;
	if ( this.value.match(numbers) ) {  
		this.numChk = true;
	} else {
		this.numChk = false;
	}

	// Validate length
	if ( this.value.length >= 8 ) { // min
		this.lenChk = true;
		if ( this.value.length > 256 ) // max
			this.lenChk = false;
	} else {
		this.lenChk = false;
	}
	
	if ( this.lowChk 
		 && this.upChk
		 && this.numChk
		 && this.lenChk ) {
		getID('pw-w').style.display = 'none';
	} else {
		getID('pw-w').style.display = '';
	}
};

getID('email').onkeyup = function(e) {
	if ( this.value.length <= 0 ) {
		getID('email-w1').style.display = '';
		return;
	}
	
	if ( !checkEmail(this.value.toLowerCase()) ) {
		getID('email-w1').style.display = '';
		return;
	} else {
		getID('email-w1').style.display = 'none';
		return;		
	}
};

getID('email').onblur = function(e) { // lost focus
	Log.d('onblur() -> e=', e);
	let email = getVal('email').toLowerCase();
	if ( email.length <= 0 ) {
		getID('email-w1').style.display = '';
		return;
	}
	
	let params = new URLSearchParams();
	params.append('email', email);
	
	axios.post('/login/account/checkemailses', params)
	.then( function(response) {
		Log.d('response.data : ', response.data);
		let r = response.data;
		if ( r.result == "failed" ) {
			Log.d('desc : ', r.desc);
			return;
		}
		
		if ( r[0].count == 0 ) {
			getID('email-w2').style.display = 'none';
		} else {
			getID('email-w2').style.display = '';
		}
	})
    .catch( function(error) {
    	Log.d('btnCheckDupProduct() -> error=', error);
    });
};

getID('name').onkeyup = function(e) {
	if ( this.value.length <= 0 ) {
		getID('name-w').style.display = '';
		return;
	}
	
	if ( this.value.length > 30 ) {
		getID('name-w').style.display = '';
	} else {
		getID('name-w').style.display = 'none';
	}
};

getID('pwConfirm').onkeyup = function() {
	pwConfirmChk();
};

var pwConfirmChk = function() {
	if ( getVal('pwConfirm') != getVal('pw') ) {
		getID('pwConfirm-w').style.display = '';
	} else {
		getID('pwConfirm-w').style.display = 'none';
	}
}

getID('btnRegister').onclick = function(e) {
	// Log.d('btnRegister() -> e=', e);
	//----------------------------------
	// 입력 체크
	if ( getVal('email').length <= 0 ) {
		modalAlert('Email is required.');
		return;
	}
	if ( getVal('name').length <= 0 ) {
		modalAlert('User name is required.');
		return;
	}
	if ( getVal('pw').length <= 0 ) {
		modalAlert('Password is required.');
		return;
	}
	if ( getVal('pwConfirm').length <= 0 ) {
		modalAlert('Password Confirm is required.');
		return;
	}
	
	//----------------------------------
	// 제약 조건 체크
	let x = document.getElementsByClassName("help-block");
	let i;
	for (i = 0; i < x.length; i++) {
	    if ( x[i].style.display != 'none' ) {
	    	modalAlert('Check requriements.');
	    	return;
	    }
	}
	
	//-------------------------------------------
	doRegister();
};

window.addEventListener('DOMContentLoaded', function() {
    Log.d('DOMContentLoaded() called...');
    initPage();
});

var showProfile = function(uname, email) {
	Log.d('showProfile() -> uname=', uname);
	Log.d('showProfile() -> email=', email);
	
	getID('pf-email').value = email;
	getID('pf-name').value = uname;
	getID('pf-pw').value = '';
	getID('pf-pwConfirm').value = '';
	initPage();
	
	$("#pfModal").modal();
};

var initPage = function() {
	var pw = getID('pf-pw'); // pw flag init
	pw.lowChk = false;
	pw.upChk = false;
	pw.numChk = false;
	pw.lenChk = false;
	
	getID('pf-pw-w').style.display = 'none';
	getID('pf-pwConfirm-w').style.display = 'none';
};

var doSave = function() {
	var params = new URLSearchParams();
	params.append('email', getVal('pf-email'));
	params.append('name', getVal('pf-name'));
	params.append('pw', sha256(getVal('pf-pw')));

	axios.post( '/common/account/modify', params )
	.then( function (response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result == 'failed' ) {
			modalAlert( response.data.desc );
			return;
		}
		mv('/main.do');
	})
    .catch( function (error) {
    	 Log.d('doRegister() -> error=', error);
    });
};

getID('pf-pw').onkeyup = function() {
	pwConfirmChk();
	
	if ( this.value.length <= 0 ) {
		getID('pf-pw-w').style.display = '';
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
		getID('pf-pw-w').style.display = 'none';
	} else {
		getID('pf-pw-w').style.display = '';
	}
};

getID('pf-email').onkeyup = function(e) {
	if ( this.value.length <= 0 ) {
		getID('pf-email-w1').style.display = '';
		return;
	}
	
	if ( !checkEmail(this.value) ) {
		getID('pf-email-w1').style.display = '';
		return;
	} else {
		getID('pf-email-w1').style.display = 'none';
		return;		
	}
};

getID('pf-email').onblur = function(e) { // lost focus
	Log.d('onblur() -> e=', e);
	var email = getVal('pf-email');
	if ( email.length <= 0 ) {
		getID('pf-email-w1').style.display = '';
		return;
	}
	
	var params = new URLSearchParams();
	params.append('pf-email', email);
	
	axios.post('/login/account/checkemailses', params)
	.then( function(response) {
		Log.d('response.data : ', response.data);
		var r = response.data;
		if ( r.result == "failed" ) {
			Log.d('desc : ', r.desc);
			return;
		}
		
		if ( r[0].count == 0 ) {
			getID('pf-email-w2').style.display = 'none';
		} else {
			getID('pf-email-w2').style.display = '';
		}
	})
    .catch( function(error) {
    	Log.d('btnCheckDupProduct() -> error=', error);
    });
};

getID('pf-name').onkeyup = function(e) {
	if ( this.value.length <= 0 ) {
		getID('pf-name-w').style.display = '';
		return;
	}
	
	if ( this.value.length > 30 ) {
		getID('pf-name-w').style.display = '';
	} else {
		getID('pf-name-w').style.display = 'none';
	}
};

getID('pf-pwConfirm').onkeyup = function() {
	pwConfirmChk();
};

var pwConfirmChk = function() {
	if ( getVal('pf-pwConfirm') != getVal('pf-pw') ) {
		getID('pf-pwConfirm-w').style.display = '';
	} else {
		getID('pf-pwConfirm-w').style.display = 'none';
	}
};

getID('btnPfModalSave').onclick = function(e) {
	// Log.d('btnRegister() -> e=', e);
	//----------------------------------
	// 입력 체크
	if ( getVal('pf-email').length <= 0 ) {
		modalAlert('Email is required');
		return;
	}
	if ( getVal('pf-name').length <= 0 ) {
		modalAlert('User name is required');
		return;
	}
	
	//----------------------------------
	// 제약 조건 체크
	var x = document.getElementsByClassName("pf-help-block");
	for (var i = 0; i < x.length; i++) {
	    if ( x[i].style.display != 'none' ) {
	    	modalAlert('Check requriements.');
	    	return;
	    }
	}
	
	//-------------------------------------------
	doSave();
};


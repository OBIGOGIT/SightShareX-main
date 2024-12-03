var doLogin = function() {
	getID('login-m').innerText = '';
	
	let params = new URLSearchParams();
	params.append('Id', getVal('txtId').toLowerCase());
	params.append('Pw', getVal('txtPw'));
	// params.append('Pw', sha256(getVal('txtPw')));

	axios.post( '/login', params )
	.then( function (response) {
		Log.d( 'response.data : ', response.data );
		if ( response.data.result != 'OK' ) {
			// alert(response.data.desc);
			getID('login-m').innerText = response.data.message;
			return;
		}
		mv('/main.do');
	})
	.catch( function (error) {
		 Log.d('btnSignIn() -> error=', error);
	});
};

getID('btnSignIn').onclick = function(e) {
	console.log("btnSignIn...")
	doLogin();
};

getID("txtPw").onkeypress = function( e ) {
	if ( e.which == 13 ) {
		doLogin();
	}
};
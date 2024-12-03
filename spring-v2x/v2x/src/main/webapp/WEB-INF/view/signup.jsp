<%@ page language="java" contentType="text/html; charset=UTF-8;" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<%@ include file="/WEB-INF/view/include/login_head.jspf" %>
<body class="hold-transition login-page">
	<%--<spring:eval expression="@environment.getProperty('login.admin.id')" var="DEF_ID" />--%>
	<%--<spring:eval expression="@environment.getProperty('login.admin.pw')" var="DEF_PW" />--%>
	<div class="login-box">
		<div class="register-logo">
			<a href="/login">V2X Server</a>
		</div>

		<div class="login-box-msg">
			<!-- (Login Message) -->
		</div>

		<!-- /.login-logo -->

		<div id="app-login" class="login-box-body">
			<p class="login-box-msg">Register a new account</p>
			<div class="form-group has-feedback">
				<label>Email</label>
				<input id='txtEmail' type="text" class="form-control" placeholder="Email" value="">
				<span class="glyphicon glyphicon-envelope form-control-feedback"></span>
			</div>
			<div class="form-group has-feedback">
				<label>ID</label>
				<input id='txtId' type="text" class="form-control" placeholder="ID" value="">
				<span class="glyphicon glyphicon-pencil form-control-feedback"></span>
				<div class="row">
					<div class="col-xs-12">
						<span id="login-m" class="help-block" style="color: rgb(192, 57, 43); margin: 0"></span>
					</div>
				</div>
			</div>
			<div class="form-group has-feedback">
				<label>Password</label>
				<input id='txtPw' type="password" class="form-control" placeholder="Password" value="">
				<span class="glyphicon glyphicon-lock form-control-feedback"></span>
				<div class="row">
					<div class="col-xs-12">
						<span id="login-pw-m" class="help-block" style="color: rgb(192, 57, 43); margin: 0"></span>
					</div>
				</div>
			</div>
			<div class="form-group has-feedback">
				<label>Confirm Password</label>
				<input id='txtConfirmPw' type="password" class="form-control" placeholder="Confirm Password" value="">
				<span class="glyphicon glyphicon-lock form-control-feedback"></span>
				<div class="row">
					<div class="col-xs-12">
						<span id="login-confirm-pw-m" class="help-block" style="color: rgb(192, 57, 43); margin: 0"></span>
					</div>
				</div>
			</div>


			<div class="form-group has-feedback">
				<label>Name</label>
				<input id='txtName' type="text" class="form-control" placeholder="Name" value="">
				<span class="glyphicon glyphicon-user form-control-feedback"></span>
			</div>
			<div class="row">
				<div class="col-xs-8">
				</div>
				<!-- /.col -->
				<div class="col-xs-4">
					<button id="btnSignUp" type="button" class="btn btn-obigo btn-block btn-flat" disabled>회원가입 </button>
				</div>
				<!-- /.col -->
			</div>
		</div>
		<!-- /.login-box-body -->
	</div>
	<!-- /.login-box -->

	<%@ include file="/WEB-INF/view/include/login_footer.jspf" %>
</body>
</html>
<script>
	window.addEventListener('DOMContentLoaded', function() { //실행될 코드
		Log.d('signup.js -> DOMContentLoaded() called...');
		// app-login
		let form = document.getElementById('app-login');
		const inputs = form.querySelectorAll('input');
		const select = form.querySelector('select');

		// 각 입력 필드와 select 필드에 이벤트 리스너 등록
		inputs.forEach(function(input) {
			input.addEventListener('input', toggleSignUpBtn);
		});
		select.addEventListener('change', toggleSignUpBtn);

		getID('txtConfirmPw').addEventListener('keyup', confirmPassword);
	});

	const doSignUp = function() {
		getID('btnSignUp').disabled = true;
		getID('login-m').innerText = '';

		var overlayUpload= '<span class="overlay" id="overlayUpload"><i class="fa fa-refresh fa-spin"></i></span>'
		getID("btnSignUp").innerHTML += overlayUpload;

		let userRestDto = {};
		userRestDto['userId'] = getVal('txtId');
		userRestDto['email'] = getVal('txtEmail');
		userRestDto['name'] = getVal('txtName');
		userRestDto['password'] = getVal('txtPw');
		userRestDto['rePassword'] = getVal('txtConfirmPw');
		userRestDto['isActive'] = false
		userRestDto['name'] = getVal('txtName');

		axios.post( '/signup', userRestDto ).then(function(response) {
			Log.d('response.data : ', response.data);
			if ( response.data.result != 'SUCCESS' ) {
				getID('btnSignIn').disabled = false;
				getID('login-m').innerText = res.data.message;
				var overlayUpload = document.getElementById("overlayUpload")
				overlayUpload.parentNode.removeChild(overlayUpload)
				return;
			}
			mv("/");
		}).catch( function (err) {
			Log.d('btnSignIn() -> err=', err);
		});
	};

	getID('btnSignUp').onclick = function(e) {
		doSignUp();
	};

	getID('txtId').onblur = function(e) { // lost focus
		Log.d('onblur() -> e=', e);
		findUser(getVal('txtId'));
	};

	const findUser = function(userId) {
		if(userId == '' || userId.length == 0) {
			getID('login-m').innerText = '';
			return;
		}

		axios.post('/check/'+userId).then(function (response) {
			Log.d('response.data : ', response.data);
			const data = response.data
			if (data.result == "SUCCESS") {
				getID('login-m').style.color = 'green';
				getID('login-m').innerText = '사용 가능한 아이디 입니다.';
			}
			else {
				getID('login-m').style.color = 'red';
				getID('login-m').innerText = data.desc;
				getID('btnSignUp').disabled = true;
			}
		}).catch(function (error) {
			Log.d('error() -> error=', error);
		});
	}

	const toggleSignUpBtn = function() {
		getID('btnSignUp').disabled = !checkFormValidation();
    }

	const checkFormValidation = function() {
		const email = getVal('txtEmail');
		const id = getVal('txtId');
		const password = getVal('txtPw');
		const confirmPassword = getVal('txtConfirmPw');
        const name = getVal('txtName');

		if (email == '' || id == '' || name == '' || password == '' || confirmPassword == ''
				|| password !== confirmPassword ) {
				// 회원 가입 버튼 막기
				return false;
		}

		// 회원 가입 버튼 활성화
		return true;
	}

	const confirmPassword = function() {
		const password = getVal('txtPw');
		const confirmPassword = getVal('txtConfirmPw');
		if (password == '' && confirmPassword == '') {
			getID('login-confirm-pw-m').innerText = '';
			return;
		}

		if (password === confirmPassword) {
			getID('login-confirm-pw-m').style.color = 'green';
			getID('login-confirm-pw-m').innerText = '비밀번호가 일치합니다.';
		} else {
			getID('login-confirm-pw-m').style.color = 'red';
			getID('login-confirm-pw-m').innerText = '비밀번호가 일치하지 않습니다.';
		}

	}

</script>
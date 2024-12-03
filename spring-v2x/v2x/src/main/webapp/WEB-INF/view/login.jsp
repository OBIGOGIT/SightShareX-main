<%@ page language="java" contentType="text/html; charset=UTF-8;" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<%@ include file="/WEB-INF/view/include/login_head.jspf" %>
<head>
	<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
	<!-- Flowbite CSS -->
	<link href="https://unpkg.com/flowbite@latest/dist/flowbite.min.css" rel="stylesheet">
	<script src="https://unpkg.com/flowbite@latest/dist/flowbite.min.js"></script>

</head>
<body class="hold-transition login-page">
<%--style tag--%>
<style>
	#oauth-login-box {
		display: flex;
		width: 50%;
		flex-direction: column;
		margin: 30px auto;
	}
	#oauth-login-box img {
		width: 100%;
	}

	.sign-up {
		margin: 20px 0;
	}

	.sign-up a {
		color: #128AFA;
	}

	.divider {
		position: relative;
		text-align: center;
		margin: 20px 0;
	}

	.divider:before,
	.divider:after {
		content: '';
		position: absolute;
		top: 50%;
		width: 45%;
		height: 1px;
		background: #a5a5a5; /* 구분선 색상 */
	}

	.divider:before {
		left: 0%;
	}

	.divider:after {
		right: 0%;
	}

	.divider-text {
		padding: 0 10px;
		position: relative;
		z-index: 1;
		color: #a5a5a5;
	}
</style>
<hq>
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
			<p class="login-box-msg">Sign in to start your session(User page)</p>
			<div class="relative z-0 w-full mb-5 group">
				<input type="text" name="floating_email" id="txtId" class="block py-3.5 px-0 w-full text-2xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
				<span class="glyphicon glyphicon-pencil form-control-feedback"></span>
				<label for="txtId" class="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
			</div>
			<div class="relative z-0 w-full mb-5 group">
				<input type="password" name="floating_password" id="txtPw" class="block py-3.5 px-0 w-full text-2xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
				<span class="glyphicon glyphicon-lock form-control-feedback"></span>
				<label for="txtPw" class="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
			</div>
			<button id="btnSignIn" type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-2lg w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 btn-block">로그인 </button>
			<div class="row">
				<div class="col-xs-12">
					<span id="login-m" class="help-block" style="color: rgb(192, 57, 43);">${not empty errorMsg ? errorMsg : ''}</span>
				</div>
				<% // 새로고침하면 error message가 사라지게끔 설정
					if (session.getAttribute("errorMsg") != null) session.removeAttribute("errorMsg");
				%>
			</div>
			<div class="sign-up">
				Don't have an account? <a href="/signup" role="button">Sign up</a>
			</div>
		</div>
		<!-- /.login-box-body -->
	</div>
	<!-- /.login-box -->

	<%@ include file="/WEB-INF/view/include/login_footer.jspf" %>
</body>
</html>
<script>
	const doLogin = function() {
		const inputField = document.getElementById('txtId');
		const errorField = document.getElementById('txtPw');

		if (!inputField.checkValidity()) {
			// 유효성 검사 실패 시 에러 스타일 및 메시지 표시
			inputField.classList.add('border-red-600', 'dark:border-red-400');
			errorField.classList.remove('hidden');
			return
		}
		else if (!errorField.checkValidity()) {
			// 유효성 검사 실패 시 에러 스타일 및 메시지 표시
			errorField.classList.add('border-red-600', 'dark:border-red-400');
			errorField.classList.remove('hidden');
			return
		}

		getID('btnSignIn').disabled=true;
		getID('login-m').innerText = '';

		var overlayUpload= '<span class="overlay" id="overlayUpload"><i class="fa fa-refresh fa-spin"></i></span>'
		getID("btnSignIn").innerHTML += overlayUpload;

		var params = new URLSearchParams();

		params.append('id', getVal('txtId').toLowerCase());
		params.append('password', getVal('txtPw'));

		axios.post( '/login', params ).then(function(res) {
			Log.d( res );
			if ( res.data.result != 'OK' ) {
				getID('btnSignIn').disabled=false;
				getID('login-m').innerText = res.data.message;
				var overlayUpload = document.getElementById("overlayUpload")
				overlayUpload.parentNode.removeChild(overlayUpload)
				return;
			}
			mv(res.data.url);
		}).catch( function (err) {
			Log.d('btnSignIn() -> err=', err);
		});
	};

	getID('btnSignIn').onclick = function(e) {
		doLogin();
	};

	getID("txtId").onkeypress = function( e ) {
		if ( e.which == 13 ) {
			doLogin();
		}
	};
	getID("txtPw").onkeypress = function( e ) {
		if ( e.which == 13 ) {
			doLogin();
		}
	};

</script>
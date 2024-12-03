// 현재날자 계산
function setDate(){
	var date = new Date();
	var hour = "";
	var min = "";

	if(date.getHours() < 10){
		hour = "0";
	}
	hour = hour + date.getHours();

	if(date.getMinutes() < 10){
		min = "0";
	}

	if (hour < 12 ) { // intTime이 12보다 작으면
		var str = '오전 ';
	}
	else { // 12보다 크면
		 var str = '오후 ';
	}

	if (hour == 12) {
		var cvHour = hour;
	}
	else {
		var cvHour = hour%12;
	}

	min = min + date.getMinutes();

	$("#currentDate").text(date.getFullYear() + "년 " + (date.getMonth() + 1) + "월 " + date.getDate() + " 일 ");
	$("#currentTime").text(str+" " +cvHour + ":" + min);
	$("#popup-currentTime").text(cvHour + ":" + min);
}









